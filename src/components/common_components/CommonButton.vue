<template>
    <button class="CommonButton" :style="styleObject" @mouseenter="status='hover'" @mouseleave="status='normal'"
            @mousedown="status='press'" @mouseup="status='hover'">
        <slot/>
    </button>
</template>

<script>
    export default {
        name: "CommonButton",
        props: ["name", "disable"],
        data: function () {
            return {
                status: "normal",
            };
        },
        computed: {
            styleObject: function () {
                return {
                    "background-image": "url(" + require("@/assets/UI/image/" + this.name + "_btn_" + this.status + ".png") + ")",
                    "background-size": "100% 100%",
                }
            }
        }
    }
</script>

<style scoped>

    .CommonButton {
        background-color: transparent;
        border-color: transparent;
        color: #bca77d;
        padding: 0;
        border-width: 0;
        cursor: pointer;
        outline: none;
    }
    .CommonButton:active {
        padding-top: 3px;
    }

    .CommonButton:focus {
        outline: none;
    }
</style>