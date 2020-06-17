<template>
    <div class="ComputerSettingDiv my-border">
        <common-button @click.native="startSingleComputer()" class="btn" name="primary">单件计算</common-button>
        <common-button @click.native="startSuitComputer()" class="btn" name="primary">套装计算</common-button>
        <common-select v-model="computerNum" :list="{1:1,2:2,4:4,8:8}"/>
        <div>
            <main-equipment-icon equipment-type="weapon" item-type="equipments"
                                 :should-show-suit-mark="false"
                                 :activeInfo.sync="activeDialog"/>
        </div>
    </div>
</template>

<script>
    import {Computer} from "@/js/computer/Computer";
    import MainEquipmentIcon from "@/components/simulator_page/main_role_info/MainEquipmentIcon";


    export default {
        name: "ComputerSettingDiv",
        components: {MainEquipmentIcon},
        props: ["role"],
        data() {
            return {
                computer: new Computer(),
                activeDialog: null,
                computerNum: 1
            }
        },
        methods: {
            startSingleComputer() {
                this.computer.startSingleCompute({
                    equipmentList: this.role.data,
                    heapSize: 5,
                    computerNum: this.computerNum,
                    occupationId: "001"
                });
            },
            startSuitComputer() {
                // this.computer.getSuitVectorsPromise({
                //     equipmentList: this.role.data
                // }).then(() => {
                //     this.computer.startSuitCompute({
                //         heapSize: 5,
                //         computerNum: this.computerNum,
                //         equipmentList: this.role.data,
                //         occupationId: "001"
                //     })
                // });
                this.computer.startSuitCompute({
                    heapSize: 5,
                    computerNum: this.computerNum,
                    equipmentList: this.role.data,
                    occupationId: "001"
                })
            }
        }
    }
</script>

<style scoped>
    .ComputerSettingDiv {
        width: 300px;
        padding: 15px;
    }

    .btn {
        width: 80px;
        height: 38px;
        outline: none;
        margin: 0 5px;
    }
</style>