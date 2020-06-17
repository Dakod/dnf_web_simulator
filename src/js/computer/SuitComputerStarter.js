import {equipmentTypeMap} from "@/js/computer/SimpleRole";
import {getZeroVector} from "@/js/computer/PermutationGenerator";
import SuitComputerWorker from "@/js/computer/worker/suitComputer.worker"
import {AbstractComputerStarter} from "@/js/computer/AbstractComputerStarter";
import {generateMythMap} from "@/js/computer/utils";


export const sanDaSuitTypes = [3, 4, 5];
export const equipmentTypesInType345OfRight = {
    3: [6, 8], 4: [5, 10], 5: [7, 9]
}
export const equipmentTypesInType345OfLeft = {
    3: 1, 4: 2, 5: 4
}
export const equipmentTypesInType345 = {
    3: [1, 6, 8], 4: [2, 5, 10], 5: [4, 7, 9]
}

export const equipmentTypesInType0 = [0, 1, 2, 3, 4];
export const equipmentTypesInType1 = [5, 6, 7];
export const equipmentTypesInType2 = [8, 9, 10];
export const equipmentTypes = [equipmentTypesInType0, equipmentTypesInType1, equipmentTypesInType2];

export class SuitComputerStarter extends AbstractComputerStarter {
    constructor(xmlData) {
        super(xmlData);
        this.vectors = [];
        this.mythTypeIndex = [1, 5, 9]
    }

    startComputerSuitVectors(options) {
        this._generateEquipmentPool(options.equipmentList);
        this._generateEquipmentTypeMap();
        this.mythMap = generateMythMap(this.equipments, this.equipmentPool, this.equipmentPoolIndexMap);
        return this._getAllPermutationVector();
    }

    startComputer(options) {
        super.startComputer(options);
    }

    _preProcess(options) {
        super._preProcess(options);
        this._generateEquipmentTypeMap();
        // this.mythMap = generateMythMap(this.equipments, this.equipmentPool, this.equipmentPoolIndexMap);
        this.vectors = options.vectors;
        this.timer.start();
        // this._getAllPermutationVector();
    }

    _getScoreComputerWorker(options, start, end, index) {
        const worker = new SuitComputerWorker();
        worker.postMessage({
            xmlData: this.xmlData,
            roleBase: this.roleBase,
            heapSize: options.heapSize,
            equipmentList: options.equipmentList,
            vectors: options.vectors.slice(start, end + 1)
        });
        worker.onmessage = (event) => {
            const data = event.data;
            if (data.msg === "heap") {
                this._onWorkerFinished(index, data.heap);
            }
        }
        return worker;
    }

    _onWorkerFinished(index, heap) {
        console.log("线程" + index + "计算完成");
        this.scoreComputerWorkers[index].result = heap;
        for (let workerInfo of this.scoreComputerWorkers) {
            if (!workerInfo.result) return;
        }
        this._onFinished();
    }

    _onFinished() {
        this.timer.end();
        this._printResult();
    }

    //测试用
    _printResult() {
        for (let workerInfo of this.scoreComputerWorkers) {
            for (let result of workerInfo.result.data) {
                let str = "";
                result.vector.forEach((index, i) => {
                    str += i + ":" + this.equipmentPool[i][index].equipmentName + ";"
                });
                console.log(str);
            }
        }
    }


    _getTotalJobNum() {
        return this.vectors.length;
    }

    _generateEquipmentTypeMap() {
        const _this = this;
        let equipmentSuitTypeMap = {
            0: {},
            1: {},
            2: {},
            3: {},
            4: {},
            5: {},
        };
        for (let equipmentsInType of this.equipmentPool) {
            equipmentsInType.forEach((theEquipment, index) => {
                const typeIndex = equipmentTypeMap.get(theEquipment.equipmentType);
                const suitId = theEquipment.suitId;
                const suitType = _this.suitInfo[suitId].suitType;
                const suitInfo = equipmentSuitTypeMap[suitType][suitId];
                if (!suitInfo) {
                    if (theEquipment.isMyth) {
                        equipmentSuitTypeMap[suitType][suitId] = {
                            myth: index,
                            mythType: typeIndex,
                            [typeIndex]: index,
                            length: 1
                        };
                    } else {
                        equipmentSuitTypeMap[suitType][suitId] = {
                            [typeIndex]: index,
                            length: 1,
                        };
                    }
                } else {
                    if (suitInfo[typeIndex] === undefined && !(suitInfo.mythType === typeIndex))
                        suitInfo.length++;
                    if (theEquipment.isMyth) {
                        suitInfo.myth = index;
                        suitInfo.mythType = typeIndex;
                        if (suitInfo[typeIndex] === undefined)
                            suitInfo[typeIndex] = index;
                    } else {
                        suitInfo[typeIndex] = index;
                    }
                }
            });
        }
        // _this.equipmentSuitTypeMapValues = Object.keys()
        for (let i = 0; i <= 5; i++) {
            equipmentSuitTypeMap[i] = Object.values(equipmentSuitTypeMap[i]);
        }
        _this.equipmentSuitTypeMap = equipmentSuitTypeMap;
    }

    _getAllPermutationVector() {
        // console.time();
        let vectors = [];
        //左右不成套的情况 左边为5和3+2  右边有33 222分散 222合
        //----左边
        const vectorsOf5InType0 = this._get5InType0(); //左边5
        const vectorsOf32InType0 = this._get32InType0();//左边3+2
        const vectorsOfLeft = [...vectorsOf5InType0, ...vectorsOf32InType0];
        //----右边
        const vectorsOf33Right = this._get33InType12();//右边3+3
        const vectorsOf222RightNormal = this._get222NormalOfRight();//右边222 一套散搭+2套正常33
        const vectorsOf2RightInType345 = this._get2InType345OfRight();//右边222 都是散搭套
        const vectorsOfRight = [...vectorsOf33Right, ...vectorsOf222RightNormal, ...vectorsOf2RightInType345];
        //----左边组合右边
        const vectorsOfLeftRightIndependent = combineVector(vectorsOfLeft, vectorsOfRight);
        if (vectorsOfLeftRightIndependent.length > 0) {
            vectors = [...vectors, ...vectorsOfLeftRightIndependent];
        }
        //左右成套的情况 以散搭组件数量来区分情况
        const vectorsOf2InMixed = this._get2InMixed();
        const vectorsOf3InMixed = this._get3InMixed();
        const vectorsOf4InMixed = this._get4InMixed();
        const vectorsOf6InMixed = this._get6InMixed();
        const vectorsOf7InMixed = this._get7InMixed();
        const vectorsOf8InMixed = this._get8InMixed();
        const vectorsOf9InMixed = this._get9InMixed();
        vectors = [...vectors, ...vectorsOf2InMixed, ...vectorsOf3InMixed, ...vectorsOf4InMixed,
            ...vectorsOf6InMixed, ...vectorsOf7InMixed, ...vectorsOf8InMixed, ...vectorsOf9InMixed];
        // console.timeEnd();
        console.log("原组合数量:" + vectors.length);
        this.vectors = this._addMythVectors(vectors);
        console.log("加入神话后组合数量:" + this.vectors.length);
        // this.vectors = vectors;
        return this.vectors;
    }

    _equipmentSuitIteration(suitType, func) {
        for (let suit of this.equipmentSuitTypeMap[suitType]) {
            func(suit);
        }
    }

    _addMythVectors(vectors) {
        let filteredVectors = [];
        for (let vector of vectors) {
            let hasMyth = false;
            let hasMoreMyth = false;
            for (let i = 0; i < this.mythTypeIndex.length; i++) {
                const equipmentType = this.mythTypeIndex[i];
                const equipmentIndex = vector[equipmentType];
                const arrayIndex = this.mythTypeIndex.indexOf(equipmentType);
                if (this.mythMap.mythIndex[arrayIndex].indexOf(equipmentIndex) >= 0) {
                    hasMoreMyth = hasMyth;
                    hasMyth = true;
                }
            }
            if (!hasMoreMyth)
                filteredVectors.push(vector);
            if (!hasMyth) {
                for (let i = 0; i < this.mythTypeIndex.length; i++) {
                    const equipmentType = this.mythTypeIndex[i];
                    const index = vector[equipmentType];
                    const arrayIndex = this.mythTypeIndex.indexOf(equipmentType);
                    const mythIndex = this.mythMap.mythProto[arrayIndex][index];
                    if (mythIndex) {
                        const newVector = [...vector];
                        newVector[equipmentType] = mythIndex;
                        filteredVectors.push(newVector);
                    }
                }
            }
        }
        return filteredVectors;
    }

    //从指定的套装类型的指定位置获取组合
    _getCommonSuitVectors(suitType, equipmentTypes) {
        const vectors = [];
        this._equipmentSuitIteration(suitType, suit => {
            if (isSuitHasType(equipmentTypes, suit)) {
                const zeroVectors = getZeroVector();
                setVector(zeroVectors, equipmentTypes, suit);
                vectors.push(zeroVectors);
            }
        });
        return vectors;
    }

    //左边5
    _get5InType0() {
        return this._getCommonSuitVectors(0, equipmentTypesInType0);
    }

    //首饰3
    _get3InType1() {
        return this._getCommonSuitVectors(1, equipmentTypesInType1);

    }

    _get2InType1(types) {
        return this._getCommonSuitVectors(1, types);
    }

    //特殊3
    _get3InType2() {
        return this._getCommonSuitVectors(2, equipmentTypesInType2);
    }

    _get2InType2(types) {
        return this._getCommonSuitVectors(2, types);
    }

    _get2OR3InType0Fixed(types) {
        return this._getCommonSuitVectors(0, types);
    }

    //右边3+3
    _get33InType12() {
        return combineVector(this._get3InType1(), this._get3InType2());
    }

    _get22InType0(types) {
        const vectors = [];
        for (let i = 0; i < 3; i++) {
            const firstIndex = types[0];
            const secondIndex = types[i + 1];
            this._equipmentSuitIteration(0, suit1 => {
                if (isSuitHasType([firstIndex, secondIndex], suit1)) {
                    this._equipmentSuitIteration(0, suit2 => {
                        if (suit2 !== suit1 && isSuitHasType(getDifferenceSet(types, [firstIndex, secondIndex]), suit2)) {
                            const zeroVector = getZeroVector();
                            setVector(zeroVector, [firstIndex, secondIndex], suit1);
                            setVector(zeroVector, getDifferenceSet(types, [firstIndex, secondIndex]), suit2);
                            vectors.push(zeroVector);
                        }
                    });
                }
            });
        }
        return vectors;
    }

    _get32InType0Fixed(types) {
        const vectors = [];
        const other3Index = getDifferenceSet([0, 1, 2, 3, 4], types);
        this._equipmentSuitIteration(0, suit1 => {
            if (isSuitHasType(types, suit1)) {
                this._equipmentSuitIteration(0, suit2 => {
                    if (isSuitHasType(other3Index, suit2) && suit2 !== suit1) {
                        const zeroVector = getZeroVector();
                        setVector(zeroVector, types, suit1);
                        setVector(zeroVector, other3Index, suit2);
                        vectors.push(zeroVector);
                    }
                });
            }
        });
        return vectors;
    }

    //左边3+2
    _get32InType0() {
        let vectors = [];
        for (let firstIndex = 0; firstIndex <= 3; firstIndex++) {
            for (let secondIndex = firstIndex + 1; secondIndex <= 4; secondIndex++) {
                vectors = [...vectors, ...this._get32InType0Fixed([firstIndex, secondIndex])];
            }
        }
        return vectors;
    }

    //获取右边散搭的2件套
    _get2InType345OfRight(suitTypes) {
        let vectors = [];
        if (!suitTypes) suitTypes = [3, 4, 5];
        for (let suitType of suitTypes) {
            const tempVectors = this._getCommonSuitVectors(suitType, equipmentTypesInType345OfRight[suitType]);
            if (vectors.length > 0)
                vectors = combineVector(tempVectors, vectors);
            else
                vectors = tempVectors;
        }
        return vectors;
    }

    //右边222分散的情况  一种散搭+2种套装
    _get222NormalOfRight() {
        let vectors = [];
        for (let suitType = 3; suitType <= 5; suitType++) {
            const sanDaTypes = equipmentTypesInType345OfRight[suitType];
            const sanDaVectors = this._getCommonSuitVectors(suitType, sanDaTypes);
            const _2InType1 = this._getCommonSuitVectors(1, getDifferenceSet([5, 6, 7], sanDaTypes));
            const _2InType2 = this._getCommonSuitVectors(2, getDifferenceSet([8, 9, 10], sanDaTypes));
            vectors = vectors.concat(combineVector(combineVector(sanDaVectors, _2InType1), _2InType2));
        }
        return vectors;
    }

    //-------------------------------------上面为左右不成套装的情况  以下为左右之间有套装的情况
    //只有两件散搭成套时
    _get2InMixed() {
        let vectors = [];
        for (let suitType of sanDaSuitTypes) {
            const leftType = equipmentTypesInType345OfLeft[suitType];
            const left22Vectors = this._get22InType0(getDifferenceSet(equipmentTypesInType0, [leftType]));
            for (let rightType of equipmentTypesInType345OfRight[suitType]) {
                const sanDaVectors = this._getCommonSuitVectors(suitType, [leftType, rightType]);
                const type1Vectors = this._getCommonSuitVectors(1, getDifferenceSet(equipmentTypesInType1, [rightType]));
                const type2Vectors = this._getCommonSuitVectors(2, getDifferenceSet(equipmentTypesInType2, [rightType]));
                vectors = vectors.concat(combineVectors([left22Vectors, sanDaVectors, type1Vectors, type2Vectors]));
            }
        }
        return vectors;
    }

    //三件时 只可能有一个三件散搭套
    _get3InMixed() {
        let vectors = [];
        for (let suitType of sanDaSuitTypes) {
            const sanDaVectors = this._getCommonSuitVectors(suitType, equipmentTypesInType345[suitType]);
            const left22Vectors = this._get22InType0(getDifferenceSet(equipmentTypesInType0, [equipmentTypesInType345OfLeft[suitType]]));
            const right22InType1 = this._get2InType1(getDifferenceSet(equipmentTypesInType1, equipmentTypesInType345OfRight[suitType]));
            const right22InType2 = this._get2InType2(getDifferenceSet(equipmentTypesInType2, equipmentTypesInType345OfRight[suitType]));
            vectors = vectors.concat(combineVectors([left22Vectors, sanDaVectors, right22InType1, right22InType2]));
        }
        return vectors;
    }

    //四件时 两个22散搭，右边分别在首饰和特殊中选一个位置
    _get4InMixed() {
        let vectors = [];
        const permutationOfType345 = [[3, 4], [3, 5], [4, 5]];
        for (let typesIn345 of permutationOfType345) {
            const firstType = typesIn345[0];
            const secondType = typesIn345[1];
            const vectorsOf3InType0 = this._get2OR3InType0Fixed(getDifferenceSet(equipmentTypesInType0, [equipmentTypesInType345OfLeft[firstType], equipmentTypesInType345OfLeft[secondType]]));
            for (let i = 0; i < 2; i++) {  //一次第一个的右边在首饰 一次第一个的右边在特殊
                const firstEquipmentTypes = [equipmentTypesInType345OfLeft[firstType], equipmentTypesInType345OfRight[firstType][i]];
                const secondEquipmentTypes = [equipmentTypesInType345OfLeft[secondType], equipmentTypesInType345OfRight[secondType][1 - i]];
                const vectorsOfFirst = this._getCommonSuitVectors(firstType, firstEquipmentTypes);
                const vectorsOfSecond = this._getCommonSuitVectors(secondType, secondEquipmentTypes);
                const vectorsOfType1 = this._get2InType1(getDifferenceSet(equipmentTypesInType1, [...firstEquipmentTypes, ...secondEquipmentTypes]));
                const vectorsOfType2 = this._get2InType2(getDifferenceSet(equipmentTypesInType2, [...firstEquipmentTypes, ...secondEquipmentTypes]));
                vectors = vectors.concat(combineVectors([vectorsOf3InType0, vectorsOfFirst, vectorsOfSecond, vectorsOfType1, vectorsOfType2]));
            }
        }
        return vectors;
    }

    //5件时 无有效组合

    //6件时 只能2+2+2 分为两种情况
    _get6InMixed() {
        let vectors = [];
        //第一种情况 3个散搭2件套
        const vectorsOf2InType0 = this._getCommonSuitVectors(0, [0, 3]);
        for (let i = 0; i < 2; i++) { //两次 一次三件都是首饰 一次三件都是特殊
            let tempVectors;
            const vectorsOf3 = i === 0 ? this._get3InType2() : this._get3InType1();
            for (let suitType of sanDaSuitTypes) {
                const vectorsOf2 = this._getCommonSuitVectors(suitType, [equipmentTypesInType345OfLeft[suitType], equipmentTypesInType345OfRight[suitType][i]]);
                tempVectors = tempVectors ? combineVector(vectorsOf2, tempVectors) : vectorsOf2;
            }
            tempVectors = combineVectors([vectorsOf3, tempVectors, vectorsOf2InType0]);
            vectors = vectors.concat(tempVectors);
        }
        //第二种情况 2个散搭2件套包含左边 1个散搭二件套在右边
        const permutationOfType345 = [[3, 4, 5], [3, 5, 4], [4, 5, 3]];//2散搭套组合 第三位代表只在右边的套装
        for (let typesIn345 of permutationOfType345) {
            const firstType = typesIn345[0];
            const secondType = typesIn345[1];
            const thirdType = typesIn345[2];
            const vectorsOf3Left = this._getCommonSuitVectors(0, getDifferenceSet(equipmentTypesInType0, [equipmentTypesInType345OfLeft[firstType], equipmentTypesInType345OfLeft[secondType]]));
            const vectorsOf2Right = this._getCommonSuitVectors(thirdType, equipmentTypesInType345OfRight[thirdType]);//先固定右边的2件散搭
            for (let i = 0; i < 2; i++) { //两次 一次都是首饰 一次都是特殊
                const vectorsOfFirst2Mixed = this._getCommonSuitVectors(firstType, [equipmentTypesInType345OfLeft[firstType], equipmentTypesInType345OfRight[firstType][i]]);//先固定右边的2件散搭
                const vectorsOfSecond2Mixed2 = this._getCommonSuitVectors(secondType, [equipmentTypesInType345OfLeft[secondType], equipmentTypesInType345OfRight[secondType][i]]);//先固定右边的2件散搭
                const vectorsOfOther2 = this._getCommonSuitVectors(2 - i,
                    getDifferenceSet(i === 0 ? equipmentTypesInType2 : equipmentTypesInType1, equipmentTypesInType345OfRight[thirdType]));
                vectors = vectors.concat(combineVectors([vectorsOf3Left, vectorsOf2Right, vectorsOfFirst2Mixed, vectorsOfSecond2Mixed2, vectorsOfOther2]));
            }
        }
        return vectors;
    }

    //7件时 3+2+2 两种情况
    _get7InMixed() {
        let vectors = [];
        //第一种情况 左边三个散搭位全有
        for (let suitType of sanDaSuitTypes) {
            const otherTwoTypes = getDifferenceSet(sanDaSuitTypes, [suitType]);
            const vectorsOf3Mixed = this._getCommonSuitVectors(suitType, equipmentTypesInType345[suitType]);//先选一个位置放3
            for (let i = 0; i < 2; i++) { //两次 第一次全是首饰 第二次全是特殊
                const firstLeftType = equipmentTypesInType345OfLeft[otherTwoTypes[0]];
                const firstRightType = equipmentTypesInType345OfRight[otherTwoTypes[0][i]];
                const secondLeftType = equipmentTypesInType345OfLeft[otherTwoTypes[1]];
                const secondRightType = equipmentTypesInType345OfRight[otherTwoTypes[1][i]];
                const vectorsOfFirst2Mixed = this._getCommonSuitVectors(otherTwoTypes[0], [firstLeftType, firstRightType]);
                const vectorsOfSecond2Mixed = this._getCommonSuitVectors(otherTwoTypes[1], [secondLeftType, secondRightType]);
                const vectorsOf2Right = this._getCommonSuitVectors(2 - i, getDifferenceSet(equipmentTypes[2 - i], equipmentTypesInType345OfRight[suitType]));
                vectors = vectors.concat(combineVectors([vectorsOf3Mixed, vectorsOf2Right, vectorsOfFirst2Mixed, vectorsOfSecond2Mixed]));
            }
        }
        //第二种情况 右边全是散搭
        for (let suitType of sanDaSuitTypes) {
            const otherTwoTypes = getDifferenceSet(sanDaSuitTypes, [suitType]);
            const vectorsOf3Mixed = this._getCommonSuitVectors(suitType, equipmentTypesInType345[suitType]);//先选一个位置放3
            const vectorsOf22Left = this._get22InType0(getDifferenceSet(equipmentTypesInType0, [equipmentTypesInType345OfLeft[suitType]]));//固定左边2+2
            const vectorsOfFirst2Mixed = this._getCommonSuitVectors(otherTwoTypes[0], equipmentTypesInType345OfRight[otherTwoTypes[0]]);
            const vectorsOfSecond2Mixed = this._getCommonSuitVectors(otherTwoTypes[1], equipmentTypesInType345OfRight[otherTwoTypes[1]]);
            vectors = vectors.concat(combineVectors([vectorsOf3Mixed, vectorsOf22Left, vectorsOfFirst2Mixed, vectorsOfSecond2Mixed]));
        }
        return vectors;
    }

    //8件时 3+3+2
    _get8InMixed() {
        let vectors = [];
        const permutationOfType345 = [[3, 4, 5], [3, 5, 4], [4, 5, 3]];
        for (let suitType of permutationOfType345) {
            const vectorsOfFirst3 = this._getCommonSuitVectors(suitType[0], equipmentTypesInType345[suitType[0]]);
            const vectorsOfSecond3 = this._getCommonSuitVectors(suitType[1], equipmentTypesInType345[suitType[1]]);
            const vectorsOf2 = this._getCommonSuitVectors(suitType[2], equipmentTypesInType345OfRight[suitType[2]]);
            const vectorsOf3Left = this._get2OR3InType0Fixed(getDifferenceSet(equipmentTypesInType0, [equipmentTypesInType345OfLeft[suitType[0]], equipmentTypesInType345OfLeft[suitType[1]]]));
            vectors = vectors.concat(combineVectors([vectorsOfFirst3, vectorsOfSecond3, vectorsOf2, vectorsOf3Left]));
        }
        return vectors;
    }

    //9件时 3+3+3 终于完了 🐇了
    _get9InMixed() {
        let vectors = [];
        const vectorsOf2 = this._getCommonSuitVectors(0, [0, 3]);
        const vectorsOfFirst3Mixed = this._getCommonSuitVectors(3, equipmentTypesInType345[3]);
        const vectorsOfSecond3Mixed = this._getCommonSuitVectors(4, equipmentTypesInType345[4]);
        const vectorsOfThird3Mixed = this._getCommonSuitVectors(5, equipmentTypesInType345[5]);
        vectors = vectors.concat(combineVectors([vectorsOf2, vectorsOfFirst3Mixed, vectorsOfSecond3Mixed, vectorsOfThird3Mixed]));
        return vectors;
    }


}


export function isSuitHasType(types, suit) {
    if (types.length > suit.length) return false;
    for (let type of types) {
        if (suit[type] === undefined) {
            if (suit.mythType !== type) return false;
        }
    }
    return true;
}

//将数组1中出现在数组2中的元素去除
export function getDifferenceSet(arr1, arr2) {
    return arr1.filter(function (v) {
        return arr2.indexOf(v) === -1;
    });
}


export function setVector(vector, types, suit) {
    for (let i = 0; i < types.length; i++) {
        vector[types[i]] = suit[types[i]];
    }
}


export function combineVector(vectors1, vectors2) {
    const vectors = [];
    for (let vector1 of vectors1) {
        for (let vector2 of vectors2) {
            vectors.push(addVector(vector1, vector2));
        }
    }
    return vectors;
}

export function combineVectors(vectors) {
    return vectors.reduce((result, vector) => combineVector(result, vector));
}

export function addVector(vector1, vector2) {
    return vector1.map((value, index) => {
        return value + (vector2[index] || 0);
    })
}

export function checkVectors(vector, index) {
    for (let i = 0; i < vector.length; i++) {
        if (vector[i] == null || vector[i] === undefined) {
            console.log(index);
        }
    }
}





