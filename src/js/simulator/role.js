import $ from "jquery"
import * as xmlReader from "@/js/xmlReader"
import {Equipments, updateRoleFromEquipment} from "@/js/simulator/equipment";
import {
    Skill,
    Skills,
    readSkillLevelUp,
    updateRoleFromSkill,
    addSkillBuffWithCheck,
    skillLevelIndex
} from "@/js/simulator/skill"
import {updateRoleFromDress, Dresss} from "@/js/simulator/dress"
import {updateRoleFromTalisman, Talismans} from "@/js/simulator/talisman"
import {updateRoleFromPet, updateRoleFromMedal, Pets, Medals} from "@/js/simulator/pet_medal";
import {Monster} from "@/js/simulator/monster";
import {Serializable} from "@/js/simulator/Serializable";
import {parseNearInt} from "@/js/utils";

function BUFF(buffType, buffNum, isOutEffective) {
    this.buffType = buffType;
    this.buffNum = buffNum;
    this.isOutEffective = isOutEffective === undefined ? true : isOutEffective;
}

export var nameMap = {
    PhyAtta: "物理攻击力 +$0",
    MagAtta: "魔法攻击力 +$0",
    IndAtta: "独立攻击力 +$0",
    Strength: "力量 +$0",
    Intelligence: "智力 +$0",
    PhyCrit: "物理暴击率 +$0%",
    MagCrit: "魔法暴击率 +$0%",
    DarkStrengthen: "暗属性强化 +$0",
    LightStrengthen: "光属性强化 +$0",
    FireStrengthen: "火属性强化 +$0",
    IceStrengthen: "冰属性强化 +$0",
    AllStrengthen: "所有属性强化 +$0",
    AllDamage: "最终伤害 +$0%",
    FourDimension: "四维 +$0",
    SkillLevel: "所有职业Lv$0~$1$2技能Lv+$3",
    SkillAtta: "技能攻击力 +$0%",
    White: "攻击时,附加$0%的伤害",
    FighterAndPet: "攻击力增加$0%",
    TriAttaPercent: "物理、魔法、独立攻击力 +$0%",
    StrengthIntelligencePercent: "力量、智力 +$0%",
    ExtraYellow: "攻击时,额外增加$0%的伤害",
    ExtraCrit: "暴击时,额外增加$0%的伤害",
    Dot: "发生持续伤害,伤害量为$0%",
    PropertyWhite: "攻击时,附加$0%的属性伤害",
    StrengthIntelligence: "力量、智力 +$0",
    AllAtta: "物理、魔法、独立攻击力 +$0",
};

export function getIllustration(name, args) {
    let template = nameMap[name];
    if (template === undefined) return "";
    args.forEach((arg, index) => {
        template = template.replace("$" + index, arg);
    });
    return template;
}


export var equipmentIndex = ["shoulder", "coat", "pants", "belt", "shoes", "weapon", "title", "bracelet", "necklace", "ring", "assistant", "magicstone", "earrings"];


export class Role extends Serializable {
    constructor(id) {
        super();
        if (id === undefined) {  //没有初始参数 这是序列化的情况

        } else {
            this.occupationId = id; //职业ID
            this.init();
            // this.updateRole();
        }
    }

    init() {  //反序列化之后需要修改的属性
        this.debug = true;
        this.updateTime = 0;
        this.keyWord = "";
        this.isUpdateClosed = false;

        this.armorMasterId = "9990001";//通用防具精通ID


        this.monster = this.monster || new Monster("000");

        this.weapenProperty = 0;
        this.buffList = [];
        this.percentAttaBuff = [];
        this.upList = {
            Yellow: 0, ExtraYellow: 0,
            CritDamage: 0, ExtraCrit: 0,
            White: 0, PropertyWhite: 0,
            PhyAttaPercent: 0, MagAttaPercent: 0, IndAttaPercent: 0, //用于统计 不参与伤害计算
            TriAttaPercent: 0,
            StrengthIntelligencePercent: 0, Dot: 0,
            AllDamage: 0, FighterAndPet: 0,
            Crit: 0.5, SpecialCrit: 0,  //统计用
            SkillAtta: 0,
        };
        this.StrengthType = ["FireStrengthen", "IceStrengthen",
            "LightStrengthen", "DarkStrengthen"]; //属强的类型列表  虽然应该是所有role共用 不过有点麻烦就这样将就吧 顺序是火冰光暗

        this.roleInfo = {
            "Level": {base: 0.0, real: 0.0, out: 0.0}, //等级
            "PhyAtta": {base: 0.0, real: 0.0, out: 0.0},  //物攻
            "MagAtta": {base: 0.0, real: 0.0, out: 0.0}, //魔攻
            "IndAtta": {base: 0.0, real: 0.0, out: 0.0}, //独立
            "RealPhyAtta": {base: 0.0, real: 0.0, out: 0.0}, //面板物攻
            "RealMagAtta": {base: 0.0, real: 0.0, out: 0.0},//面板魔攻
            "RealIndAtta": {base: 0.0, real: 0.0, out: 0.0}, //面板独立
            "Strength": {base: 0.0, real: 0.0, out: 0.0}, //力量
            "Intelligence": {base: 0.0, real: 0.0, out: 0.0}, //智力
            "PhyCrit": {base: 0.0, real: 0.0, out: 0.0},  //物理暴击
            "MagCrit": {base: 0.0, real: 0.0, out: 0.0},  //魔法暴击
            "DarkStrengthen": {base: 0.0, real: 0.0, out: 0.0}, //暗强
            "LightStrengthen": {base: 0.0, real: 0.0, out: 0.0}, //光强
            "FireStrengthen": {base: 0.0, real: 0.0, out: 0.0}, //火强
            "IceStrengthen": {base: 0.0, real: 0.0, out: 0.0} //冰强
        };
        this.initRoleBase();

        this.suitInfo = this.suitInfo || {}; //装备套装编辑设置
        this.equipments = this.equipments || new Equipments();
        this.dresss = this.dresss || new Dresss();
        this.pets = this.pets || new Pets();
        this.medals = this.medals || new Medals();
        this.talismans = this.talismans || new Talismans();
        this.props = this.props || {};  //消耗品
        if (!this.skills) {
            this.skills = new Skills();
            this.initSkills();
        }
        if (!this.skillLevelMap) {
            this.reBuildSkillLevelMap();
        }
        this.suitMarkInfo = {};

        this.nameMap = nameMap;
    }

    initRoleBase() {
        if (this.occupationId) {
            const _this = this;
            let node = xmlReader.getRoleBase(this.occupationId);
            this.armorMasterSkillId = node.children("armorMasterSkillId").text();
            this.buffSkillId = node.children("buffSkillId").text();
            this.mainProperty = node.children("mainProperty").text();
            this.pi = node.children("pi").text();
            this.masterArmorType = xmlReader.getSkillInfo(this.armorMasterSkillId).find("EquipmentType").text(); //精通甲

            node.children("Property").children().each(function () {
                let tagName = $(this)[0].tagName;
                _this.roleInfo[tagName].base = parseFloat($(this).text());
                _this.roleInfo[tagName].real = parseFloat($(this).text());
                _this.roleInfo[tagName].out = parseFloat($(this).text());
            });
        }
    }

    isPropActive(propsId) {
        return this.props[propsId];
    }

    initSkills() {
        const _this = this;
        let skillLevelMap = Array(22); //等级-技能Map  用于缓存
        xmlReader.getAllSkills(this.occupationId).find("skill").each(function () {
            let skill = new Skill($(this));
            _this.skills[$(this).attr("id")] = skill; //添加技能 如果默认等级为空，则为0级
            const level = $(this).children("Level").text();
            if (!level) return;
            let skillIndex = skillLevelIndex[level];
            if (!skillLevelMap[skillIndex]) {
                skillLevelMap[skillIndex] = [skill];
            } else {
                skillLevelMap[skillIndex].push(skill);
            }
        });
        this.skillLevelMap = skillLevelMap;
    }

    reBuildSkillLevelMap() {
        let skillLevelMap = Array(22); //等级-技能Map  用于缓存
        for (let skillId in this.skills) {
            const skill = this.skills[skillId];
            const level = skill.learnLevel;
            let skillIndex = skillLevelIndex[level];
            if (!skillLevelMap[skillIndex]) {
                skillLevelMap[skillIndex] = [skill];
            } else {
                skillLevelMap[skillIndex].push(skill);
            }
        }
        this.skillLevelMap = skillLevelMap;
    }

    updateRole(from) {
        const _this = this;
        if (this.debug) {
            this.updateTime++;
            console.log("更新角色!总次数:" + this.updateTime + " 触发对象:" + from);
            console.time();
        }
        if (!this.isUpdateClosed) {
            //先重置角色
            this.weapenProperty = 0; //清空属性攻击
            for (let x in this.roleInfo) { //恢复基础面板
                this.roleInfo[x].real = this.roleInfo[x].base;
                this.roleInfo[x].out = this.roleInfo[x].base;
            }
            for (let x in this.upList) {  //清空提升词条
                if (x === 'Crit')
                    this.upList[x] = 50;
                else
                    this.upList[x] = 0;
            }
            this.buffList.length = 0;  //清空技能攻击力BUFF
            this.percentAttaBuff.length = 0;  //清空技能攻击力BUFF
            //重置技能
            for (let skillId in this.skills) {
                this.skills[skillId].resetSkill();
            }
            //根据装备更新(需要包含套装计算和精通甲属性计算)
            updateRoleFromEquipment(this);
            //根据装扮更新
            updateRoleFromDress(this);
            //根据宠物更新
            updateRoleFromPet(this);
            //根据勋章更新
            updateRoleFromMedal(this);
            //读取消耗品
            updateRoleFromProp(this);
            //读取调节器
            updateRoleFromAdjuster(this);
            //读取护石
            updateRoleFromTalisman(this);
            //先遍历所有技能，寻找技能之间的相互加成
            for (let skill in this.skills) {
                if (!this.skills[skill].isDisable && !this.skills[skill].skillLevel <= 0) { //弃用或者0级不生效
                    readSkillLevelUp(this, this.skills[skill]);
                }
            }
            //根据技能更新
            for (let skill in this.skills) {
                if (!this.skills[skill].isDisable && !this.skills[skill].skillLevel <= 0) { //弃用或者0级不生效
                    updateRoleFromSkill(this, this.skills[skill]);
                }
            }
            //计算百分比力智
            this.roleInfo["Strength"].real = parseNearInt(this.roleInfo["Strength"].real) * (1 + this.upList.StrengthIntelligencePercent / 100);
            this.roleInfo["Intelligence"].real = parseNearInt(this.roleInfo["Intelligence"].real) * (1 + this.upList.StrengthIntelligencePercent / 100);

            //计算技能提供的百分比三攻  这里是否需要舍入还需要测试
            for (let buff in this.percentAttaBuff) {
                const theBuff = this.percentAttaBuff[buff];
                switch (theBuff.buffType) {
                    case "PhyAttaPercent":
                    case "MagAttaPercent":
                    case "IndAttaPercent":
                        if (theBuff.isOutEffective) {
                            this.roleInfo[theBuff.buffType.slice(0, 7)].out *= 1 + theBuff.buffNum / 100;
                        }
                        this.upList[theBuff.buffType] = (this.upList[theBuff.buffType] + 100) * (100 + theBuff.buffNum) / 100 - 100; //提供统计信息
                        this.roleInfo[theBuff.buffType.slice(0, 7)].real *= 1 + theBuff.buffNum / 100;
                        break;
                    default:
                        break;
                }
            }
            //计算总技攻 dot 统计用
            for (let buff in this.buffList) {
                const theBuff = this.buffList[buff];
                if (theBuff.buffType === 'SkillAtta') {
                    this.upList.SkillAtta = (this.upList.SkillAtta + 100) * (100 + theBuff.buffNum) / 100 - 100;
                } else if (theBuff.buffType === 'Dot') {
                    this.upList.Dot = (this.upList.Dot + 100) * (100 + theBuff.buffNum) / 100 - 100;
                }
            }
            //计算站街的面板
            this.roleInfo["RealPhyAtta"].out = parseNearInt(this.roleInfo["PhyAtta"].out * (1 + parseNearInt(this.roleInfo["Strength"].out) / 250.0)); //物攻
            this.roleInfo["RealMagAtta"].out = parseNearInt(this.roleInfo["MagAtta"].out * (1 + parseNearInt(this.roleInfo["Intelligence"].out) / 250.0)); //魔攻
            this.roleInfo["RealIndAtta"].out = this.roleInfo["IndAtta"].out; //独立

            //计算实际的面板
            this.roleInfo["RealPhyAtta"].real = (this.getRealAtta(this.roleInfo["PhyAtta"].real, this.roleInfo["Strength"].real)); //物攻
            this.roleInfo["RealMagAtta"].real = (this.getRealAtta(this.roleInfo["MagAtta"].real, this.roleInfo["Intelligence"].real)); //魔攻
            this.roleInfo["RealIndAtta"].real = (this.roleInfo["IndAtta"].real * (1 + this.upList.TriAttaPercent / 100)); //独立

            //计算武器属性攻击
            this.buffList.forEach(function (item) {
                if (item.buffType === "PropertyAtta")
                    switch (item.buffNum) {
                        case 5:
                            _this.weapenProperty |= 1 << (3 - _this.StrengthType.indexOf(getMaxStrengthenString(_this)));
                            break;
                        default:
                            _this.weapenProperty |= 1 << (3 - item.buffNum);
                            break;
                    }
            });
        }
        if (this.debug)
            console.timeEnd();
    }

    changeRoleValue(name, value, isOutEffective) {
        if (isOutEffective === undefined || isOutEffective === true) {
            this.roleInfo[name].out += value;
        }
        return this.roleInfo[name].real += value;
    }

    readEffect(name, value, isOutEffective) {
        if (isNaN(value)) return;
        value = parseFloat(value);
        switch (name) {
            case "PhyAtta":  //物攻
            case "MagAtta":  //魔攻
            case "IndAtta": //独立
            case "Strength": //力量
            case "Intelligence": //智力
            case "DarkStrengthen": //暗强
            case "LightStrengthen"://光强
            case "FireStrengthen"://火强
            case "IceStrengthen"://冰强
                this.changeRoleValue(name, value, isOutEffective);
                break;
            case "AllStrengthen":  //全属强
                this.changeRoleValue("DarkStrengthen", value, isOutEffective);
                this.changeRoleValue("LightStrengthen", value, isOutEffective);
                this.changeRoleValue("FireStrengthen", value, isOutEffective);
                this.changeRoleValue("IceStrengthen", value, isOutEffective);
                break;
            case "AllAtta":
                this.changeRoleValue("PhyAtta", value, isOutEffective);
                this.changeRoleValue("MagAtta", value, isOutEffective);
                this.changeRoleValue("IndAtta", value, isOutEffective);
                break;
            case "FourDimension":
                this.changeRoleValue("Strength", value, isOutEffective);
                this.changeRoleValue("Intelligence", value, isOutEffective);
                break;
            case "StrengthIntelligence":
                this.changeRoleValue("Strength", value, isOutEffective);
                this.changeRoleValue("Intelligence", value, isOutEffective);
                break;
            case "PhyCrit": //物爆
            case "MagCrit": //魔爆
                this.changeRoleValue(name, value / 100, isOutEffective);
                break;
            case "ExtraYellow":
            case "White":
            case "PropertyWhite":
            case "ExtraCrit": // case "StrengthPercent":   整合了
            case "AllDamage":// case "IntelligencePercent":
            case "StrengthIntelligencePercent":
            case "FighterAndPet":
            case "TriAttaPercent":
                this.upList[name] += value;  //这些词条不可能是小数
                break;
            case "PhyAttaPercent":  //这三条已经不可能由装备提供 只能来自技能 因此无冲突
            case "MagAttaPercent":
            case "IndAttaPercent":
                this.percentAttaBuff.push(new BUFF(name, value, isOutEffective));
                break;
            case "Yellow":
            case "CritDamage":  //黄字和爆伤取最大值
                if (this.upList[name] < value) {
                    this.upList[name] = value;
                }
                break;
            case "SkillAtta":  //增加技能伤害
                this.buffList.push(new BUFF("SkillAtta", value));
                break;
            case "Dot" :  //新词条
                this.buffList.push(new BUFF("Dot", value));
                break;
            case "SpecialCrit": //不冲突的爆伤
                this.buffList.push(new BUFF("SkillCrit", value));
                this.upList.SpecialCrit += value;//统计用
                break;
            case "PropertyAtta": //属性攻击
                this.buffList.push(new BUFF("PropertyAtta", value));
                break;
            default:
                break;
        }
    }

    upRoleSkill(Node, skillLevel) {
        const _this = this;
        if (Node.attr("type") === ("range")) {
            let num = parseNearInt(Node.text());
            let start = parseNearInt(Node.attr("start"));
            let startIndex = skillLevelIndex[start];
            let end = parseNearInt(Node.attr("end"));
            let endIndex = skillLevelIndex[end];
            let condition = Node.attr("condition");
            for (let i = startIndex; i <= endIndex; i++) {
                if (this.skillLevelMap[i]) {
                    for (let skill of this.skillLevelMap[i]) {
                        skill.increaseSkillLevelWithCondition(num, start, end, condition);
                    }
                }
            }
        } else if (Node.attr("type") === ("single")) {
            Node.children("SkillId").each(function () {
                let value = parseNearInt($(this).attr("value"));
                let grow = parseNearInt(xmlReader.getAttributeValueWithDefault($(this), "grow", "0"));
                if (skillLevel == null) {
                    skillLevel = 1;
                }
                if (_this.skills[$(this).text()] != null) //如果有这个技能
                    _this.skills[$(this).text()].upSkillLevel += value + (skillLevel - 1) * grow;
            });
        }
    }

    getWeaponType() {
        if (this.equipments["weapon"].equipmentId == null)//没有武器
            return "短剑";//返回默认武器 先这样写 后续需要从角色XML读取
        return xmlReader.getEquipmentInfo(this.equipments["weapon"].equipmentId).children("Type").text();
    }

    //根据基础攻击算出面板攻击
    getRealAtta(attaNum, value) {
        // return parseNearInt(attaNum * (1 + parseNearInt(value) / 250.0) * (1 + this.upList.TriAttaPercent / 100));
        return parseNearInt(attaNum * (1 + parseNearInt(value) / 250.0) * (1 + this.upList.TriAttaPercent / 100)
            * (1 + this.upList.FighterAndPet / 100));
    }

    getIllustration = getIllustration;
}

Serializable.defineNotEnumerableProperty(Role.prototype, "serializeField",
    ["occupationId", "suitInfo", "equipments", "dresss", "pets", "medals", "talismans", "props", "skills","monster"]);
Serializable.defineNotEnumerableProperty(Role.prototype, "serializeClass",
    {skills: Skills, equipments: Equipments, dresss: Dresss, pets: Pets, medals: Medals, talismans: Talismans,monster:Monster});

//读取父节点下的所有属性到角色中
export function readEffectFromParentNode(node, role) {
    $(node).children().each(function () {
        readSingleProperty(this, role);
    });
}

export function readSingleProperty(node, role) {
    switch ($(node)[0].tagName) {
        case "SkillLevel":
            role.upRoleSkill($(node));
            break;
        case "SkillUp":
            addSkillBuffWithCheck($(node), role);
            break;
        case "Cd":
            addSkillBuffWithCheck($(node), role);
            break;
        case "Condition":
            if (xmlReader.judgeCondition($(node), role)) {  //如果条件满足 递归读取属性
                $(node).children().each(function () {
                    readSingleProperty(this, role);
                });
            }
            break;
        default: {
            let isOutEffective = ($(node).attr("isOutEffective") !== "false");
            role.readEffect($(node)[0].tagName, parseFloat($(node).text()), isOutEffective);
        }
    }
}

//初始化角色 ID为职业ID
export function initRole(ID) {
    return new Role(ID);
}

//读取消耗品
function updateRoleFromProp(role) {
    for (let propId in role.props) {
        if (role.props[propId] == false) continue;
        let nodes = xmlReader.getPropInfo(propId);
        nodes.children().each(function () {
            switch ($(this)[0].tagName) {
                // case "SkillLevel": //增加技能等级
                //     role.upRoleSkill($(this), skill.skillLevel);
                //     break;
                case "Condition":
                    if (xmlReader.judgeCondition($(this), role)) {  //如果条件满足 递归读取属性
                        $(this).children().each(function () {
                            role.readEffect($(this)[0].tagName, parseFloat($(this).text()), false);
                        });
                    }
                    break;
                default:
                    role.readEffect($(this)[0].tagName, parseFloat($(this).text()), false);
                    break;
            }
        });
    }
}

//读取调节器
export function updateRoleFromAdjuster() {
    // $(".role-info-section input").each(function () {
    //     var value = parseFloat($(this).val());
    //     var type = $(this).siblings("span").attr("class");
    //     if (!isNaN(value)) {
    //         if (type == "RealPhyAtta" || type == "RealMagAtta" || type == "RealIndAtta")
    //             type = type.slice(4);
    //         if (type == "PhyCrit" || type == "MagCrit")
    //             value /= 100;
    //         role.roleInfo[type].real += value;
    //     }
    // });
}

//预设一些属性
// function debugFunc(role) {
//     // //超大陆鞋子
//     // role.equipments["shoes"].equipmentId = "04209000";
//     // role.equipments["shoes"].amplitudetype = "Intelligence";
//     // role.equipments["shoes"].strengthenNum = 8;
//     // //超大陆裤子
//     // role.equipments["pants"].equipmentId = "02209000";
//     // role.equipments["pants"].amplitudetype = "Intelligence";
//     // role.equipments["pants"].strengthenNum = 7;
//     // role.equipments["pants"].enchantingId = "001004";
//     // role.equipments["pants"].enchantingLevel = "01";
//     // //超大陆衣服
//     // role.equipments["coat"].equipmentId = "01209000";
//     // role.equipments["coat"].amplitudetype = "Intelligence";
//     // role.equipments["coat"].strengthenNum = 8;
//     // role.equipments["coat"].enchantingId = "001004";
//     // role.equipments["coat"].enchantingLevel = "01";
//     // //超大陆肩膀
//     role.equipments["shoulder"].equipmentId = "00209000";
//     role.equipments["shoulder"].updateNodeById();
//     role.equipments["shoulder"].amplitudetype = "Intelligence";
//     role.equipments["shoulder"].strengthenNum = 8;
//     // role.equipments["shoulder"].enchantingId = "004001";
//     // role.equipments["shoulder"].enchantingLevel = "00";
//     //
//     // role.equipments["belt"].equipmentId = "03209000";
//     // role.equipments["belt"].amplitudetype = "Intelligence";
//     // role.equipments["belt"].strengthenNum = 7;
//     // role.equipments["belt"].enchantingId = "003000";
//     // role.equipments["belt"].enchantingLevel = "01";
// }

//获取人物最高属强的属强名称
function getMaxStrengthenString(role) {
    let s = "";
    let max = Number.MIN_SAFE_INTEGER;
    for (let i = 0; i < 4; i++) {
        if (role.roleInfo[role.StrengthType[i]].real > max) {  //如果都一样的话默认为火属性
            max = role.roleInfo[role.StrengthType[i]].real;
            s = role.StrengthType[i];
        }
    }
    return s;
}