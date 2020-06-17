<template>
    <div class="equipment-item-mask" v-if="shouldBeFiltered">
        <div :class='[getEquipmentGrade]' class="equipment-item"
             :title="getEquipmentName">
            <img v-if="equipmentNode!=null" class="equipment-icon" :src='getItemImgUrl'>
            <sprite-render v-if="getEquipmentGrade ==='myth' " class="sprite" frames="11" sprite-img="myth_effect"
                           time="1.3s"/>
        </div>
    </div>
</template>

<script>
    // import * as xmlReader from '../xmlReader'
    // import $ from 'jquery'

    export default {
        name: "EquipmentItem",
        inject: ['roles'],
        props: ["equipmentNode", "itemType", "hasFilter"],
        computed: {
            itemId: function () {
                return this.$(this.equipmentNode).attr("id");
            },
            getEquipmentGrade: function () {
                if (this.itemType !== undefined)//无用代码 以后
                    return this.$(this.equipmentNode).find("Grade").text();
                return "";
            },
            getEquipmentName: function () {
                return this.$(this.equipmentNode).find("Name").text();
            },
            currEquipmentId() {
                return this.$(this.equipmentNode).attr('id');
            },
            curEquipmentSuitName: function () {
                if (this.itemType === 'equipments')
                    return this.xmlReader.getMainSuitName(this.currEquipmentId);
                return "";
            },
            shouldBeFiltered() {
                if (this.hasFilter === undefined || this.hasFilter === "false")
                    return true;
                else {
                    if (this.roles.role.keyWord === "" || this.getEquipmentName.indexOf(this.roles.role.keyWord) !== -1) return true;
                    let suitName = this.curEquipmentSuitName;
                    if (suitName !== undefined && suitName !== "")
                        return suitName.indexOf(this.roles.role.keyWord) !== -1;
                    return false;
                }
            },
            getItemImgUrl: function () {
                if (this.itemType === 'talismans') {
                    return require("@/assets/UI/" + this.itemType + "Icon/" + "talisman_artifact.png");
                }
                if (this.itemType === 'equipments')
                    return require("@/assets/UI/equipmentsIcon/" + this.itemId.slice(0, 2) + "/" + this.itemId.slice(2, 4) + "/"
                        + parseInt(this.itemId.slice(4)) + ".png");
                return require("@/assets/UI/" + this.itemType + "Icon/" + this.itemId + ".png");
                // return require("@/assets/UI/" + this.itemType + "Icon/" + parseInt(this.itemId) + ".png");
            },
        },
        methods: {}
    }
</script>

<style scoped>
    .equipment-item-mask {
        padding: 2px;
        /*width: 53px;*/
        /*height: 53px;*/
        width: 100%;
        height: 100%;
        cursor: pointer;
        flex-shrink: 0;
    }

    .equipment-item {
        background-image: url("../assets/UI/image/item_bg.png");
        background-size: 100% 100%;
        padding: 1px;
        position: relative;
    }

    .equipment-icon {
        width: 100%;
        height: 100%;
    }

    .sprite {
        position: absolute;
        /*width: 47px;*/
        /*height: 47px;*/
        width: 90%;
        height: 90%;
        top: 5%;
        left: 5%;
        opacity: 0.7;
    }

    .normal {
        background-image: url("../assets/UI/image/itemmask_normal.png"), url("../assets/UI/image/item_bg.png");
    }

    .senior {
        background-image: url("../assets/UI/image/itemmask_senior.png"), url("../assets/UI/image/item_bg.png");
    }

    .rare {
        background-image: url("../assets/UI/image/itemmask_rare.png"), url("../assets/UI/image/item_bg.png");
    }

    .artifact {
        background-image: url("../assets/UI/image/itemmask_artifact.png"), url("../assets/UI/image/item_bg.png");
    }

    .legend {
        background-image: url("../assets/UI/image/itemmask_legend.png"), url("../assets/UI/image/item_bg.png");
    }

    .epic {
        background-image: url("../assets/UI/image/itemmask_epic.png"), url("../assets/UI/image/item_bg.png");
    }

    .myth {
        background-image: url("../assets/UI/image/itemmask_myth.png"), url("../assets/UI/image/item_bg.png");
    }


    .dress {
        background-image: url("../assets/UI/image/itemmask_dress.png"), url("../assets/UI/image/item_bg.png")
    }
</style>