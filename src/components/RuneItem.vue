<template>
    <div class="rune-item-mask">
        <div class="rune-item" :title="getRuneName()">
            <div :class='[runeGrade]' class="rune-mask"></div>
            <img v-if="skillId!=null" class="rune-icon" :src='getItemImgUrl()'>
        </div>
    </div>
</template>

<script>
    export default {
        name: "RuneItem",
        props: ['runeType', 'runeGrade', 'skillId'],
        methods: {
            getItemImgUrl: function () {
                return require("@/assets/UI/image/skillIcon/" + this.skillId.slice(0, 2) + "/" + this.runeType + "/" +
                    parseInt(this.skillId.slice(3)) + ".png");
            },
            getRuneName: function () {
                return this.myUtils.getRuneName(this.runeType, this.skillId);
            }
        }
    }
</script>

<style scoped>

    .rune-item-mask {
        padding: 2px;
        /*width: 53px;*/
        /*height: 53px;*/
        width: 100%;
        height: 100%;
        cursor: pointer;
        flex-shrink: 0;
    }

    .rune-item {
        padding: 2px;
        position: relative;
    }

    .rune-mask {
        position: absolute;
        background-image: url("../assets/UI/image/item_bg.png");
        background-size: 100% 100%;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .rune-icon {
        width: 100%;
        height: 100%;
    }

    .normal {
        background-image: url("../assets/UI/image/itemmask_normal_rune.png");
    }

    .senior {
        background-image: url("../assets/UI/image/itemmask_senior_rune.png");
    }

    .rare {
        background-image: url("../assets/UI/image/itemmask_rare_rune.png");
    }
</style>