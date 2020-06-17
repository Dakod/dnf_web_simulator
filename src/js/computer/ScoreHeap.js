export class ScoreHeap {
    constructor(size) {
        this.size = size;
        this.data = Array();
        this.length = 0;
    }

    // canBeAdd(score) {
    //     if (this.length < this.size) return true;
    //     return this.data[0].score < score || this.length < this.size;
    // }
    //
    // addWithoutCheck(scoreObject) {
    //     if (this.length < this.size) {
    //         this._addDirect(scoreObject);
    //         return;
    //     }
    //     this.data[0] = scoreObject;
    //     this._minHeapify(0);
    // }

    add(scoreObject) {
        if (this.length < this.size) {
            this.data.push(scoreObject);
            this.length++;
            this._initHeap();
            return;
        }
        if (scoreObject.score > this.data[0].score) {
            this.data[0] = scoreObject;
            this._minHeapify(0);
        }
    }

    // _addDirect(scoreObject) {
    //     this.data.push(scoreObject);
    //     this.length++;
    //     if (this.length === this.size)
    //         this._initHeap();
    // }

    _initHeap() {
        for (let i = this.length / 2 - 1; i >= 0; i--) {
            this._minHeapify(parseInt(i));
        }
    }

    _minHeapify(index) {
        const l = 2 * index + 1;
        const r = 2 * index + 2;
        let least = index;
        if (l < this.length && (this.data[l].score < this.data[index].score)) {
            least = l;
        }
        if (r < this.length && (this.data[r].score < this.data[least].score))
            least = r;
        if (least !== index) {
            this._swap(index, least);
            this._minHeapify(least);
        }
    }

    _swap(a, b) {
        const t = this.data[a];
        this.data[a] = this.data[b];
        this.data[b] = t;
    }
}

// let heap = new ScoreHeap(5);
// heap.add({score: 5});
// heap.add({score: 8});
// heap.add({score: 99});
// heap.add({score: 1});
// heap.add({score: 86});
// heap.add({score: 135});
// heap.add({score: 514});
// heap.add({score: 516134});
//
// console.log(heap);