<template>
    <div class="MedalSelectDiv my-border">
        <div class="d-flex w-100 h-100 flex-wrap">
            <div class="medals-div w-100 d-flex justify-content-center align-items-end">
                <div class="position-relative">
                    <img class="medal-on-img" v-show="roles.role.medals.bead1.equipmentId!=null"
                         src="@/assets/UI/image/bead_on.png">
                    <main-equipment-icon style="width: 70px;height: 70px;margin-right: 50px" :check-change="checkBead"
                                         equipment-type="bead1" item-type="medals"
                                         :active-info="activeInfo"
                                         v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
                </div>
                <div class="position-relative">
                    <img class="medal-on-img" v-show="roles.role.medals.bead2.equipmentId!=null"
                         style="margin-left: 50px"
                         src="@/assets/UI/image/bead_on.png">
                    <main-equipment-icon style="width: 70px;height: 70px;margin-left: 50px" :check-change="checkBead"
                                         equipment-type="bead2" item-type="medals"
                                         :active-info="activeInfo"
                                         v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
                </div>
            </div>
            <div class="medals-div-center w-100">
                <div class="medal-item-div mx-auto" style="margin-left: 40px;">
                    <main-equipment-icon style="width: 50px;height: 50px;"
                                         equipment-type="medal" item-type="medals"
                                         :active-info="activeInfo"
                                         v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
                </div>
            </div>
            <div class="medals-div w-100 d-flex justify-content-center align-items-start">
                <div class="position-relative">
                    <img class="medal-on-img" v-show="roles.role.medals.bead3.equipmentId!=null"
                         src="@/assets/UI/image/bead_on.png">
                    <main-equipment-icon style="width: 70px;height: 70px;margin-right: 50px" :check-change="checkBead"
                                         equipment-type="bead3" item-type="medals"
                                         :active-info="activeInfo"
                                         v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
                </div>
                <div class="position-relative">
                    <img class="medal-on-img" v-show="roles.role.medals.bead4.equipmentId!=null"
                         style="margin-left: 50px"
                         src="@/assets/UI/image/bead_on.png">
                    <main-equipment-icon style="width: 70px;height: 70px;margin-left: 50px" :check-change="checkBead"
                                         equipment-type="bead4" item-type="medals"
                                         :active-info="activeInfo"
                                         v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import MainEquipmentIcon from "@/components/simulator_page/main_role_info/MainEquipmentIcon";

    export default {
        name: "MedalSelectDiv",
        props: ['activeInfo'],
        data: function () {
            return {};
        },
        inject: ['roles'],
        components: {
            MainEquipmentIcon
        },
        methods: {
            checkBead(role, node, equipmentType) {
                let curType = $(node).attr("type");
                for (let index = 1; index <= 4; index++) {
                    if (String(role.medals["bead" + index].equipmentId) != "null") {
                        if ($(role.medals["bead" + index].xmlNode).attr("type") === curType &&
                            equipmentType !== ("bead" + index))
                            return false;
                    }
                }
                return true;
            }
        }
    }
</script>

<style scoped>
    .MedalSelectDiv {
        width: 520px;
        height: 323px;
        margin-bottom: 5px;
        background-image: url("../../../assets/UI/image/medal_bg.png");
        background-size: 100% 100%;
    }

    .medal-on-img {
        position: absolute;
        width: 70px;
        height: 70px;
        z-index: 10;
        pointer-events: none;
    }

    .medal-equipments-div {
        width: 60px;
        height: 180px;
        margin-left: 330px;
        margin-top: 40px;
    }

    .medal-item-div {
        width: 75px;
        height: 75px;
        background-image: url("../../../assets/UI/image/medal_on.png");
        background-size: 100% 100%;
        padding-top: 12px;
        padding-left: 12px;
    }

    .medals-div {
        height: 130px;
    }

    .medals-div-center {
        height: 75px;
    }
</style>