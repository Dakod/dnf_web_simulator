<template>
    <div class="EquipmentSelectDialog" @click="focus='-1'">
        <common-dialog :title="myUtils.getSelectDialogTitle(equipmentType,itemType)">
            <div id="equipment-info-div" class="d-flex w-100">
                <img class="defaultImg" v-show='shouldShowDefaultIcon'
                     :src="require('@/assets/UI/image/'+equipmentType+'.png')" alt="">
                <equipment-item style="width: 53px;height: 53px;" v-show='!shouldShowDefaultIcon'
                                :item-type="itemType"
                                :equipment-node="roles.role[itemType][equipmentType].xmlNode"
                                @click.native="takeOfEquipment"/>
                <div class="w-100 d-flex flex-wrap">
                    <label class="w-100 equipment-name-label"
                           :class="[curEquipmentGrade+'-text']">{{curEquipmentName}}</label>
                    <label class="w-100 equipment-suit-label">
                        {{curEquipmentSuitName}}
                    </label>
                </div>
                <div class="d-flex flex-wrap edit-btn-div position-relative">
                    <div style="height: 26px;width: 26px">
                        <common-button @click.stop.native="focus=(focus==='0'? '-1' : '0')"
                                       v-show="shouldShowEquipmentEditBtn()"
                                       name="info"
                                       class="edit-btn" title="装备详细设置"/>
                        <equipment-edit-dialog v-if="shouldShowEquipmentEditBtn()" :parentFocus.sync="focus" index="0"
                                               :equipment="roles.role[itemType][this.equipmentType]"/>
                    </div>
                    <div style="height: 26px;width: 26px">
                        <common-button @click.stop.native="focus=(focus==='1'? '-1' : '1')"
                                       v-show="shouldShowSuitEditBtn()" name="info" class="edit-btn"
                                       title="套装详细设置"/>
                        <suit-edit-dialog v-if="shouldShowSuitEditBtn()" :parentFocus.sync="focus" index="1"
                                          :equipment="roles.role[itemType][this.equipmentType]"/>
                    </div>
                </div>
            </div>
            <div v-if="(itemType==='equipments'||equipmentType==='medal')"
                 class="d-flex align-items-center py-1 w-100 justify-content-between">
                <span v-if="equipmentType!=='title'">
                    <label class="my-label">强化/增幅:</label>
                    <common-input @input="updateRole(roles.role)" min-num="0" max-num="20" type="number" index="2"
                                  :focus.sync="focus"
                                  v-model="roles.role[itemType][equipmentType].strengthenNum"
                                  class="my-input" style="width: 40px"/>
                </span>
                <span v-if="equipmentType==='weapon'">
                    <label class="my-label">锻造:</label>
                    <common-input @input="updateRole(roles.role)" min-num="0" max-num="8" type="number" index="13"
                                  :focus.sync="focus"
                                  v-model="roles.role[itemType][equipmentType].forgingNum"
                                  class="my-input" style="width: 40px"/>
                </span>
                <span v-if="equipmentType!=='medal' && equipmentType !=='title'">
                    <label class="my-label">类型:</label>
                    <common-select @input="updateRole(roles.role)"
                                   :focus.sync="focus" index="3"
                                   v-model="roles.role[itemType][equipmentType].amplitudetype"
                                   style="width: 120px;height: 34px" :list="amplitudeTypeList"/>
                </span>
            </div>
            <div v-if="itemType==='equipments' || equipmentType==='pet'" class="d-flex align-items-center py-1 w-100">
                <label class="my-label">附魔:</label>
                <common-select @input="updateRole(roles.role)"
                               class="w-100" :focus.sync="focus" has-null="true"
                               v-model="roles.role[itemType][equipmentType].enchantingId" index="4"
                               input-color="#68EDA1" select-color="#68EDA1" style="height: 34px;"
                               :list="enchantingList"/>
            </div>

            <div v-if="itemType==='dresss'||equipmentType==='medal'" class="d-flex align-items-center py-1 w-100">
                <label class="my-label">属性:</label>
                <common-select @input="updateRole(roles.role)"
                               class="w-100" :focus.sync="focus" has-null="true"
                               v-model="roles.role[itemType][equipmentType].propertyId" index="5"
                               style="height: 34px;"
                               :list="getDressPropertyList"/>
            </div>

            <div v-if="myUtils.shouldShowBadgeSelect(equipmentType,0)" class="d-flex align-items-center py-1 w-100">
                <label class="my-label">徽章:</label>
                <div class="d-flex">
                    <common-select @input="updateRole(roles.role)"
                                   v-model="roles.role[itemType][equipmentType].badge.badge1" :focus.sync="focus"
                                   index="6"
                                   has-null="true"
                                   style="height: 34px;"
                                   :list="badgeList"/>
                    <common-select @input="updateRole(roles.role)"
                                   v-if="myUtils.shouldShowBadgeSelect(equipmentType,1)"
                                   v-model="roles.role[itemType][equipmentType].badge.badge2" :focus.sync="focus"
                                   index="7"
                                   has-null="true"
                                   style="height: 34px;"
                                   :list="badgeList"/>
                </div>
            </div>

            <div v-if="itemType==='talismans'" class="d-flex align-items-center py-1 w-100">
                <label class="my-label">符文类型:</label>
                <div class="d-flex">
                    <common-select @input="updateRole(roles.role)"
                                   v-model="roles.role.talismans[equipmentType].rune1.type"
                                   :focus.sync="focus" index="8"
                                   style="height: 34px;"
                                   :list="runeTypeMap(1)"/>
                    <common-select @input="updateRole(roles.role)"
                                   v-model="roles.role.talismans[equipmentType].rune2.type"
                                   :focus.sync="focus" index="9"
                                   style="height: 34px;"
                                   :list="runeTypeMap(2)"/>
                    <common-select @input="updateRole(roles.role)"
                                   v-model="roles.role.talismans[equipmentType].rune3.type"
                                   :focus.sync="focus" index="10"
                                   style="height: 34px;"
                                   :list="runeTypeMap(3)"/>
                </div>
            </div>
            <div v-show="itemType==='equipments'" class="w-100 align-items-center mt-1 search-div">
                <common-button @click.native="changeKeyWord()" name="search" class="search-btn"/>
                <common-input @input="customKeyWord=$event" @keypress.enter.native="changeKeyWord()"
                              :value="roles.role.keyWord" index="11" :focus.sync="focus"
                              class="w-100 search-input"
                              placeholder="输入装备或套装名称"/>
            </div>

            <div id="equipment-bar-div" class="mx-auto mt-2 my-scroll ">
                <div id="equipment-bar" class="d-flex flex-wrap align-content-start">
                    <template v-for="(item,name) in equipmentList">
                        <equipment-item style="width: 53px;height: 53px;" :key="name"
                                        :has-filter="itemType==='equipments'?'true':'false'"
                                        :equipment-node="item"
                                        :item-type="itemType"
                                        @click.native="selectEquipment(item)">
                        </equipment-item>
                    </template>
                </div>
            </div>
        </common-dialog>
    </div>

</template>

<script>
    import EquipmentItem from "@/components/EquipmentItem";
    import EquipmentEditDialog from "@/components/simulator_page/dialogs/EquipmentEditDialog";
    import SuitEditDialog from "@/components/simulator_page/dialogs/SuitEditDialog";

    export default {
        name: "EquipmentSelectDialog",
        inject: ['roles'],
        props: ['equipmentType', 'itemType'],
        data: function () {
            return {
                amplitudeTypeList: {
                    "null": "强化",
                    "Strength": "增幅:力量",
                    "Intelligence": "增幅:智力"
                },
                enchantingList: this.getEnchantingList(),
                badgeList: this.getBadgeList(),
                focus: "", //当前焦点在哪个input组件,
                customKeyWord: ""
            }
        },
        beforeUpdate() {
            // console.log("beforeupdate")
            // this.role.updateRole("EquipmentSelectDialog");
        },
        computed: {
            curEquipmentName: function () {
                let node = this.roles.role[this.itemType][this.equipmentType].xmlNode;
                if (node === null) return "";
                return this.$(node).children("Name").text();
            },
            curEquipmentGrade: function () {
                let node = this.roles.role[this.itemType][this.equipmentType].xmlNode;
                if (node === null) return "";
                return this.$(node).children("Grade").text();
            },
            curEquipmentSuitName: function () {
                let node = this.roles.role[this.itemType][this.equipmentType].xmlNode;
                if (node === null) return "";
                if (this.itemType === 'equipments')
                    return this.xmlReader.getMainSuitName(this.$(node).attr('id'));
                else if (this.itemType === 'talismans')
                    return this.$(node).children("Skill").text();
                return "";
            },
            shouldShowDefaultIcon: function () {
                return this.roles.role[this.itemType][this.equipmentType].equipmentId == null;
            },
            equipmentList: function () {
                if (this.itemType === 'talismans')
                    return this.xmlReader.getAllTypeTalismanInfo(this.roles.role.occupationId);
                else
                    return this.xmlReader.getAllTypeItemInfo(this.equipmentType, this.itemType);
            },
            getDressPropertyList: function () {
                return this.myUtils.getDressAndMedalPropertyMap(this.roles.role[this.itemType][this.equipmentType].xmlNode);
            },
        },
        mounted() {
        },
        components: {
            EquipmentItem,
            EquipmentEditDialog,
            SuitEditDialog
        },
        methods: {
            selectEquipment: function (item) {
                this.$emit('equipmentChange', item);
            },
            takeOfEquipment: function () {
                this.roles.role[this.itemType][this.equipmentType].setXMLNode(null);
                this.roles.role.updateRole();
            },
            getBadgeList: function () { //获取附魔的列表
                return this.myUtils.getBadgeMap(this.equipmentType);
            },
            shouldShowEquipmentEditBtn: function () {
                let node = this.roles.role[this.itemType][this.equipmentType].xmlNode;
                if (node == null) {
                    return false;
                }
                return this.$(node).attr('editable') === 'true';
            },
            shouldShowSuitEditBtn: function () {
                let node = this.roles.role[this.itemType][this.equipmentType].xmlNode;
                if (node == null) {
                    return false;
                }
                return this.xmlReader.getSuitInfo(this.$(node).attr('suit')).attr('editable') === 'true';
            },
            changeKeyWord() {
                this.roles.role.keyWord = this.customKeyWord;
            },
            getEnchantingList: function () { //获取附魔的列表
                return this.myUtils.getEnchantingMap(this.equipmentType);
            },
            runeTypeMap: function (index) {
                return this.myUtils.getRuneTypeMap(this.equipmentType, index, this.roles.role)
            },
        }
    }
</script>

<style scoped>
    .EquipmentSelectDialog {
        width: 480px;

        z-index: 12;
        cursor: default;
    }

    .common-dialog {
        width: 480px;
    }

    .search-div {
        display: flex;
    }

    .edit-btn-div {
        width: 26px;
    }

    .edit-btn {
        width: 26px;
        height: 26px;
    }

    .search-btn {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        flex-shrink: 0;
    }

    .search-input {
        text-align: left;
    }

    .defaultImg {
        width: 53px;
        height: 53px;
        flex-shrink: 0;
    }

    .equipment-name-label {
        margin-bottom: 0;
        margin-left: 10px;
    }

    .equipment-suit-label {
        color: #78FF1E;
        margin-bottom: 0;
        margin-left: 10px;
    }

    #equipment-bar-div {
        height: 159px;
        background-image: url("../../../assets/UI/image/blackbglighter.png");
        overflow-x: hidden;
        overflow-y: auto;
    }

    #equipment-info-div {
        height: 53px;
        margin-bottom: 5px;
    }

    #equipment-bar {
        min-height: 150px;
        /*height: 300px;*/
    }

    .my-label {
        flex-shrink: 0;
    }
</style>