import $ from "jquery"
import * as xmlReader from "@/js/xmlReader"
import {readEffectFromParentNode} from "@/js/simulator/role"
import {Serializable} from "@/js/simulator/Serializable";
import {AbstractEquipment} from "@/js/simulator/AbstractEquipment";

const dressList = ["hair_d", "cap_d", "face_d", "neck_d", "coat_d", "skin_d", "belt_d", "pants_d", "shoes_d", "weapon_d", "aura_d"];


export class Dresss extends Serializable {
    constructor() {
        super();
        for (let dressName of dressList) {
            this[dressName] = new Dress();
        }
    }
}

export class Dress extends AbstractEquipment {
    constructor() {
        super();
        this.equipmentId = null;   //装扮Id
        this.propertyId = null; //属性Id
        this.badge = {
            badge1: "null",  //白金也在这个框
            badge2: "null"
        };
    }


}

Dress.prototype.itemType = "dresss";

Serializable.defineNotEnumerableProperty(Dress.prototype, "serializeField",
    ["equipmentId", "propertyId", "badge"]);
Serializable.defineNotEnumerableProperty(Dresss.prototype, "serializeClass", {"all": Dress});

export function updateRoleFromDress(role) {
    let counterMap = {};//储存装备的套装信息表
    for (let dress in role.dresss) {
        let theDress = role.dresss[dress]; //获取该部位的装备

        if (theDress.equipmentId == null) continue;
        //获取装扮属性
        let element = xmlReader.getDressInfo(theDress.equipmentId);
        element.children().each(function () {
            switch ($(this)[0].tagName) {
                case "Fix": //读取固定的属性
                    $(this).children().each(function () {
                        if ($(this)[0].tagName === "SkillLevel")
                            role.upRoleSkill($(this));
                        else
                            role.readEffect($(this)[0].tagName, parseFloat($(this).text()));
                    });
                    break;
                case "Property": {
                    let curId = $(this).attr("index"); //获取属性ID
                    if (curId != null) {  //如果没有ID 则不是属性
                        if (role.dresss[dress].propertyId === curId)  //如果属性和装扮选择的属性一致，则效果生效
                            readEffectFromParentNode($(this), role);
                    }
                }
                    break;
                default:
                    break;
            }
        });
        //获取徽章效果
        if (String(theDress.badge.badge1) != "null") {  //第一个徽章
            readEffectFromParentNode(xmlReader.getBadgeInfo(theDress.badge.badge1),role);
        }
        if (String(theDress.badge.badge2) != "null") {  //第二个徽章
            readEffectFromParentNode(xmlReader.getBadgeInfo(theDress.badge.badge2),role);
        }
        //计算套装数量信息
        let suitId;
        if ((suitId = element.attr("suit")) != null) { //如果有套装效果
            if (counterMap[suitId] == null)
                counterMap[suitId] = 1;
            else
                counterMap[suitId] += 1;
        }
    }
    //获取套装效果
    for (let suit in counterMap) {
        xmlReader.getDressSuitInfo(suit).children("property").each(function () {
            if (counterMap[suit] >= parseInt($(this).attr("num"))) {  //如果件数大于套装需求数，则套装有效
                readEffectFromParentNode($(this), role);
            }
        });
    }
}