<template>
    <div class="objectiveQuestions">
        <teacher-header :header="header"/>
        <scroll-content ref="myscrollfull" @reload="reloadData" :mescrollValue="mescrollValue" v-if="pageShow">
            <div class="objective_warp">
                <div class="topic">
                    {{objective.questionContent}}
                </div>
                <div class="option" v-for="(item,index) in objective.options" :key="index">
                    {{tab(index)}}.{{item}}
                </div>
            </div>
            <div class="tips">
                提交人数：{{initial.count}}人，正确率{{initial.acc*100}}%
            </div>
            <div id="chart">
                <div id="objective">

                </div>
                <div id="selectChart">

                </div>
            </div>
            <div class="objectiveTitle">
                <span class="icon"></span>
                <span class="title">学生列表</span>
            </div>
            <student-list :studentList="objective" :allShow="allShow"/>
        </scroll-content>
        <loading v-if="loading"/>
    </div>
</template>

<!--教师端客观题详情-->

<script>
    import TeacherHeader from '../../../components/public/PublicHeader'
    import ScrollContent from '../../../components/public/ScrollContent'
    import StudentList from '../../../components/teacherClassroom/studentList'
    import {getCourseStatistics, getQuestion, getQuestionStatisticsList} from '@/api/teacher/classroom'
    import Loading from '../../../components/public/Loading'
    import {mapGetters} from 'vuex'

    export default {
        components: {
            TeacherHeader,
            ScrollContent,
            StudentList,
            Loading
        },
        data() {
            return {
                //饼图数据
                total: {
                    submited: 0,
                    all: 0
                },
                mescrollValue: {up: false, down: true},        //是否需要下拉上拉加载数据
                loading: true,                                  //页面加载状态
                pageShow: false,                                //内容加载状态
                header: {                                       //头部标题内容
                    title: '',
                    url: '/TClassroom'
                },
                objective: {},//题目
                allShow: false,                                //是否显示全选按钮
                //提交总人数
                studentCount: '',
                //题目的初始值
                initial: {
                    acc: '',
                    count: ''
                }
            }
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'topicId',
                'courseId',
                'title'
            ])
        },
        mounted() {
            this.getObjectiveQuestions();
        },
        methods: {
            //第一个饼图
            drawLine1() {
                this.$nextTick(function () {
                    // 基于准备好的dom，初始化echarts实例
                    let myChart = this.$echarts.init(document.getElementById('objective'))
                    // 绘制图表
                    myChart.setOption({
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            left: 'left',
                            top: 0,
                            data: [{name: "提交", icon: 'circle'}, {name: "未提交", icon: 'circle'}],
                            formatter: function (a) {
                                return a;
                            }
                        },
                        series: [
                            {
                                name: '客观题',
                                type: 'pie',
                                radius: '50%',
                                center: ['50%', '60%'],
                                data: [
                                    {value: this.total.submited, name: "提交"},
                                    {value: this.total.all - this.total.submited, name: "未提交"}
                                ],
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ],
                        color: ['rgba(103,233,117,1)', 'rgba(48,154,60,1)']

                    });
                });
            },
            //第二个饼图
            drawLine2() {
                this.$nextTick(function () {
                    // 基于准备好的dom，初始化echarts实例
                    let myChart = this.$echarts.init(document.getElementById('selectChart'))
                    // 绘制图表
                    myChart.setOption({
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            left: 'left',
                            top: '0',
                            width: 150,
                            data: [
                                {name: "正确", icon: 'circle'},
                                {name: "错误", icon: 'circle'},
                            ],
                            formatter: function (a) {
                                return a;
                            }
                        },
                        series: [
                            {
                                name: '客观题',
                                type: 'pie',
                                radius: '50%',
                                center: ['50%', '60%'],
                                data: [
                                    {value: this.initial.acc, name: "正确"},
                                    {value: 1 - this.initial.acc, name: "错误"}
                                ],
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ],
                        color: ['rgba(103,216,233,1)', 'rgba(48,137,154,1)', 'rgba(48,83,154,1)', 'rgba(68,48,154,1)']
                    });
                })
            },
            //获取页面数据
            async getObjectiveQuestions() {
                let self = this;
                let r1 = await getQuestion(self.topicId);
                self.objective = r1.data.data;
                //获取当前的总人数
                let r2 = await getCourseStatistics(self.courseId);
                self.studentCount = r2.data.data.studentCount;
                let res = await getQuestionStatisticsList(self.courseId);
                self.pageShow = true;
                self.loading = false;
                let data = res.data.data.list;
                data.forEach((question) => {
                    if (question.questionId === self.topicId) {
                        self.initial.acc = question.acc;
                        self.initial.count = question.count;
                    }
                });
                self.total.all = self.studentCount;
                self.total.submited = self.initial.count;
                self.drawLine1();
                self.drawLine2();
                self.header.title = self.title;
            },
            //给选项添加ABCD
            tab(index) {
                let num = 65 + index;
                return String.fromCharCode(num);
            },
            reloadData() {
                setTimeout(() => {
                    this.getObjectiveQuestions();
                    this.$refs.myscrollfull.endSuccess();
                }, 2000)
            }
        }
    }
</script>

<style lang="scss">
    .objectiveQuestions {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        .mescroll {
            box-sizing: border-box;
            position: absolute;
            top: 3.15rem;
            bottom: 0;
            padding: 3.5rem 4.86rem 3.14rem;
            height: auto !important;
            background-color: rgba(255, 255, 255, 1);
            .objective_warp {
                padding: 2.86rem 2.29rem;
                font-size: 18px;
                border-radius: 18px;
                line-height: 34px;
                background-color: rgba(246, 255, 247, 1);
                .topic {
                    padding-bottom: 1rem;
                }
            }
            .tips {
                padding: 3.43rem 0 1.36rem;
                font-size: 18px;
                color: rgba(105, 180, 130, 1);
            }
            .objectiveTitle {
                height: 2rem;
                position: relative;
                margin: 1.43rem 0 2.29rem;
                .icon {
                    display: inline-block;
                    width: .57rem;
                    height: 1.43rem;
                    margin-top: .285rem;
                    background-color: rgba(128, 213, 156, 1);
                }
                .title {
                    position: absolute;
                    top: 50%;
                    margin-left: .57rem;
                    transform: translateY(-50%);
                    font-size: 20px;
                    color: rgba(53, 53, 53, 1);
                }
            }
            #chart {
                width: 100%;
                height: 15rem;
                display: flex;
                position: relative;
                padding-bottom: 1.7rem;
                &:before {
                    content: "";
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-bottom: 2px solid rgba(230, 230, 230, .5);
                    -webkit-transform: scaleY(.5);
                    -webkit-transform-origin: 0 0;
                }
                #objective {
                    width: 50%;
                    height: 100%;
                }
                #selectChart {
                    width: 50%;
                    height: 100%;
                }
            }
        }
    }
</style>
