<template>
    <div class="CommonSelect">
        <input :style="{color:inputColor}" :value="selectedVal" readonly v-on:click.stop="onInputClicked">
        <ul v-show='isShow && (focus===index)' class="my-scroll">
            <li v-if="hasNull" :style="{color:selectColor}" v-on:click.stop='selectLi("null")'>无</li>
            <li :style="{color:selectColor}" v-for='(val, key) in list' :key="key" v-on:click.stop='selectLi(key)'>
                {{val}}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "CommonSelect",
        data: function () {
            return {
                isShow: false,
                myValue: this.value
            }
        },
        props: {
            list: Object,
            value: [String, Number],
            inputColor: {
                default: "white"
            },
            selectColor: {
                default: "#bca77d"
            },
            focus: {
                default: 0
            },
            index: {
                default: 0
            },
            hasNull: {
                default: false
            }
        },
        computed: {
            selectedVal: {
                get: function () {
                    if ((String(this.myValue) === "null") && (this.list['null'] === undefined))
                        return "无";
                    if (this.list[this.myValue] === undefined) { // 如果选择的值在list没定义，显然此时list被替换而value值没变 因该从list中选中一个值作为value
                        if (Object.keys(this.list).length === 0) {//list是空的
                            this.$emit('input', "null");
                            return "无";
                        }
                        for (let key in this.list) {
                            this.$emit('input', key);
                            return this.list[key];
                        }
                    }
                    return this.list[this.myValue];
                }
            }
        },
        watch: {
            focus: function () {
                if (this.focus !== this.index)
                    this.isShow = false;
            },
            value: function () {
                this.myValue = this.value;
            }
        },
        methods: {
            selectLi: function (key) {
                // this.selectedVal = this.list[key];
                this.isShow = false;
                this.myValue = key;
                this.$emit('input', key);
            },
            onInputClicked: function () {
                this.isShow = !this.isShow;
                this.$emit("update:focus", this.index);
            },
        }
    }
</script>

<style scoped>
    .CommonSelect {
        position: relative;
        display: inline-block;
    }

    .CommonSelect input {
        outline-style: none;
        border: 2px solid #78715b;
        /*background-color: black;*/
        /*color: white;*/
        border-radius: 7px;
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        background: url("../../assets/UI/image/select_normal.png") no-repeat right center, url("../../assets/UI/image/blackbg.png") repeat center;
        background-size: auto 100%;
        padding-left: 5px;
        padding-right: 30px;
        cursor: default;
        width: 100%;
        height: 34px;
        text-align: center;
    }

    .CommonSelect input:hover {
        background-image: url("../../assets/UI/image/select_hover.png"), url("../../assets/UI/image/blackbg.png");
    }

    .CommonSelect input:active {
        background-image: url("../../assets/UI/image/select_press.png"), url("../../assets/UI/image/blackbg.png");
    }

    .CommonSelect ul {
        position: absolute;
        list-style: none;
        top: 30px;
        width: 100%;
        padding: 0;
        z-index: 13;
        max-height: 300px;
        background-color: black;
        border: #4e555b solid 1px;
    }

    .CommonSelect ul li {
        text-align: center;
        /*color: #bca77d;*/
        background-image: url("../../assets/UI/image/blackbg.png");
        border: 3px solid transparent;
    }

    .CommonSelect ul li:hover {
        /*background-image: url("../../assets/UI/image/select_item_hover.png"), url("../../assets/UI/image/blackbg.png");*/
        background-size: 100% 100%;
        background-repeat: no-repeat;
        border-image: url("../../assets/UI/image/select_item_hover.png") 3 3 round;
    }
</style>