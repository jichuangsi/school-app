<template>
    <div class="topic_warp">
        <div class="title">{{objective.title}}</div>
        <div class="topic">
            {{objective.questionContent}}
        </div>
        <div class="select clearfix"
             v-for="(item,index) in objective.options"
             :key="index"
             @click="selectIndex(index,objective.questionId)"
        >
            <div class="round">
                <span class="point" v-if="pointIndex === index"></span>
            </div>
            <div class="option">{{conversion(index)}}.</div>
            <div class="text">{{item}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "classObjective",
        props: {
            objective: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        data() {
            return {
                pointIndex: -1
            }
        },
        mounted() {
            // console.log(this.objective);
        },
        methods: {
            selectIndex(index, id) {
                this.pointIndex = index;
                let num = 65+index;
                let option = String.fromCharCode(num);
                this.$emit('selectAnswer', id, option);
            },
            conversion(index) {
                let num = 65 + index;
                return String.fromCharCode(num);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .topic_warp {
        .title {
            padding-bottom: .57rem;
            font-size: 18px;
            line-height: 1.79rem;
            color: rgba(105, 180, 130, 1);
        }

        .item {
            padding: 0 3.71rem;
            line-height: 2.43rem;
            font-size: 18px;
        }

        .topic {
            line-height: 2.43rem;
            font-size: 18px;
            padding: 0 3.71rem;
        }

        .select {
            position: relative;
            height: 1.79rem;
            padding: 1.14rem 3.71rem 1.36rem;
            font-size: 0;
            cursor: pointer;

            .round {
                position: relative;
                display: inline-block;
                width: 1.43rem;
                height: 1.43rem;
                border-radius: 50%;
                border: 2px solid rgba(105, 180, 130, 1);
                float: left;

                .point {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translateX(-50%) translateY(-50%);
                    width: .57rem;
                    height: .57rem;
                    border-radius: 50%;
                    background-color: rgba(154, 132, 255, 1);
                }

            }
            .option {
                display: inline-block;
                height: 1.79rem;
                line-height: 1.79rem;
                padding-left: 0.57rem;
                padding-right: 0.79rem;
                font-size: 20px;
                color: rgba(105, 180, 130, 1);
                float: left;
            }

            .text {
                display: inline-block;
                height: 1.79rem;
                line-height: 1.79rem;
                font-size: 18px;
                color: rgba(53, 53, 53, 1);
                float: left;
            }
        }
    }
</style>
