<template>
    <div class="SerializeDialog">
        <Modal :visible="visible" title="保存/加载" width="1200px">
            <div class="main-content-div my-border">
                <div class="header">
                    <span class="text-danger my-label mr-5">数据保存在浏览器缓存中!装备模板只保存装备，增幅附魔不会覆盖当前设置!</span>
                    <span class="my-label">当前版本:<span class="text-info">{{version}}</span></span>
                </div>
                <div class="content">
                    <div class="content-div">
                        <div class="role-div my-border my-scroll">
                            <div v-for="role in serializeUtils.roles" :key="role.key"
                                 class="role-item">
                                <div class="role-img-div flex-shrink-0">
                                    <sprite-render scale="0.75" class="role-img" :sprite-img="role.occupationId"
                                                   :frames="myUtils.occupationImgFrameMap[role.occupationId]"
                                                   time="8s"/>
                                </div>
                                <div class="role-info ml-1">
                                    <div class="role-info-div1">
                                        <div class="h-50 w-100 d-flex align-items-center">
                                            <span class="role-name-text my-label">{{role.name}}</span>
                                        </div>
                                        <div class="h-50 w-100 d-flex align-items-center">
                                            <span class="my-label">{{myUtils.occupationNameMap[role.occupationId]}}</span>
                                        </div>
                                    </div>
                                    <div class="role-info-div2">
                                        <div class="h-50 w-100 d-flex align-items-center">
                                            <span class="my-label">版本:</span>
                                            <span :class="[role.version == version?'text-info' : 'text-danger']">{{role.version}}</span>
                                        </div>
                                        <div class="h-50 w-100 d-flex align-items-center">
                                            <span class="my-label">{{role.date}}</span>
                                        </div>
                                    </div>
                                    <div class="role-info-div3 d-flex flex-wrap align-content-around">
                                        <common-button @click.native="loadRole(role)" class="edit-btn"
                                                       name="primary">加载
                                        </common-button>
                                        <common-button @click.native="deleteRole(role.key)" class="edit-btn"
                                                       name="danger">删除
                                        </common-button>
                                    </div>
                                </div>
                            </div>
                            <div class="role-item my-border">
                                <common-input v-model="roleName" class="role-name-input" placeholder="请输入角色名称"/>
                                <common-button @click.native="saveRole()" class="save-btn" name="primary">保存
                                </common-button>
                            </div>
                        </div>
                        <div class="equipment-template-div my-border my-scroll">
                            <div v-for="template in serializeUtils.templates" :key="template.key"
                                 class="role-item">
                                <div class="role-img-div flex-shrink-0">

                                </div>
                                <div class="role-info ml-1">
                                    <div class="role-info-div1">
                                        <div class="h-100 w-100 d-flex align-items-center">
                                            <span class="template-name-text my-label">{{template.name}}</span>
                                        </div>
                                    </div>
                                    <div class="role-info-div2">
                                        <div class="h-50 w-100 d-flex align-items-center">
                                            <span class="my-label">版本:</span>
                                            <span :class="[template.version == version?'text-info' : 'text-danger']">{{template.version}}</span>
                                        </div>
                                        <div class="h-50 w-100 d-flex align-items-center">
                                            <span class="my-label">{{template.date}}</span>
                                        </div>
                                    </div>
                                    <div class="role-info-div3 d-flex flex-wrap align-content-around">
                                        <common-button @click.native="loadTemplate(template)" class="edit-btn"
                                                       name="primary">加载
                                        </common-button>
                                        <common-button @click.native="deleteTemplate(template.key)" class="edit-btn"
                                                       name="danger">删除
                                        </common-button>
                                    </div>
                                </div>
                            </div>

                            <div class="role-item my-border">
                                <common-input v-model="templateName" class="role-name-input"
                                              placeholder="请输入装备模板名称"></common-input>
                                <common-button @click.native="saveTemplate()" class="save-btn" name="primary">保存
                                </common-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer"></div>
            </div>

            <div slot="footer" class="btn-footer d-flex justify-content-center">
                <div class="mt-3">
                    <common-button @click.native="closeMedal()" class="close-btn px-4"
                                   name="primary">关闭
                    </common-button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {RoleSerializeUtils} from "@/js/simulator/RoleSerializeUtils";
    import {Role} from "@/js/simulator/role";
    import {Equipments} from "@/js/simulator/equipment";

    export default {
        name: "SerializeDialog",
        props: ["visible"],
        inject: ['roles', "simulatorPageComponent"],
        data() {
            return {
                // isLocalStorageAvailable: window.localStorage === undefined
                serializeUtils: new RoleSerializeUtils(),
                roleName: "",
                templateName: ""
            }
        },
        methods: {
            closeMedal() {
                this.$emit("update:visible", false);
            },
            saveRole() {
                this.serializeUtils.addRole(this.roles.role, this.roleName);
                this.roleName = "";
            },
            loadRole(roleModel) {
                let role = this.serializeUtils.parseRole(roleModel);
                if (role instanceof Role) {
                    role.updateRole();
                    this.simulatorPageComponent.roles.role = role;
                    this.simulatorPageComponent.roles.savedRole[role.occupationId] = role;
                }
                // this.$root.$children[0].$data.role
            },
            deleteRole(key) {
                this.serializeUtils.deleteRole(key);
            },
            saveTemplate() {
                this.serializeUtils.addTemplate(this.roles.role, this.templateName);
                this.templateName = "";
            },
            loadTemplate(templateModel) {
                let equipments = this.serializeUtils.parseTemplate(templateModel);
                if (equipments instanceof Equipments) {
                    this.simulatorPageComponent.roles.role.equipments.copyPureEquipments(equipments);
                    this.roles.role.updateRole();
                }
            },
            deleteTemplate(key) {
                this.serializeUtils.deleteTemplate(key);
            },
        }
    }
</script>

<style scoped>
    .main-content-div {
        width: 100%;
        height: 630px;
        font-size: 18px;
    }

    .role-img-div {
        height: 100%;
        width: 120px;
    }

    .role-img {
        width: 100%;
        height: 100%;
    }

    .save-btn {
        width: 90px;
        height: 40px;
    }

    .content-div {
        display: flex;
        justify-content: space-around;
        height: 100%;
        width: 100%;
    }

    .role-div {
        width: 40%;
        height: 100%;
        background-color: black;
        padding: 10px;
    }

    .role-item {
        border: 2px solid rgba(64, 61, 60, 0.79);
        padding: 3px;
        height: 100px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-radius: 2%;
        margin-bottom: 5px;
        /*border-image: url("../assets/UI/image/role_select_bg_orange.png") 5 5 round; !* Old Firefox *!*/
        /* Safari and Chrome */
        /* Opera */
    }

    .role-item:hover {
        padding: 0;
        border: 5px solid transparent;
        border-image: url("../../assets/UI/image/role_select_bg.png") 5 5 round;
    }

    .equipment-template-div {
        width: 40%;
        height: 100%;
        background-color: black;
        padding: 10px;
    }

    .version-text {
        color: lawngreen;
    }

    .header {
        height: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .content {
        height: 75%;
    }

    .footer {
        height: 7%;
    }

    .btn-footer {
        height: 8%;
    }

    .role-info {
        height: 100%;
        width: 100%;
        display: flex;
    }

    .role-info-div1 {
        flex: 3;
    }

    .role-info-div2 {
        flex: 3;
    }

    .role-info-div3 {
        flex: 2;
    }

    .edit-btn {
        width: 95%;
        height: 40%;
    }

    .close-btn {
        height: 30px;
    }

    .template-name-text {
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        width: 110px;
    }

    .role-name-text {
        width: 110px;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>