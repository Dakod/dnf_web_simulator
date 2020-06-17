<template>
    <div class="CommonTabBar d-flex">
        <div :class="{active: isActive(index)}" class="capsule" v-for="(item, index) in list" :key="index"
         @click="selectActive(index)">
            <label class="my-label">{{item}}</label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CommonTabBar",
        props:['list',"activeIndex"],
        data:function () {
            return{
                active : this.activeIndex
            }
        },
        methods:{
            isActive: function(index){
                return index == this.active;
            },
            selectActive:function (index) {
                this.active = index;
                this.$emit("tabChange",index);
            }
        }
    }
</script>

<style scoped>
    .capsule{
        padding-left: 20px;
        padding-right: 20px;
        background-image: url("../../assets/UI/image/tab_background_normal.png");
        background-size: 100% 100%;
        cursor: pointer;
        margin-right: 2px;
    }
    .capsule:hover{
        background-image:url("../../assets/UI/image/tab_background_enter.png"),url("../../assets/UI/image/tab_background_normal.png");
    }
    .capsule label{
        margin-bottom: 0px;
        margin-top: 7px;
        cursor: pointer;
    }
    .active{
        background-image: url("../../assets/UI/image/tab_background_active.png");
        cursor: default;
    }
    .active:hover{
        background-image: url("../../assets/UI/image/tab_background_active.png");
    }
    .active label{
        cursor: default;
    }
    .CommonTabBar{
        padding-left: 20px;
        padding-right: 20px;
        height: 35px;
        margin-top: 3px;
        margin-bottom: 3px;
    }

</style>