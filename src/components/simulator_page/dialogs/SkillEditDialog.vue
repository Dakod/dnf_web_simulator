<template>
    <div class="SkillEditDialog">
        <common-bubble class="bubble" position="mid_bottom">
            <div class="skill-div">
                <div class="skill-item" v-for="skillVer in skillVersionList" :key="$(skillVer).attr('index')">
                    <img :title="$(skillVer).attr('title')" class="skill-icon"
                         :src="skillIconUrl($(skillVer).attr('index'))"
                         @click.stop="changeSkillVersion($(skillVer).attr('index'))">
                    <img class="chosen_img" src="@/assets/UI/image/skill_version_chosen.png"
                         v-show="skill.version === $(skillVer).attr('index')">
                </div>
            </div>
        </common-bubble>
    </div>

</template>

<script>
    export default {
        name: "SkillEditDialog",
        props: ["skill"],
        computed: {
            // hasEdit() {
            //     return this.skill.xmlNode.attr("hasDiffVer") === "true";
            // },
            skillVersionList() {
                return this.skill.xmlNode.children("Property");
            },
            skillIconUrl() {
                return function (index) {
                    return require('@/assets/UI/image/skillIcon/' + this.skill.skillId.slice(0, 2) + "/" +
                        parseInt(this.skill.skillId.slice(3)) + (index === "0" ? "" : ("_" + index)) + ".png");
                }
            }
        },
        methods: {
            changeSkillVersion(index) {
                this.skill.version = index;
                this.$emit("change-skill-version", "");
            }
        }
    }
</script>

<style scoped>
    .SkillEditDialog {
        position: absolute;
        z-index: 14;
        left: -40px;
        top: -68px;
    }

    .skill-icon {
        width: 40px;
        height: 40px;
        cursor: pointer;
    }

    .skill-div {
        display: flex;
    }

    .skill-item {
        position: relative;
    }

    .chosen_img {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        pointer-events: none;
    }


</style>