<template>
    <div class="EquipmentCollectionDiv my-border my-scroll">
        <div class="suit-item" v-for="suit in suitList" :key="suit.id">
            <span @click="toggleSuit(suit)" class="suitName">{{suit.suitName}}</span>
            <div v-for="equipment in suit.equipments" :key="equipment.id"
                 :class="[{'equipment-search-mask':showSearchMask(equipment)}]">
                <equipment-item :class="[{'gray-equipment' : !role || !role.data[equipment.id]}]"
                                @click.native="toggleEquipment(equipment.id)" class="equipment-icon"
                                :equipment-node="equipment.node" item-type="equipments"/>
            </div>
        </div>
    </div>
</template>

<script>
    import * as utils from "@/js/utils"
    import EquipmentItem from "@/components/EquipmentItem";

    export default {
        name: "EquipmentCollectionDiv",
        props: ["role", "roleKey", "serializeUtils","keyWord"],
        provide() {
            return {
                roles: {}
            }
        },
        components: {EquipmentItem},
        data() {
            return {
                suitList: utils.getAllSuitInfo(),
            };
        },
        methods: {
            toggleEquipment(id) {
                if (this.role && this.role.data) {
                    if (this.role.data[id]) {
                        this.$delete(this.role.data, id);
                        this.serializeUtils.updateRole(this.role, this.roleKey);
                    } else {
                        this.$set(this.role.data, id, true);
                        this.serializeUtils.updateRole(this.role, this.roleKey);
                    }
                }
            },
            toggleSuit(suit) {
                if (this.isSuitFull(suit)) {
                    for (let equipment of suit.equipments) {
                        this.$delete(this.role.data, equipment.id);
                    }
                    this.serializeUtils.updateRole(this.role, this.roleKey);
                } else {
                    for (let equipment of suit.equipments) {
                        this.$set(this.role.data, equipment.id, true);
                    }
                    this.serializeUtils.updateRole(this.role, this.roleKey);
                }
            },
            isSuitFull(suit) {
                for (let equipment of suit.equipments) {
                    if (!this.role.data[equipment.id])
                        return false;
                }
                return true;
            },
            showSearchMask(equipment) {
                return this.keyWord && equipment.equipmentName.indexOf(this.keyWord) !== -1;
            }
        }
    }
</script>

<style scoped>
    .EquipmentCollectionDiv {
        width: 1200px;
        height: 790px;
        padding: 15px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .equipment-icon {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
    }

    .equipment-search-mask:before {
        content: "";
        width: 40px;
        height: 40px;
        background-image: url("../../assets/UI/image/item_search_mask.png");
        background-size: 100% 100%;
        position: absolute;
        z-index: 3;
        pointer-events: none;
    }

    .suit-item {
        /*width: 500px;*/
        /*height: 80px;*/
        display: flex;
        align-items: center;
        padding: 0 10px;
    }

    .suitName {
        color: lawngreen;
        width: 90px;
        text-align: center;
        margin: 0 5px;
        cursor: pointer;
    }

    .gray-equipment {
        /*-webkit-filter: sepia(100%);*/
        -webkit-filter: grayscale(80%) brightness(50%);
    }

</style>