<template>
    <div class="PropertyDetailDialog" v-show="activeInfo==='propertyDetail'" @click="focus='-1'">
        <common-dialog title="词条信息">
            <div class="property-detail-div">
                <div v-for="(value,key) in roles.role.upList" class="property-detail-item" :key="key">
                    <label :class="[key]" class="my-label">{{myUtils.propertyNameMap[key] +
                        ":"}}</label>
                    <label class="value-label">{{myUtils.toFixed(value,1) + "%"}}</label>
                </div>
                <div class="property-detail-item">
                    <label class="total my-label">估计提升:</label>
                    <label class=" value-label">{{totalBuffValue + "%"}}</label>
                </div>
                <div class="w-100 property-detail-item-full">
                    <label class="score my-label">最终得分(攻击力*增益):</label>
                    <label class=" value-label">{{score.toLocaleString()}}</label>
                </div>
            </div>

        </common-dialog>
    </div>
</template>

<script>
    export default {
        name: "PropertyDetailDialog",
        inject: ['roles'],
        props: ['activeInfo'],
        computed: {
            totalBuffValue() {
                return this.myUtils.toFixed(this.myUtils.getTotalBuffValue(this.roles.role) * 100, 1);
            },
            score() {
                return parseInt(this.myUtils.getFinalScore(this.roles.role));
            },
        },
        data: function () {
            return {
                focus: "", //当前焦点在哪个input组件
            }
        },
    }
</script>

<style scoped>
    .PropertyDetailDialog {
        position: absolute;
        top: -300px;
        width: 450px;
        z-index: 13;
    }

    .property-detail-div {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .property-detail-item {
        width: 45%;
        display: flex;
        justify-content: space-between;
    }

    .property-detail-item-full {
        display: flex;
        justify-content: space-between;
    }

    .value-label {
        color: white;
        margin-bottom: 0;
    }

    .Yellow, .ExtraYellow {
        color: yellow;
    }

    .CritDamage, .ExtraCrit {
        color: orange;
    }

    .PropertyWhite {
        background-image: linear-gradient(to left bottom, red, #29d5ff, #ffee00, #b309ff);
        color: transparent;
        -webkit-background-clip: text;
        /*-moz-background-clip: text;*/
        -ms-background-clip: text;
    }

    .White {
        color: white;
    }

    .total {
        color: lawngreen;
    }

    .score {
        color: red;
    }
</style>