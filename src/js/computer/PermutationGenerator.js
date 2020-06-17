let math = require('mathjs');

const vectorSize = 11;

export class PermutationGenerator {
    constructor(base, start, end) {
        this.base = base;
        this.weight = this._getWeight();
        this.vectorSize = base.length;
        this.startVector = this._int2Vector(start);
        this.currentVector = [...this.startVector];
        this.endVector = this._int2Vector(end);
        this.isEnd = false;
    }

    getNextPermutation() {
        if (this._increase())
            return this.currentVector;
        else {
            this.isEnd = true;
            return undefined;
        }
    }

    _getZeroVector() {
        return new Array(this.base.length).fill(0);
    }

    _getWeight() {
        const arr = new Array(this.base.length);
        arr[0] = 1;
        for (let i = 1; i < arr.length; i++) {
            arr[i] = arr[i - 1] * this.base[i - 1];
        }
        return arr;
    }

    _int2Vector(num) {
        let i = 0;
        const vector = this._getZeroVector();
        do {
            vector[i] = parseInt((i >= this.vectorSize - 1 ? num : num % this.weight[i + 1]) / this.weight[i]);
            i++;
        } while (i < this.vectorSize && num > this.weight[i]);
        return vector;
    }

    _vector2Int(vector) {
        return math.dot(this.weight, vector);
    }

    _increase() {
        let i = 0;
        let carry = 0;
        this.currentVector[0]++;
        do {
            this.currentVector[i] += carry;
            if (this.currentVector[i] === this.base[i]) {
                carry = 1;
                this.currentVector[i] = 0;
            } else
                carry = 0;
        } while (carry > 0 && i++ < this.vectorSize - 1);
        return carry <= 0;
    }

}

export function getZeroVector() {
    return Array(vectorSize).fill(0);
}

// let a = new PermutationGenerator([15, 15, 15, 15, 15, 8, 8, 8, 8, 8, 8], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], []);
// console.log(a);
// let v = a._int2Vector(11);
// console.log(v);
// console.log(a._vector2Int(v));
//
// console.time();
// // 199065600000
// for (let i = 0; i < 766600000; i++) {
//     a.getNextPermutation();
//     // console.log(a.currentVector);
// }
// console.timeEnd();
// console.log(a.currentVector);

