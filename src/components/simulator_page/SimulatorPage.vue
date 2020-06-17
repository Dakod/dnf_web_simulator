<template>
    <div class="body_all" @click="global.activeDialog = null">
        <div class="main-div d-flex mx-auto flex-wrap align-content-start">
            <div id="role-info-div" class="d-flex flex-wrap align-content-start justify-content-center"
                 style="padding:2px">
                <div id="role-info-title" class="w-100">
                    <label class="window-title-label">个人信息</label>
                    <img src="@/assets/UI/image/window_title.png" class="w-100 ">
                </div>
                <common-tab-bar id="tab-bar-div" :list="tabList" :activeIndex="activeTab"
                                @tabChange="activeTab=$event"/>
                <div id="tab-content-div">
                    <div v-show="activeTab==0" id="equipment-select-div">
                        <div class="armor-select-div d-flex justify-content-between h-100">
                            <img id="role-image" :src="require('@/assets/UI/role/'+roles.role.occupationId+'.png')">
                            <div class="equipment_lef d-flex flex-wrap">
                                <ul id="equipment_ul_1">
                                    <li class="shoulder">
                                        <main-equipment-icon equipment-type="shoulder" item-type="equipments"
                                                             :should-show-suit-mark="shouldShowSuitMark"
                                                             :activeInfo.sync="global.activeDialog"/>
                                    </li>
                                    <li class="pants">
                                        <main-equipment-icon equipment-type="pants" item-type="equipments"
                                                             :should-show-suit-mark="shouldShowSuitMark"
                                                             :activeInfo.sync="global.activeDialog"/>
                                    </li>
                                    <li class="shoes">
                                        <main-equipment-icon equipment-type="shoes" item-type="equipments"
                                                             :should-show-suit-mark="shouldShowSuitMark"
                                                             :activeInfo.sync="global.activeDialog"/>
                                    </li>
                                </ul>
                                <ul id="equipment_ul_2">
                                    <li class="coat">
                                        <main-equipment-icon :check-change="checkMyth" equipment-type="coat"
                                                             :should-show-suit-mark="shouldShowSuitMark"
                                                             item-type="equipments"
                                                             :activeInfo.sync="global.activeDialog"/>
                                    </li>
                                    <li class="belt">
                                        <main-equipment-icon equipment-type="belt" item-type="equipments"
                                                             :should-show-suit-mark="shouldShowSuitMark"
                                                             :activeInfo.sync="global.activeDialog"/>
                                    </li>
                                </ul>
                            </div>
                            <div class="equipment_right">
                                <ul id="equipment_ul_3">
                                    <li class="weapon">
                                        <main-equipment-icon equipment-type="weapon" item-type="equipments"
                                                             :should-show-suit-mark="shouldShowSuitMark"
                                                             :activeInfo.sync="global.activeDialog"/>
                                    </li>
                                    <li class="bracelet">
                                        <main-equipment-icon :check-change="checkMyth" equipment-type="bracelet"
                                                             :should-show-suit-mark="shouldShowSuitMark"
                                                             item-type="equipments"
                                                             :activeInfo.sync="global.activeDialog"/>
                                    </li>
                                    <li class="assistant">
                                        <main-equipment-icon equipment-type="assistant" item-type="equipments"
                                                             :should-show-suit-mark="shouldShowSuitMark"
                                                             :activeInfo.sync="global.activeDialog"/>
                                    </li>
                                    <li class="earrings">
                                        <main-equipment-icon :check-change="checkMyth" equipment-type="earrings"
                                                             :should-show-suit-mark="shouldShowSuitMark"
                                                             item-type="equipments"
                                                             :activeInfo.sync="global.activeDialog"/>
                                    </li>
                                </ul>
                                <ul id="equipment_ul_4">
                                    <li class="title">
                                        <main-equipment-icon equipment-type="title" item-type="equipments"
                                                             :activeInfo.sync="global.activeDialog"/>
                                    </li>
                                    <li class="necklace">
                                        <main-equipment-icon equipment-type="necklace" item-type="equipments"
                                                             :should-show-suit-mark="shouldShowSuitMark"
                                                             :activeInfo.sync="global.activeDialog"/>
                                    </li>
                                    <li class="ring">
                                        <main-equipment-icon equipment-type="ring" item-type="equipments"
                                                             :should-show-suit-mark="shouldShowSuitMark"
                                                             :activeInfo.sync="global.activeDialog"/>
                                    </li>
                                    <li class="magicstone">
                                        <main-equipment-icon equipment-type="magicstone" item-type="equipments"
                                                             :should-show-suit-mark="shouldShowSuitMark"
                                                             :activeInfo.sync="global.activeDialog"/>
                                    </li>
                                </ul>
                            </div>
                            <div class="role-change-div">
                                <label class="role-name">{{myUtils.occupationNameMap[roles.role.occupationId]}}</label>
                                <common-button @click.stop.native="global.activeDialog =
                                                    global.activeDialog==='roleChange'?'':'roleChange'"
                                               class="change-role-btn" name="primary">切换职业
                                </common-button>
                                <div class="position-relative">
                                    <role-change-bubble @click.stop.native="global.activeDialog='roleChange'"
                                                        :activeInfo.sync="global.activeDialog"/>
                                </div>
                            </div>
                            <div class="buff-div">
                                <common-button @click.stop.native="global.activeDialog =
                                                    global.activeDialog==='buff'?'':'buff'"
                                               name="buff" title="buff换装"
                                               style="width: 50px;height: 50px"/>
                                <buff-skill-edit-dialog @click.stop.native="global.activeDialog='buff'"
                                                        :activeInfo.sync="global.activeDialog"/>
                            </div>
                            <div class="suitmark-div">
                                <common-button name="suitmark" @click.native="shouldShowSuitMark = !shouldShowSuitMark"
                                               title="套装标记开关"
                                               style="width: 50px;height: 50px"/>
                            </div>
                        </div>
                    </div>
                    <dress-select-div v-show="activeTab==1" :activeInfo.sync="global.activeDialog"/>
                    <pet-select-div v-show="activeTab==2" :activeInfo.sync="global.activeDialog"/>
                    <medal-select-div v-show="activeTab==4" :activeInfo.sync="global.activeDialog"/>
                    <talisman-div v-show="activeTab==3" :activeInfo.sync="global.activeDialog"/>
                    <monster-div v-show="activeTab==5" :activeInfo.sync="global.activeDialog"/>
                </div>
                <div v-show="activeTab!=3" id="role-details-div">
                    <role-details :is-real="isReal"/>
                </div>
                <div id="prop-div" class="my-scroll">
                    <prop-info-window :props-list="propsList"/>
                </div>
                <div class="bottom-buttons-div">
                    <common-button @click.native="isReal = !isReal"
                                   class="bottom-button" name="primary">站街/进图切换
                    </common-button>
                    <div class="position-relative">
                        <common-button @click.stop.native="global.activeDialog =
                                                    global.activeDialog==='propertyDetail'?'':'propertyDetail'"
                                       class="bottom-button"
                                       name="orange">词条信息
                        </common-button>
                        <property-detail-dialog @click.stop.native="global.activeDialog='propertyDetail'"
                                                :activeInfo.sync="global.activeDialog"/>
                    </div>
                    <common-button @click.stop.native="computeDamage()" class="bottom-button"
                                   name="green">开始计算
                    </common-button>
                </div>
                <div class="bottom-buttons-div">
                    <common-button @click.native="serializeDialogVisible = true" class="bottom-button" name="primary">
                        保存/加载
                    </common-button>
                    <common-button class="bottom-button" name="orange" @click.native='toCollection'>收藏册</common-button>
                    <div class="position-relative">
                        <common-button @click.stop.native="global.activeDialog =
                                                    global.activeDialog==='fastSettingDialog'?'':'fastSettingDialog'"
                                       class="bottom-button" name="green">一键增幅
                        </common-button>
                        <fast-setting-dialog  @click.stop.native="global.activeDialog='fastSettingDialog'"
                                              :activeInfo.sync="global.activeDialog"/>
                    </div>
                </div>
            </div>
            <div id="skill-info-div">
                <div id="damage-skill-info">
                    <damage-skill-window ref="DamageSkillWindow"/>
                </div>
                <div id="buff-skill-info">
                    <buff-skill-window style="height: 300px"/>
                </div>
            </div>
            <div class="footer w-100 d-flex justify-content-center align-items-center">
                <label class="footer-label my-label ">&copy;Darod 版本:{{version}} 仅供学习交流使用</label>
            </div>
        </div>
        <serialize-dialog :visible.sync="serializeDialogVisible"/>
        <div id="modal-wrapper" class="modal-wrapper"/>
    </div>
</template>

<script>
    import PropertyDetailDialog from "@/components/simulator_page/dialogs/PropertyDetailDialog";
    import MainEquipmentIcon from "@/components/simulator_page/main_role_info/MainEquipmentIcon";
    import BuffSkillEditDialog from "@/components/simulator_page/dialogs/BuffSkillEditDialog";
    import RoleDetails from "@/components/simulator_page/main_role_info/RoleDetails";
    import PropInfoWindow from "@/components/simulator_page/main_role_info/PropInfoWindow";
    import BuffSkillWindow from "@/components/simulator_page/buff_skill_div/BuffSkillWindow";
    import DressSelectDiv from "@/components/simulator_page/main_role_info/DressSelectDiv";
    import PetSelectDiv from "@/components/simulator_page/main_role_info/PetSelectDiv";
    import MedalSelectDiv from "@/components/simulator_page/main_role_info/MedalSelectDiv";
    import TalismanDiv from "@/components/simulator_page/main_role_info/TalismanDiv";
    import * as roleModel from "@/js/simulator/role"
    import DamageSkillWindow from "@/components/simulator_page/damage_skill_div/DamageSkillWindow";
    import MonsterDiv from "@/components/simulator_page/main_role_info/MonsterDiv";
    import SerializeDialog from "@/components/simulator_page/SerializeDialog";
    import RoleChangeBubble from "@/components/simulator_page/dialogs/RoleChangeBubble";
    import FastSettingDialog from "@/components/simulator_page/dialogs/FastSettingDialog";

    export default {
        name: "SimulatorPage",
        mounted() {
            this.roles.role.updateRole("APP");
            this.roles.savedRole["001"] = this.roles.role;
        },
        beforeUpdate() {
            // this.role.updateRole();
        },
        provide: function () {
            return {
                roles: this.roles,
                global: this.global,
                simulatorPageComponent: this
            };
        },
        // props: ["role"],
        data: function () {
            return {
                tabList: ["装备", "装扮", "宠物", "护石", "勋章", "怪物"],  //tab选项
                activeTab: 0,  //活跃的tabindex
                equipmentXML: null,  //装备xml文件
                roles: {
                    role: new roleModel.Role("001"),
                    savedRole: {}//缓存的角色 切换职业时 保留被切换职业的数据
                }, //角色模型
                global: {
                    activeDialog: null  //活跃的装备选择面板
                },
                // activeEquipmentDialog: null,
                isReal: true,//显示进图面板还是城镇面板
                serializeDialogVisible: false,

                shouldShowSuitMark: true,//是否显示套装标记
                // roles:[new roleModel.Role("001")],
                // curRoleIndex:0,
            }
        },
        computed: {
            propsList: function () {
                return this.xmlReader.getAllProps();
            }
        },
        methods: {
            computeDamage() {
                this.myUtils.computeDamage(this.roles.role);
                this.$refs.DamageSkillWindow.refreshSort();
            },
            checkMyth(role, node, curEquipmentType) {
                if ($(node).children("Grade").text() !== "myth") return true;  //不是神话 直接穿
                for (let equipmentType in role.equipments) {
                    let equipmentNode = role.equipments[equipmentType].xmlNode;
                    if (equipmentNode !== null && $(equipmentNode).children("Grade").text() === "myth" && equipmentType !== curEquipmentType) return false;
                }
                return true;
            },
            toCollection() {
                this.$router.push("/computer");
            }
        },
        components: {
            FastSettingDialog,
            RoleChangeBubble,
            MonsterDiv,
            MainEquipmentIcon,
            RoleDetails,
            PropInfoWindow,
            DamageSkillWindow,
            BuffSkillWindow,
            DressSelectDiv,
            PetSelectDiv,
            MedalSelectDiv,
            TalismanDiv,
            BuffSkillEditDialog,
            PropertyDetailDialog,
            SerializeDialog
            // test
        }
    }
</script>

<style scoped>
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

    .role-change-div {
        position: absolute;
        bottom: 10px;
        display: flex;
        justify-content: center;
        width: 50%;
        flex-wrap: wrap;
        left: 0;
        right: 0;
        margin: auto;
    }

    .role-name {
        color: #68EDA1;
        margin-bottom: 0;
        width: 100%;
        text-align: center;
    }

    .change-role-btn {
        width: 84px;
        height: 40px;
    }

    .buff-div {
        width: 50px;
        height: 50px;
        position: absolute;
        bottom: 10px;
        left: 10px;
    }

    .suitmark-div {
        width: 50px;
        height: 50px;
        position: absolute;
        bottom: 10px;
        right: 10px;
    }

    #equipment_ul_1 {
        margin-bottom: 0;
        height: 180px;
    }

    #equipment_ul_2 {
        margin-bottom: 0;
        height: 180px;
    }

    .equipment_lef {
        align-content: start;
    }


    #tab-bar-div {
        /*height: 30px;*/
        width: inherit;
    }

    #role-info-div {
        width: 550px;
        height: 865px;
        /*background-image: url("assets/UI/image/blackbglight.png");*/
        background-size: 100% 100%;
        background-color: rgba(0, 0, 0, 0.85);
    }

    #equipment-select-div {
        background-image: url("../../assets/UI/image/background.png");
        background-size: cover;
        border: 2px solid #a0a0a038;
        width: 520px;
        height: 323px;
        margin-bottom: 5px;
    }

    #role-details-div {
        border: 2px solid #a0a0a038;
        width: 520px;
        height: 215px;
        margin-bottom: 5px;
        display: flex;
    }

    #skill-info-div {
        width: 1000px;
        background-color: rgba(0, 0, 0, 0.85);
        padding: 2px;
        height: 865px;
    }

    #prop-div {
        border: 2px solid #a0a0a038;
        width: 520px;
        height: 110px;
    }

    .equipment_lef {
        width: 140px;
        height: 319px;
        padding-left: 16px;
        padding-top: 16px;
    }

    .equipment_lef > ul {
        list-style-type: none;
        padding-left: 2px;
        float: left;
    }

    .equipment_right {
        /*width: 140px;*/
        height: 230px;
        padding-right: 16px;
        padding-top: 16px;
    }

    .equipment_right > ul {
        list-style-type: none;
        padding-left: 2px;
        float: left;
    }

    #role-image {
        width: 170px;
        height: 233px;
        align-self: flex-end;
        margin-right: 30px;
    }

    #role-info-title {
        position: relative;
    }

    #role-info-title > img {
        height: 35px;
    }

    .equipment_lef > ul > li, .equipment_right > ul > li {
        width: 53px;
        height: 53px;
    }

    .bottom-buttons-div {
        display: flex;
        width: 520px;
        height: 60px;
        align-items: center;
        justify-content: space-around;
    }

    .bottom-button {
        width: 120px;
        height: 40px;
    }

    .armor-select-div {
        position: relative;
    }

    #role-image {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .footer {
        background-color: rgba(0, 0, 0, 0.85);
        height: 60px;
    }

    .footer-label {
        font-family: initial;
    }
</style>