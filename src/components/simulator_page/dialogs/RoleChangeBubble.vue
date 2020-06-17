<template>
    <div class="RoleChangeBubble" v-show="activeInfo==='roleChange'">
        <el-cascader-panel @input="changeRole" :value="roles.role.occupationId" :props="{ emitPath:false }"
                           class="select"
                           :options="options"
                           popper-class="popper">
            <template slot-scope="{ node, data }">
                <span v-if="!node.isLeaf">{{ data.label }}</span>
                <div v-else class="role-div" :class="{'gray-img': data.disabled}">
                    <sprite-render scale="0.75" class="role-img" :sprite-img="data.value"
                                   :frames="myUtils.occupationImgFrameMap[data.value]"
                                   time="8s"/>
                </div>
            </template>
        </el-cascader-panel>
    </div>
</template>

<script>
    import {Role} from "@/js/simulator/role";

    export default {
        name: "RoleChangeBubble",
        props: ['activeInfo'],
        inject: ["roles"],
        data() {
            return {
                value: "001",
                options: [{
                    value: "00",
                    label: "鬼剑士(男)",
                    children: [{
                        value: "001",
                        label: "鬼泣"
                    }, {
                        value: "002",
                        label: "狂战士",
                        // disabled: true,
                    }, {
                        value: "003",
                        label: "阿修罗",
                        disabled: true,
                    }, {
                        value: "004",
                        label: "剑魂",
                        disabled: true,
                    }, {
                        value: "005",
                        label: "剑鬼",
                        disabled: true,
                    }]
                },
                    {
                        value: "00",
                        label: "鬼剑士(女)",
                        children: [{
                            value: "011",
                            label: "鬼泣",
                            disabled: true,
                        }, {
                            value: "012",
                            label: "狂战士",
                            disabled: true,
                        }, {
                            value: "013",
                            label: "阿修罗",
                            disabled: true,
                        }, {
                            value: "014",
                            label: "剑魂",
                            disabled: true,
                        }]
                    }]
            }
        },
        methods: {
            changeRole(event) {
                if (this.roles.savedRole[event] !== undefined) {
                    this.roles.role = this.roles.savedRole[event];
                } else {
                    this.roles.role = new Role(event);
                    this.roles.role.updateRole();
                    this.roles.savedRole[event] = this.roles.role;
                }
            }
        }
    }
</script>

<style scoped>
    .RoleChangeBubble {
        position: absolute;
        z-index: 20;
        pointer-events: none;
    }

    .select > >>> div {
        background-color: rgba(0, 0, 0, 0.85);
    }

    /*.select > >>> div >>> > div {*/
    /*    border: rgba(96, 76, 45, 0.89) solid 2px;*/
    /*}*/

    .select >>> span {
        color: #bca77d;
    }

    .select {
        border: unset;
    }

    .select >>> .el-scrollbar {
        border: rgba(96, 76, 45, 0.89) solid 2px;
        pointer-events: all;
    }

    .select >>> .el-scrollbar:first-child {
        height: 204px;
    }

    .select >>> .el-scrollbar:first-child .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .select >>> .el-cascader-node:hover {
        background-color: #0e3768;
    }

    .select >>> .is-active {
        background-color: #0e3768;
    }

    .select >>> .in-active-path {
        background-color: #0e3768;
    }

    .role-div {
        height: 90px;
    }

    .role-img {
        height: 90px;
        width: 120px;
    }


    .select >>> .el-scrollbar:nth-child(2) .el-cascader-node {
        height: 90px;
        padding-right: 0;
    }

    .select >>> .el-scrollbar:nth-child(2) .el-cascader-menu__wrap {
        height: 480px;
    }
</style>