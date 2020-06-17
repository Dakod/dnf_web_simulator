import SingleComputerWorker from "@/js/computer/worker/singleComputer.worker"
import {AbstractComputerStarter} from "@/js/computer/AbstractComputerStarter";


export class SingleComputerStarter extends AbstractComputerStarter {
    constructor(xmlData) {
        super(xmlData);
    }

    startComputer(options) {
        super.startComputer(options);
    }


    _getTotalJobNum() {
        return this._getTotalPermutationNum();
    }


    updateTotalPermutationNum(equipmentList) {
        this._generateEquipmentPool(equipmentList);
    }


    _preProcess(options) {
        //初始化角色
        this._readRoleBase(options.occupationId);
        this._generateEquipmentPool(options.equipmentList);
        console.log("组合数量" + this._getTotalPermutationNum());
        this.timer.start();
    }

    _getScoreComputerWorker(options, start, end, index) {
        const worker = new SingleComputerWorker();
        worker.postMessage({
            xmlData: this.xmlData,
            roleBase: this.roleBase,
            heapSize: options.heapSize,
            start: start,
            end: end,
            equipmentList: options.equipmentList
        });
        worker.onmessage = (event) => {
            const data = event.data;
            if (data.msg === "heap") {
                this._onWorkerFinished(index, data.heap);
            }
        }
        return worker;
    }

    _getTotalPermutationNum() {
        let total = 1;
        this.equipmentPool.forEach(equipmentPoolItem => total *= equipmentPoolItem.length);
        return total;
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
    }
}