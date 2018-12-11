<template>
    <div class="subjective">
        <div class="topic_warp">
            <div class="title">{{subjectiveTopic.title}}</div>
            <div class="topic" v-html="subjectiveTopic.questionContent">
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
    .MathJye table{
        border-collapse: collapse;
        margin: 0;
        padding: 0;
        text-align: center;
        vertical-align: middle;
        line-height: normal;
        font-size: inherit;
        _font-size: 100%;
        font-style: normal;
        font-weight: normal;
        border: 0;
        float: none;
        display: inline-block;
        zoom: 0;
    }
    .mathjye-underpoint2 {
        border-bottom: 2px dotted #000;
        padding-bottom: 3px;
    }
    #q_answer{display:none;}
    table.edittable{border-collapse:collapse;text-align:center;margin:2px}table.edittable td,table.edittable th{line-height:30px;padding:5px;white-space:normal;word-break:break-all;border:1px solid #000;vertical-align:middle}table.composition{border-collapse:collapse;text-align:left;margin:2px;width:98%}table.composition td,table.composition th{line-height:30px;white-space:normal;word-break:break-all;border-width:0;vertical-align:middle}table.composition2{border-collapse:collapse;width:auto}table.composition2 td,table.composition2 th{text-align:left;line-height:30px;white-space:normal;word-break:break-all;border:none;border-width:0;vertical-align:middle}
    sup {
        vertical-align: super;
    }
</style>
