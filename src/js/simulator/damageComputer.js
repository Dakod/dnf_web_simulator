let isCounterOn = false; //是否开启破招
let isPartCounter = false; // 开启破招时，是全破招还是部分破招
import {getSkillValue} from "@/js/simulator/skill"
import * as xmlReader from "@/js/xmlReader"
import * as utils from "@/js/utils"

// let isCrit = true;  //是否暴击



export function getDamage(role, skill, monster) {
    // let b = skill.customToJson();
    // console.log(b);
    // let str = '{"skillId":"0010010","version":"0","baseSkillLevel":50}';
    // let a = new Skill();
    // a.parse(JSON.parse(str));
    // let str = role.equipments.customToJson();

    let upList = role.upList; //获取角色BUFF表
    let node = skill.xmlNode; //获取技能节点
    let RealPhyAtta = role.roleInfo["RealPhyAtta"].real;  //获取面板物攻
    let RealMagAtta = role.roleInfo["RealMagAtta"].real;  //获取面板魔攻
    let RealIndAtta = role.roleInfo["RealIndAtta"].real;  //获取面板独立

    let cd = parseFloat(node.children("Cd").text());  //获取CD

    let RealAtta = node.attr("pm") === "物理" ? RealPhyAtta : RealMagAtta; //判断是物理还是魔法
    let StrengthIntelligence = parseInt(node.attr("pm") === "物理" ?  //根据技能是物理还是魔法判断需要的是智力还是力量
        role.roleInfo["Strength"].real : role.roleInfo["Intelligence"].real); //需要取整一下
    let damage = 0; //总伤害
    let propertyNode = skill.getSkillNodeByVersion();
    propertyNode.children("Damage").each(function () {
        let theDamage = 0; //本次攻击(段)的伤害
        if ($(this).attr("pi") === "百分比") {  //这是百分比技能或者百分比部分
            theDamage += parseInt(RealAtta * getPreDamage(role, monster, $(this)) * getSkillValue($(this), skill) / 100);
        } else if ($(this).attr("pi") === "固伤") {  //这是独立技能或者独立部分
            theDamage += parseInt(RealIndAtta * getPreDamage(role, monster, $(this)) * (1 + StrengthIntelligence / 250) *
                getSkillValue($(this), skill));
        }
        if (isCounterOn === true) {
            if (isPartCounter === false)
                theDamage *= 1.25; //破招
            else {
                if (xmlReader.getAttributeValueWithDefault($(this), "counterable", "true") === "true") //默认可破招
                    theDamage *= 1.25;
            }
        }
        //计算EX等单独技能伤害加成
        for (const skillBuff of skill.skillBuff) {
            if (skillBuff.type === "all")   //加成是对全部段的
                theDamage *= 1 + skillBuff.value / 100;
            else if (skillBuff.type === "index") {  //加成是针对某一个段的
                if ($(this).attr("index") === skillBuff.index)
                    theDamage *= 1 + skillBuff.value / 100;
            } else if (skillBuff.type === "cd") {
                cd *= 1 + skillBuff.value / 100;
            }
        }
        //修改 百分比的话 宠物斗神计入双攻了
        if($(this).attr("pi") === "固伤")
            theDamage *= (1 + upList.FighterAndPet / 100); //计算宠物和斗神
        damage += theDamage;
    });

    for (const buff of role.buffList) {
        if (buff.buffType === "SkillAtta")
            damage *= 1 + buff.buffNum / 100;
    }
    damage *= (1 + upList.Yellow / 100 + upList.ExtraYellow / 100);  //计算黄字
    if (isCrited()) {
        damage *= 1.5;
        damage *= (1 + upList.CritDamage / 100 + upList.ExtraCrit / 100); //爆伤和额外爆伤
        for (const buff of role.buffList) {
            if (buff.buffType === "SkillCrit")
                damage *= 1 + buff.buffNum / 100;
        }
    }


    damage *= (1 + upList.AllDamage / 100);//计算所有攻击力
    damage = parseInt(damage); //白字攻击算前取整数
    let maxStrength = utils.getMaxWhiteStrengthenString(role);
    damage *= (1 + upList.White / 100 + upList.PropertyWhite / 100 *
        (1 + (maxStrength.max) * 0.0045 + 0.05));   //白字和属性白字
    damage = parseInt(damage);

    skill.cd = cd; // 计算CD
    return damage <= 0 ? 1 : damage;
}

//对各种伤害的共性计算处理
function getPreDamage(role, monster, element) {
    return (1 - monster.defence / (monster.defence +
        role.roleInfo["Level"].real * 200)) * getPropertyUp(role, monster, element);
}

//获取属强的增益  先计算技能的是否有属性
function getPropertyUp(role, monster, element) {
    //先要计算技能的属性
    // var Property = new Object();
    let Property = 0;
    element.children("Property").each(function () {
        switch ($(this).text()) {
            case "暗":
                Property |= (1 << 0);
                break;
            case "光":
                Property |= (1 << 1);
                break;
            case "冰":
                Property |= (1 << 2);
                break;
            case "火":
                Property |= (1 << 3);
                break;
        }
    });

    //改版后所有技能吃武器属性
    // if (getAttributeValueWithDefalue(element, "changeable", "true") == "true")//默认属性为可以改变
    Property |= role.weapenProperty;

    if (Property === 0) return 1.0; //无属性攻击
    let max = Number.MIN_SAFE_INTEGER;
    if (((Property & (1 << 0)) !== 0))  //如果武器有暗属性
        max = Math.max(max, role.roleInfo["DarkStrengthen"].real - monster.DarkStrengthen);
    if (((Property & (1 << 1)) !== 0)) //如果武器有光属性
        max = Math.max(max, role.roleInfo["LightStrengthen"].real - monster.LightStrengthen);
    if (((Property & (1 << 2)) !== 0)) //如果武器有冰属性
        max = Math.max(max, role.roleInfo["IceStrengthen"].real - monster.IceStrengthen);
    if (((Property & (1 << 3)) !== 0)) //如果武器有火属性
        max = Math.max(max, role.roleInfo["FireStrengthen"].real - monster.FireStrengthen);
    return (1 + max * 0.0045 + 0.05);
//        return (1 + max /220);
}


function isCrited() {
    return true;
}