<template>
    <div class="PropInfoWindow d-flex flex-wrap p-1">
        <div @click="toggleProp($(item).attr('id'))" class="prop-item-mask" v-for="item in propsList"
             :key="$(item).attr('id')">
            <div :class='[$(item).find("Grade").text()]' class="prop-item" :title="$(item).find('Name').text()">
<!--                <img class="item-hover-mask" :src="require('../assets/UI/image/item_hover_mask.png')">-->
                <img :class='{"gray-img": shouldImgGray(item)}' class="prop-item-img"
                     :src="require('@/assets/UI/props/'+$(item).attr('id')+'.png')">
            </div>
        </div>
        <div class="prop-item-mask" v-for="i in remainNum" :key="'empty'+ i">
            <div class="prop-item empty">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PropInfoWindow",
        props: ["propsList"],
        inject: ["roles"],
        data: function () {
            return {
                numOfPerLine: 10 //每行有几个消耗品，需要根据大小数一数
            }
        },
        computed: {
            propIconNum: function () {
                return this.propsList.length;
            },
            remainNum: function () {
                return this.numOfPerLine - this.propIconNum % this.numOfPerLine
            }
        },
        methods: {
            shouldImgGray: function (item) {
                return !this.roles.role.props[this.$(item).attr('id')];
            },
            toggleProp: function (propId) {
                const isActive = this.roles.role.props[propId];
                if (isActive) {
                    this.roles.role.props[propId] = false;
                } else {
                    this.$set(this.roles.role.props, propId, true);
                }
                this.roles.role.updateRole("PropInfoWindow");
            }
        }
    }
</script>

<style scoped>
    .PropInfoWindow {

    }

    .prop-item {
        width: 100%;
        height: 100%;
        padding: 1px;
        cursor: pointer;
        background-image: url("../../../assets/UI/image/prop_bg.png");
        background-size: 100% 100%;
    }

    .prop-item-img {
        width: 100%;
        height: 100%;
    }

    .prop-item-mask {
        width: 49px;
        height: 49px;
        padding: 2px;
        position: relative;
    }

    /*.item-hover-mask {*/
    /*    position: absolute;*/
    /*    top: 0;*/
    /*    left: 0;*/
    /*    display: none;*/
    /*    width: inherit;*/
    /*    height: inherit;*/
    /*}*/


    .empty {
        cursor: default;
    }

    .normal {
        background-image: url("../../../assets/UI/image/itemmask_normal.png"), url("../../../assets/UI/image/prop_bg.png");
    }

    .senior {
        background-image: url("../../../assets/UI/image/itemmask_senior.png"), url("../../../assets/UI/image/prop_bg.png");
    }

    .rare {
        background-image: url("../../../assets/UI/image/itemmask_rare.png"), url("../../../assets/UI/image/prop_bg.png");
    }


    .artifact {
        background-image: url("../../../assets/UI/image/itemmask_artifact.png"), url("../../../assets/UI/image/prop_bg.png");
    }

    .legend {
        background-image: url("../../../assets/UI/image/itemmask_legend.png"), url("../../../assets/UI/image/prop_bg.png");
    }

    .epic {
        background-image: url("../../../assets/UI/image/itemmask_epic.png"), url("../../../assets/UI/image/prop_bg.png");
    }
</style>