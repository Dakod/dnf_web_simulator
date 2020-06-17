<template>
    <div class="MonsterDiv my-border">
        <div class="h-100 d-flex">
            <div class="mr-3 monster-img-div d-flex align-items-center">
                <img class="ml-3" :src="require('@/assets/UI/monsterImg/' +monsterId+'.png')">
            </div>
            <div class="monster-info-div w-100 d-flex flex-wrap align-content-center mr-3">
                <div class="monster-info-item w-100">
                    <label class="my-label">选择怪物:</label>
                    <common-select class="common-select" @input="onMonsterSelectChange()" v-model="roles.role.monster.id"
                                   index="0" :focus.sync="focus" :list="monsterListMap"/>
                </div>
                <div class="monster-info-item w-100">
                    <label class="my-label">等级:</label>
                    <common-input type="number" class="common-select" index="1" :focus.sync="focus" min-num="0"
                                  max-num="150"
                                  v-model="roles.role.monster.level"/>
                </div>
                <div class="monster-info-item w-100">
                    <label class="my-label">防御:</label>
                    <common-input type="number" min-num="0"
                                  class="common-select" index="2" :focus.sync="focus" v-model="roles.role.monster.defence"/>
                </div>
                <div class="monster-info-item w-100">
                    <label class="my-label"><span style="color: #f80000">火抗</span>:</label>
                    <common-input type="number" min-num="0"
                                  class="common-select" index="3" :focus.sync="focus"
                                  v-model="roles.role.monster.FireStrengthen"/>
                </div>
                <div class="monster-info-item w-100">
                    <label class="my-label"><span style="color: #295ae4">冰抗</span>:</label>
                    <common-input type="number" min-num="0"
                                  class="common-select" index="4" :focus.sync="focus"
                                  v-model="roles.role.monster.IceStrengthen"/>
                </div>
                <div class="monster-info-item w-100">
                    <label class="my-label"><span style="color: #f4f4f4">光抗</span>:</label>
                    <common-input type="number" min-num="0"
                                  class="common-select" index="5" :focus.sync="focus"
                                  v-model="roles.role.monster.LightStrengthen"/>
                </div>
                <div class="monster-info-item w-100">
                    <label class="my-label"><span style="color: #771db2">暗抗</span>:</label>
                    <common-input type="number" min-num="0"
                                  class="common-select" index="6" :focus.sync="focus"
                                  v-model="roles.role.monster.DarkStrengthen"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MonsterDiv",
        props: ['activeInfo'],
        data: function () {
            return {
                focus: ""
            };
        },
        inject: ['roles'],
        computed: {
            monsterId() {
                return this.roles.role.monster.id;
            },
            monsterList() {
                return this.xmlReader.getAllMonsterInfo();
            },
            monsterListMap() {
                let map = {};
                let _this = this;
                this.monsterList.each(function () {
                    map[_this.$(this).attr("id")] = _this.$(this).children("Name").text();
                });
                return map;
            }
        },
        methods: {
            onMonsterSelectChange: function () {
                this.roles.role.monster.resetMonster();
                this.updateRole(this.roles.role);
            }
        },
        components: {}
    }
</script>

<style scoped>
    .MonsterDiv {
        width: 520px;
        height: 323px;
        margin-bottom: 5px;
    }

    .monster-img-div {
        height: 100%;
        width: auto;
    }

    .monster-img-div img {
        width: 200px;
        height: 200px;
    }

    .monster-info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 3px;
    }

    .common-select {
        width: 180px;
    }
</style>