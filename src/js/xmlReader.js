import $ from 'jquery'
// import {VERSION} from './SerializeUtils'

let resources = {};

// let equipmentXML = null;
// let dressXML = null;
// let additiveXML = null;
// let enchantingXML = null;
// let skillXML = null;
// let badgeXML = null;
// let petXML = null;
// let medalXML = null;
// let propXML = null;
// let monsterXML = null;
// let roleXML = null;
// let talismanXML = null;
export let commonArmor = null;


const xmlResourceList = ["equipment", "prop", "skill", "additive", "enchanting", "badge", "dress",
    "pet", "medal", "talisman", "monster", "role"];
const jsonResourceList = ["commonArmor"];

function xmlLoad(xmlUrl, type) {
    return new Promise(function (resolve, reject) {
        let request = new XMLHttpRequest();
        request.open('GET', xmlUrl);
        request.responseType = type || 'document';
        request.onload = function () {
            if (request.status == 200) {
                resolve(request.response);
            } else {
                reject(Error('获取资源失败' + request.statusText));
            }
        };
        request.onerror = function () {
            reject(Error('There was a network error.'));
        };

        request.send();
    });
}


export function initResource() {
    let promiseList = [];
    for (let resource of xmlResourceList) {
        promiseList.push(xmlLoad(`Resource/${resource}.xml`).then(res => {
            resources[`${resource}XML`] = res;
        }));
    }
    for (let resource of jsonResourceList) {
        promiseList.push(xmlLoad(`Resource/${resource}.json`, "json").then(res => {
            resources[`${resource}`] = res;
        }));
    }
    return Promise.all(promiseList);
}

// xmlLoad("Resource/equipment_100.xml").then(res => {
//     equipmentXML = res;
// });

// $.ajax({
//     url: "Resource/equipment_100.xml",
//     async: false,
//     type: "GET",
//     dataType: "xml",
//     success: function (xml) {
//         equipmentXML = xml;
//     }
// });

// $.ajax({
//     url: "Resource/prop.xml",
//     async: false,
//     type: "GET",
//     dataType: "xml",
//     success: function (xml) {
//         propXML = xml;
//     }
// });

// $.ajax({
//     url: "Resource/skill.xml",
//     async: false,
//     type: "GET",
//     dataType: "xml",
//     success: function (xml) {
//         skillXML = xml;
//     }
// });
//
// $.ajax({
//     url: "Resource/additive.xml",
//     async: false,
//     type: "GET",
//     dataType: "xml",
//     success: function (xml) {
//         additiveXML = xml;
//     }
// });
// $.ajax({
//     url: "Resource/enchanting.xml",
//     async: false,
//     type: "GET",
//     dataType: "xml",
//     success: function (xml) {
//         enchantingXML = xml;
//     }
// });
// $.ajax({
//     url: "Resource/badge.xml",
//     async: false,
//     type: "GET",
//     dataType: "xml",
//     success: function (xml) {
//         badgeXML = xml;
//     }
// });
// $.ajax({
//     url: "Resource/dress.xml",
//     async: false,
//     type: "GET",
//     dataType: "xml",
//     success: function (xml) {
//         dressXML = xml;
//     }
// });
// $.ajax({
//     url: "Resource/pet.xml",
//     async: false,
//     type: "GET",
//     dataType: "xml",
//     success: function (xml) {
//         petXML = xml;
//     }
// });
// $.ajax({
//     url: "Resource/medal.xml",
//     async: false,
//     type: "GET",
//     dataType: "xml",
//     success: function (xml) {
//         medalXML = xml;
//     }
// });
// $.ajax({
//     url: "Resource/talisman.xml",
//     async: false,
//     type: "GET",
//     dataType: "xml",
//     success: function (xml) {
//         talismanXML = xml;
//     }
// });
// $.ajax({
//     url: "Resource/monster.xml",
//     async: false,
//     type: "GET",
//     dataType: "xml",
//     success: function (xml) {
//         monsterXML = xml;
//     }
// });
// $.ajax({
//     url: "Resource/role.xml",
//     async: false,
//     type: "GET",
//     dataType: "xml",
//     success: function (xml) {
//         roleXML = xml;
//     }
// });
// $.ajax({
//     url: "Resource/common_armor.json",
//     async: false,
//     type: "GET",
//     dataType: "json",
//     success: function (json) {
//         commonArmor = json;
//     }
// });

// 获取装备 装扮 宠物 护石等物品信息
export function getAllTypeItemInfo(equipmentType, itemType) {
    if (itemType === undefined || itemType === 'equipments')
        return getAllTypeEquipmentInfo(equipmentType);
    if (itemType === 'dresss')
        return getAllTypeDressInfo(equipmentType);
    if (itemType === 'pets')
        return getAllTypePetInfo(equipmentType);
    if (itemType === 'medals')
        return getAllTypeMedalInfo(equipmentType);

}

// 获取装备 装扮 宠物 护石等物品信息
export function getItemInfo(id, itemType) {
    if (itemType === undefined || itemType === 'equipments')
        return getEquipmentInfo(id);
    if (itemType === 'dresss')
        return getDressInfo(id);
    if (itemType === 'pets')
        return getAllTypePetInfo(null, id);
    if (itemType === 'medals')
        return getMedalInfo(id);
    if (itemType === 'talismans')
        return getTalismanInfo(id);
}

//-----------------------------------------------装备相关---------------------------------------
export function getAllTypeEquipmentInfo(equipmentType) {
    return $(resources.equipmentXML).find(equipmentType + " equipment");
}

export function getEquipmentInfo(id) {
    return $(resources.equipmentXML).find("equipments equipment[id='" + id + "']");
}

//获取装备的大类 (防具，武器，首饰等)
export function getEquipmentType(ID) {
    return $(resources.equipmentXML).find("equipment[id='" + ID + "']").parent().parent()[0].nodeName;
}

//获取装备的小类(头肩、手镯等)
export function getEquipmentSmallType(ID) {
    return $(resources.equipmentXML).find("equipment[id='" + ID + "']").parent()[0].nodeName;
}

//获取所有套装信息
export function getAllSuitInfo(isFiltered) {
    if (!isFiltered)
        return $(resources.equipmentXML).find("suit");
    else
        return $(resources.equipmentXML).find("suit[inCollection!='false']");
}

//获取某个套装的所有装备
export function getEquipmentWithSuitId(id) {
    return $(resources.equipmentXML).find("equipment[suit='" + id + "']");
}

//获取主套装的名称
export function getMainSuitName(equipmentId) {
    let mainSuitId = $(resources.equipmentXML).find("#" + equipmentId).attr("suit");
    if (mainSuitId === undefined)
        return "";
    mainSuitId = mainSuitId.split(" ")[0];
    return getSuitInfo(mainSuitId).children("Name").text();
}

//获取强化数值
export function getStrengthenInfo(type, value, level) {
    return $(resources.additiveXML).find("additive strengthen " + type + " " + level + " strength[value='" + value + "']");
}

//获取增幅数值
export function getAmplitudeInfo(value, level) {
    return parseFloat($(resources.additiveXML).find("additive amplitude lv" + level + " num[value='" + value + "']").text());
}

//获取锻造数值
export function getForgingInfo(value, level) {
    return parseFloat($(resources.additiveXML).find("additive forging lv" + level + " num[value='" + value + "']").text());
}

export function getEquipmentTagValue(ID, tag) {
    return $(resources.equipmentXML).find("equipment[id='" + ID + "'] " + tag).text();
}

//获取附魔信息
export function getEnchantingInfo(ID, level) {
    return $(resources.enchantingXML).find("enchantings enchanting[id='" + ID + "'] Effect[level='" + level + "']");
}

//获取装备套装信息
export function getSuitInfo(ID) {
    return $(resources.equipmentXML).find("equipments suits suit[id='" + ID + "']");
}


//-----------------------------------------------装扮相关---------------------------------------
export function getDressInfo(id) {
    return $(resources.dressXML).find("dresses dress[id='" + id + "']");
}

export function getDressID(type, grade) {
    return $(resources.dressXML).find("dresses " + type + " " + "dress[type='" + grade + "']").attr("id");
}

//获取装扮套装信息
export function getDressSuitInfo(ID) {
    return $(resources.dressXML).find("dresses suits suit[id='" + ID + "']");
}

//读取所有装扮
export function getAllTypeDressInfo(dressType) {
    return $(resources.dressXML).find(dressType + " dress");
}

//读取某类型的装扮可选属性
export function getAllDressProperty(dressId) {
    return $(resources.dressXML).find("#" + dressId);
}

//-----------------------------------------------技能相关---------------------------------------
//获取基础防具精通的数值节点
export function getArmorMasterElement(ID, equipmentType, grade, level) {
    if (grade === 'myth') grade = 'epic';
    return $(resources.skillXML).find("skills skill[id='" + ID + "'] Special " + equipmentType + " " + grade + " item[level='" + level + "']");
}

//根据ID获取技能的节点
export function getSkillInfo(ID) {
    return $(resources.skillXML).find("skills skill[id='" + ID + "']");
}

//读取某个职业的所有技能
export function getAllSkills(occupationId) {
    let s = "#999,#" + occupationId.slice(0, 2) + "0,#" + occupationId;
    return $(resources.skillXML).find(s);
}

//读取有符文的技能
export function getSkillsWithRune(occupationId) {
    return $(resources.skillXML).find("#" + occupationId).children("skill[hasRune='true']");
}


//根据ID获取徽章的节点
export function getBadgeInfo(ID) {
    return $(resources.badgeXML).find("badges badge[id='" + ID + "']");
}

//判断Condition标签是否成立
// eslint-disable-next-line no-unused-vars
export function judgeCondition(e, role) {
    var result = false;
    var first = e.attr("first");
    var mid = e.attr("mid");
    var last = e.attr("last");
    eval("result = role." + first + mid + last);
    return result;
}

//读取元素是否的某个属性值，若为空，则返回默认值
export function getAttributeValueWithDefault(element, attribute, defaultValue) {
    if (element.attr(attribute) != null) {
        return element.attr(attribute);
    } else
        return defaultValue;
}


//读取所有附魔宝珠
export function getAllEnchantingInfo(type) {
    return $(resources.enchantingXML).find("enchantings enchanting Type:contains('" + type + "')").parent();
}

//读取所有徽章
export function getAllBadgeInfo(type) {
    return $(resources.badgeXML).find("." + type);
}


//读取宠物
export function getAllTypePetInfo(type, id) {
    if (id != undefined) {
        return $(resources.petXML).find("#" + id);
    }
    return $(resources.petXML).find(type);
}

//读取勋章
export function getAllTypeMedalInfo(type) {
    if (type.slice(0, 4) == "bead") {
        return $(resources.medalXML).find("bead");
    }
    return $(resources.medalXML).find(type);
}

//读取护石
export function getAllTypeTalismanInfo(occupationId) {
    return $(resources.talismanXML).find("*[occupationId='" + occupationId + "'] talisman");
}

export function getTalismanInfo(id) {
    return $(resources.talismanXML).find("#" + id);
}


export function getMedalInfo(id) {
    return $(resources.medalXML).find("#" + id);
}


export function getAllProps() {
    return $(resources.propXML).find("prop");
}

export function getPropInfo(id) {
    return $(resources.propXML).find("#" + id);
}

export function getMonsterInfo(id) {
    return $(resources.monsterXML).find("#" + id);
}

export function getAllMonsterInfo() {
    return $(resources.monsterXML).find("monster");
}


export function getRoleBase(Id) {
    return $(resources.roleXML).find("role[id='" + Id + "']");
}

export function getCommonArmorObject() {
    return resources.commonArmor;
}

// export function test(id) {
//     var element = $(equipmentXML).find("equipments equipment[id='" + "04209000" + "']");
//     alert(element.children("Type").text());
// }