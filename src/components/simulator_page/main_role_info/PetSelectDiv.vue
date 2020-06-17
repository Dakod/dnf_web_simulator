<template>
    <div class="PetSelectDiv my-border">
        <div class="d-flex">
            <div class="pet-item-div" style="margin-left: 40px;margin-top: 40px">
                <main-equipment-icon equipment-type="pet" item-type="pets"
                                     :active-info="activeInfo"
                                     v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
            </div>
            <div class="pet-equipments-div d-flex flex-wrap">
                <div class="pet-item-div">
                    <main-equipment-icon equipment-type="redequipment" item-type="pets"
                                         :active-info="activeInfo"
                                         v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
                </div>
                <div class="pet-item-div">
                    <main-equipment-icon equipment-type="blueequipment" item-type="pets"
                                         :active-info="activeInfo"
                                         v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
                </div>
                <div class="pet-item-div">
                    <main-equipment-icon equipment-type="greenequipment" item-type="pets"
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
        name: "PetSelectDiv",
        props: ['activeInfo'],
        data: function () {
            return {};
        },
        components: {
            MainEquipmentIcon
        }
    }
</script>

<style scoped>
    .PetSelectDiv {
        width: 520px;
        height: 323px;
        margin-bottom: 5px;
    }

    .pet-equipments-div {
        width: 60px;
        height: 180px;
        margin-left: 330px;
        margin-top: 40px;
    }

    .pet-item-div {
        width: 60px;
        height: 60px;
        margin-bottom: 10px;
    }
</style>