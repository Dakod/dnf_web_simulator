import skillForComputer from "@/js/computer/resource/SkillForComputer";
import {Equipment} from "@/js/simulator/equipment";


export const strengthTypeList = ["FireStrengthen", "IceStrengthen",
    "LightStrengthen", "DarkStrengthen"];

export const upTypeMap = new Map([
    "Yellow", "ExtraYellow",
    "CritDamage", "ExtraCrit",
    "White", "PropertyWhite",
    "TriAttaPercent", //6
    "StrengthIntelligencePercent", "Dot",
    "AllDamage", "FighterAndPet",
    "SkillAtta"].map((value, index) => [value, index]));

export const roleUpTypeMap = [
    "PhyAtta", "MagAtta",
    "IndAtta", "Strength",
    "Intelligence", "PhyCrit",
    "MagCrit", //6
    "DarkStrengthen", "LightStrengthen",
    "FireStrengthen", "IceStrengthen",
    "AllStrengthen"];
export const equipmentTypeMap = new Map([
    "shoulder", "coat",
    "pants", "belt",
    "shoes", "bracelet",
    "necklace",
    "ring", "assistant",
    "earrings", "magicstone"].map((value, index) => [value, index]));

export class SimpleRole {
    constructor(xmlData, roleBase) {
        this.occupationId = roleBase.occupationId;
        this.roleBase = roleBase;
        this.xmlData = xmlData;
        this.equipments = xmlData.equipments;
        this.suitInfo = xmlData.suitInfo;
        this.init();
    }

    init() {
        this.roleInfo = {
            "PhyAtta": 0.0,  //物攻
            "MagAtta": 0.0, //魔攻
            "IndAtta": 0.0, //独立
            "Strength": 0.0, //力量
            "Intelligence": 0.0, //智力
            "PhyCrit": 0.0,  //物理暴击
            "MagCrit": 0.0,  //魔法暴击
            "DarkStrengthen": 0.0, //暗强
            "LightStrengthen": 0.0, //光强
            "FireStrengthen": 0.0, //火强
            "IceStrengthen": 0.0, //冰强
            "AllStrengthen": 0.0, //全属强
        };
        this.equipments = {
            "weapon": new Equipment()
        };
        this.skills = JSON.parse(JSON.stringify(skillForComputer[this.occupationId]));
        this.upList = new Array(upTypeMap.size).fill(0);
        this.skillAtta = 1;
        this._loadEquipment();
        this.initRole();
    }

    initRole() {
        for (let property in this.roleInfo) {
            this.roleInfo[property] = this.roleBase.roleInfo[property];
        }
        this.roleInfo.AllStrengthen = 0.0;
    }

    readUpList(upList, isInverse) {
        if (isInverse)
            this.upList = subtractVectors(this.upList, upList)
        else
            this.upList = addVectors(this.upList, upList);
    }

    readRoleUpList(roleUpList, isInverse) {
        for (let property in roleUpList) {
            this.roleInfo[property] += roleUpList[property] * isInverse ? -1 : 1;
        }
    }

    _setSkillToEffect(effectObject) {
        const _this = this;
        const skillLevelUp = [];
        const start = effectObject.skillLevelUp.start;
        const end = effectObject.skillLevelUp.end;
        const condition = effectObject.skillLevelUp.condition;
        for (let level in _this.skills) {
            if (level >= (start - 0) && level <= (end - 0)) {
                const theSkills = _this.skills[level];
                theSkills.forEach(skill => {
                    if (condition === "全部" || condition === skill.type) {
                        skillLevelUp.push({
                            value: effectObject.skillLevelUp.value,
                            target: skill
                        });
                    }
                });
            }
            effectObject.skillLevelUp = skillLevelUp;
        }
    }

    //将装备信息中的等级加成对应到角色中
    _loadEquipment() {
        for (let equipmentId in this.equipments) {
            const theEquipment = this.equipments[equipmentId];
            if (theEquipment.skillLevelUp) {
                this._setSkillToEffect(theEquipment);
            }
        }
        for (let suitId in this.suitInfo) {
            const theSuit = this.suitInfo[suitId];
            for (let num in theSuit.effect) {
                const theEffect = theSuit.effect[num];
                if (theEffect.skillLevelUp) {
                    this._setSkillToEffect(theEffect);
                }
            }
        }
    }

    generateEquipmentPool(equipmentList) {
        let equipmentPool = Array(equipmentTypeMap.size).fill(1).map(() => []);
        for (let equipmentId of Object.keys(equipmentList).sort()) {
            let index = equipmentTypeMap.get(this.equipments[equipmentId].equipmentType);
            if (!equipmentPool[index])
                equipmentPool[index] = [this.equipments[equipmentId]];
            else
                equipmentPool[index].push(this.equipments[equipmentId]);
        }
        this.equipmentPool = equipmentPool;
    }
}

function

addVectors(vector1, vector2) {
    return vector1.map((value, index) => {
        return value + (vector2[index] || 0);
    })
}

function

subtractVectors(vector1, vector2) {
    return vector1.map((value, index) => {
        return value - (vector2[index] || 0);
    })
}