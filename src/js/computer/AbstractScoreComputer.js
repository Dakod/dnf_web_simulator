import {ScoreHeap} from "@/js/computer/ScoreHeap";
import {strengthTypeList} from "@/js/computer/SimpleRole";


export class AbstractScoreComputer {
    constructor(role, heapSize) {
        this.role = role;
        this.preRoleSuitInfo = {};
        this.roleSuitInfo = {};
        this.suitInfo = this.role.xmlData.suitInfo;
        this.equipmentPool = role.equipmentPool;
        this.scoreHeap = new ScoreHeap(heapSize);
    }


    _getInitialVector() {

    }

    _isComputeEnd() {

    }

    startCompute() {
        // console.time();
        this._initComputer();
        this._computeInitialVector();
        do {
            const score = this._getCurrentScore();
            this.scoreHeap.add(this._getScoreObject(score));
            this._increaseVector();
        } while (!this._isComputeEnd())
        // console.timeEnd();
    }

    _getEquipmentPoolBase() {
        return this.equipmentPool.map(equipments => equipments && equipments.length);
    }

    _initComputer() {
        this.currentVector = this._getInitialVector();
    }

    _computeInitialVector() {
        for (let i = 0; i < this.currentVector.length; i++) {
            this._readEquipmentEffect(this.equipmentPool[i][this.currentVector[i]]);
        }
        this._readSuitEffect();
    }

    _getNextPermutation() {

    }

    _increaseVector() {
        const nextPermutation = this._getNextPermutation();
        if (!nextPermutation) return false;
        const theta = subtractVectors(nextPermutation, this.currentVector);
        for (let i = 0; i < theta.length; i++) {
            if (theta[i] !== 0) {
                const equipmentPoolItem = this.equipmentPool[i]
                this._readEquipmentEffect(equipmentPoolItem[this.currentVector[i]], true);
                this._readEquipmentEffect(equipmentPoolItem[nextPermutation[i]]);
            }
        }
        this._readSuitEffect();
        this.currentVector = [...nextPermutation];
        return true;
    }

    _getCurrentScore() {
        let score = 1;
        const upList = this.role.upList;
        const roleInfo = this.role.roleInfo;
        let maxStrengthen = this._getMaxStrengthenInfo();

        const strength = (roleInfo.Strength) * (1 + upList[7] / 100); //StrengthIntelligencePercent
        const intelligence = (roleInfo.Intelligence) * (1 + upList[7] / 100);

        const phyAtta = (this._getRealAtta(roleInfo.PhyAtta, strength, upList)); //物攻
        const magAtta = (this._getRealAtta(roleInfo.MagAtta, intelligence, upList)); //魔攻
        const indAtta = (roleInfo.IndAtta * (1 + upList[6] / 100)); //TriAttaPercent

        score *= 1 + upList[0] / 100 + upList[1] / 100; //黄字 额外黄字
        score *= 1 + upList[2] / 100 + upList[3] / 100; //爆伤 额外爆伤
        score *= (1 + upList[9] / 100);//计算所有攻击力
        score *= (1 + upList[4] / 100 + upList[5] / 100 *
            (1 + (maxStrengthen.max) * 0.0045 + 0.05));   //白字和属性白字
        score *= (1 + upList[8] / 100);//计算dot
        score *= (1 + this.role.skillAtta / 100);//计算技攻
        score *= (1 + maxStrengthen.max * 0.0045 + 0.05); //计算属强

        // score *= (1 + upList.FighterAndPet / 100);//计算宠物和斗神
        // score *= (1 + upList.StrengthIntelligencePercent / 100);

        if (this.role.pi === '固伤') {//如果是百分比 宠物斗神的效果体现在攻击力面板上了
            score *= (1 + upList[10] / 100);//计算宠物和斗神
            if (this.role.mainProperty === "Strength") {
                score *= 1 + roleInfo.Strength / 250;
                return score * indAtta;
            } else {
                score *= 1 + roleInfo.Intelligence / 250;
                return score * indAtta;
            }
        } else {  //百分比
            if (this.role.mainProperty === "Strength")
                return score * phyAtta;
            else
                return score * magAtta;
        }
    }

    _getScoreObject(score) {
        return {
            score: score,
            vector: [...this.currentVector]
        }
    }

    _readEquipmentEffect(equipment, isInverse) {
        const inverseBase = isInverse ? -1 : 1;
        //读取词条
        this.role.readUpList(equipment.upList, isInverse);
        this.role.readRoleUpList(equipment.roleUpList, isInverse);
        //读取技能等级
        if (equipment.skillLevelUp) {
            equipment.skillLevelUp.forEach(levelUp => {
                const target = levelUp.target;
                const oldUpValue = target.level * target.grow + target.value;
                const currentLevel = levelUp.target.level + levelUp.value * inverseBase;
                const newUpValue = currentLevel * target.grow + target.value;
                levelUp.target.level = currentLevel;
                const maxLevel = levelUp.target.maxLevel;
                if (currentLevel <= maxLevel) {
                    if (levelUp.target.type === "SkillAtta") {
                        this.role.skillAtta /= oldUpValue;
                        this.role.skillAtta *= newUpValue;
                    } else {
                        this.role.roleInfo[levelUp.target.type] -= oldUpValue;
                        this.role.roleInfo[levelUp.target.type] += newUpValue;
                    }
                }
            });
        }
        //设置套装
        if (equipment.suitId) {
            const suitId = equipment.suitId;
            if (this.roleSuitInfo[suitId]) {
                this.roleSuitInfo[suitId] += inverseBase;
                if (this.roleSuitInfo[suitId] === 0)
                    delete this.roleSuitInfo[suitId];
            } else {
                !isInverse && (this.roleSuitInfo[suitId] = 1);
            }
        }
    }

    _readSuitEffect() {
        //移除旧效果
        for (let suitId in this.preRoleSuitInfo) {
            const effect = this.suitInfo[suitId].effect;
            const suitNum = this.preRoleSuitInfo[suitId];
            for (let num in effect) {
                if ((suitNum - 0) >= (num - 0)) {
                    this._readEquipmentEffect(effect[num], true);
                }
            }
        }
        //加载新效果
        for (let suitId in this.roleSuitInfo) {
            const effect = this.suitInfo[suitId].effect;
            const suitNum = this.roleSuitInfo[suitId];
            for (let num in effect) {
                if ((suitNum - 0) >= (num - 0)) {
                    this._readEquipmentEffect(effect[num]);
                }
            }
        }
        this.preRoleSuitInfo = {...this.roleSuitInfo};
    }

    _getMaxStrengthenInfo() {
        let result = "";
        let max = Number.MIN_SAFE_INTEGER;
        for (let i = 0; i < 4; i++) {
            const value = this.role.roleInfo[strengthTypeList[i]]
            if (value > max) {  //如果都一样的话默认为火属性
                max = value;
                result = strengthTypeList[i];
            }
        }
        return {result, max: max + this.role.roleInfo.AllStrengthen};
    }

    _getRealAtta(attaNum, value, upList) {
        return (attaNum * (1 + (value) / 250.0) * (1 + upList[6] / 100)
            * (1 + upList[10] / 100));
    }
}


function subtractVectors(vector1, vector2) {
    return vector1.map((value, index) => {
        return value - (vector2[index] || 0);
    })
}