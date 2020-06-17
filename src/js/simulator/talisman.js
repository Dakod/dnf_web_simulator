import $ from "jquery"
import * as xmlReader from "@/js/xmlReader"
import {readEffectFromParentNode} from "@/js/simulator/role";
import {Serializable} from "@/js/simulator/Serializable";
import {AbstractEquipment} from "@/js/simulator/AbstractEquipment";

//antiquitylibrary黄 circlemage绿 guardians蓝 secondpact红 terracotta紫

const valueMap = {
    antiquitylibrary: {
        normal: [3],
        senior: [4],
        rare: [5]
    },
    circlemage: {
        normal: [-1, -3],
        senior: [-2, -4],
        rare: [-3, -6]
    },
    guardians: {
        normal: [-2],
        senior: [-3],
        rare: [-4]
    },
    secondpact: {
        normal: [2, 1],
        senior: [3, 2],
        rare: [5, 3]
    },
    terracotta: {
        normal: [1],
        senior: [2],
        rare: [3]
    }
};

class Rune extends Serializable {
    constructor(type) {
        super();
        this.type = type;
        this.grade = "null";
        this.skill = null;
    }

    hasSkill() {
        return String(this.skill) !== 'null';
    }
}

Serializable.defineNotEnumerableProperty(Rune.prototype, "serializeField",
    ["type", "grade", "skill"]);


export class Talismans extends Serializable {
    constructor() {
        super();
        this.talisman1 = new Talisman();
        this.talisman2 = new Talisman();
    }
}

export class Talisman extends AbstractEquipment {
    constructor() {
        super();
        this.equipmentId = null;
        this.rune1 = new Rune('guardians');
        this.rune2 = new Rune('secondpact');
        this.rune3 = new Rune('terracotta');
    }

    init() {
        super.init();
    }

    isFull() {
        return this.rune1.hasSkill() && this.rune2.hasSkill() && this.rune3.hasSkill();
    }

    hasEquipment() {
        return String(this.equipmentId) !== "null";
    }

}

Talisman.prototype.itemType = "talismans";

Serializable.defineNotEnumerableProperty(Talisman.prototype, "serializeField",
    ["equipmentId", "rune1", "rune2", "rune3"]);
Serializable.defineNotEnumerableProperty(Talisman.prototype, "serializeClass",
    {rune1: Rune, rune2: Rune, rune3: Rune});
Serializable.defineNotEnumerableProperty(Talismans.prototype, "serializeClass", {"all": Talisman});

export function talisman() {
    // this.occupationId = occupationId;
    this.equipmentId = null;
    this.xmlNode = null;

    this.rune1 = new Rune('guardians');
    this.rune2 = new Rune('secondpact');
    this.rune3 = new Rune('terracotta');
    this.isFull = function () {
        return this.rune1.hasSkill() && this.rune2.hasSkill() && this.rune3.hasSkill();
    };
    this.hasEquipment = function () {
        return String(this.equipmentId) !== "null";
    };


    this.setXMLNode = function (node) {
        this.xmlNode = node;  //更新node
        this.updateEquipmentId(); //根据node获取id
        // this.updateEditInfo();
    };

    this.updateEquipmentId = function () {
        if (this.xmlNode != null) {
            this.equipmentId = $(this.xmlNode).attr("id");
        } else {
            this.equipmentId = null;
        }
    };

    //根据ID获取对应的xmlNode  仅在反序列化后需要调用
    this.updateNodeById = function () {
        this.xmlNode = xmlReader.getTalismanInfo(this.equipmentId);
        // this.updateEditInfo();
    };
}


export function updateRoleFromTalisman(role) {
    for (let talisman in role.talismans) {
        let theTalisman = role.talismans[talisman];
        if (String(theTalisman.equipmentId) === 'null')
            continue;
        let node = xmlReader.getItemInfo(theTalisman.equipmentId, 'talismans');
        let nodes = node.children('Property');
        nodes.each(function () {
            if (($(this).attr('full') === 'true')) {
                if (theTalisman.isFull()) {
                    readSkillUp($(this), role);
                }
                readEffectFromParentNode(this, role);
            } else {
                if (!theTalisman.isFull()) {
                    readSkillUp($(this), role);

                }
            }
        });
        for (let n = 1; n <= 3; n++) {
            let rune = theTalisman["rune" + n];
            if (String(rune.skill) === 'null')
                continue;
            switch (rune.type) {
                case "antiquitylibrary":
                    //鸡肋
                    break;
                case "circlemage":
                    role.skills[rune.skill].skillBuff.push({
                        value: valueMap.circlemage[rune.grade][0],
                        type: "all"
                    });
                    role.skills[rune.skill].skillBuff.push({
                        value: valueMap.circlemage[rune.grade][1],
                        type: "cd"
                    });
                    //冷却减少
                    break;
                case "guardians":
                    role.skills[rune.skill].skillBuff.push({
                        value: valueMap.guardians[rune.grade][0],
                        type: "cd"
                    });
                    //冷却减少
                    break;
                case "secondpact":
                    role.skills[rune.skill].skillBuff.push({
                        value: valueMap.secondpact[rune.grade][0],
                        type: "all"
                    });
                    role.skills[rune.skill].skillBuff.push({
                        value: valueMap.secondpact[rune.grade][1],
                        type: "cd"
                    });
                    //冷却增加
                    break;
                case "terracotta":
                    role.skills[rune.skill].skillBuff.push({
                        value: valueMap.terracotta[rune.grade][0],
                        type: "all"
                    });
                    break;
                default:
                    break;
            }
        }
    }
}

function readSkillUp(node, role) {
    node.children().each(function () {
        let tagName = $(this)[0].tagName;
        if (tagName === 'SkillUp' || tagName === 'Cd') {
            let index = $(this).attr("index");  //对某个技能特定的一个攻击段的加成 没有代表全都加成
            if (index !== undefined) {
                role.skills[$(this).children("Id").text()].skillBuff.push({
                    value: parseFloat($(this).children("Value").text()),
                    type: "index",
                    index: index
                });
            } else {
                let value = parseFloat($(this).children("Value").text());
                $(this).children("Id").each(function () {
                    role.skills[$(this).text()].skillBuff.push({
                        value: value,
                        type: tagName === "SkillUp" ? "all" : "cd"
                    })
                });
            }
        }
    });
}
