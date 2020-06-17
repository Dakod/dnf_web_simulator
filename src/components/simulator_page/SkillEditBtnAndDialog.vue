<template>
    <div class="SkillEditBtnAndDialog">
        <common-button @click.native.stop="setShouldShow" class="skill-edit-btn" name="refresh" title="更换形态"/>
        <skill-edit-dialog @change-skill-version="$emit('change-skill-version','')" v-show="shouldShowTotal"
                           :skill="skill"/>
    </div>
</template>

<script>
    import SkillEditDialog from "@/components/simulator_page/dialogs/SkillEditDialog";

    export default {
        name: "SkillEditBtnAndDialog",
        components: {SkillEditDialog},
        inject: ["global"],
        props: ["skill"],
        data() {
            return {
                shouldShow: false
            }
        },
        computed: {
            shouldShowTotal() {
                return this.shouldShow && this.global.activeDialog === 'skill_edit:' + this.skill.skillId;
            }
        },
        methods: {
            setShouldShow() {
                this.shouldShow = !this.shouldShowTotal;
                this.global.activeDialog = 'skill_edit:' + this.skill.skillId;
                this.$emit("changes", "");
            }
        }
    }
</script>

<style scoped>
    .SkillEditBtnAndDialog {
        width: 20px;
        display: flex;
        align-items: center;
        margin-left: 3px;
        position: relative;
    }

    .skill-edit-btn {
        width: 20px;
        height: 20px;
    }
</style>