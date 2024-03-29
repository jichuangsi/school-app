<template>
    <div class="TClassroom">
        <teacher-header :header="header"/>
        <scroll-content ref="myscrollfull" @load="loadData" :mescrollValue="mescrollValue" v-if="pageShow">
            <div class="subjectAvatar"></div>
            <div class="subjectName">{{courseName}}</div>
            <div class="msg">
                <div class="left">
                    <div class="row">班级&nbsp;<span>{{classMsg.className}}</span></div>
                    <div class="row">上课时间 &nbsp;<span>{{time(classMsg.courseEndTime)}}</span></div>
                    <div class="row">在线人数 &nbsp;<span class="people">{{studentCount}}</span></div>
                </div>
                <div class="right started" @click.stop.passive="updateState"
                     v-if="classMsg.courseStatus === 'NOTSTART'">上课
                </div>
                <div class="right class" @click.stop.passive="updateState" v-if="classMsg.courseStatus === 'PROGRESS'">
                    上课中
                </div>
                <div class="right view" @click.stop.passive="updateState" v-if="classMsg.courseStatus === 'FINISH'">
                    已结束
                </div>
            </div>
            <div class="subjectTitle">
                <span class="icon"></span>
                <span class="title">课堂题目</span>
            </div>
            <teacher-topic v-for="item in showTopicList"
                           :topic="item"
                           :topicCount="item.count"
                           :topicAcc="item.acc"
                           :courseId="courseId"
                           :studentCount="studentCount" :key="item.index"/>
        </scroll-content>
        <loading v-if="loading"/>
    </div>
</template>
<!--课堂详情-->
<script>
    import Vue from 'vue'
    import TeacherHeader from '../../../components/public/PublicHeader'
    import ScrollContent from '../../../components/public/ScrollContent'
    import TeacherTopic from '../../../components/teacherClassroom/teacherTopic'
    import {
        changeCourseStatus,
        courseStart,
        getCourse,
        getCourseStatistics,
        getQuestionStatisticsList
    } from '@/api/teacher/classroom'
    import Loading from '../../../components/public/Loading'
    import {mapGetters} from 'vuex'
    import SockJS from 'sockjs-client'
    import Stomp from 'stompjs'
    import {MessageBox} from 'mint-ui';

    export default {
        components: {
            TeacherHeader,
            ScrollContent,
            TeacherTopic,
            Loading
        },
        data() {
            return {
                //课堂人数
                studentCount: 0,
                //课堂状态
                courseStatus: '',
                loading: true,                               //页面加载状态
                pageShow: false,                             //页面内容显示
                mescrollValue: {up: false, down: false},     //页面你是否需要下拉上拉加载
                header: {                                    //头部标题内容
                    title: '课堂详情',
                    url: '/teacherIndex'
                },
                //课堂的所有内容
                classMsg: {},
                showTopicList: [],
                //ws地址
                wsUrl: 'http://school.jichuangsi.com:81',
                //保存ws的对象
                stompClient: null,
                subscription: null,
                //用户token
                token: localStorage.getItem('token')
            }
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'courseId',
                'courseName'
            ])
        },
        mounted() {
            this.getTClassroom();
            this.connect();
            this.start();
        },
        methods: {
            //页面获取数据
            getTClassroom() {
                let _this = this;
                getCourse(_this.courseId)
                    .then(res => {
                        _this.pageShow = true;
                        _this.loading = false;
                        _this.classMsg = res.data.data;
                        let objective = 0;
                        let subjective = 0;
                        _this.courseStatus = this.classMsg.courseStatus;
                        for (let i = 0; i < this.classMsg.questions.length; i++) {
                            if (this.classMsg.questions[i].quesetionType === 'objective') {
                                objective++;
                                this.classMsg.questions[i].title = '客观题-' + objective;
                                this.classMsg.questions[i].acc = 0;
                                this.classMsg.questions[i].count = 0;
                                this.showTopicList.push(this.classMsg.questions[i])

                            } else if (this.classMsg.questions[i].quesetionType === 'subjective') {
                                subjective++;
                                this.classMsg.questions[i].title = '主观题-' + subjective;
                                this.classMsg.questions[i].acc = 0;
                                this.classMsg.questions[i].count = 0;
                                this.showTopicList.push(this.classMsg.questions[i])
                            }
                        }
                        this.getQuestionStatisticsList();
                    })
                    .catch(err => {
                        console.log(err);
                    });
                //获取当前课堂人数
                getCourseStatistics(_this.courseId)
                    .then(res => {
                        _this.studentCount = res.data.data.studentCount;
                        _this.pageShow = true;
                        _this.loading = false;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            //获取题目的正确率人数初始值
            getQuestionStatisticsList() {
                let self = this;
                getQuestionStatisticsList(self.courseId)
                    .then(res => {
                        self.showTopicList.forEach((topic, i) => {
                            res.data.data.list.forEach((r) => {
                                if (r.questionId === topic.questionId) {
                                    topic.acc = r.acc;
                                    topic.count = r.count;
                                    self.$set(self.showTopicList[i], i, topic);
                                }
                            })
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            //改变课堂状态
            async updateState() {
                switch (this.courseStatus) {
                    case 'NOTSTART':
                        try {
                            await MessageBox.confirm('', {message: '是否开始上课'});
                            await changeCourseStatus(this.courseId, "PROGRESS");
                            await courseStart(this.courseId);
                            this.classMsg.courseStatus = 'PROGRESS';
                        } catch (e) {
                            console.log(e);

                        }
                        break;
                    case 'PROGRESS':
                        try {
                            await MessageBox.confirm('', {message: '是否结束课程'});
                            await changeCourseStatus(this.courseId, "FINISH");
                            this.classMsg.courseStatus = 'FINISH';
                        } catch (e) {
                            console.log(e);
                        }
                        break;
                    case 'FINISH':
                        break;
                }
            },
            async start() {
                if (this.courseStatus == 'PROGRESS') {
                    await courseStart(this.courseId);
                    await changeCourseStatus(this.courseId, this.courseStatus);
                }
            },
            //下拉刷新
            loadData(pageIndex) {
                setTimeout(() => {
                    this.$refs.myscrollfull.endByPage(1, 1);
                    //第一个参数：当前页获取的数据总数；第二个参数：列表总页数
                }, 2000)
            },
            //转换时间
            time(courseEndTime) {
                let times = parseInt(courseEndTime);
                let date = new Date(times);
                let month = (date.getMonth() + 1 > 10 ? 0 + (date.getMonth() + 1) : date.getMonth() + 1);
                let day = date.getDate();
                let hours = date.getHours();
                let minutes = date.getMinutes();
                return month + '月' + day + '日\t' + hours + ':' + minutes;
            },
            //连接方法
            connect() {
                //地址+端点路径，构建websocket链接地址
                let socket = new SockJS(this.wsUrl + '/websocket/course');
                this.stompClient = Stomp.over(socket);//一些老的浏览器不支持WebSocket的脚本或者使用别的名字。默认下，stomp.js会使用浏览器原生的WebSocket class去创建WebSocket。利用Stomp.over(ws)这个方法可以使用其他类型的WebSockets。这个方法得到一个满足WebSocket定义的对象
                this.stompClient.heartbeat.outgoing = 400000;  // client will send heartbeats every 40000ms
                this.stompClient.heartbeat.incoming = 0;      // client does not want to receive heartbeats from the server
                //连接时的请求头部信息
                let headers = {
                    login: 'mylogin',
                    passcode: 'mypasscode',
                    // additional header
                    userId: 'curUserId',
                    accessToken: this.token
                };

                //创建连接并在连接成功后订阅班级为“2018001”班级的信息
                let _this = this;
                this.stompClient.connect(headers, function (frame) {
                    console.log('Connected:' + frame);

                    let subHeader = {
                        userId: 'curUserId',
                        accessToken: _this.token
                    };//订阅时的头信息
                    //监听的路径以及回调。返回的subscription用于取消订阅
                    //监听课堂人数
                    _this.subscription = _this.stompClient.subscribe('/queue/course/teacher/cs/' + _this.courseId, function (response) {
                        _this.classNumber(response);
                    }, subHeader);
                    //监听课堂提交答案
                    _this.stompClient.subscribe('/queue/course/teacher/qs/' + _this.courseId, function (response) {
                        _this.classAnswer(response);
                    }, subHeader);
                });
            },
            //上课人数
            classNumber(response) {
                let classData = JSON.parse(response.body);
                if (classData.data) {
                    this.studentCount = classData.data.studentCount
                }
            },
            //上课提交的答案
            classAnswer(response) {
                let _this = this;
                let classData = JSON.parse(response.body);
                if (classData.data) {
                    _this.showTopicList.forEach((topic, index) => {
                        if (topic.questionId && topic.questionId === classData.data.questionId) {
                            if (topic.questionId === classData.data.questionId) {
                                topic.acc = classData.data.acc;
                                topic.count = classData.data.count;
                                Vue.set(_this.showTopicList, index, topic);
                            }
                        }
                    });
                }
            }
        }
    }
</script>

<style lang="scss">
    .TClassroom {
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
            padding: 2.36rem 3.34rem 3.14rem;
            height: auto !important;
            .subjectAvatar {
                width: 13.43rem;
                height: 13.43rem;
                background-color: red;
                margin: 0 auto;
                border-radius: 10%;
            }
            .subjectName {
                padding-top: 1.14rem;
                padding-bottom: 2.29rem;
                text-align: center;
                font-size: 32px;
                position: relative;
                &:before {
                    content: "";
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-bottom: 1px solid rgba(230, 230, 230, 1);
                    -webkit-transform: scaleY(.5);
                    -webkit-transform-origin: 0 0;
                }
            }
            .msg {
                padding: 1.71rem 0;
                height: 9.14rem;
                font-size: 18px;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                .left {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .row {
                        span {
                            color: #999999;
                        }
                        .people {
                            color: #80D59C;
                            font-size: 34px;
                        }
                    }
                }
                .right {
                    width: 8.57rem;
                    height: 3rem;
                    background-color: rgba(128, 213, 156, 1);
                    border-radius: 100px;
                    text-align: center;
                    line-height: 3rem;
                    color: rgba(255, 255, 255, 1);
                }
                .class {
                    background-color: #8E78F0;
                }
                .class:active {
                    background-color: #7262c2;
                    box-shadow: 0 2px 6px 3px #7262c2;
                }
                .view {
                    background-color: #888888;
                }
                .started {
                    background-color: #69B482;
                }
                .started:active {
                    background-color: #4a9460;
                    box-shadow: 0 2px 6px 3px #4a9460;
                }
                &:before {
                    content: "";
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-bottom: 1px solid rgba(230, 230, 230, 1);
                    -webkit-transform: scaleY(.5);
                    -webkit-transform-origin: 0 0;
                }
            }
            .subjectTitle {
                height: 2rem;
                position: relative;
                margin: 1.43rem 0 1.07rem;
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
        }
    }
</style>
