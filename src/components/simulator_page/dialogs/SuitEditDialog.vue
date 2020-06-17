<template>
    <div v-if="hasEdit" @click.stop=""
         v-show="parentFocus===index"
         class="SuitEditDialog">
        <common-bubble position="right_top">
                <div class="edit-div">
                    <div class="edit-item p-1" v-for="(editItem,index) in EditTag"
                         :key="$(editItem).attr('index')">
                        <label class="my-label edit-title">{{$(editItem).attr('title')}}</label>
                        <common-select @input="updateRole(roles.role)"
                                       :list='myUtils.getEditSelectionMap(editItem)' :focus.sync="focus" value="0"
                                       :index="index"
                                       v-model="roles.role.suitInfo[suitId][$(editItem).attr('index')]"
                                       v-if="$(editItem)[0].tagName==='Selection'"/>
                        <!--                    <span v-if="$(editItem)[0].tagName==='Input'">-->
                        <!--                        <span class="my-label mr-1">{{inputPrefixSuffix($(editItem)).prefix}}</span>-->
                        <!--                        <common-input :focus.sync="focus" class="edit-input" :index="index"-->
                        <!--                                      v-model="equipment.editInfo[index.toString()]"/>-->
                        <!--                        <span class="my-label ml-1">{{inputPrefixSuffix($(editItem)).suffix}}</span>-->
                        <!--                    </span>-->
                    </div>
                </div>
        </common-bubble>
    </div>
</template>

<script>
    export default {
        name: "SuitEditDialog",
        props: ["equipment", "parentFocus", "index"],
        inject: ["roles"],
        beforeUpdate: function () {
            // this.roles.role.updateRole("SuitEditDialog");
        },
        created: function () {  //加载套装信息
            this.hasEdit = (this.equipment != null) &&
                (this.xmlReader.getSuitInfo(this.$(this.equipment.xmlNode).attr('suit')).attr('editable') === 'true');
            if (!this.hasEdit)
                return;
            //读取默认属性
            let curMap = this.roles.role.suitInfo[this.suitId];
            if (curMap === undefined) {
                this.$set(this.roles.role.suitInfo, this.suitId, {});
                curMap = this.roles.role.suitInfo[this.suitId];
            }
            let that = this;
            this.EditTag.each(function () {
                let index = that.$(this).attr('index');
                let defaultVal = that.$(this).attr('default');
                if (curMap[index] === undefined) {
                    that.$set(that.roles.role.suitInfo[that.suitId], index, defaultVal);
                }
            });
        },
        data: function () {
            return {
                focus: "-1", //当前焦点在哪个input组件
                hasEdit: false,
                suitId: this.$(this.equipment.xmlNode).attr('suit')
            }
        },
        computed: {
            EditTag: function () {
                return this.xmlReader.getSuitInfo(this.$(this.equipment.xmlNode).attr('suit')).find('Edit').children();
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
        }
    }
</script>

<style scoped>
    .SuitEditDialog {
        position: absolute;
        top: 64px;
        right: -10px;
        width: 400px;
        z-index: 14;
    }

    .edit-div {
        height: 100%;
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