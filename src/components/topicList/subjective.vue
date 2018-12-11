<template>
    <div class="subjective">
        <div class="topic_warp">
            <div class="title">{{subjectiveTopic.title}}</div>
            <div class="topic">
                {{subjectiveTopic.questionContent}}
            </div>
        </div>
    </div>
</template>

<!--主观题-->

<script>

    export default {
        name: 'subjective',
        props: {
            subjectiveTopic: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .subjective {
        width: 100%;
        .topic_warp {
            position: relative;
            .title {
                font-size: 18px;
                color: #69B482;
            }
            .topic {
                color: #353535;
                font-size: 18px;
                line-height: 34px;
                padding: 0 2.57rem;
            }
        }
    }
</style>
