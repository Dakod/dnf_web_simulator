<template>
    <div class="RuneSelectDialog" @click="focus='-1'">
        <common-dialog :title="'符文设置'">
            <div id="rune-info-div" class="d-flex w-100">
                <img class="defaultImg" v-show='shouldShowDefaultIcon()'
                     :src="require('@/assets/UI/image/'+curType+'.png')" alt="">
                <rune-item style="width: 53px;height: 53px;" v-show='!shouldShowDefaultIcon()'
                           :rune-type="curType"
                           :rune-grade="curRune.grade" :skill-id="curRune.skill"
                           @click.native="takeOfRune()"/>
                <div class="w-100 d-flex flex-wrap">
                    <label class="w-100 rune-name-label"
                           :class="[curRune.grade+'-text']">{{curName}}</label>
                    <label class="w-100 rune-suit-label">

                    </label>
                </div>
            </div>
            <div id="rune-bar-div" class="mx-auto mt-2 my-scroll ">
                <div id="rune-bar" class="d-flex flex-wrap align-content-start">
                    <template v-for="(skillId,index) in runeList">
                        <rune-item style="width: 53px;height: 53px;" :key="index + '-1'"
                                   :rune-type="curType" rune-grade="normal" :skill-id="skillId"
                                   @click.native="selectRune(skillId,'normal')">
                        </rune-item>
                        <rune-item style="width: 53px;height: 53px;" :key="index + '-2'"
                                   :rune-type="curType" rune-grade="senior" :skill-id="skillId"
                                   @click.native="selectRune(skillId,'senior')">
                        </rune-item>
                        <rune-item style="width: 53px;height: 53px;" :key="index + '-3'"
                                   :rune-type="curType" rune-grade="rare" :skill-id="skillId"
                                   @click.native="selectRune(skillId,'rare')">
                        </rune-item>
                    </template>
                </div>
            </div>
        </common-dialog>
    </div>

</template>

<script>
    import RuneItem from "@/components/RuneItem";

    export default {
        name: "RuneSelectDialog",
        inject: ['roles'],
        props: ['index'],
        data: function () {
            return {
                focus: "", //当前焦点在哪个input组件
            }
        },
        beforeUpdate() {
            // console.log("beforeupdate")
            // this.role.updateRole("RuneSelectDialog");
        },
        computed: {
            curRune: function () {
                return this.myUtils.getRuneByIndex(this.index, this.roles.role);
            },
            curType: function () {
                return this.curRune.type;
            },
            curGrade: function () {
                return this.curRune.grade;
            },
            curName: function () {
                return this.myUtils.getRuneName(this.curType, this.curRune.skill);
            },
            runeList() {
                return this.myUtils.getAllRune(this.roles.role.occupationId);
            }
        },
        components: {
            RuneItem,
        },
        methods: {
            shouldShowDefaultIcon: function () {
                return !this.curRune.hasSkill();
            },
            selectRune: function (skillId, grade) {
                let rune = this.myUtils.getRuneByIndex(this.index, this.roles.role);
                rune.skill = skillId;
                rune.grade = grade;
                this.updateRole(this.roles.role);
            },
            takeOfRune: function () {
                this.curRune.skill = null;
                this.updateRole(this.roles.role);
            },
        }
    }
</script>

<style scoped>
    .RuneSelectDialog {
        width: 480px;

        z-index: 14;
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

    .rune-name-label {
        margin-bottom: 0;
        margin-left: 10px;
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