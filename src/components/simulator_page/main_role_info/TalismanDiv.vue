<template>
    <div class="TalismanDiv my-border">
        <sprite-render v-show="shouldShowCompleteAmi()" class="sprite" frames="10" sprite-img="talisman_complete"
                       time="0.9s"/>
        <sprite-render v-show="shouldShowCompleteAmiUp()" class="rune_up" frames="10" sprite-img="rune_up" scale="0.52"
                       time="0.9s"/>
        <sprite-render v-show="shouldShowCompleteAmiDown()" class="rune_down" frames="10" sprite-img="rune_down"
                       scale="0.47" time="0.9s"/>
        <div class="talisman-center">
            <main-equipment-icon class="talisman-icon-up" :check-change="checkChange"
                                 equipment-type="talisman1" item-type="talismans"
                                 :active-info="activeInfo"
                                 v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>

            <main-equipment-icon class="talisman-icon-down" :check-change="checkChange"
                                 equipment-type="talisman2" item-type="talismans"
                                 :active-info="activeInfo"
                                 v-on:update:activeInfo="$emit('update:activeInfo',$event)"/>
        </div>
        <div class="rune-div" v-for="n in 6" :key="n" :class='["rune-div-"+ n]'>
            <div :class='[getRuneBgClass(n)]' class="rune-icon"
                 @click.stop="changeActiveEquipmentDialog('talisman_rune'+n)">
                <div class="rune-mask">
                    <rune-item class="rune-item" v-show='myUtils.getRuneByIndex(n,roles.role).hasSkill()'
                               :rune-type="myUtils.getRuneByIndex(n,roles.role).type"
                               :rune-grade="myUtils.getRuneByIndex(n,roles.role).grade"
                               :skill-id="myUtils.getRuneByIndex(n,roles.role).skill"/>
                    <sprite-render v-show="shouldShowRuneAmi(n)" :class='["rune-sprite-"+ n]' class="rune-sprite"
                                   scale="1"
                                   :sprite-img="getRuneSpriteName(n)" frames="10" time="1s"/>
                </div>
                <rune-select-dialog v-show="activeInfo === 'talisman_rune'+n" class="rune-select-dialog" :index="n"/>
            </div>
        </div>

    </div>
</template>

<script>
    import RuneItem from "@/components/RuneItem";
    import RuneSelectDialog from "@/components/simulator_page/dialogs/RuneSelectDialog";
    import MainEquipmentIcon from "@/components/simulator_page/main_role_info/MainEquipmentIcon";

    export default {
        name: "TalismanDiv",
        props: ['activeInfo'],
        data: function () {
            return {};
        },
        inject: ['roles'],
        computed: {

        },
        methods: {
            checkChange: function (role, node) {
                return !(role.talismans.talisman1.equipmentId === this.$(node).attr("id") ||
                    role.talismans.talisman2.equipmentId === this.$(node).attr("id"));
            },
            getRuneBgClass: function (index) {
                let rune = this.myUtils.getRuneByIndex(index, this.roles.role);
                if (String(rune.skill) !== 'null') {
                    return "on";
                }
                return rune.type
            },
            changeActiveEquipmentDialog: function (info) {
                this.$emit('update:activeInfo', info);
            },
            shouldShowCompleteAmi: function () {
                return this.roles.role.talismans.talisman1.equipmentId != null && this.roles.role.talismans.talisman2.equipmentId != null &&
                    this.roles.role.talismans.talisman1.isFull() && this.roles.role.talismans.talisman2.isFull();
            },
            shouldShowCompleteAmiUp() {
                return this.roles.role.talismans.talisman1.equipmentId != null && this.roles.role.talismans.talisman1.isFull();
            },
            shouldShowCompleteAmiDown() {
                return this.roles.role.talismans.talisman2.equipmentId != null && this.roles.role.talismans.talisman2.isFull();
            },
            shouldShowRuneAmi(n) {
                return this.myUtils.getRuneByIndex(n, this.roles.role).hasSkill() && this.roles.role.talismans["talisman" + (1 + parseInt(((n - 1) / 3).toString()))].hasEquipment();
            },
            getRuneSpriteName(n) {
                switch ((n - 1) % 3) {
                    case 0:
                        return "rune_left";
                    case 1:
                        return "rune_mid";
                    case 2:
                        return "rune_right";
                }
            },
        },
        components: {
            RuneSelectDialog,
            MainEquipmentIcon,
            RuneItem
        },
    }
</script>

<style scoped>
    .TalismanDiv {
        width: 520px;
        height: 543px;
        margin-bottom: 5px;
        background-image: url("../../../assets/UI/image/talisman_bg.png");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 80% auto;
        position: relative;
    }

    .talisman-center {
        width: 165px;
        height: 150px;
        background-image: url("../../../assets/UI/image/talisman_center.png");
        background-size: 100% 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -77px;
        margin-left: -82px;
        z-index: 12;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding-left: 57px;
        padding-right: 57px;
        align-content: space-between;
    }

    .sprite {
        width: 395px;
        height: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -215px;
        margin-left: -207px;
    }

    .rune_up {
        position: absolute;
        width: 360px;
        height: 0;
        top: 85px;
        left: 80px;
    }

    .rune_down {
        position: absolute;
        width: 360px;
        height: 0;
        left: 74px;
        bottom: 260px;
    }

    .rune-mask {
        width: 60px;
        height: 60px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .rune-item {
        width: 45px;
        height: 45px;
    }

    .rune-select-dialog {
        position: absolute;
        top: 20px;
        left: 20px;
    }

    .talisman-icon-up {
        width: 50px;
        height: 50px;
        margin-top: 10px;
    }

    .talisman-icon-down {
        width: 50px;
        height: 50px;
        margin-bottom: 10px;
    }

    .rune-div {
        position: absolute;
        width: 60px;
        height: 60px;
        /*z-index: 1;*/
    }

    .rune-div-1 {
        top: 154px;
        left: 87px;
    }

    .rune-div-2 {
        top: 77px;
        left: 228px;
    }

    .rune-div-3 {
        top: 154px;
        left: 370px;
    }

    .rune-div-4 {
        top: 317px;
        left: 87px;
    }

    .rune-div-5 {
        top: 402px;
        left: 228px;
    }

    .rune-div-6 {
        top: 317px;
        left: 370px;
    }

    .rune-sprite {
        position: absolute;
        width: 200px;
        height: 0;
        pointer-events: none;
    }

    .rune-sprite-1 {
        top: -23px;
        left: 3px;
    }

    .rune-sprite-2 {
        top: 4px;
    }

    .rune-sprite-3 {
        top: -29px;
        right: 8px;
    }

    .rune-sprite-4 {
        transform: rotateX(180deg);
        left: 4px;
        bottom: -26px;
    }

    .rune-sprite-5 {
        transform: rotateX(180deg);
        bottom: 10px;
    }

    .rune-sprite-6 {
        transform: rotateX(180deg);
        right: 10px;
        bottom: -30px;
    }

    .rune-icon {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .antiquitylibrary {
        background-image: url("../../../assets/UI/image/antiquitylibrary.png");
    }

    .circlemage {
        background-image: url("../../../assets/UI/image/circlemage.png");
    }

    .guardians {
        background-image: url("../../../assets/UI/image/guardians.png");
    }

    .secondpact {
        background-image: url("../../../assets/UI/image/secondpact.png");
    }

    .terracotta {
        background-image: url("../../../assets/UI/image/terracotta.png");
    }

    .on {
        background-image: url("../../../assets/UI/image/rune_on_bg.png");
    }


</style>