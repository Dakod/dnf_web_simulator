<template>
    <div v-show="visible" class="Modal">
        <CommonDialog class="dialog" :title="title" :style="styleObject">
            <slot></slot>
            <div class="btn-footer">
                <slot name="footer"/>
            </div>
        </CommonDialog>
    </div>
</template>

<script>
    export default {
        name: "Modal",
        props: ["title", "width", "height", "visible"],
        data() {
            return {
                styleObject: {
                    width: this.width,
                    height: this.height
                }
            }
        },
        methods: {},
        watch: {
            visible: function (val) {
                if (val === true) {
                    document.getElementById("modal-wrapper").style.display = "unset";
                    document.body.style.overflow = "hidden";
                } else {
                    document.getElementById("modal-wrapper").style.display = "none";
                    document.body.style.overflow = "unset";
                }
            }
        }
    }
</script>

<style scoped>
    .Modal {
        position: fixed;
        z-index: 2002;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
        margin: 0;
    }

    .dialog {
        position: relative;
        margin-left: auto;
        margin-right: auto;
        margin-top: 8vh;
    }

</style>