import {AbstractScoreComputer} from "@/js/computer/AbstractScoreComputer";
import {PermutationGenerator} from "@/js/computer/PermutationGenerator";
import {SimpleRole} from "@/js/computer/SimpleRole";

export class SingleScoreComputer extends AbstractScoreComputer {
    constructor(xmlData, roleBase, equipmentList, heapSize, start, end) {
        const role = new SimpleRole(xmlData, roleBase);
        role.generateEquipmentPool(equipmentList);
        super(role, heapSize);
        this.start = start;
        this.end = end;
        this._init();
    }

    startCompute() {
        super.startCompute();
        console.log(this.start + "-" + this.end + "计算完成!");
    }

    _init() {
        this.perGenerator = new PermutationGenerator(this._getEquipmentPoolBase(), this.start, this.end);
    }

    _getInitialVector() {
        return [...this.perGenerator.currentVector];
    }

    _isComputeEnd() {
        return this.perGenerator.isEnd;
    }

    _getNextPermutation() {
        return this.perGenerator.getNextPermutation();
    }

}