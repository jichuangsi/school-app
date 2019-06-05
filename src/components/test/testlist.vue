<template>
    <div class="testList">
        <div class="task_content">
            <div class="task_warp" :class="{progress:studenttest.testStatus==='PROGRESS'}">
                <div class="task" :class="{
                green:studenttest.testStatus==='PROGRESS',
                gray:studenttest.testStatus=='FINISH'||studenttest.testStatus=='COMPLETED'}">
                    <div class="testInfo" @click.stop.passive="gotest(studenttest.testId)">
                        <div class="subject">
                            <div class="subject_img">
                                <img src="../../../public/images/classroom.png" v-if="studenttest.subjectId==null">
                                <img src="../../assets/语文_03.png" v-if="studenttest.subjectId==1">
                                <img src="../../assets/数学_03.png" v-if="studenttest.subjectId==2">
                                <img src="../../assets/英语_03.png" v-if="studenttest.subjectId==3">
                                <img src="../../assets/历史_03.png" v-if="studenttest.subjectId==4">
                                <img src="../../assets/地理_03.png" v-if="studenttest.subjectId==5">
                                <img src="../../assets/政治_03.png" v-if="studenttest.subjectId==6">
                                <img src="../../assets/生物_03.png" v-if="studenttest.subjectId==7">
                                <img src="../../assets/物理_03.png" v-if="studenttest.subjectId==8">
                                <img src="../../assets/化学_03.png" v-if="studenttest.subjectId==9">
                            </div>
                        </div>
                        <div class="testInfo0">
                            <div class="testInfo1">
                                <div class="task_name">{{studenttest.testName}}
                                    <span class="task_status">({{tips()}})</span>
                                    <div v-if="studenttest.testStatus == 'FINISH'||studenttest.testStatus=='COMPLETED'" class="fr">得分：<span>{{studenttest.totalScore}}</span></div>
                                </div>
                            </div>
                            <div class="testInfo2">
                                <div class="item">发布时间:{{time(studenttest.testPublishTime)}}</div>
                                <div class="teacher">老师:{{studenttest.teacherName}}</div>
                            </div>
                            <div class="testInfo3">
                                <div class="item">结束时间:{{time(studenttest.testEndTime)}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    //import {mapGetters} from 'vuex'
    import store from '@/store'

    export default {
        name: "testlist",
        props: {
            studenttest: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        computed: {
            //vuex 调用
            /*...mapGetters([
                'courseId'
            ])*/
        },
        mounted(){
            console.log(this.studenttest)
        },
        methods: {
            time(time) {
                if(time===0) return "暂无";
                let times = parseInt(time);
                let date = new Date(times);
                let month = (date.getMonth() + 1 > 10 ? 0 + (date.getMonth() + 1) : date.getMonth() + 1);
                let day = date.getDate();
                let hours = date.getHours();
                let minutes = date.getMinutes();
                return month + '月' + day + '日\t' + hours + ':' + minutes;
            },
            //进入课堂
            gotest(testId) {
                store.commit('SET_TESTID', testId);
                console.log(testId);
                this.$router.push({
                    path: '@/pages/student/test/test-objective',
                    name: 'tesobjective'
                })
            },
            tips(){
                if(this.studenttest.testStatus=='FINISH'||this.studenttest.testStatus=='COMPLETED'){
                    return "终止提交";
                }else{
                    if (this.studenttest.completed){
                        return "已完成";
                    } else {
                        return "待完成"
                    }
                }
            }
        }
    }
</script>

<!--教师端课目信息-->

<style lang="scss">
    .testList {
        .task_content {
            padding-bottom: 0rem;
            .title {
                font-size: 24px;
                padding-bottom: .57rem;
                color: rgba(128, 213, 156, 1);
            }
            .pendingTitle {
                color: rgba(238, 199, 32, 1);
            }
            .progress {
                box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.18);
            }
            .task_warp {
                //position: relative;
                //padding: 0.5rem 1.14rem;
                //background-color: white;
                //border-radius: 18px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 18px;
                margin-top: 2.0rem;
                //padding: 1.43rem 1.43rem;
                background-color: white;
                border-radius: 18px;
                .task {
                    width: 100%;
                    border-radius: 18px;
                    /*position: relative;
                    box-sizing: border-box;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    padding: .64rem 1.14rem .64rem 1.14rem;
                    margin-bottom: 1.14rem;
                    height: 7rem;
                    line-height: 1.86rem;
                    font-size: 16px;
                    border-radius: 16px;*/
                    //height: 11rem;
                    .testInfo{
                        width: 100%;
                        display: flex;
                        padding: 1rem 1rem;
                        .subject{
                            margin-right: 4rem;
                            .subject_img {
                                width: 9rem;
                                height: 9rem;
                                img {
                                    width: 100%;
                                    height: 100%;
                                    border-radius: 18px;
                                }
                            }
                        }
                        .testInfo0{
                            width: 100%;
                            font-size: 18px;
                            .testInfo1{
                                padding-top: 1.57rem;
                                .task_name {
                                    /*overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;*/
                                    color: rgba(53, 53, 53, 1);
                                    .task_status {
                                        font-size: 16px;
                                        color: rgba(136, 136, 136, 1);
                                    }
                                    .fr {
                                        color: crimson;
                                        font-size: 18px;
                                        span {
                                            font-style: italic;
                                            text-decoration: underline; 
                                        }
                                    }
                                }
                            }
                            .testInfo2{
                                padding-top: 1.57rem;
                                color: rgba(136, 136, 136, 1);
                                .teacher {
                                    width: 50%;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    float: right;
                                }
                                .item {
                                    max-width: 50%;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    float: left;
                                }
                            }
                            .testInfo3{
                                padding-top: 2.2rem;
                                width: 100%;
                                .item {
                                    float: left;
                                    color: rgba(162, 162, 162, 1);
                                }
                            }
                        }
                    }
                    .state {
                        /*max-width: 20%;
                        width: 20%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        position: relative;
                        text-align: center;*/
                        width: 8.57rem;
                        height: 3rem;
                        line-height: 3rem;
                        text-align: center;
                        font-size: 16px;
                        color: white;
                        border-radius: 100px;
                        margin-top: 3%
                    }
                }
                .violet {
                    background-color: rgba(241, 238, 254, 1);
                    .state {
                        //line-height: 1.86rem;
                        //border-radius: 1.86rem;
                        background-color: rgba(142, 120, 240, 1);
                        color: white;
                    }
                }
                .green {
                    background-color: rgba(222, 255, 225, 1);
                    .state {
                        background-color: rgba(101, 179, 127, 1);
                        color: white;
                    }
                }
                .yellow {
                    background-color: rgb(255, 252, 225);
                    .state {
                        background-color: rgb(255, 249, 142);
                        color: gray;
                        /*&:before {
                            content: "";
                            display: inline-block;
                            height: .57rem;
                            width: .57rem;
                            background-color: rgba(255, 82, 82, 1);
                            border-radius: 50%;
                            position: absolute;
                            top: .4rem;
                            right: -.64rem;
                            font-size: 0;
                        }*/
                    }
                }
                .gray {
                    background-color: rgba(230, 230, 230, 1);
                    .state {
                        background-color: rgba(162, 162, 162, 1);
                        color: white;
                    }
                }
                .task:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
</style>
