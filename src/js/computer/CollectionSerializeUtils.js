import {serializeUtils, VERSION, saveFile} from "@/js/SerializeUtils";


export class CollectionSerializeUtils {
    constructor() {
        this.roles = {};
        this.getDefaultRoleKey().then(res => {
            if (res) {
                this.defaultRoleKey = res;
                this.hasDefaultRoleKey = true;
            }
        });
        this.updateRoleList();
    }

    updateRoleList() {
        this.getRoles().then(roleMap => {
            if (roleMap.defaultRoleKey)
                delete roleMap.defaultRoleKey;
            if (Object.keys(roleMap).length === 0) {   //没有角色
                serializeUtils.write("collection", {
                    data: {},
                    name: "默认",
                    date: new Date().toLocaleDateString(),
                    version: VERSION
                }).then(() => {
                    this.getRoles().then(roleMap => {
                        this.roles = roleMap;
                    });
                });
            } else
                this.roles = roleMap;
        });
    }


    //查询角色
    getRoles() {
        return serializeUtils.readAll("collection", true);
    }

    //序列化角色
    addRole(name, role) {
        let roleModel = role || {
            data: {},
            name: name || "未命名角色",
            date: new Date().toLocaleDateString(),
            version: VERSION
        };
        return serializeUtils.write("collection", roleModel).then(() => {
            this.updateRoleList();
        });
    }

    updateRole(data, key) {
        serializeUtils.update("collection", data, parseInt(key));
    }

    deleteRole(key) {
        return serializeUtils.delete("collection", parseInt(key)).then(() => {
            this.updateRoleList();
        });
    }

    updateDefaultRoleKey(key) {
        serializeUtils.update("collection", key, "defaultRoleKey");
        this.defaultRoleKey = key;
    }

    getDefaultRoleKey() {
        return serializeUtils.get("collection", "defaultRoleKey");
    }

    saveRoles() {
        saveFile("roles.dar", JSON.stringify(this.roles));
    }

    importRoles(roles) {
        if(roles) {
            for (let key in roles) {
                this.updateRole(roles[key], key);
            }
            this.updateRoleList();
        }
    }
}





