<template>
    <div class="subjectiveDetails">
        <teacher-header :header="header"/>
        <scroll-content ref="myscrollfull" @reload="reloadData" v-if="pageShow" :mescrollValue="mescrollValue">
            <div class="subjective_warp">
                <div class="topic">
                    {{studentList.questionContent}}
                </div>
            </div>
            <div class="tips">
                提交人数：{{initial.count}}人
            </div>
            <div id="subjectiveChart">

            </div>
            <div class="subjectiveTitle">
                <span class="icon"></span>
                <span class="title">学生列表</span>
            </div>
            <student-list :studentList="studentList"/>
        </scroll-content>
        <loading v-if="loading"/>
    </div>
</template>

<!--主观题详情-->

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
                mescrollValue: {up: false, down: true},          //是否需要上拉加载状态
                loading: true,                                    //页面加载状态
                pageShow: false,                                  //内容加载状态
                header: {                                         //头部标题加载
                    title: '',
                    url: '/TClassroom'
                },
                studentCount: '',
                studentList: {},
                initial: {
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
            this.getStudent();
        },
        methods: {
            //获取页面数据
            async getStudent() {
                //获取题目基本信息
                let self = this;
                let r1 = await getQuestion(self.topicId);
                self.studentList = r1.data.data;
                let r2 = await getCourseStatistics(self.courseId);
                self.studentCount = r2.data.data.studentCount;
                //获取当前人数的初始值 平均分 正确率
                let res = await getQuestionStatisticsList(self.courseId);
                this.pageShow = true;
                this.loading = false;
                let data = res.data.data.list;
                data.forEach((question) => {
                    if (question.questionId === self.topicId) {
                        self.initial.count = question.count;
                    }
                });
                this.drawLine();
                this.header.title = this.title;
            },
            //饼图加载
            drawLine() {
                this.$nextTick(function () {
                    // 基于准备好的dom，初始化echarts实例
                    let myChart = this.$echarts.init(document.getElementById('subjectiveChart'));
                    // 绘制图表
                    myChart.setOption({
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            top: 0,
                            left: 0,
                            itemGap: 35,
                            bottom: 'bottom',
                            data: [{name: "提交", icon: 'circle'}, {name: "未提交", icon: 'circle'}],
                            formatter: function (a) {
                                return a;
                            }
                        },
                        series: [
                            {
                                name: '主观题',
                                type: 'pie',
                                radius: '70%',
                                center: ['70%', '50%'],
                                data: [
                                    {value: this.initial.count, name: "提交"},
                                    {value: this.studentCount - this.initial.count, name: "未提交"}
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
                })
            },
            reloadData() {
                setTimeout(() => {
                    this.getStudent();
                    this.$refs.myscrollfull.endSuccess();
                }, 2000)
            }
        }
    }
</script>

<style lang="scss">
    .subjectiveDetails {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        .mescroll {
            box-sizing: border-box;
            position: absolute;
            top: 3.15rem;
            bottom: 6rem;
            padding: 3.5rem 4.86rem 3.14rem;
            height: auto !important;
            background-color: rgba(255, 255, 255, 1);
            .subjective_warp {
                padding: 2.86rem 2.29rem;
                font-size: 18px;
                border-radius: 18px;
                line-height: 34px;
                background-color: rgba(246, 255, 247, 1);
            }
            .tips {
                padding: 3.43rem 0 .79rem;
                font-size: 18px;
                color: rgba(105, 180, 130, 1);
                position: relative;
            }
            .subjectiveTitle {
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
            #subjectiveChart {
                width: 100%;
                height: 10.7rem;
                position: relative;
                padding-bottom: 1.93rem;
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
            }
        }
    }
</style>
