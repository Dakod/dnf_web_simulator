export const mythTypeIndex = [1, 5, 9];

export function generateMythMap(equipments, equipmentPool, equipmentPoolIndex) {
    const mythMap = {
        mythIndex: [[], [], []],
        mythProto: [{}, {}, {}]
    };//上衣 手镯 耳环
    for (let equipmentId in equipments) {
        const theEquipment = equipments[equipmentId];
        if (!equipmentPoolIndex[equipmentId]) continue; //不在装备池
        const poolIndex = equipmentPoolIndex[equipmentId][1];
        if (theEquipment.isMyth) {
            const typeIndexInArray = mythTypeIndex.indexOf(theEquipment.typeIndex);
            const protoPool = equipmentPoolIndex[theEquipment.mythOf];
            mythMap.mythIndex[typeIndexInArray].push(poolIndex);
            if (protoPool) {  //如果原型在池子中
                mythMap.mythProto[typeIndexInArray][protoPool[1]] = poolIndex;
            }
        }
    }
    return mythMap;
}

export function addVectors(vector1, vector2) {
    if (!vector1) return [...vector2];
    if (!vector2) return [...vector1];
    return vector1.map((value, index) => {
        return value + (vector2[index] || 0);
    })
}

export function subtractVectors(vector1, vector2) {
    if (!vector1) return [...vector2];
    if (!vector2) return [...vector1];
    return vector1.map((value, index) => {
        return value - (vector2[index] || 0);
    })
}
