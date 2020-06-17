<template>
    <div class="RoleDetails p-2 my-scroll">
        <div class="d-flex property-item-container">
            <property-item class="property-item" property-name="Strength" :is-real="isReal">力量</property-item>
            <property-item class="property-item" property-name="Intelligence" :is-real="isReal">智力</property-item>
        </div>
        <div class="d-flex property-item-container">
            <property-item class="property-item" property-name="RealPhyAtta" :is-real="isReal">物理攻击力</property-item>
            <property-item class="property-item" property-name="RealMagAtta" :is-real="isReal">魔法攻击力</property-item>
        </div>
        <div class="d-flex property-item-container">
            <property-item class="property-item" property-name="RealIndAtta" :is-real="isReal">独立攻击力</property-item>
        </div>
        <div class="d-flex property-item-container">
            <property-item class="property-item" property-name="PhyCrit" :is-real="isReal">物理暴击率</property-item>
            <property-item class="property-item" property-name="MagCrit" :is-real="isReal"> 魔法暴击率</property-item>
        </div>
        <div class="d-flex property-item-container">
            <property-item class="property-item" property-name="FireStrengthen" :is-real="isReal">火属性强化</property-item>
            <property-item class="property-item" property-name="IceStrengthen" :is-real="isReal">冰属性强化</property-item>
        </div>
        <div class="d-flex property-item-container">
            <property-item class="property-item" property-name="LightStrengthen" :is-real="isReal">光属性强化</property-item>
            <property-item class="property-item" property-name="DarkStrengthen" :is-real="isReal">暗属性强化</property-item>
        </div>

    </div>
</template>

<script>
    import PropertyItem from "@/components/simulator_page/main_role_info/PropertyItem";

    export default {
        name: "RoleDetails",
        props: ["isReal"],
        components: {
            PropertyItem,
        }
    }
</script>

<style scoped>
    .RoleDetails {
        width: inherit;
        overflow-y: auto;
        overflow-x: hidden;
        margin-top: 2px;
    }

    .property-item {
        flex: 1;
        height: 30px;
    }

    .property-item-container {
        margin-bottom: 2px;
    }

</style>