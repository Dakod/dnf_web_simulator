import $ from "jquery"
import * as xmlReader from "@/js/xmlReader"
import {readEffectFromParentNode, readSingleProperty} from "@/js/simulator/role"
import {Serializable} from "@/js/simulator/Serializable";
import {AbstractEquipment} from "@/js/simulator/AbstractEquipment";

const equipmentList = ["shoulder", "coat", "pants", "belt",
    "shoes", "weapon", "title", "bracelet", "necklace", "ring", "assistant", "magicstone", "earrings"];

export class Equipments extends Serializable {
    constructor() {
        super();
        for (let equipmentName of equipmentList)
            this[equipmentName] = new Equipment();
    }

    cleanEquipmentsDetail() {
        for (let equipmentName of equipmentList) {
            let theEquipment = this[equipmentName];
            theEquipment.strengthenNum = 0;
            theEquipment.amplitudetype = "null";
            theEquipment.forgingNum = 0;
            theEquipment.enchantingId = 0;
            theEquipment.enchantingLevel = "";
            theEquipment.badge.badge1 = "null";
            theEquipment.badge.badge2 = "null";
        }
    }

    copyEquipmentsDetail(source) {
        for (let equipmentName of equipmentList) {
            let theEquipment = this[equipmentName];
            theEquipment.strengthenNum = source[equipmentName].strengthenNum;
            theEquipment.amplitudetype = source[equipmentName].amplitudetype;
            theEquipment.forgingNum = source[equipmentName].forgingNum;
            theEquipment.enchantingId = source[equipmentName].enchantingId;
            theEquipment.enchantingLevel = source[equipmentName].enchantingLevel;
            theEquipment.badge.badge1 = source[equipmentName].badge.badge1;
            theEquipment.badge.badge2 = source[equipmentName].badge.badge2;
        }
    }

    copyPureEquipments(source) {
        for (let equipmentName of equipmentList) {
            let theEquipment = this[equipmentName];
            theEquipment.equipmentId = source[equipmentName].equipmentId;
            theEquipment.init();
            theEquipment.editInfo = source[equipmentName].editInfo;
        }
    }

    setStrengthen(type, num) {
        for (let equipmentName of equipmentList) {
            if (equipmentName === "title") continue;
            this[equipmentName].strengthenNum = num;
            this[equipmentName].amplitudetype = type;
        }
    }
}

export class Equipment extends AbstractEquipment {
    constructor() {
        super();
        this.equipmentId = null;   //装备Id
        this.strengthenNum = 0; //强化数值
        this.amplitudetype = "null";
        this.forgingNum = 0; // 锻造数值 （只有武器有）
        this.enchantingId = null;  //附魔ID
        this.enchantingLevel = ""; //附魔等级 (根据属性分类，等级计算数值)
        this.badge = {
            badge1: "null",  //白金也在这个框
            badge2: "null"
        };
        this.editInfo = {};//装备编辑信息
    }

    init() {
        // this.isLocked = false; //是否锁定 锁定代表快速计算时不会被替换
        this.counterMap = {}; //装备套装数量信息
        super.init();
    }


}

Equipment.prototype.hasEditInfo = true;
Equipment.prototype.itemType = "equipments";

Serializable.defineNotEnumerableProperty(Equipment.prototype, "serializeField",
    ["equipmentId", "strengthenNum", "amplitudetype", "forgingNum", "enchantingId", "enchantingLevel", "badge", "editInfo"]);
Serializable.defineNotEnumerableProperty(Equipments.prototype, "serializeClass", {"all": Equipment});


//读取父节点下的所有词条
export function readEquipmentNode(node, role, equipment) {
    node.children().each(function () {
        switch ($(this)[0].tagName) {
            case "StrengthNumUp": //受强化和增幅数值影响的词条
                var value = equipment.strengthenNum;
                var max = $(this).attr("max");
                value = Math.min(value, max);
                $(this).children().each(function () {
                    role.readEffect($(this)[0].tagName, parseFloat(value));
                });
                break;
            case "Edit":
                break;

            default:
                readSingleProperty(this, role);
        }
    });
}


export function updateRoleFromEquipment(role) {
    let counterMap = {};//储存装备的套装信息表
    let suitMarkInfo = {};//套装标记表
    let armorMasterTotal = 0; //防具精通的总提升
    for (let equipment in role.equipments) {
        let theEquipment = role.equipments[equipment]; //获取该部位的装备
        if (theEquipment.equipmentId == null) continue;
        let equipmentType = xmlReader.getEquipmentType(theEquipment.equipmentId);
        //获取装备属性节点
        let element = xmlReader.getEquipmentInfo(theEquipment.equipmentId);
        readEquipmentNode(element.children("Property"), role, theEquipment);
        //读取可编辑属性
        if (element.attr('editable') === 'true') {  //如果可编辑
            element.find("Edit").children().each(function () {
                let value = theEquipment.editInfo[$(this).attr('index')];//获取设置的值
                switch ($(this)[0].tagName) {
                    case "Selection":
                        readEquipmentNode($(this).children("Option[value='" + value + "']"), role, theEquipment);
                        break;
                    case "Input":
                        if ($(this).children()[0].tagName === 'SkillLevel') {  //是技能等级时 调整的是最大等级
                            $(this).children().attr('end', value);
                        } else {
                            $(this).children().text(value);
                        }
                        readEquipmentNode($(this), role, theEquipment);
                        break;
                    default:
                        break;
                }
            });
        }
        //获取强化增益
        if (theEquipment.strengthenNum > 0) {
            if (equipmentType === "weapon" || equipmentType === "special") { //如果装备是武器或者耳环 左右槽
                let theElement = xmlReader.getStrengthenInfo(xmlReader.getEquipmentTagValue(theEquipment.equipmentId, "Type"), theEquipment.strengthenNum,
                    " lv" + element.children("Level").text());
                readEffectFromParentNode(theElement, role);
            }
        }
        //获取增幅收益
        if (String(theEquipment.amplitudetype) !== "null" && equipmentType !== "title") {  //如果有增幅 并且不是称号
            let value = xmlReader.getAmplitudeInfo(theEquipment.strengthenNum, element.children("Level").text());
            role.changeRoleValue(theEquipment.amplitudetype, value);
        }
        //获取锻造收益
        if (theEquipment.forgingNum > 0) {  //如果有锻造
            if (equipmentType === "weapon") {  //是武器的话
                let v = xmlReader.getForgingInfo(theEquipment.forgingNum, element.children("Level").text());
                role.changeRoleValue("IndAtta", v);
            }
        }

        //获取附魔增益
        if (String(theEquipment.enchantingId) !== "null") {
            let enchantingId = theEquipment.enchantingId.slice(0, 6);
            let enchantingLevel = theEquipment.enchantingId.slice(6, 8);
            let element = xmlReader.getEnchantingInfo(enchantingId, enchantingLevel);
            // element1.children().each(function () {
            //     switch ($(this)[0].tagName) {
            //         case "SkillLevel":
            //             role.upRoleSkill($(this));
            //             break;
            //         default:
            //             role.readEffect($(this)[0].tagName, parseFloat($(this).text()));
            //     }
            // });
            readEffectFromParentNode(element, role);
        }
        //获取徽章效果
        if (String(theEquipment.badge.badge1) != "null") {  //第一个徽章
            readEffectFromParentNode(xmlReader.getBadgeInfo(theEquipment.badge.badge1), role);
        }
        if (String(theEquipment.badge.badge2) != "null") {  //第二个徽章
            readEffectFromParentNode(xmlReader.getBadgeInfo(theEquipment.badge.badge2), role);
        }
        //计算套装数量信息
        let suitId;
        if ((suitId = element.attr("suit")) != null) { //如果有套装效果
            let suitIds = suitId.split(" ");
            for (suitId of suitIds) {
                if (xmlReader.getSuitInfo(suitId).attr("link") != null)  //套装属性链接到别的套装
                    suitId = xmlReader.getSuitInfo(suitId).attr("link");
                if (counterMap[suitId] == null)
                    counterMap[suitId] = 1;
                else
                    counterMap[suitId] += 1;
                //记录套装包含哪些部位
                if (suitMarkInfo[suitId] == null) {
                    suitMarkInfo[suitId] = [equipment];
                } else
                    suitMarkInfo[suitId].push(equipment);
            }
        }
        // role.counterMap = counterMap;
        //获取防具精通信息 (有些职业有多种专精，后续需要改写)
        if (xmlReader.getEquipmentType(theEquipment.equipmentId) === "armor") {
            let commonArmorObject = xmlReader.getCommonArmorObject();
            let grade = element.children("Grade").text();
            let level = element.children("Level").text();
            let smallType = xmlReader.getEquipmentSmallType(theEquipment.equipmentId);
            let armorMasterPropertyInfo = commonArmorObject.armorMaster[level][smallType];
            let mainProperty = armorMasterPropertyInfo.mainProperty + parseInt((theEquipment.strengthenNum / 3)) * armorMasterPropertyInfo.grow;
            let isMaster = true;
            if (role.skills[role.armorMasterSkillId].isDisable === true)  //如果禁用防具精通 则不作为精通甲
                isMaster = false;
            armorMasterTotal += isMaster ? mainProperty / 0.4 : mainProperty;
            role.readEffect(role.mainProperty === "Strength" ? "PhyCrit" : "MagCrit", isMaster ? armorMasterPropertyInfo.crit * 2 : armorMasterPropertyInfo.crit);
            //获取防具的通用属性 力和智 根据是否转甲会有不同
            let streInte = commonArmorObject[grade][level][isMaster ? role.masterArmorType : element.children("Type").text()][smallType];
            role.readEffect("Strength", streInte[0]);
            role.readEffect("Intelligence", streInte[1]);
        }
    }
    //计算精通总和
    role.readEffect(role.mainProperty, armorMasterTotal);

    //获取套装效果
    for (let suit in counterMap) {
        let node = xmlReader.getSuitInfo(suit);
        if (node.attr("higher") == null) {  //没有高阶套装
            node.children("Property").each(function () {
                if (counterMap[suit] >= parseInt($(this).attr("num"))) {  //如果件数大于套装需求数，则套装有效
                    readEffectFromParentNode($(this), role);
                    getEditProperty(node, this, role);
                    suitMarkInfo[suit].isActive = true;
                }
            });
        } else { //有高阶套装
            node.children("Property").each(function () {
                let hiderNum = counterMap[node.attr("higher")] == undefined ? 0 : counterMap[node.attr("higher")];
                if (counterMap[suit] + hiderNum >= parseInt($(this).attr("num")) &&  //件数大于套装需求数，并且高阶套装效果没有被触发
                    hiderNum < parseInt($(this).attr("num"))) {
                    readEffectFromParentNode($(this), role);
                    getEditProperty(node, this, role);
                }
            });
        }
    }
    //分配套装标记
    setSuitMark(role, suitMarkInfo);
}

function getEditProperty(suitNode, propertyNode, role) {
    if (suitNode.attr('editable') === 'true' && $(propertyNode).children('Edit') !== undefined) {  //有可编辑属性
        $(propertyNode).children('Edit').children().each(function () {
            let value = "";
            let suitInfo = role.suitInfo[suitNode.attr('id')];//获取设置的值
            if ((suitInfo === undefined) || (suitInfo[$(this).attr('index')] === undefined))//没有设置
                value = $(this).attr('default');
            else
                value = suitInfo[$(this).attr('index')];
            switch ($(this)[0].tagName) {
                case "Selection" :
                    readEquipmentNode($(this).children("Option[value='" + value + "']"), role, null);
                    break;
                default:
                    break;
            }
        });
    }
}


function setSuitMark(role, suitMarkInfo) {
    let map = {};
    let index = 0;
    for (let suitId in suitMarkInfo) {
        if (suitMarkInfo[suitId].length > 1 && suitMarkInfo[suitId].isActive !== undefined) {
            for (let equipmentType of suitMarkInfo[suitId]) {
                map[equipmentType] = index;
            }
            index++;
        }
    }
    role.suitMarkInfo = map;
}
