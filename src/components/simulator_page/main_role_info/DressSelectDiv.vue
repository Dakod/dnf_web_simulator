<template>
    <div class="DressSelectDiv my-border">
        <div class="dress-items-div d-flex flex-wrap align-content-start">
            <div class="dress-item-div">
                <main-equipment-icon equipment-type="weapon_d" item-type="dresss"
                                     :active-info="activeInfo"
                                     v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
            </div>
            <div class="dress-item-div">
                <main-equipment-icon equipment-type="hair_d" item-type="dresss"
                                     :active-info="activeInfo"
                                     v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
            </div>
            <div class="dress-item-div">
                <main-equipment-icon equipment-type="cap_d" item-type="dresss"
                                     :active-info="activeInfo"
                                     v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
            </div>
            <div class="dress-item-div">
                <main-equipment-icon equipment-type="face_d" item-type="dresss"
                                     :active-info="activeInfo"
                                     v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
            </div>
            <div class="dress-item-div">
                <main-equipment-icon equipment-type="aura_d" item-type="dresss"
                                     :active-info="activeInfo"
                                     v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
            </div>
            <div class="dress-item-div">
                <main-equipment-icon equipment-type="neck_d" item-type="dresss"
                                     :active-info="activeInfo"
                                     v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
            </div>
            <div class="dress-item-div">
                <main-equipment-icon equipment-type="coat_d" item-type="dresss"
                                     :active-info="activeInfo"
                                     v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
            </div>
            <div class="dress-item-div">
                <main-equipment-icon equipment-type="skin_d" item-type="dresss"
                                     :active-info="activeInfo"
                                     v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
            </div>
            <div style="width: 53px;height:53px"></div>
            <div class="dress-item-div">
                <main-equipment-icon equipment-type="belt_d" item-type="dresss"
                                     :active-info="activeInfo"
                                     v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
            </div>
            <div class="dress-item-div">
                <main-equipment-icon equipment-type="pants_d" item-type="dresss"
                                     :active-info="activeInfo"
                                     v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
            </div>
            <div class="dress-item-div">
                <main-equipment-icon equipment-type="shoes_d" item-type="dresss"
                                     :active-info="activeInfo"
                                     v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
            </div>
        </div>
    </div>
</template>

<script>
    import MainEquipmentIcon from "@/components/simulator_page/main_role_info/MainEquipmentIcon";

    export default {
        name: "DressSelectDiv",
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
    .DressSelectDiv {
        width: 520px;
        height: 323px;
        margin-bottom: 5px;
    }

    .dress-items-div {
        margin-left: 250px;
        margin-top: 60px;
        height: 165px;
        width: 220px;
    }

    .dress-item-div {
        width: 53px;
        height: 53px;
    }

</style>