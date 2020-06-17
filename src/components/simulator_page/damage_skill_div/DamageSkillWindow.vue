<template>
    <div class="DamageSkillWindow">
        <div class="window-title w-100">
            <label class="window-title-label">主动技能</label>
            <img src="@/assets/UI/image/window_title.png" class="w-100 h-100">
        </div>
        <div class="skill-table-div p-2">
            <el-table ref="skillTable" @sort-change="sortChange" :data="damageSkillList" style="width: 100%"
                      height="500"
                      class="my-border">
                <el-table-column fixed label="技能" width="70" header-align="center" align="center">
                    <template slot-scope="scope">
                        <div class="skill-icon-div">
                            <img :class='{"gray-img": scope.row.isDisable}' title="点击启用/禁用"
                                 class="skill-icon"
                                 :src="getSkillIconUrl(scope.row)"
                                 @click='toggleSkill(scope.row)'>
                            <skill-edit-btn-and-dialog :skill="scope.row"
                                                       v-if="$(scope.row.xmlNode).attr('hasDiffVer')==='true'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed label="技能名称" width="250" header-align="center" align="center">
                    <template slot-scope="scope">
                        <div class="skill-text t2">
                            {{ $(scope.row.xmlNode).attr("hasDiffVer") === 'true' ?
                            scope.row.getSkillNodeByVersion().attr('title')
                            : $(scope.row.xmlNode).children("Name").text() }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="等级" width="90" header-align="center" align="center">
                    <template slot-scope="scope">
                        <common-input-number @input="roles.role.updateRole()"
                                             :min="$(scope.row.xmlNode).children('MinLevel').text()- 0"
                                             :max="$(scope.row.xmlNode).children('LimitLevel').text() - 0"
                                             class="skill-level-input"
                                             v-model.number="scope.row.baseSkillLevel"/>
                    </template>
                </el-table-column>
                <el-table-column prop="skillLevel" label="实际等级" width="70" header-align="center" align="center">
                    <template slot-scope="scope">
                        <label class="real-skill-level-label mb-0">
                            {{scope.row.skillLevel}}
                        </label>
                    </template>
                </el-table-column>
                <el-table-column label="使用次数" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <common-input-number :min="1"
                                             class="skill-level-input"
                                             v-model.number="scope.row.times"/>
                    </template>
                </el-table-column>
                <el-table-column prop="total-damage" sortable :sort-method="sortByTotalDamage" label="总伤害" width="150"
                                 header-align="center"
                                 align="center">
                    <template slot-scope="scope">
                        <label class="total-damage">
                            {{(scope.row.singleDamage * scope.row.times).toLocaleString()}}
                        </label>
                    </template>
                </el-table-column>
                <el-table-column prop="average-damage" sortable :sort-method="sortByAverageDamage" label="平均伤害"
                                 width="150"
                                 header-align="center" align="center">
                    <template slot-scope="scope">
                        <label class="average-damage">
                            {{scope.row.singleDamage.toLocaleString()}}
                        </label>
                    </template>
                </el-table-column>
                <el-table-column label="占比" width="70" header-align="center" align="center">
                    <template slot-scope="scope">
                        <label class="percentage">
                            {{isNaN(scope.row.singleDamage * scope.row.times / totalDamage)?"0%" :
                            ((scope.row.singleDamage * scope.row.times / totalDamage * 100).toFixed(1) + "%")}}
                        </label>
                    </template>
                </el-table-column>
                <el-table-column label="CD" width="70" header-align="center" align="center">
                    <template slot-scope="scope">
                        <label class="percentage">
                            <!--                            {{myUtils.toFixed(scope.row.cd,2)}}-->
                            {{(scope.row.cd).toFixed(2)}}
                        </label>
                    </template>
                </el-table-column>
                <el-table-column prop="second-damage" sortable :sort-method="sortBySecondDamage" label="秒伤" width="150"
                                 header-align="center"
                                 align="center">
                    <template slot-scope="scope">
                        <label class="percentage">
                            {{parseInt(scope.row.singleDamage / scope.row.cd).toLocaleString()}}
                        </label>
                    </template>
                </el-table-column>
                <el-table-column prop="second-damage-sp" sortable :sort-method="sortBySecondDamageSp" label="秒伤/sp"
                                 width="150"
                                 header-align="center" align="center">
                    <template slot-scope="scope">
                        <label class="percentage">
                            {{getSecondDamageSp(scope.row)}}
                        </label>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import SkillEditBtnAndDialog from "@/components/simulator_page/SkillEditBtnAndDialog";

    export default {
        name: "DamageSkillWindow",
        inject: ["roles"],
        data: function () {
            return {
                isSortOn: false, //是否开启排序功能,
                sortBy: "",
                order: ""
            }
        },
        computed: {
            damageSkillList: function () {
                return Object.values(this.roles.role.skills).filter(skill =>
                    skill.xmlNode.attr("df") === "伤害" || skill.xmlNode.attr("df") === undefined
                );
                // return this.skillList.toArray().filter((skill) =>
                //     this.xmlReader.getAttributeValueWithDefault(this.$(skill), "df", "伤害") === "伤害"
                // );
            },
            totalDamage: function () {
                let totalDamage = 0;
                for (const skill of this.damageSkillList) {
                    totalDamage += skill.singleDamage * skill.times;
                }
                return totalDamage;
            }
        },
        methods: {
            toggleSkill: function (skill) {
                skill.isDisable = !skill.isDisable;
                this.roles.role.updateRole("DamageSkillWindow");
            },
            getSkillIconUrl(skill) {
                let id = skill.skillId;
                let suffix = $(skill.xmlNode).attr("hasDiffVer") === 'true' ?
                    "_" + skill.getSkillNodeByVersion().attr('index')
                    : "";
                suffix = suffix === "_0" ? "" : suffix;
                return require('@/assets/UI/image/skillIcon/' + id.slice(0, 2) + "/" +
                    parseInt(id.slice(3)) + suffix + ".png");
            },
            sortByTotalDamage(skill1, skill2) {
                return (skill1.singleDamage * skill1.times) - (skill2.singleDamage * skill2.times);
            },
            sortByAverageDamage(skill1, skill2) {
                return skill1.singleDamage - skill2.singleDamage;
            },
            sortBySecondDamage(skill1, skill2) {
                return (skill1.singleDamage / skill1.cd) - (skill2.singleDamage / skill2.cd);
            },
            sortBySecondDamageSp(skill1, skill2) {
                if (skill1.sp === 0) return 1;
                if (skill2.sp === 0) return -1;
                return this.getSecondDamageSp(skill1) - this.getSecondDamageSp(skill2);
            },
            sortChange(info) {
                this.sortBy = info.prop;
                this.order = info.order;
            },
            refreshSort() {
                if (this.sortBy === "") return;
                this.$refs.skillTable.sort(this.sortBy, this.order);
            },
            getSecondDamageSp(skill) {
                if (skill.sp === 0) return "∞";
                return parseInt(skill.singleDamage / skill.cd / (skill.sp * skill.baseSkillLevel)).toLocaleString()
            }

        },
        components: {
            SkillEditBtnAndDialog
        }

    }
</script>

<style scoped>
    .DamageSkillWindow {
        height: 555px;
    }

    /*对eltable的自定义*/
    >>> .el-table__row {
        background-color: rgba(64, 64, 64, 0);
        /*background-color: black;*/
    }

    >>> .el-table {
        background-color: unset;
        /*background-color: black;*/
    }

    /*.el-table__expanded-cell*/
    >>> .el-table th, >>> .el-table tr {
        /*background-color: unset;*/
        background-color: black;
    }

    >>> .el-table td, >>> .el-table th.is-leaf {
        /*border-bottom: 1px solid #a0a0a0;*/
        border-bottom: unset;
    }

    >>> .el-table__fixed::before {
        height: 0;
    }

    >>> .el-table::before {
        height: 0;
    }

    >>> .el-table tbody tr td {
        background-color: rgba(255, 255, 255, 0) !important
    }

    >>> .el-table .cell {
        padding: 0;
        overflow: unset;
    }

    >>> .el-table {
        font-size: 1rem;
    }

    >>> .el-table td, .el-table th {
        padding: 5px 0;
    }

    >>> .el-table__body-wrapper::-webkit-scrollbar-button:vertical:decrement {
        background-image: url("../../../assets/UI/image/scroll_up_normal.png");
        background-size: 100% 100%;
    }

    >>> .el-table__body-wrapper::-webkit-scrollbar-button:vertical:decrement:hover {
        background-image: url("../../../assets/UI/image/scroll_up_hover.png");
    }

    >>> .el-table__body-wrapper::-webkit-scrollbar-button:vertical:increment {
        background-image: url("../../../assets/UI/image/scroll_down_normal.png");
        background-size: 100% 100%;
    }

    >>> .el-table__body-wrapper::-webkit-scrollbar-button:vertical:increment:hover {
        background-image: url("../../../assets/UI/image/scroll_down_hover.png");
    }

    >>> .el-table__body-wrapper::-webkit-scrollbar-button:horizontal:decrement {
        background-image: url("../../../assets/UI/image/scroll_left_normal.png");
        background-size: 100% 100%;
    }

    >>> .el-table__body-wrapper::-webkit-scrollbar-button:horizontal:decrement:hover {
        background-image: url("../../../assets/UI/image/scroll_left_hover.png");
    }

    >>> .el-table__body-wrapper::-webkit-scrollbar-button:horizontal:increment {
        background-image: url("../../../assets/UI/image/scroll_right_normal.png");
        background-size: 100% 100%;
    }

    >>> .el-table__body-wrapper::-webkit-scrollbar-button:horizontal:increment:hover {
        background-image: url("../../../assets/UI/image/scroll_right_hover.png");
    }

    >>> .el-table__body-wrapper::-webkit-scrollbar {
        width: 10px;
        /*height: 10px;*/
    }

    >>> .el-table__body-wrapper::-webkit-scrollbar-thumb {
        border-radius: 3px;
        border: 2px solid #413422;
    }

    >>> .el-table__body-wrapper::-webkit-scrollbar-corner {
        background-color: black;
    }

    .my-scroll::-webkit-scrollbar-thumb {
        border-radius: 3px;
        border: 2px solid #413422;
    }

    /*table {*/
    /*    table-layout: fixed;*/
    /*    width: 100%;*/
    /*}*/

    /*tbody {*/
    /*    display: inline-block;*/
    /*    width: 100%;*/
    /*    height: 465px;*/
    /*}*/

    /*tr {*/
    /*    display: inline-block;*/
    /*    width: 100%;*/
    /*}*/

    /*td, th {*/
    /*    display: inline-block;*/
    /*}*/

    /*table th {*/
    /*    color: white;*/
    /*    text-align: center;*/
    /*}*/

    .window-title {
        height: 35px;
        position: relative;
    }


    /*.window-title-label {*/
    /*    color: #bca77d;*/
    /*    position: absolute;*/
    /*    left: 0;*/
    /*    right: 0;*/
    /*    top: 0;*/
    /*    bottom: 0;*/
    /*    margin: auto;*/
    /*    width: max-content;*/
    /*}*/


    .skill-text {
        color: white;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }


    .skill-icon {
        width: 40px;
        height: 40px;
        cursor: pointer;
        margin-left: 5px;
    }

    .skill-level-input {
        width: 40px;
    }

    .real-skill-level-label {
        width: 40px;
        text-align: center;
        color: #bca77d;
    }

    .total-damage, .average-damage, .percentage {
        color: white;
        text-align: right;
        width: 100%;
    }

    .skill-icon-div {
        display: flex;
    }

    .skill-edit-div {
        width: 20px;
        display: flex;
        align-items: center;
        margin-left: 3px;
    }

    .skill-edit-btn {
        width: 20px;
        height: 20px;
    }

    .sort_btn {
        cursor: pointer;
    }

    .sort_btn:hover {
        background-image: url("../../../assets/UI/image/select_item_hover.png");
        background-size: 100% 100%;
    }

</style>