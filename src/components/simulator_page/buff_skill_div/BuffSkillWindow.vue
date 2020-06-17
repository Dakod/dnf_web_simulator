<template>
    <div class="BuffSkillWindow">
        <div class="window-title w-100">
            <label class="window-title-label">被动技能</label>
            <img src="@/assets/UI/image/window_title.png" class="w-100 h-100">
        </div>
        <div class="skill-table-div p-2 h-auto">
            <div class="my-scroll skill-inner-table-div my-border d-flex flex-wrap">
                <div v-for="skill in BuffSkillList" :key="skill.skillId" class="skill-item my-border">
                    <div class="skill-icon-div">
                        <img :class='{"gray-img": skill.isDisable}' title="点击启用/禁用"
                             class="skill-icon"
                             :src="getSkillIconUrl(skill)"
                             @click='toggleSkill(skill)'>
                        <skill-edit-btn-and-dialog @change-skill-version="roles.role.updateRole()" :skill="skill"
                                                   v-if="$(skill.xmlNode).attr('hasDiffVer')==='true'"/>
                    </div>
                    <label class="skill-name-label">
                        {{$(skill.xmlNode).attr("hasDiffVer") === 'true' ?
                        skill.getSkillNodeByVersion().attr('title')
                        : $(skill.xmlNode).children("Name").text()}}
                    </label>
                    <common-input-number @input="roles.role.updateRole()" type="number"
                                         :min="$(skill.xmlNode).children('MinLevel').text() - 0"
                                         :max="$(skill.xmlNode).children('LimitLevel').text() - 0"
                                         class="skill-level-input"
                                         v-model.number="skill.baseSkillLevel"/>
                    <label class="real-skill-level-label mb-0">{{skill.skillLevel}}</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SkillEditBtnAndDialog from "@/components/simulator_page/SkillEditBtnAndDialog";

    export default {
        name: "BuffSkillWindow",
        inject: ["roles"],
        components: {SkillEditBtnAndDialog},
        data: function () {
            return {
                // skillList: this.xmlReader.getAllSkills(this.roles.role).find("skill"),
            }
        },
        computed: {
            BuffSkillList: function () {
                return Object.values(this.roles.role.skills).filter(skill =>
                    skill.xmlNode.attr("df") === "BUFF"
                );
                // return this.skillList.toArray().filter((skill) =>
                //     this.xmlReader.getAttributeValueWithDefault(this.$(skill), "df", "伤害") !== "伤害"
                // );
            }
        },
        methods: {
            toggleSkill: function (skill) {
                skill.isDisable = !skill.isDisable;
                this.roles.role.updateRole("BuffSkillWindow");
            },
            getSkillIconUrl(skill) {
                let id = skill.skillId;
                let suffix = $(skill.xmlNode).attr("hasDiffVer") === 'true' ?
                    "_" + skill.getSkillNodeByVersion().attr('index')
                    : "";
                suffix = suffix === "_0" ? "" : suffix;
                return require('@/assets/UI/image/skillIcon/' + id.slice(0, 2) + "/" +
                    parseInt(id.slice(3)) + suffix + ".png");
            }
        }
    }
</script>

<style scoped>
    .BuffSkillWindow {
        height: 100%;
    }

    .window-title {
        height: 35px;
        position: relative;
    }

    .skill-inner-table-div {
        height: 249px;
    }

    .skill-item {
        height: 46px;
        width: 50%;
        padding-top: 2px;
        padding-bottom: 2px;
        display: flex;
        align-items: center;
    }

    .skill-icon {
        width: 40px;
        height: 40px;
        cursor: pointer;
    }

    .skill-level-input {
        width: 40px;
    }

    .skill-name-label {
        color: white;
        text-align: center;
        width: 200px;
        margin-bottom: 0;
    }

    .real-skill-level-label {
        color: #bca77d;
        width: 80px;
        text-align: center;
    }

    .skill-icon-div {
        width: 63px;
        display: flex;
    }
</style>