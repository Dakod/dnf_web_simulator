import {SingleComputerStarter} from "@/js/computer/SingleComputerStarter";
import {SuitComputerStarter} from "@/js/computer/SuitComputerStarter";
import * as xmlReader from "@/js/xmlReader";
import suitVectorWorker from "@/js/computer/worker/suitVectorsComputer.worker"
import $ from "jquery";
import {equipmentTypeMap, roleUpTypeMap, upTypeMap} from "@/js/computer/SimpleRole";


export class Computer {
    constructor() {
        this.equipmentNodes = this._getEquipmentNodes();
        this._readXml();
        this.singleComputer = new SingleComputerStarter(this.xmlData);
        this.suitComputer = new SuitComputerStarter(this.xmlData);
    }

    changeOccupation(occupationId) {
        this.occupationId = occupationId;
        // this._readRoleBase();
        // this.xmlData.occupationId = occupationId;
    }

    getSuitVectorsPromise(options) {
        // this.suitComputer.startComputer(options);
        const _this = this;
        const worker = new suitVectorWorker();
        worker.postMessage({
            ...options,
            xmlData: this.xmlData
        });
        return new Promise(resolve => {
            worker.onmessage = (event) => {
                const data = event.data;
                if (data.msg === "vectors") {
                    _this.suitVectors = data.vectors;
                    console.log("组合计算完成!");
                    resolve();
                }
            }
        });
    }

    startSingleCompute(options) {
        this.singleComputer.startComputer(options);
    }

    startSuitCompute(options) {

        this.suitComputer.startComputer({
            ...options,
            vectors: this.suitComputer.startComputerSuitVectors(options)
        });
    }

    _getEquipmentNodes() {
        return xmlReader.getAllTypeEquipmentInfo("equipments");
    }

    _readXml() {
        this._readSuitInfo();
        // this._readRoleBase();
        this._readEquipments();
        this.xmlData = {
            // roleBase: this.roleBase,
            suitInfo: this.suitInfo,
            equipments: this.equipments,
            // occupationId: this.occupationId
        };
    }

    _readSuitInfo() {
        //读取套装信息
        const _this = this;
        let suitInfo = {};
        xmlReader.getAllSuitInfo(true).each(function () {
            const info = {
                suitType: $(this).attr("type"),
                effect: {}
            };
            $(this).children("Property").each(function () {
                const num = $(this).attr("num") - 0;
                const propertyInfo = {};
                _this._getEquipmentUpList($(this), propertyInfo);
                if (propertyInfo.skillLevelUp.length === 0)
                    delete propertyInfo.skillLevelUp;
                info.effect[num] = propertyInfo;
            })
            suitInfo[$(this).attr("id")] = info;
        });
        this.suitInfo = suitInfo;
    }

    // _readRoleBase() {
    //     //读取职业基础
    //     const _this = this;
    //     let node = xmlReader.getRoleBase(this.occupationId);
    //     this.roleBase = {
    //         roleInfo: {},
    //         mainProperty: node.children("mainProperty").text(),
    //         pi: node.children("pi").text()
    //     }
    //     node.children("Property").children().each(function () {
    //         let tagName = $(this)[0].tagName;
    //         _this.roleBase[tagName] = parseFloat($(this).text());
    //     });
    // }

    _readEquipments() {
        let map = {};
        const _this = this;
        this.equipmentNodes.each(function () {
            let equipmentInfo = {
                id: $(this).attr("id"),
                equipmentName: $(this).children("Name").text(),
                equipmentType: $(this).parent()[0].nodeName,
                suitId: $(this).attr("suit"),
                isMyth: $(this).children("Grade").text() === "myth",
                typeIndex: equipmentTypeMap.get($(this).parent()[0].nodeName)
            };
            if ($(this).attr("mythOf"))
                equipmentInfo.mythOf = $(this).attr("mythOf");
            _this._getEquipmentUpList($(this).children("Property"), equipmentInfo);
            if (equipmentInfo.skillLevelUp.length === 0)
                delete equipmentInfo.skillLevelUp;
            map[$(this).attr("id")] = equipmentInfo;
        });
        this.equipments = map;
    }

    _getEquipmentUpList(node, equipmentInfo) {
        const _this = this;
        equipmentInfo.upList = equipmentInfo.upList || new Array(upTypeMap.size).fill(0);
        const upList = equipmentInfo.upList;
        equipmentInfo.roleUpList = equipmentInfo.roleUpList || {};
        const roleUpList = equipmentInfo.roleUpList;
        equipmentInfo.skillLevelUp = equipmentInfo.skillLevelUp || [];
        const skillLevelUp = equipmentInfo.skillLevelUp;
        $(node).children().each(function () {
            const tagName = $(this)[0].tagName;
            if (upTypeMap.get(tagName)) {
                upList[upTypeMap.get($(this)[0].tagName)] += parseFloat($(this).text());
            } else if (roleUpTypeMap.indexOf(tagName) > -1) {
                roleUpList[tagName] = (roleUpList[tagName] ? roleUpList[tagName] : 0) + parseFloat($(this).text());
            } else if (tagName === "SkillLevel") {
                skillLevelUp.push({
                    start: $(this).attr("start"),
                    end: $(this).attr("end"),
                    condition: $(this).attr("condition"),
                    value: $(this).text() - 0
                });
            } else if (tagName === "Edit") {
                $(this).children().each(function () {
                    const type = $(this)[0].tagName;
                    let defaultVal = "";
                    if (type === 'Selection') {
                        if ($(this).attr('default') != null)
                            defaultVal = $(this).attr('default');
                        else
                            defaultVal = "0";
                    } else {
                        if ($(this).children()[0].tagName === 'SkillLevel')
                            defaultVal = $(this).children().attr('max') - 0;
                        else
                            defaultVal = $(this).children().text() - 0;
                    }
                    switch (type) {
                        case "Selection":
                            _this._getEquipmentUpList($(this).children("Option[value='" + defaultVal + "']"), equipmentInfo);
                            break;
                        case "Input":
                            if ($(this).children()[0].tagName === 'SkillLevel') {  //是技能等级时 调整的是最大等级
                                $(this).children().attr('end', defaultVal);
                            } else {
                                $(this).children().text(defaultVal);
                            }
                            _this._getEquipmentUpList($(this), equipmentInfo);
                            break;
                        default:
                            break;
                    }
                });
            }
        });
    }
}