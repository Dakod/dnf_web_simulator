import $ from "jquery"
import * as xmlReader from "@/js/xmlReader"
import {readEffectFromParentNode} from "@/js/simulator/role"
import {Serializable} from "@/js/simulator/Serializable";
import {AbstractEquipment} from "@/js/simulator/AbstractEquipment";

const petList = ["pet", "redequipment", "blueequipment", "greenequipment"];

export class Pets extends Serializable {
    constructor() {
        super();
        for (let petName of petList) {
            this[petName] = new Pet();
        }
    }
}

export class Pet extends AbstractEquipment {
    constructor() {
        super();
        this.equipmentId = null;
        this.enchantingId = null;
        this.enchantingLevel = "";
        this.editInfo = {};//装备编辑信息
    }

}

Pet.prototype.hasEditInfo = true;
Pet.prototype.itemType = "pets";

Serializable.defineNotEnumerableProperty(Pet.prototype, "serializeField",
    ["equipmentId", "enchantingId", "enchantingLevel", "editInfo"]);
Serializable.defineNotEnumerableProperty(Pets.prototype, "serializeClass", {"all": Pet});

const medalList = ["medal", "bead1", "bead2", "bead3", "bead4"];

export class Medals extends Serializable {
    constructor() {
        super();
        for (let medalName of medalList) {
            this[medalName] = new Medal();
        }
    }
}

export class Medal extends AbstractEquipment {
    constructor() {
        super();
        this.equipmentId = null;
        this.propertyId = null;
        this.strengthenNum = 0;
    }

    init() {
        super.init();
    }
}

Medal.prototype.itemType = "medals";

Serializable.defineNotEnumerableProperty(Medal.prototype, "serializeField",
    ["equipmentId", "propertyId", "strengthenNum"]);
Serializable.defineNotEnumerableProperty(Medals.prototype, "serializeClass", {"all": Medal});


export function updateRoleFromPet(role) {
    for (let petType in role.pets) {
        let thePet = role.pets[petType]; //获取该部位的装备
        if (thePet.equipmentId == null) continue;
        let element = xmlReader.getAllTypePetInfo(petType, thePet.equipmentId);
        readEffectFromParentNode(element.children("Property"), role);
        if (element.attr('editable') === 'true') {  //如果可编辑
            element.children("Edit").children().each(function () {
                let value = thePet.editInfo[$(this).attr('index')];//获取设置的值
                switch ($(this)[0].tagName) {
                    case "Selection":
                        readEffectFromParentNode($(this).children("Option[value='" + value + "']"), role);
                        break;
                    case "Input":
                        if ($(this).children()[0].tagName === 'SkillLevel') {  //是技能等级时 调整的是最大等级
                            $(this).children().attr('end', value);
                        } else {
                            $(this).children().text(value);
                        }
                        readEffectFromParentNode($(this), role);
                        break;
                    default:
                        break;
                }
            });
        }

        //获取附魔增益
        if (String(thePet.enchantingId) != "null") {
            let enchantingId = thePet.enchantingId.slice(0, 6);
            let enchantingLevel = thePet.enchantingId.slice(6, 8);
            let element1 = xmlReader.getEnchantingInfo(enchantingId, enchantingLevel);
            element1.children().each(function () {
                role.readEffect($(this)[0].tagName, parseFloat($(this).text()));
            });
        }
    }
}

export function updateRoleFromMedal(role) {
    if (role.medals["medal"].equipmentId == null) return;//没有勋章 不计算守护珠
    for (let medalType in role.medals) {
        let theMedal = role.medals[medalType]; //获取该部位的装备
        if (theMedal.equipmentId == null) continue;
        let element = xmlReader.getMedalInfo(theMedal.equipmentId);
        if (medalType === "medal") {
            let id = theMedal.propertyId;
            if (String(id) != "null")
                readEffectFromParentNode(element.find("Property[index='" + id + "']"), role);
            //强化收益
            let theElement = xmlReader.getStrengthenInfo("勋章", theMedal.strengthenNum, element.children("Type").text());
            readEffectFromParentNode(theElement, role);
        } else {
            readEffectFromParentNode(element.children("Property"), role);
        }
    }
}