<template>
    <div class="PropertyItem d-flex align-items-center justify-content-between">
        <div>
            <img class="profile-icon" :src="require('@/assets/UI/image/property_icon/' + propertyName+'.png')">
            <label>
                <slot/>
            </label>
        </div>
        <label class="valueLabel">
            {{propertyValueString}}
        </label>
    </div>
</template>

<script>
    export default {
        name: "PropertyItem",
        props: ["propertyName", "isReal"],
        methods: {},
        computed: {
            propertyValueString: function () {
                let value = this.roles.role.roleInfo[this.propertyName][this.isReal ? "real" : "out"];
                if (this.propertyName === "PhyCrit" || this.propertyName === "MagCrit") {
                    value = "+" + (Math.floor(value * 100 * 100) / 100).toFixed(1) + "%";
                } else {
                    value = parseInt(value);
                }
                return value;
            },
        },
        inject: ["roles"],
    }
</script>

<style scoped>
    .PropertyItem {
        padding-right: 5px;
    }

    .profile-icon {
        height: 25px;
        width: 25px;
    }

    label {
        color: white;
        margin-bottom: 0;
        margin-left: 5px;
    }

    .valueLabel {
        color: #96FF1E;
    }

</style>