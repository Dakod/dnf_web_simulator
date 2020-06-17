<template>
    <div class="equipIcon" @click.stop="changeActiveEquipmentDialog()">
        <img src="@/assets/UI/image/lock.png" class="lock-img" style="display: none;">
        <img v-show='shouldShowDefaultIcon'
             :src="require('@/assets/UI/image/'+equipmentType+'.png')">

        <div class="suitMark" v-if='roles.role.suitMarkInfo[equipmentType]!=null && shouldShowSuitMark'>
            <img class="mx-auto"
                 :src="require('@/assets/UI/image/suit_mark_'+roles.role.suitMarkInfo[equipmentType]+'.png')">
        </div>
        <equipment-item v-show='!shouldShowDefaultIcon' :item-type="itemType"
                        :equipment-node='this.roles.role[itemType][equipmentType].xmlNode'/>

        <equipment-select-dialog v-show="activeInfo == equipmentType" :item-type="itemType"
                                 @equipmentChange='equipmentChange(equipmentType,itemType,$event)'
                                 :style="dialogStyleObject"
                                 :equipment-type="equipmentType"/>
    </div>
</template>

<script>
    import EquipmentItem from "@/components/EquipmentItem";
    import EquipmentSelectDialog from "@/components/simulator_page/dialogs/EquipmentSelectDialog";

    export default {
        name: "MainEquipmentIcon",
        props: ['equipmentType', 'activeInfo', "itemType", "checkChange","shouldShowSuitMark"],//itemType为大类 装备 时装 宠物 宠物装备等
        inject: ['roles'],
        data: function () {
            return {
                dialogStyleObject: {
                    position: "absolute",
                    top: "20px",
                    left: "20px"
                }
            }
        },
        computed:{
            shouldShowDefaultIcon(){
                return this.roles.role[this.itemType][this.equipmentType].equipmentId == null;
            }
        },
        methods: {
            equipmentChange: function (equipmentType, itemType, node) {
                if (this.checkChange !== undefined)
                    if (!this.checkChange(this.roles.role, node,this.equipmentType,this.itemType))  //验证能否更改装备
                        return;
                this.roles.role[itemType][equipmentType].setXMLNode(node);
                this.roles.role.updateRole();
            },
            changeActiveEquipmentDialog: function () {
                this.$emit('update:activeInfo', this.equipmentType);
            }
        },
        components: {
            EquipmentItem,
            EquipmentSelectDialog
        }
    }
</script>

<style scoped>
    .equipIcon {
        position: relative;
        /*width: 53px;*/
        /*height: 53px;*/
        width: 100%;
        height: 100%;

        margin-bottom: 0;
        margin-right: 0;
        cursor: pointer;
    }

    .equipIcon img:nth-child(2) {
        width: 100%;
        height: 100%;
    }

    .suitMark {
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 10;
        width: 49px;
        height: 49px;
    }
    .suitMark img{
        width: 100%;
        height: 100%;
    }


</style>