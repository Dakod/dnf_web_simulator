<template>
    <div class="body_all">
        <div class="main-div d-flex mx-auto flex-wrap align-content-start">
            <div class="computer-div">
                <div class="header-div">
                    <common-button class="btn" name="primary" @click.native="toSimulator">返回</common-button>
                    <common-select :list="roleSelectMap" :value="currentRoleKeyView"
                                   @input="changeCurrentRole"/>

                    <div class="create-role d-flex-center">
                        <common-input v-model="roleName" placeholder="输入角色名称"></common-input>
                        <common-button @click.native="createRole()" class="btn" name="primary">创建</common-button>
                        <common-button @click.native="deleteRole()" class="btn" name="danger">删除</common-button>
                    </div>
                    <div class="search-div d-flex-center">
                        <common-button @click.native="keyWord = keyWordView" name="search" class="search-btn"/>
                        <common-input @keypress.enter.native="keyWord = keyWordView" v-model="keyWordView"
                                      placeholder="输入装备名称搜索"/>
                    </div>
                    <div class="serialize-div">
                        <common-button @click.native="exportConfig()" class="btn" name="primary">导出</common-button>
                        <common-button @click.native="importConfig()" class="btn" name="primary">导入</common-button>
                        <input style="display: none" type="file" id="files" accept=".dar"/>
                    </div>
                </div>
                <div class="collection-div">
                    <equipment-collection-div :role="currentRole" :role-key="currentRoleKeyView"
                                              :serializeUtils="serializeUtils" :key-word="keyWord"/>
                    <!--                    <computer-setting-div :role="currentRole"/>-->
                    <div class="my-border temp-div">
                        <span class="myth-text">敬请期待</span>
                    </div>
                </div>

            </div>
            <div class="footer w-100 d-flex justify-content-center align-items-center">
                <label class="footer-label my-label ">&copy;Darod 版本:{{version}} 仅供学习交流使用</label>
            </div>
        </div>
        <div id="modal-wrapper" class="modal-wrapper"/>
    </div>
</template>

<script>

    import {CollectionSerializeUtils} from "@/js/computer/CollectionSerializeUtils";
    import EquipmentCollectionDiv from "@/components/computer_page/EquipmentCollectionDiv";
    import ComputerSettingDiv from "@/components/computer_page/ComputerSettingDiv";

    export default {
        name: "ComputerPage",
        mounted() {
            let _this = this;
            let inputElement = document.getElementById("files");
            inputElement.addEventListener("change", () => {
                let input = document.getElementById("files");
                if (input.files.length > 0) {
                    let selectedFile = input.files[0];//获取读取的File对象
                    // let name = selectedFile.name;//读取选中文件的文件名
                    // let size = selectedFile.size;//读取选中文件的大小
                    let reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
                    reader.readAsText(selectedFile);//读取文件的内容
                    reader.onload = function () {
                        let roles = {};
                        try {
                            roles = JSON.parse(this.result)
                        } catch (e) {
                            console.log("文件读取失败");
                        }
                        _this.serializeUtils.importRoles(roles);
                        input.value = null;
                    };
                }
            }, false);
        },
        beforeUpdate() {
        },
        provide: function () {

        },
        data: function () {
            return {
                serializeUtils: new CollectionSerializeUtils(),
                currentRoleKey: "",
                defaultRoleKey: "",
                roleName: "",
                keyWord: "",
                keyWordView: "",
            }
        },
        computed: {
            roleMap() {
                return this.serializeUtils.roles;
            },
            roleSelectMap() {
                let map = {};
                for (let key in this.roleMap) {
                    map[key] = this.roleMap[key].name;
                }
                return map;
            },
            currentRole() {
                return this.roleMap[this.currentRoleKeyView];
            },
            currentRoleKeyView() {
                if (!this.currentRoleKey || this.currentRoleKey === "null") {
                    if (Object.keys(this.roleMap).length > 0) {
                        if (this.serializeUtils.defaultRoleKey &&
                            this.roleMap[this.serializeUtils.defaultRoleKey])
                            return this.serializeUtils.defaultRoleKey;
                        return Object.keys(this.roleMap)[0];
                    }
                    return "null";
                } else
                    return this.currentRoleKey;
            },
        },
        methods: {
            createRole() {
                this.serializeUtils.addRole(this.roleName);
                this.roleName = "";
            },
            deleteRole() {
                this.serializeUtils.deleteRole(this.currentRoleKeyView);
            },
            changeCurrentRole(event) {
                // if (this.serializeUtils.hasDefaultRoleKey) {
                this.serializeUtils.updateDefaultRoleKey(event);
                // }
                this.currentRoleKey = event;
            },
            exportConfig() {
                this.serializeUtils.saveRoles();
            },
            importConfig() {
                let inputElement = document.getElementById("files");
                inputElement.click();
            },
            toSimulator() {
                this.$router.push("/simulator");
            }
        },
        components: {ComputerSettingDiv, EquipmentCollectionDiv}
    }
</script>

<style scoped>
    .d-flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .temp-div {
        width: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .body_all {
        background-image: url("../../assets/UI/image/bg_all.jpg");
        background-size: 100% 100%;
        height: 100%;
        min-width: 1550px;
        display: flex;
        align-items: center;
    }

    .main-div {
        width: 1550px;
        /*height: 100%;*/
        font-family: 宋体, serif;
        font-weight: 400;
    }

    .footer {
        background-color: rgba(0, 0, 0, 0.85);
        height: 60px;
    }

    .footer-label {
        font-family: initial;
    }

    .computer-div {
        height: 865px;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.85);
        padding: 0 15px 15px 15px;
    }

    .header-div {
        display: flex;
        justify-content: space-around;
        height: 60px;
        align-items: center;
    }

    .btn {
        width: 80px;
        height: 38px;
        outline: none;
        margin: 0 5px;
    }

    .search-btn {
        width: 38px;
        height: 38px;
        margin: 0 5px;
    }

    .collection-div {
        display: flex;
        justify-content: space-between;
    }

    .computer-setting-div {
    }
</style>