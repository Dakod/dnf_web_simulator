<template>
    <div class="FastSettingDialog" v-show="activeInfo==='fastSettingDialog'" @click="focus='-1'">
        <common-dialog title="一键增幅">
            <div class="setting-div">
                <div>
                    <span>
                        <label class="my-label">类型:</label>
                        <common-select :focus.sync="focus" index="0"
                                       v-model="type"
                                       style="width: 120px;height: 34px" :list="amplitudeTypeList"/>
                    </span>
                    <span class="ml-5">
                            <label class="my-label">数值:</label>
                            <common-input min-num="0" max-num="20" type="number" index="1"
                                          :focus.sync="focus"
                                          v-model="num"
                                          class="my-input" style="width: 40px"/>
                    </span>
                </div>
                <common-button @click.native="applySetting" class="apply-button" name="primary">应用</common-button>
            </div>
        </common-dialog>
    </div>
</template>

<script>
    export default {
        name: "FastSettingDialog",
        inject: ['roles'],
        props: ['activeInfo'],
        data: function () {
            return {
                focus: "", //当前焦点在哪个input组件
                amplitudeTypeList: {
                    "null": "强化",
                    "Strength": "增幅:力量",
                    "Intelligence": "增幅:智力"
                },
                type: "null",
                num: 0
            }
        },
        methods: {
            applySetting() {
                this.roles.role.equipments.setStrengthen(this.type, this.num);
                this.roles.role.updateRole();
            }
        }
    }
</script>

<style scoped>
    .FastSettingDialog {
        position: absolute;
        top: -120px;
        width: 450px;
        z-index: 13;
    }

    .apply-button {
        width: 80px;
        height: 40px;
        margin-left: 30px;
    }

    .setting-div {
        display: flex;
        align-items: center;
    }
</style>