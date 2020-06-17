<template>
    <div @click.stop="" v-if="equipment!=null && $(equipment.xmlNode).attr('editable')==='true'" v-show="parentFocus===index"
         class="EquipmentEditDialog">
        <common-bubble>
            <div class="edit-div">
                <div class="edit-item p-1" v-for="(editItem,index) in EditTag.children()"
                     :key="$(editItem).attr('index')">
                    <label class="my-label edit-title">{{$(editItem).attr('title')}}</label>
                    <common-select @input="roles.role.updateRole()"
                                   :list='myUtils.getEditSelectionMap(editItem)' :focus.sync="focus" value="0"
                                   :index="index"
                                   v-model="equipment.editInfo[index.toString()]"
                                   v-if="$(editItem)[0].tagName==='Selection'"/>
                    <span v-if="$(editItem)[0].tagName==='Input'">
                        <span class="my-label mr-1">{{inputPrefixSuffix($(editItem)).prefix}}</span>
                        <common-input-number @input="updateRole(roles.role)" type="number"
                                             :min="$(editItem).children().attr('min')-0"
                                             :max="$(editItem).children().attr('max')-0"
                                             :step="$(editItem).children().attr('step')-0"
                                             :focus.sync="focus" class="edit-input" :index="index"
                                             v-model.number="equipment.editInfo[index.toString()]"/>
                        <span class="my-label ml-1">{{inputPrefixSuffix($(editItem)).suffix}}</span>
                    </span>
                </div>
            </div>
        </common-bubble>
    </div>
</template>

<script>
    export default {
        name: "EquipmentEditDialog",
        props: ["equipment", "parentFocus", "index"],
        inject: ["roles"],
        beforeUpdate: function () {
            // this.role.updateRole("EquipmentEditDialog");
        },
        data: function () {
            return {
                focus: -1, //当前焦点在哪个input组件
            }
        },
        computed: {
            EditTag: function () {
                return this.$(this.equipment.xmlNode).find('Edit');
            },
            inputPrefixSuffix: function () {
                return function (editItem) {
                    let result = {};
                    let tagName = editItem.children()[0].tagName;
                    if (tagName === 'SkillLevel') {
                        let str = this.roles.role.nameMap["SkillLevel"];
                        let start = this.$(editItem).children().attr("start");
                        // let end = this.$(editItem).children().attr("end");
                        let condition = this.$(editItem).children().attr("condition");
                        let value = this.$(editItem).children().text();
                        str = str.replace("$0", start);
                        str = str.replace("$2", condition);
                        str = str.replace("$3", value);
                        result.prefix = str.split("$1")[0];
                        result.suffix = str.split("$1")[1];
                    } else {
                        result.prefix = this.roles.role.nameMap[editItem.children()[0].tagName].split("$0")[0];
                        result.suffix = this.roles.role.nameMap[editItem.children()[0].tagName].split("$0")[1];
                    }
                    return result;
                }
            }
        },
        methods: {

            // getInputDefaultValue:function (editItem) {
            //
            // }
        }
    }
</script>

<style scoped>
    .EquipmentEditDialog {
        position: absolute;
        z-index: 14;
        top: 38px;
        right: -10px;
        width: 400px;
        /*height: 200px;*/
        /*max-height: 200px;*/
    }

    .edit-div {
        height: 100%;
        /*max-height: 180px;*/
    }

    .edit-item {
        min-height: 40px;
        display: flex;
        align-items: center;
    }

    .edit-title {
        width: 150px;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .edit-input {
        min-width: 34px;
        max-width: 50px;
        height: 34px;
    }

</style>