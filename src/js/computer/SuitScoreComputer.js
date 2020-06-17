import {AbstractScoreComputer} from "@/js/computer/AbstractScoreComputer";
import {SimpleRole} from "@/js/computer/SimpleRole";


export class SuitScoreComputer extends AbstractScoreComputer {

    constructor(xmlData, roleBase, equipmentList, heapSize, vectors) {
        const role = new SimpleRole(xmlData, roleBase);
        role.generateEquipmentPool(equipmentList);
        super(role, heapSize);
        this.vectors = vectors;
        this.currentIndex = 0;
        this.vectorsSize = vectors.length;
    }

    _init() {

    }

    _getInitialVector() {
        // this.currentIndex++;
        return [...this.vectors[0]];
    }

    _isComputeEnd() {
        return this.currentIndex >= this.vectorsSize;
    }

    _getNextPermutation() {
        if (this.currentIndex >= this.vectorsSize - 1) {
            this.currentIndex++;
            return undefined;
        }
        return this.vectors[++this.currentIndex];
    }

}