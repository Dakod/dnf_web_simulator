<!--//-->
<!--//-->
<template>
    <div class="common-dialog d-flex flex-wrap align-content-start">
        <!--         v-bind:style="{width:width+'px',height:height+'px'}">-->
        <div id="dialog-title">
            <label class="dialog-title-label">{{title}}</label>
            <img src="../../assets/UI/image/dialog_title_left.png">
            <img src="../../assets/UI/image/dialog_title_mid.png" style="flex-grow:1">
            <img src="../../assets/UI/image/dialog_title_right.png">
        </div>
        <div class="p-3 w-100">
            <slot></slot>
        </div>
    </div>
</template>


<script>


    export default {
        name: "CommonDialog",
        props: ['title'],
        // props: ["width", "height"],
        components: {}
    }
</script>


<style scoped>
    .common-dialog {
        border: 3px solid transparent;
        background-image: url("../../assets/UI/image/blackbglighter.png");
        border-image-source: url("../../assets/UI/image/dialog_bg.png");
        border-image-slice: 3;
        border-image-repeat: round;
    }

    #dialog-title {
        width: 100%;
        height: 34px;
        display: flex;
        position: relative;
    }

    #dialog-title img {
        height: 34px;
    }

    .dialog-title-label {
        color: #bca77d;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        /*width: 64px;*/
        height: 25px;
        text-align: center;
    }

</style>