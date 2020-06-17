<template>
    <input spellcheck="false" ref="inputDom" @input="onInput($event)" :value="value" class="my-input"
           @click.stop="$emit('update:focus',index)" :placeholder="_placeholder"/>

</template>

<script>
    export default {
        name: "CommonInput",
        props: ["type", "maxNum", "minNum", "value", "index", "focus", "step", "placeholder"],
        computed: {
            _placeholder: function () {
                return this.placeholder === undefined ? "" : this.placeholder;
            }
        },
        methods: {
            onInput: function (event) {
                let inputVal = event.target.value;
                if (this.type === 'number') {
                    let val = inputVal.replace(/[^\d]/g, '');
                    if (val === '')
                        val = 0;
                    val = parseInt(val);
                    if (this.maxNum !== undefined && val > this.maxNum)
                        val = this.maxNum;
                    if (this.minNum !== undefined && val < this.minNum)
                        val = this.minNum;
                    val = parseInt(val);
                    this.$emit('input', val);
                    if (this.value === val) { //如果此时的value和计算之后的val相同，那么vue将不会重新渲染，需要手动更改input的值
                        this.$refs.inputDom.value = val;
                    }
                } else {
                    this.$emit('input', inputVal);
                }
            },
            // onChange: function (event) {
            // }
        },
    }
</script>

<style scoped>

</style>