import * as xmlReader from "@/js/xmlReader"
import $ from 'jquery'
import {getIllustration} from '@/js/simulator/role'
import {getDamage} from '@/js/simulator/damageComputer'
import {getSkillValue} from "@/js/simulator/skill";


export const equipmentTypeNameMap = {
    "shoulder": "头肩",
    "coat": "上衣",
    "pants": "下装",
    "belt": "腰带",
    "shoes": "鞋",
    "weapon": "武器",
    "title": "称号",
    "bracelet": "手镯",
    "necklace": "项链",
    "ring": "戒指",
    "assistant": "辅助装备",
    "magicstone": "魔法石",
    "earrings": "耳环",
    "hair_d": "头部",
    "cap_d": "帽子",
    "face_d": "脸部",
    "neck_d": "胸部",
    "coat_d": "上衣",
    "skin_d": "皮肤",
    "belt_d": "腰带",
    "pants_d": "下装",
    "shoes_d": "鞋",
    "weapon_d": "武器",
    "aura_d": "光环",
    "pet": "宠物",
    "redequipment": "红色宠物装备",
    "blueequipment": "蓝色宠物装备",
    "greenequipment": "绿色宠物装备",
    "medal": "勋章",
    "bead1": "守护珠一",
    "bead2": "守护珠二",
    "bead3": "守护珠三",
    "bead4": "守护珠四",
    "talisman1": "护石一",
    "talisman2": "护石二"
};
export const runeTypeNameMap = {
    antiquitylibrary: "远古图书馆",
    circlemage: "旋魔会",
    guardians: "誓卫者",
    secondpact: "第二个真相",
    terracotta: "塔拉库沓"
};
export const propertyNameMap = {
    TriAttaPercent: "百分比三攻",
    Yellow: "黄字",
    ExtraYellow: "额外黄字",
    White: "白字",
    PropertyWhite: "属性白字",
    CritDamage: "爆伤",
    ExtraCrit: "额外爆伤",
    AllDamage: "最终伤害",
    PhyAttaPercent: "百分比物攻(技能)",
    MagAttaPercent: "百分比魔攻(技能)",
    IndAttaPercent: "百分比独立(技能)",
    StrengthIntelligencePercent: "百分比力智",
    Dot: "持续伤害",
    FighterAndPet: "宠物/斗神",
    SkillAtta: "技攻",
    Crit: "暴击增益",
    SpecialCrit: "技能爆伤",
};
export const occupationNameMap = {
    "001": "极诣·鬼泣",
    "002": "极诣·狂战士(测试中)",
    "003": "极诣·阿修罗",
    "004": "极诣·剑魂",
    "005": "极诣·剑影",
    "011": "极诣·流浪武士",
    "012": "极诣·暗殿骑士",
    "013": "极诣·驭剑士",
    "014": "极诣·契魔者",
};
export const occupationImgFrameMap = {
    "001": "90",
    "002": "90",
    "003": "46",
    "004": "100",
    "005": "120",
    "011": "100",
    "012": "100",
    "013": "100",
    "014": "100",
};

export function listToMap(list, getKeyFun, getValueFun) {
    let map = {};
    list.forEach(function (item) {
        map[getKeyFun(item)] = getValueFun(item);
    });
    return map;
}

export function getIllustrationFromNode(node) {
    if ($(node)[0].tagName === "SkillLevel") {
        let start = $(node).attr("start");
        let end = $(node).attr("end");
        let condition = $(node).attr("condition");
        let value = $(node).text();
        return getIllustration("SkillLevel", [start, end, condition, value]);
    } else if ($(node)[0].tagName === "PropertyAtta") {
        if ($(node).text() === '5')
            return "对武器赋予自身属性强化中数值最高的属性";
    } else
        return getIllustration([$(node)[0].tagName], [$(node).text()]);
}

export function getEnchantingMap(equipmentType) {
    let map = {};
    xmlReader.getAllEnchantingInfo(equipmentType).each(function () {
        let isCorrect = false;
        $(this).children("Type").each(function () {
            if ($(this).text() === equipmentType) isCorrect = true;
        });
        if (!isCorrect) return;
        let id = $(this).attr("id");
        $(this).children("Effect").each(function () {
            let illustration = "";
            $(this).children().each(function () {
                illustration += getIllustrationFromNode(this) + " ";
            });
            map[id + $(this).attr("level")] = illustration;
        });
    });
    return map;
}

export function getBadgeMap(equipmentType) {
    let map = {};
    xmlReader.getAllBadgeInfo(equipmentType).children().each(function () {
        let id = $(this).attr("id");
        let illustration = "";
        $(this).children().each(function () {
            illustration += getIllustration([$(this)[0].tagName], [$(this).text()]) + " ";
        });
        map[id] = illustration;
    });
    return map;
}

export function shouldShowBadgeSelect(type, index) {
    if (type === "title" || type === "earrings" || type === "talisman2" ||
        type === "hair_d" || type === "cap_d" || type === "face_d" ||
        type === "neck_d" || type === "coat_d" || type === "talisman1" ||
        type === "belt_d" || type === "pants_d" || type === "shoes_d" ||
        type === "pet" || type === "redequipment" || type === "blueequipment" ||
        type === "greenequipment" || type === "medal" || type === "bead1" ||
        type === "bead2" || type === "bead3" || type === "bead4" || type === "weapon" || type === "medal") { //武器 称号 耳环 宠物 宠物装备 没徽章
        return false;
    } else if (type === "assistant" || type === "magicstone") {  //只有一个徽章
        return index === 0;
    } else {   //两个徽章
        return true;
    }
    // if (type == "skin_d" || type == "aura_d") {
    //     $(".badge-div,.badge-div *").show();
    // }
}

export function getEditSelectionMap(node) {
    if (node == null) return {};
    let map = {};
    $(node).children().each(function () {
        let illustration = $(this).attr('title');
        $(this).children().each(function () {
            illustration += getIllustrationFromNode(this) + " ";
        });
        map[$(this).attr('value')] = illustration;
    });
    return map;
}

export function getDressAndMedalPropertyMap(node) {
    if (node == null) return {};
    let map = {};
    $(node).children("Property").each(function () {
        let illustration = "";
        $(this).children().each(function () {
            illustration += getIllustrationFromNode(this) + " ";
        });
        map[$(this).attr('index')] = illustration;
    });
    return map;
}

export function getRuneTypeMap(equipmentType, index, role) {
    let map = {};
    let next1 = (index) % 3 + 1;
    let next2 = (index + 1) % 3 + 1;
    let talisman = role.talismans[equipmentType];
    for (let key in runeTypeNameMap) {
        if ((talisman["rune" + next1].type !== key) && (talisman["rune" + next2].type !== key)) {
            map[key] = runeTypeNameMap[key];
        }
    }
    return map;
}

export function getRuneByIndex(index, role) {
    let talismanIndex = 1 + parseInt(((index - 1) / 3).toString());
    let runeIndex = (index - 1) % 3 + 1;
    return role.talismans['talisman' + talismanIndex]["rune" + runeIndex];
}

export function getRuneName(type, skillId) {
    if (skillId === null) return "";
    return runeTypeNameMap[type] + "[" + xmlReader.getSkillInfo(skillId).children("Name").text() + "]";
}

export function getAllRune(occupationId) {
    return xmlReader.getSkillsWithRune(occupationId).map(function () {
        return $(this).attr('id');
    }).toArray();
}

export function getSelectDialogTitle(equipmentType, itemType) {
    let title = "";
    switch (itemType) {
        case "equipments":
            title += "装备设置";
            break;
        case "dresss":
            title += "装扮设置";
            break;
        case "pets":
            title += "宠物设置";
            break;
        case "medals":
            title += "勋章设置";
            break;
        case "talismans":
            title += "护石设置";
            break;
        default:
            break;
    }
    title += "(" + equipmentTypeNameMap[equipmentType] + ")";
    return title;
}

//计算除了力量、智力、百分比三攻的增益
function getBuffValueWithoutMainProperty(role) {
    let upList = role.upList;
    let result = 1;
    let maxStrengthen = getMaxWhiteStrengthenString(role);
    result *= 1.5; //暴击加成 考虑要不要加上去
    result *= 1 + upList.Yellow / 100 + upList.ExtraYellow / 100; //黄字 额外黄字
    result *= 1 + upList.CritDamage / 100 + upList.ExtraCrit / 100; //爆伤 额外爆伤
    result *= 1 + upList.SpecialCrit / 100;  //技能爆伤
    result *= (1 + upList.AllDamage / 100);//计算所有攻击力
    result *= (1 + upList.White / 100 + upList.PropertyWhite / 100 *
        (1 + (maxStrengthen.max) * 0.0045 + 0.05));   //白字和属性白字
    result *= (1 + upList.Dot / 100);//计算dot
    result *= (1 + upList.SkillAtta / 100);//计算技攻
    result *= (1 + maxStrengthen.max * 0.0045 + 0.05); //计算属强
    return result;
}

//计算角色各词条总增益
export function getTotalBuffValue(role) {
    let upList = role.upList;
    let result = getBuffValueWithoutMainProperty(role);
    result *= (1 + upList.FighterAndPet / 100);//计算宠物和斗神
    result *= (1 + upList.StrengthIntelligencePercent / 100);//计算百分比力智  这是近似计算 因为力智越高 百分比提升越接近数值
    if (role.pi === '百分比') {
        if (role.mainProperty === "Strength") {
            result *= 1 + upList.PhyAttaPercent / 100;
        } else {
            result *= 1 + upList.MagAttaPercent / 100;
        }
    } else
        result *= 1 + upList.IndAttaPercent / 100;
    return result;
}

export function getFinalScore(role) {
    let upList = role.upList;
    let result = getBuffValueWithoutMainProperty(role);
    if (role.pi === '固伤') {//如果是百分比 宠物斗神的效果体现在攻击力面板上了
        result *= (1 + upList.FighterAndPet / 100);//计算宠物和斗神
        if (role.mainProperty === "Strength") {
            result *= 1 + role.roleInfo.Strength.real / 250;
            return result * role.roleInfo.RealIndAtta.real;
        } else {
            result *= 1 + role.roleInfo.Intelligence.real / 250;
            return result * role.roleInfo.RealIndAtta.real;
        }
    } else {  //百分比
        if (role.mainProperty === "Strength")
            return result * role.roleInfo.RealPhyAtta.real;
        else
            return result * role.roleInfo.RealMagAtta.real;
    }
}


//获取属性白字的最高属强
export function getMaxWhiteStrengthenString(role) {
    let result = "";
    let max = Number.MIN_SAFE_INTEGER;
    for (let i = 0; i < 4; i++) {
        let absoluteValue = role.roleInfo[role.StrengthType[i]].real - role.monster[role.StrengthType[i]];
        if (absoluteValue > max) {  //如果都一样的话默认为火属性
            max = absoluteValue;
            result = role.StrengthType[i];
        }
    }
    return {result, max};
}


export function toFixed(value, n) {
    let base = Math.pow(10, n);
    return (Math.floor(value * base) / base).toFixed(n);
}

export function computeDamage(role) {
    // let a = new Equipments();
    // a.parse(JSON.parse('{"shoulder":{"equipmentId":"0101068","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"coat":{"equipmentId":"0201074","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"pants":{"equipmentId":"0301071","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"belt":{"equipmentId":"0401070","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"shoes":{"equipmentId":"0501072","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"weapon":{"equipmentId":"0002191","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"title":{"equipmentId":"1200361","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"bracelet":{"equipmentId":"0600900","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"necklace":{"equipmentId":"0700216","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"ring":{"equipmentId":"0800901","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"assistant":{"equipmentId":"0900901","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"magicstone":{"equipmentId":"1100900","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"earrings":{"equipmentId":"1000900","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}}}'));
    // role.equipments = a;

    // role.updateRole();

    // let str = role.talismans.customToJson();
    // console.log(str);
    // let a = new Talismans();
    // a.parse(JSON.parse('{"talisman1":{"equipmentId":"00101","rune1":{"type":"guardians","grade":"rare","skill":"0010082"},"rune2":{"type":"secondpact","grade":"rare","skill":"0010170"},"rune3":{"type":"terracotta","grade":"rare","skill":"0010332"}},"talisman2":{"equipmentId":"00100","rune1":{"type":"guardians","grade":"rare","skill":"0010082"},"rune2":{"type":"secondpact","grade":"rare","skill":"0010082"},"rune3":{"type":"terracotta","grade":"senior","skill":"0010532"}}}'));
    // role.talismans = a;
    // role.updateRole();

    // let str = role.customToJson();
    // // let s = '{"occupationId":"001","suitInfo":{},"equipments":{"shoulder":{"equipmentId":"0100071","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"coat":{"equipmentId":"0200075","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"pants":{"equipmentId":"0300074","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"belt":{"equipmentId":"0400070","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"shoes":{"equipmentId":"0500072","strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"weapon":{"equipmentId":null,"strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"title":{"equipmentId":null,"strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"bracelet":{"equipmentId":null,"strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"necklace":{"equipmentId":null,"strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"ring":{"equipmentId":null,"strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"assistant":{"equipmentId":null,"strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"magicstone":{"equipmentId":null,"strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}},"earrings":{"equipmentId":null,"strengthenNum":0,"amplitudetype":"null","forgingNum":0,"enchantingId":null,"enchantingLevel":"","badge":{"badge1":"null","badge2":"null"},"editInfo":{}}},"dresss":{"hair_d":{"equipmentId":null,"propertyId":null,"badge":{"badge1":"null","badge2":"null"}},"cap_d":{"equipmentId":null,"propertyId":null,"badge":{"badge1":"null","badge2":"null"}},"face_d":{"equipmentId":null,"propertyId":null,"badge":{"badge1":"null","badge2":"null"}},"neck_d":{"equipmentId":null,"propertyId":null,"badge":{"badge1":"null","badge2":"null"}},"coat_d":{"equipmentId":null,"propertyId":null,"badge":{"badge1":"null","badge2":"null"}},"skin_d":{"equipmentId":null,"propertyId":null,"badge":{"badge1":"null","badge2":"null"}},"belt_d":{"equipmentId":null,"propertyId":null,"badge":{"badge1":"null","badge2":"null"}},"pants_d":{"equipmentId":null,"propertyId":null,"badge":{"badge1":"null","badge2":"null"}},"shoes_d":{"equipmentId":null,"propertyId":null,"badge":{"badge1":"null","badge2":"null"}},"weapon_d":{"equipmentId":null,"propertyId":null,"badge":{"badge1":"null","badge2":"null"}},"aura_d":{"equipmentId":null,"propertyId":null,"badge":{"badge1":"null","badge2":"null"}}},"pets":{"pet":{"equipmentId":null,"enchantingId":null,"enchantingLevel":"","editInfo":{}},"redequipment":{"equipmentId":null,"enchantingId":null,"enchantingLevel":"","editInfo":{}},"blueequipment":{"equipmentId":null,"enchantingId":null,"enchantingLevel":"","editInfo":{}},"greenequipment":{"equipmentId":null,"enchantingId":null,"enchantingLevel":"","editInfo":{}}},"medals":{"medal":{"equipmentId":null,"propertyId":null,"strengthenNum":0},"bead1":{"equipmentId":null,"propertyId":null,"strengthenNum":0},"bead2":{"equipmentId":null,"propertyId":null,"strengthenNum":0},"bead3":{"equipmentId":null,"propertyId":null,"strengthenNum":0},"bead4":{"equipmentId":null,"propertyId":null,"strengthenNum":0}},"talismans":{"talisman1":{"equipmentId":null,"rune1":{"type":"guardians","grade":"null","skill":null},"rune2":{"type":"secondpact","grade":"null","skill":null},"rune3":{"type":"terracotta","grade":"null","skill":null}},"talisman2":{"equipmentId":null,"rune1":{"type":"guardians","grade":"null","skill":null},"rune2":{"type":"secondpact","grade":"null","skill":null},"rune3":{"type":"terracotta","grade":"null","skill":null}}},"props":{},"skills":{"9990001":{"skillId":"9990001","version":"0","baseSkillLevel":1},"9990002":{"skillId":"9990002","version":"0","baseSkillLevel":95},"9990003":{"skillId":"9990003","version":"0","baseSkillLevel":0},"9990004":{"skillId":"9990004","version":"0","baseSkillLevel":0},"9990005":{"skillId":"9990005","version":"0","baseSkillLevel":0},"9990006":{"skillId":"9990006","version":"0","baseSkillLevel":2},"9990007":{"skillId":"9990007","version":"0","baseSkillLevel":1},"9990008":{"skillId":"9990008","version":"0","baseSkillLevel":7},"9990009":{"skillId":"9990009","version":"0","baseSkillLevel":6},"9990010":{"skillId":"9990010","version":"0","baseSkillLevel":0},"0000052":{"skillId":"0000052","version":"0","baseSkillLevel":10},"0000064":{"skillId":"0000064","version":"0","baseSkillLevel":29},"0000066":{"skillId":"0000066","version":"0","baseSkillLevel":29},"0010204":{"skillId":"0010204","version":"0","baseSkillLevel":1},"0010080":{"skillId":"0010080","version":"0","baseSkillLevel":10},"0010010":{"skillId":"0010010","version":"0","baseSkillLevel":50},"0010084":{"skillId":"0010084","version":"0","baseSkillLevel":1},"0010062":{"skillId":"0010062","version":"0","baseSkillLevel":10},"0010174":{"skillId":"0010174","version":"0","baseSkillLevel":1},"0010016":{"skillId":"0010016","version":"0","baseSkillLevel":20},"0010046":{"skillId":"0010046","version":"0","baseSkillLevel":1},"0010160":{"skillId":"0010160","version":"0","baseSkillLevel":43},"0010332":{"skillId":"0010332","version":"0","baseSkillLevel":24},"0010082":{"skillId":"0010082","version":"0","baseSkillLevel":36},"0010090":{"skillId":"0010090","version":"0","baseSkillLevel":33},"0010170":{"skillId":"0010170","version":"0","baseSkillLevel":33},"0010530":{"skillId":"0010530","version":"0","baseSkillLevel":31},"0010138":{"skillId":"0010138","version":"0","baseSkillLevel":31},"0010178":{"skillId":"0010178","version":"0","baseSkillLevel":28},"0010179":{"skillId":"0010179","version":"0","baseSkillLevel":28},"0010532":{"skillId":"0010532","version":"0","baseSkillLevel":28},"0010196":{"skillId":"0010196","version":"0","baseSkillLevel":18},"0010188":{"skillId":"0010188","version":"0","baseSkillLevel":11},"0010189":{"skillId":"0010189","version":"0","baseSkillLevel":11},"0010536":{"skillId":"0010536","version":"0","baseSkillLevel":21},"0010542":{"skillId":"0010542","version":"0","baseSkillLevel":16},"0010420":{"skillId":"0010420","version":"0","baseSkillLevel":13},"0010440":{"skillId":"0010440","version":"0","baseSkillLevel":9},"0010534":{"skillId":"0010534","version":"0","baseSkillLevel":11},"0010434":{"skillId":"0010434","version":"0","baseSkillLevel":4},"0010226":{"skillId":"0010226","version":"0","baseSkillLevel":0},"0010266":{"skillId":"0010266","version":"0","baseSkillLevel":0},"0010316":{"skillId":"0010316","version":"0","baseSkillLevel":5},"0010334":{"skillId":"0010334","version":"0","baseSkillLevel":5},"0010326":{"skillId":"0010326","version":"0","baseSkillLevel":0},"0010276":{"skillId":"0010276","version":"0","baseSkillLevel":5},"0010538":{"skillId":"0010538","version":"0","baseSkillLevel":5},"0010314":{"skillId":"0010314","version":"0","baseSkillLevel":0},"0010330":{"skillId":"0010330","version":"0","baseSkillLevel":5},"0010552":{"skillId":"0010552","version":"0","baseSkillLevel":0},"0010554":{"skillId":"0010554","version":"0","baseSkillLevel":0}}}'
    // console.log(str);
    // let a = new Role();
    // a.parse(JSON.parse(str));

    //计算全部技能的伤害
    for (let skillId in role.skills) {
        let skill = role.skills[skillId];
        if (xmlReader.getAttributeValueWithDefault(skill.xmlNode, "df", "伤害") !== "伤害") continue;
        if (skill.isDisable) {
            skill.singleDamage = 0;
            skill.percentage = 0;
            continue;
        }
        // if (getAttributeValueWithDefalue(getSkillInfo(skill.skillId), "df", "伤害") == "伤害") { //是伤害技能的话
        skill.singleDamage = parseInt(getDamage(role, skill, role.monster)); //计算单次伤害
        // let sum = damage * parseFloat($("#" + skill.skillId + " .times").val()); //计算多次伤害
        // totalDamage += sum; //计入总和
        // }
    }
    // console.timeEnd();
}

export function parseNearInt(num) {
    let cur = parseInt(num);
    if (num - cur < 0.00001)
        return cur;
    if (cur + 1 - num < 0.00001)
        return cur + 1;
    return cur;
}

export function getBuffSkillValue(node, buffSkill) {
    return getSkillValue(node.find("Property[index='" + buffSkill.version + "']").children(), buffSkill);
}

//----------------------计算器相关------------------------------------------

export function getAllSuitInfo() {
    return xmlReader.getAllSuitInfo(true).map(function () {
        return {
            suitName: $(this).children("Name").text().slice(0, -3),
            id: $(this).attr("id"),
            equipments: getSuitEquipment($(this).attr("id"))
        }
    }).toArray();
}

function getSuitEquipment(suitId) {
    return xmlReader.getEquipmentWithSuitId(suitId).map(function () {
        return {
            id: $(this).attr("id"),
            equipmentName: $(this).children("Name").text(),
            node: $(this)
        }
    }).toArray();
}
