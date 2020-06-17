import {Role} from "@/js/simulator/role";
// import {Equipments} from "@/js/simulator/equipment";
import {serializeUtils, VERSION} from "@/js/SerializeUtils";
import {Equipments} from "@/js/simulator/equipment";


export class RoleSerializeUtils {
    constructor() {
        this.roles = [];
        this.templates = [];
        this.updateRoleList();
        this.updateTemplateList();
    }

    updateRoleList() {
        this.getRoles().then(roleList => {
            this.roles = roleList;
        });
    }

    parseRole(roleModel) {
        let role = new Role();
        role.parse(JSON.parse(roleModel.data));
        return role;
    }

    //查询角色
    getRoles() {
        return serializeUtils.readAll("role");
    }

    //序列化角色
    addRole(role, name) {
        let roleModel = {
            data: role.customToJson(),
            name: name,
            date: new Date().toLocaleDateString(),
            occupationId: role.occupationId,
            version: VERSION
        };
        return serializeUtils.write("role", roleModel).then(() => {
            this.updateRoleList();
        });
    }

    deleteRole(key) {
        return serializeUtils.delete("role", key).then(() => {
            this.updateRoleList();
        });
    }


    //-----------------------------------------------装备模板相关

    updateTemplateList() {
        this.getTemplates().then(templateList => {
            this.templates = templateList;
        });
    }

    parseTemplate(templateModel, keepSetting) {
        let temp = new Equipments();
        temp.copyPureEquipments(JSON.parse(templateModel.data));
        //默认不保存打造细节
        if (!keepSetting) {
            temp.cleanEquipmentsDetail();
        }
        return temp;
    }

    //查询装备模板
    getTemplates() {
        return serializeUtils.readAll("template");
    }

    //序列化模板
    addTemplate(role, name) {
        let templateModel = {
            data: role.equipments.customToJson(),
            name: name,
            date: new Date().toLocaleDateString(),
            version: VERSION
        };
        return serializeUtils.write("template", templateModel).then(() => {
            this.updateTemplateList();
        });
    }

    deleteTemplate(key) {
        return serializeUtils.delete("template", key).then(() => {
            this.updateTemplateList();
        });
    }


    // //装备模板相关
    // addTemplate(role, name) {
    //     let uuid = getUUID();
    //     let metaData = this._getTemplateMetaData(name, uuid);
    //     window.localStorage.setItem(uuid, MAGIC + role.equipments.customToJson());
    //     this.metaData.equipmentTemplates.push(metaData);
    //     this._writeMetaDate();
    // }
    //
    // deleteTemplate(key) {
    //     let index = this.metaData.equipmentTemplates.findIndex(role => role.key === key);
    //     if (index < 0) return;
    //     this.metaData.equipmentTemplates.splice(index, 1);
    //     window.localStorage.removeItem(key);
    //     this._writeMetaDate();
    // }
    //
    // _getTemplateMetaData(name, key) {
    //     return {
    //         name: name,
    //         version: VERSION,
    //         date: new Date().toLocaleDateString(),
    //         key: key
    //     }
    // }
    //
    // getTemplate(key, keepSetting) {
    //     let str = window.localStorage.getItem(key);
    //     let equipments = null;
    //     if (str) {
    //         if (str.slice(0, MAGIC.length) === MAGIC) {
    //             try {
    //                 let temp = new Equipments();
    //                 temp.copyPureEquipments(JSON.parse(str.slice(MAGIC.length)));
    //                 equipments = temp;
    //                 //默认不保存打造细节
    //                 if (!keepSetting) {
    //                     temp.cleanEquipmentsDetail();
    //                 }
    //             } catch (e) {
    //                 console.log(e);
    //             }
    //         }
    //     }
    //     return equipments;
    // }
}





