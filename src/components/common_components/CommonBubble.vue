<template>
    <div class="CommonBubble">
        <div class="bubble p-2" :class="[position]">
            <div class="bubble-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CommonBubble",
        props: {
            position: {
                type: String,
                default: "right_top"
            }
        }
    }
</script>

<style scoped>
    .CommonBubble {
        z-index: 14;
        width: 100%;
        /*height: 100%;*/
        /*height: 200px;*/
        border: rgba(96, 76, 45, 0.89) solid 2px;
        border-radius: 5px;
        background-color: rgba(0, 0, 0, 0.71);
        background-size: 100% 100%;
    }
    .bubble-content{
        border: 2px solid rgba(160, 160, 160, 0.22);
    }

    .bubble {
        position: relative;
        width: 100%;
        /*height: 100%;*/
    }

    .bubble::before {
        content: '';
        width: 0;
        height: 0;
        border: 12px solid;
        position: absolute;
        border-color: transparent transparent rgba(96, 76, 45, 0.89) transparent;
        pointer-events: none;
    }

    .bubble::after {
        content: '';
        width: 0;
        height: 0;
        border: 8px solid;
        position: absolute;
        border-color: transparent transparent rgba(0, 0, 0, 0.71) transparent;
        pointer-events: none;
    }

    /*右上*/
    .right_top::before {
        right: 10px;
        top: -24px;
    }

    .right_top::after {
        right: 14px;
        top: -16px; /*上面的+8*/
    }

    /*左下*/
    .left_bottom::before {
        left: 10px;
        bottom: -24px;
        border-color: rgba(96, 76, 45, 0.89) transparent transparent transparent;
    }

    .left_bottom::after {
        left: 14px;
        bottom: -16px; /*上面的+8*/
        border-color: rgba(0, 0, 0, 0.71) transparent transparent transparent;
    }

    /*左上*/
    .left_top::before {
        left: 10px;
        top: -24px;
    }

    .left_top::after {
        left: 14px;
        top: -16px; /*上面的+8*/
    }

    /*右下*/
    .right_bottom::before {
        right: 10px;
        bottom: -24px;
        border-color: rgba(96, 76, 45, 0.89) transparent transparent transparent;
    }

    .right_bottom::after {
        right: 14px;
        bottom: -16px; /*上面的+8*/
        border-color: rgba(0, 0, 0, 0.71) transparent transparent transparent;
    }

    /*上中*/
    .mid_top::before {
        left: 0;
        right: 0;
        top: -24px;
        margin-left: auto;
        margin-right: auto;
    }

    .mid_top::after {
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        top: -16px; /*上面的+8*/
    }

    /*下中*/
    .mid_bottom::before {
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        bottom: -24px;
        border-color: rgba(96, 76, 45, 0.89) transparent transparent transparent;
    }

    .mid_bottom::after {
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        bottom: -16px; /*上面的+8*/
        border-color: rgba(0, 0, 0, 0.71) transparent transparent transparent;
    }


</style>