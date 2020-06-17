<template>
    <div class="SpriteRender" ref="self">
        <div class="render-div" :style="styleObject">

        </div>
    </div>
</template>

<script>
    export default {
        name: "SpriteRender",
        props: ['spriteImg', 'frames', 'time', "scale"],
        data: function () {
            return {
                styleObject: {
                    "background-image": "url('" + require("@/assets/UI/Sprite/" + this.spriteImg + ".png") + "')",
                    "background-size": this.frames + "00% 100%",
                    "animation-duration": this.time,
                    "animation-timing-function": "steps(" + (parseInt(this.frames) - 1) + ")",
                    "padding-bottom": this.scale === undefined ? "100%" : parseFloat(this.scale) * 100 + "%"
                }
            };
        },
        mounted() {
        },
    }
</script>

<style scoped>
    .render-div {
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        background-repeat: no-repeat;
        animation-name: play;
        animation-delay: 0s;
        animation-iteration-count: infinite;
    }

    @keyframes play {
        0% {
            background-position: left;
        }
        100% {
            background-position: right;
        }
    }

</style>