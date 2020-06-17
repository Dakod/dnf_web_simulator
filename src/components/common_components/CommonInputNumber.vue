<template>
    <el-input-number :min="min" :max="max" :controls="false" :step="step" step-strictly :value="value"
                     @input="onInput" @click.stop="$emit('update:focus',index)"
                     :placeholder="_placeholder"/>
</template>

<script>
    export default {
        name: "CommonInputNumber",
        // props: ["index", "focus", "step", "placeholder"],
        props: {
            step: {
                type: Number,
                default: 1
            },
            max: {
                type: Number,
                default: Infinity
            },
            min: {
                type: Number,
                default: -Infinity
            },
            index: Number,
            value: Number,
            focus: Number,
            placeholder: String
        },
        computed: {
            _placeholder: function () {
                return this.placeholder === undefined ? "" : this.placeholder;
            }
        },
        methods: {
            onInput: function (inputVal) {
                if (inputVal !== this.value)//值没有变化 不触发input
                    this.$emit('input', inputVal);
            }
        },
    }
</script>

<style>
    .el-input input {
        outline-style: none;
        border: 2px solid #78715b;
        background-color: black;
        color: white;
        border-radius: 7px;
        padding: 3px 7px 3px 7px !important;
        text-align: center;
        height: 34px;
    }
</style>

<style scoped>

</style>