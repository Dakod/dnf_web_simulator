<template>
    <div class="BuffSkillEditDialog" v-show="activeInfo==='buff'" @click="focus='-1'">
        <common-dialog title="Buff强化">
            <div class="skill-info-div d-flex w-100">
                <img class="defaultImg"
                     :src="require('@/assets/UI/image/skillIcon/' + skillId.slice(0, 2) + '/' +
                     parseInt(skillId.slice(3)) + '.png')">
                <div class="w-100 d-flex flex-wrap">
                    <label class="w-100 buff-skill-name-label">
                        {{$(buffSkill.xmlNode).children('Name').text() + " (Lv." + buffSkill.skillLevel+")"}}
                    </label>
                    <label class="w-100 rune-suit-label">
                        {{"当前数值:" + myUtils.getBuffSkillValue($(buffSkill.xmlNode),buffSkill) + "%"}}
                    </label>
                </div>
            </div>
            <div class="d-flex align-items-center py-1 w-100">
                <label class="my-label">属性:</label>
                <common-select @input="updateRole(roles.role)"
                               class="w-100" :focus.sync="focus"
                               index="0"
                               style="height: 34px;"
                               v-model="roles.role.skills[skillId].version"
                               :list="buffSelectionMap"/>
            </div>

            <div id="skill-edit-div" class="mx-auto mt-2 my-scroll ">

            </div>
        </common-dialog>
    </div>
</template>

<script>
    export default {
        name: "BuffSkillEditDialog",
        inject: ['roles'],
        props: ['activeInfo'],
        data: function () {
            return {
                focus: "", //当前焦点在哪个input组件
            }
        },
        computed: {
            skillId() {
                return this.roles.role.buffSkillId;
            },
            buffSkill() {
                return this.roles.role.skills[this.roles.role.buffSkillId];
            },
            buffSelectionMap: function () {
                let map = {};
                let that = this;
                this.buffSkill.xmlNode.children("Property").each(function () {
                    let index = that.$(this).attr("index");
                    map[index] = that.$(this).attr("title");
                });
                return map;
            }
        },
        components: {},
        methods: {}
    }
</script>

<style scoped>
    .BuffSkillEditDialog {
        width: 480px;
        position: absolute;
        left: 30px;
        top: -150px;
        z-index: 12;
        cursor: default;
    }

    .common-dialog {
        width: 480px;
    }

    .edit-btn-div {
        width: 26px;
    }

    .edit-btn {
        width: 26px;
        height: 26px;
    }

    .defaultImg {
        width: 53px;
        height: 53px;
        flex-shrink: 0;
    }

    .buff-skill-name-label {
        margin-bottom: 0;
        margin-left: 10px;
        color: #E7C754;
    }

    .rune-suit-label {
        color: #78FF1E;
        margin-bottom: 0;
        margin-left: 10px;
    }

    #rune-bar-div {
        height: 159px;
        background-image: url("../../../assets/UI/image/blackbglighter.png");
        overflow-x: hidden;
        overflow-y: auto;
    }

    #rune-info-div {
        height: 53px;
        margin-bottom: 5px;
    }

    #rune-bar {
        min-height: 150px;
        /*height: 300px;*/
    }

    .my-label {
        flex-shrink: 0;
    }
</style>