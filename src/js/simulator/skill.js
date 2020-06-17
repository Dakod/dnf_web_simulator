import * as xmlReader from '@/js/xmlReader'
import $ from 'jquery'
import {Serializable} from '@/js/simulator/Serializable'

export const skillLevelIndex = {
    1: 0, 5: 1, 10: 2, 15: 3, 20: 4, 25: 5, 30: 6, 35: 7, 40: 8, 45: 9, 48: 10, 50: 11,
    55: 12, 60: 13, 65: 14, 70: 15, 75: 16, 80: 17, 85: 18, 95: 19, 100: 20
}


export class Skills extends Serializable {
    constructor() {
        super();
    }
}


export class Skill extends Serializable {
    constructor(xmlNode) {
        super();
        if (xmlNode !== undefined) {
            this.xmlNode = xmlNode;
            this.init();
        }
    }

    getSkillNodeByVersion() {
        let node;
        if (this.xmlNode.attr("hasDiffVer") === 'true' || this.xmlNode.attr("type") === '换装') {     //技能有多个版本
            node = this.xmlNode.children("Property[index='" + this.version + "']");
        } else
            node = this.xmlNode.children("Property");
        return node;
    }

    increaseSkillLevelWithCondition(increaseNum, start, end, condition) {
        if (this.learnLevel < start || this.learnLevel > end) return;  //不在提升范围
        if (this.type === condition) {
            this.upSkillLevel += increaseNum;
            return;
        }
        if (condition === "全部") {
            if (this.type === "主动" || this.type === "被动") {
                this.upSkillLevel += increaseNum;
            }
        }
    }

    resetSkill() {
        this.upSkillLevel = 0; //清空等级加成
        this.skillBuff.length = 0;//清空buff
    }

    addSkillBuffWithCheck(type, start, end, value) {
        if (this.learnLevel < start || this.learnLevel > end) return;  //不在提升范围
        if (this.xmlNode.attr("df") === "伤害") {
            this.skillBuff.push({
                type: type,
                value: value
            });
        }
    }

    init() {
        if (this.xmlNode === undefined)  //没有读取好了的xml
            this.xmlNode = xmlReader.getSkillInfo(this.skillId);
        if (this.skillId === undefined) //如果没有ID 这是没有反序列化的情况 反序列化的情况下只有一个Id
            this.skillId = this.xmlNode.attr('id');//技能Id
        if (this.version === undefined)
            this.version = "0";
        const MinLevel = this.xmlNode.children("MinLevel").length === 0 ? 0 : parseInt(this.xmlNode.children("MinLevel").text());
        const DefaultLevel = this.xmlNode.children("DefaultLevel").length === 0 ? 0 : parseInt(this.xmlNode.children("DefaultLevel").text());
        const defaultSkillLevel = Math.max(MinLevel, DefaultLevel);
        this.defaultSkillLevel = defaultSkillLevel;//默认等级为满级
        if (this.baseSkillLevel === undefined)
            this.baseSkillLevel = defaultSkillLevel; //原本的技能等级
        this.upSkillLevel = 0; //提升的技能等级效果
        this.limitLevel = parseInt(this.xmlNode.children("LimitLevel").text());  //限制等级
        this.learnLevel = parseInt(this.xmlNode.children("Level").text());  //学习等级
        this.type = this.xmlNode.attr("type");
        this.cd = parseInt(this.xmlNode.children("Cd").text());//技能CD
        this.sp = parseInt(this.xmlNode.children("Sp").text());//技能CD
        // this.grow = parseInt(this.xmlNode.children("Sp").text());//技能CD
        // this.damagePercent = parseInt(this.xmlNode.children("Sp").text());//技能CD
        this.skillBuff = []; //储存某些技能或装备对技能伤害的加成
        this.isDisable = false; //是否被禁用
        this.version = "0";//技能的不同版本

        this.times = 1;
        this.singleDamage = 0;
        this.percentage = 0;
    }

    _getSkillPercent() {

    }

    get skillLevel() {
        if (this.baseSkillLevel <= 0) //等级为0 即没学 不加成
            return 0;
        return Math.min(this.baseSkillLevel + this.upSkillLevel, this.limitLevel);
    }

    set skillLevel(newValue) {
        this.baseSkillLevel = newValue
    }

}

Serializable.defineNotEnumerableProperty(Skill.prototype, "serializeField", ["skillId", "version", "baseSkillLevel"]);
Serializable.defineNotEnumerableProperty(Skills.prototype, "serializeClass", {"all": Skill});


export function updateRoleFromSkill(role, skill) {
    readSkill(role, skill.getSkillNodeByVersion(), skill);
}

function readSkill(role, node, skill) {
    node.children().each(function () {
        let isOutEffective = ($(this).attr("isOutEffective") !== "false");
        switch ($(this)[0].tagName) {
            case "Condition":
                if (xmlReader.judgeCondition($(this), role)) {  //如果条件满足 递归读取属性
                    readSkill(role, $(this), skill);
                }
                break;
            case "SpecialCrit": //不冲突的爆伤
                role.readEffect($(this)[0].tagName, getSkillValue($(this), skill));
                break;
            case "SkillUp": //对别的技能的加成效果
            case "Cd":   //减少CD效果
            {
                let tagName = $(this)[0].tagName;
                let index = $(this).attr("index");  //对某个技能特定的一个攻击段的加成 没有代表全都加成
                if (index !== undefined) {
                    role.skills[$(this).children("Id").text()].skillBuff.push({
                        value: getSkillValue($(this), skill),
                        type: "index",
                        index: index
                    });
                } else {
                    let value = getSkillValue($(this), skill);
                    $(this).children("Id").each(function () {
                        role.skills[$(this).text()].skillBuff.push({
                            value: value,
                            type: tagName === "SkillUp" ? "all" : "cd"
                        })
                    });
                }
            }
                break;
            default:
                role.readEffect($(this)[0].tagName, getSkillValue($(this), skill), isOutEffective);
                break;
        }
    })
}

export function readSkillLevelUp(role, skill) {
    readSkillLevelUpR(role, skill.getSkillNodeByVersion(), skill);
}

//读取技能之间的相互等级加成
function readSkillLevelUpR(role, node, skill) {
    node.children().each(function () {
        switch ($(this)[0].tagName) {
            case "Condition":
                if (xmlReader.judgeCondition($(this), role)) {  //如果条件满足 递归读取属性
                    readSkillLevelUpR(role, $(this), skill);
                }
                break;
            case "SkillLevel": //增加技能等级
                role.upRoleSkill($(this), skill.skillLevel);
                break;
            default:
                break;
        }
    })
}

//根据技能等级获取技能的数值  e为元素  注意 有些元素不是属性，需要返回0
export function getSkillValue(e, skill) {
    let result = 0.0;
    let growType = e.attr('growType');
    if (growType === undefined || growType === "liner") {  //为空代表是线性成长
        if (e.children("Value") == null) return 0.0;  //没有value标签，则这个不是数值属性，直接返回
        let value = parseFloat(e.children("Value").text());
        let grow = parseFloat(e.children("Grow").text());
        if (isNaN(grow)) result = value;
        else
            result = value + grow * (skill.skillLevel - 1);
    } else if (growType === "fix") { //固定
        let temp = e.find("Value[level='" + skill.skillLevel + "']");
        if (temp.length <= 0)
            return 0;
        else
            return parseFloat(temp.text()); //固定数值直接返回就完事了
    } else if (growType === "break") {//折线模式
        let breakPoint = parseInt(e.attr("breakpoint")); //转折点
        let value = parseFloat(e.children("Value").text());
        let grow = parseFloat(e.children("Grow").text()); //前面的提升率
        let grow2 = parseFloat(e.children("Grow2").text()); //转折点后的提升率
        result = skill.skillLevel > breakPoint ? (value + grow * (breakPoint - 1) + grow2 * (skill.skillLevel - breakPoint))
            : (value + grow * (skill.skillLevel - 1));
    } else if (growType === "mix") {//固定和线性混合模式
        //dummy
    } else if (growType === "differ") { //根据不同类型有不同的数值
        let grow = parseFloat(e.children("Grow").text());
        let value = parseFloat(e.children("[id='" + skill.typeId + "']").children("Value").text());
        result = value + grow * (skill.skillLevel - 1);
    } else
        return 0.0;

    if (e.attr("abandonNum") != null) {
        let num = Math.pow(10, parseInt(e.attr("abandonNum")));
        result *= num;
        return parseInt(result) / num;
    } else
        return parseInt(result);
}


export function addSkillBuffWithCheck(node, role) {
    const type = node.attr("type");
    const tagName = node[0].tagName;
    const buffType = tagName === 'SkillUp' ? "all" : "cd";
    const value = parseInt(node.text());
    if (type === "range") {
        for (let skill in role.skills) {
            role.skills[skill].addSkillBuffWithCheck(buffType, node.attr("start"),
                node.attr("end"), value);
        }
    } else if (type === "talisman1" || type === "talisman2") {
        if (String(role.talismans[type].equipmentId) !== "null") { //有护石
            role.skills[$(role.talismans[type].xmlNode).children("SkillId").text()].skillBuff.push({
                type: buffType,
                value: value
            })
        }
    } else if (type === "single") {
        const id = node.attr("skillId");
        role.skills[id].skillBuff.push({
            type: buffType,
            value: value
        })
    }
}