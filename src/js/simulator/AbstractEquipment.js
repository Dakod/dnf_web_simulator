import {Serializable} from "@/js/simulator/Serializable";
import $ from "jquery";
import * as xmlReader from "@/js/xmlReader";

export class AbstractEquipment extends Serializable {
    constructor() {
        super();
        this.xmlNode = null;   //缓存xml结点
        this.init();
    }

    setXMLNode(node) {
        this.xmlNode = node;  //更新node
        this.updateEquipmentId(); //根据node获取id
        if (this.hasEditInfo)
            this.updateEditInfo();
    }

    init() {
        if (this.equipmentId !== undefined && String(this.equipmentId) !== 'null') {
            let editInfo = this.editInfo;
            this.setXMLNode(xmlReader.getItemInfo(this.equipmentId, this.itemType));
            if (editInfo)
                this.editInfo = editInfo;
        }
    }

    updateEquipmentId() {
        if (this.xmlNode != null) {
            this.equipmentId = $(this.xmlNode).attr("id");
        } else {
            this.equipmentId = null;
        }
    }

    updateEditInfo() {
        //读取装备编辑信息
        let newEditInfo = {};
        if (this.xmlNode == null || $(this.xmlNode).attr('editable') !== 'true') { //无装备或者装备不可编辑
            this.editInfo = newEditInfo;
        } else {
            $(this.xmlNode).find("Edit").children().each(function () {
                let type = $(this)[0].tagName;
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
                newEditInfo[$(this).attr('index')] = defaultVal;
            });
        }
        this.editInfo = newEditInfo;
    }
}

AbstractEquipment.prototype.hasEditInfo = false;
AbstractEquipment.prototype.itemType = undefined;
