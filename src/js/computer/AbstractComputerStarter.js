import {Timer} from "@/js/computer/Timer";
import * as xmlReader from "@/js/xmlReader";
import $ from "jquery";
import {equipmentTypeMap} from "@/js/computer/SimpleRole";

export class AbstractComputerStarter {
    constructor(xmlData) {
        this.xmlData = xmlData;
        this.suitInfo = xmlData.suitInfo;
        this.equipments = xmlData.equipments;
        this.timer = new Timer("全部计算");
    }

    startComputer(options) {
        this._preProcess(options);
        const jobSection = this._getDividedJobSection(options.computerNum);
        if (!jobSection) return;
        this.scoreComputerWorkers = Array(options.computerNum);
        for (let i = 0; i < options.computerNum; i++) {
            this.scoreComputerWorkers[i] = {
                worker: this._getScoreComputerWorker(options, jobSection[i][0], jobSection[i][1], i)
            };
        }
    }

    _getScoreComputerWorker() {

    }

    _preProcess(options) {
        this._readRoleBase(options.occupationId);
        this._generateEquipmentPool(options.equipmentList);
    }

    _readRoleBase(occupationId) {
        //读取职业基础
        const _this = this;
        let node = xmlReader.getRoleBase(occupationId);
        this.roleBase = {
            roleInfo: {},
            mainProperty: node.children("mainProperty").text(),
            pi: node.children("pi").text(),
            occupationId: occupationId
        }
        node.children("Property").children().each(function () {
            let tagName = $(this)[0].tagName;
            _this.roleBase.roleInfo[tagName] = parseFloat($(this).text());
        });
    }

    _generateEquipmentPool(equipmentList) {
        this.equipmentPoolIndexMap = {};
        let equipmentPool = Array(equipmentTypeMap.size).fill(1).map(() => []);
        for (let equipmentId of Object.keys(equipmentList)) {
            let index = equipmentTypeMap.get(this.equipments[equipmentId].equipmentType);
            if (!equipmentPool[index])
                equipmentPool[index] = [this.equipments[equipmentId]];
            else
                equipmentPool[index].push(this.equipments[equipmentId]);
            this.equipmentPoolIndexMap[equipmentId] = [index, equipmentPool[index].length - 1];
        }
        this.equipmentPool = equipmentPool;
    }

    _getTotalJobNum() {

    }

    _getDividedJobSection(computerNum) {
        if (!computerNum) computerNum = 1;
        const total = this._getTotalJobNum();
        if (total === 0) return undefined;
        const step = Math.ceil(total / computerNum);
        const result = Array(computerNum);
        for (let i = 0; i < computerNum; i++) {
            const base = step * i;
            result[i] = [base, (base + step - 1) > (total - 1) ? total - 1 : (base + step - 1)];
        }
        return result;
    }

}