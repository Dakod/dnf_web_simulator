<template>
    <div class="App">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <!--        <SimulatorPage/>-->
    </div>
</template>


<script>


    export default {
        name: 'App'
    }
</script>
<style scoped>
    .App {
        width: 100%;
        height: 100%;
    }
</style>
<style>

    .modal-wrapper {
        display: none;
        position: fixed;
        z-index: 2000;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
        margin: 0;
        opacity: .5;
        background: #000;
        width: 100%;
        height: 100%;
    }

    .my-input {
        outline-style: none;
        border: 2px solid #78715b;
        background-color: black;
        color: white;
        border-radius: 7px;
        padding: 3px 7px;
        text-align: center;
    }

    .my-label {
        color: #bca77d;
        margin-bottom: 0;
    }

    .my-select {
        outline-style: none;
        border: 2px solid #78715b;
        /*background-color: black;*/
        color: white;
        border-radius: 7px;
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        background: url("./assets/UI/image/select_normal.png") no-repeat right center, url("./assets/UI/image/blackbg.png") repeat center;
        background-size: auto 100%;
        padding-right: 30px;
    }

    .my-select:hover {
        background-image: url("./assets/UI/image/select_hover.png"), url("./assets/UI/image/blackbg.png");
    }

    .my-select option {
        background: url("./assets/UI/image/blackbg.png") no-repeat scroll right center;
    }

    .my-scroll {
        overflow-y: auto;
        overflow-x: hidden;
    }

    .my-scroll::-webkit-scrollbar-button:decrement {
        background-image: url("./assets/UI/image/scroll_up_normal.png");
        background-size: 100% 100%;
    }

    .my-scroll::-webkit-scrollbar-button:decrement:hover {
        background-image: url("./assets/UI/image/scroll_up_hover.png");
    }

    .my-scroll::-webkit-scrollbar-button:increment {
        background-image: url("./assets/UI/image/scroll_down_normal.png");
        background-size: 100% 100%;
    }

    .my-scroll::-webkit-scrollbar-button:increment:hover {
        background-image: url("./assets/UI/image/scroll_down_hover.png");
    }

    .my-scroll::-webkit-scrollbar-button:vertical:start:increment {
        display: none;
    }

    .my-scroll::-webkit-scrollbar-button:vertical:end:decrement {
        display: none;
    }

    .my-scroll::-webkit-scrollbar {
        width: 10px;
    }

    .my-scroll::-webkit-scrollbar-thumb {
        border-radius: 3px;
        border: 2px solid #413422;
    }

    .window-title-label {
        color: #bca77d;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 64px;
        /*width: max-content;*/
    }


    .gray-img {
        -webkit-filter: grayscale(100%);
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        filter: grayscale(100%);
    }

    .my-border {
        border: 2px solid #a0a0a038;
    }

    .normal-text {
        color: #FFFFFF;
    }

    .senior-text {
        color: #68D5ED;
    }

    .rare-text {
        color: #B36BFF;
    }

    .artifact-text {
        color: #FF00FF;
    }

    .legend-text {
        color: #FF7800;
    }

    .epic-text {
        color: #FFB400;
    }

    .myth-text {
        background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #F8C63D), color-stop(1, #CC66E7));
        color: transparent;
        -webkit-background-clip: text;
        /*-moz-background-clip: text;*/
        -ms-background-clip: text;
    }

    .dress-text {
        color: #B36BFF;
    }

</style>
