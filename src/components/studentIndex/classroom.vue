/* eslint-disable vue/valid-v-bind */
<template>
    <div class="classroomList">
        <public-header :header="header"/>
        <scroll-content ref="myscrollfull" @load="loadData" @reload="reloadData" v-if="pageShow" @init="mescrollInit"
                        :tips="tips">
            <!--<div slot="empty" style="text-align: center">无任何数据</div>-->
            <div class="navbox">
                <div v-for="(item,index) in nav" :key="index" :class="{navcolor:navindex == index}" @click="navclick(item,index)">{{item}}</div>
            </div>
            <div class="tips" v-if="classNew"><span class="point"></span><span class="text">老师布置了新题目</span></div>
            <!--今天的课堂-->
            
            <div
                    class="list"
                    :class="{nowClass:item.courseStatus === 'PROGRESS',newClass:newborder==1&&index==0}"
                    v-for="(item,index) in classList" :key="index"
                    v-if="item.subjectName == navtext || navtext == '全科'"
                    @click="goClassroom(item.courseId,item.courseName)"
            >
                <div class="subject">
                    <div class="subject_img">
                        <img src="../../../public/images/classroom.png" v-if="item.subjectId==null">
                        <img src="../../assets/语文_03.png" v-if="item.subjectId==1">
                        <img src="../../assets/数学_03.png" v-if="item.subjectId==2">
                        <img src="../../assets/英语_03.png" v-if="item.subjectId==3">
                        <img src="../../assets/历史_03.png" v-if="item.subjectId==4">
                        <img src="../../assets/地理_03.png" v-if="item.subjectId==5">
                        <img src="../../assets/政治_03.png" v-if="item.subjectId==6">
                        <img src="../../assets/生物_03.png" v-if="item.subjectId==7">
                        <img src="../../assets/物理_03.png" v-if="item.subjectId==8">
                        <img src="../../assets/化学_03.png" v-if="item.subjectId==9">
                    </div>
                    <div class="subject_details">
                        <p class="name">{{item.courseName}}</p>
                        <p class="teacher">任课老师：{{item.teacherName}}</p>
                        <p class="time" v-if="item.courseStatus==='FINISH'"><span class="iconfont">&#xe61b;</span>
                            <span>{{time(item.courseEndTime)}}</span></p>
                    </div>
                </div>
                <div class="subjectState processing" v-if="item.courseStatus==='PROGRESS'">课程进行中</div>
                <div class="subjectState startTime" v-if="item.courseStatus==='NOTSTART'">开始时间：{{time(item.courseStartTime)}}</div>
                <div class="subjectState end" v-if="item.courseStatus==='FINISH'">已结束</div>
            </div>
            <div class="history" v-if="classroomState">上拉查看历史信息</div>
        </scroll-content>
        <loading v-if="loading"/>
    </div>
</template>

<script>
    import PublicHeader from '../public/PublicHeader.vue'
    import ScrollContent from '../public/ScrollContent.vue'
    import Loading from '../public/Loading'
    import {getHistory, goCLassroom} from '@/api/student/classroom'
    import {mapGetters} from 'vuex'
    import store from '@/store'
    import SockJS from 'sockjs-client'
    import Stomp from 'stompjs'
    import {Toast} from 'mint-ui';

    export default {
        components: {
            PublicHeader,
            ScrollContent,
            Loading
        },
        data() {
            return {
                navtext:'全科',
                navindex:0,
                nav: ['全科', '语文', '数学', '英语', '政治', '地理', '历史', '生物', '物理', '化学'],
                current: '',
                newborder: 0,
                //课堂页码
                classroomPage: 100,
                //判断课堂还有没有
                classroomState: true,
                loading: true,            //页面加载状态
                pageShow: false,          //页面显示状态
                //课堂数据
                classList: [],
                classNew: '',             //是否有新作业状态
                header: {                 //头部标题
                    title: '课堂列表'
                },
                tips: '没有更多课堂列表',                             //页面加载到最后提示文字
                wsUrl: this.apiHost(), //'http://api.jichuangsi.com',
                stompClient: null,
                subscription: null,
                token: localStorage.getItem("token"),
                classId: '',
                mescroll: null,
                tabFired: false
            }
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'classroomList',
                'isCNew'
            ])
        },
        mounted() {
            // this.getClassroomList();
            // 判断vuex里面是否有数据
            this.classId = JSON.parse(localStorage.getItem("user")).roles[0].primaryClass.classId;
            if (!this.classroomList||this.classroomList.length === 0) {
                let _self = this;
                let networkState = navigator.connection.type;
                //console.log(networkState);
                if (networkState === "unknown") {
                    document.addEventListener("online", function(){
                        //console.log(_self.tabFired);
                        if(!_self.tabFired){
                            _self.getClassroomList();
                            _self.tabFired = true;
                        }
                    });
                }else{
                    this.getClassroomList();
                }
            } else {
                this.pageShow = true;
                this.loading = false;
            }
            //this.connect();
        },
        activated(){
            this.tabFired = false;
            //console.log("isCNew:" + this.isCNew);
            if(this.isCNew){
                this.classId = JSON.parse(localStorage.getItem("user")).roles[0].primaryClass.classId;
                store.commit('SET_HISTORY', []);
                this.getClassroomList();
                this.mescroll.resetUpScroll();
                store.commit('IS_CNEW', false);
            }
            this.connect();
        },
        methods: {
            //选择科目
            navclick(item,index) {
                this.navindex = index
                this.navtext = item
            },
            mescrollInit (mescroll) {
                this.mescroll = mescroll;
            },
            //页面加载获取数据
            getClassroomList() {
                this.$store.dispatch('getClassList').then((res) => {
                    this.pageShow = true;
                    this.loading = false;
                    this.classList = this.classroomList;
                    //this.time()
                    //console.log(this.classList)
                }).catch((err) => {
                    console.log('err in getClassroomList', err);
                    this.pageShow = true;
                    this.loading = false;
                    /*let msg = this.getMsg(err);
                    if(msg){
                        Toast({
                            message: msg,
                            position: 'middle',
                            duration: 2000
                        });
                    }*/
                });
            },
            //上拉加载数据
            loadData(pageIndex) {
                setTimeout(() => {
                    getHistory(pageIndex)
                        .then(res => {
                            console.log(res.data.data.content);
                            store.commit('SET_HISTORY', res.data.data.content);
                            this.classList = this.classroomList;
                            this.removeRepeat(this.classList, 'courseId');
                            this.classroomPage = res.data.data.pageCount;
                            if (this.classroomPage === pageIndex) {
                                this.classroomState = false
                            }
                            this.$refs.myscrollfull.endByPage(res.data.data.pageSize, res.data.data.pageCount);
                        })
                        .catch(err => {
                            console.log('err', err);
                            this.mescroll.endErr();
                            /*let msg = this.getMsg(err);
                            if(msg){
                                Toast({
                                    message: msg,
                                    position: 'middle',
                                    duration: 2000
                                });
                            }*/
                        })
                }, 2000)
            },
            //下拉刷新数据
            reloadData() {
                let _this = this;
                setTimeout(function () {

                    let arr1 = [];
                    //if(!_this.classroomState){
                        arr1 = _this.classList;
                    //}
                    //console.log(arr1);
                    //_this.getClassroomList();
                     _this.$store.dispatch('getClassList').then((res) => {
                         _this.classList = _this.classroomList;
                         //if(!_this.classroomState){
                             let arr2 = _this.classList;
                             //console.log(arr2);
                             if(arr1&&arr1.length>0){
                                 let arr3 = [];
                                 arr1.forEach((item, index)=>{
                                     let i = arr2.findIndex(x=>{
                                         return x.courseId === item.courseId;
                                     });
                                     if(i === -1){
                                         arr3.push(arr1[index]);
                                     }
                                     //console.log(arr3);
                                 });
                                 let j = arr2.findIndex(x=>{
                                     return x.courseStatus === 'FINISH';
                                 });
                                 arr3.forEach((item, index)=>{
                                     item.courseStatus = 'FINISH';
                                     if(j === -1){
                                         _this.classList.push(item);
                                     }else{
                                         _this.classList.splice(j++, 0, item);
                                     }
                                 })
                                 //console.log(_this.classList);
                                 _this.removeRepeat(_this.classList, 'courseId');
                             }
                         //}
                     }).catch(err=>{
                         console.log('err', err);
                         _this.mescroll.endErr();
                     });
                    _this.$refs.myscrollfull.endSuccess();
                }, 1000)
            },
            removeRepeat(arr, key){
                for(let i = 0; i < arr.length; i++) {
                    for(let j = i+1; j < arr.length; j++) {
                        if(arr[i][key] === arr[j][key]){
                            arr.splice(j, 1);
                            j = j-1;  // 关键，因为splice()删除元素之后，会使得数组长度减小，此时如果没有j=j-1的话，会导致相同id项在重复两次以上之后无法进行去重，且会错误删除id没有重复的项。
                        }
                    }
                }
            },
            //把毫秒换算成正常时间
            time(time) {
                let times = parseInt(time);
                let date = new Date(times);
                let month = (date.getMonth() + 1 > 10 ? 0 + (date.getMonth() + 1) : date.getMonth() + 1);
                let day = date.getDate();
                let hours = date.getHours();
                let minutes = date.getMinutes();
                return month + '月' + day + '日\t' + hours + ':' + minutes;
                /*let times = parseInt(time);
                let date = new Date(times);
                let year = date.getFullYear();
                let month = (date.getMonth() + 1 > 10 ? 0 + (date.getMonth() + 1) : date.getMonth() + 1);
                let day = date.getDate();
                let hours = date.getHours();
                let minutes = date.getMinutes();
                return year + '.' + month + '.' + day + '.\t' + hours + ':' + minutes;*/
            },
            //给课堂列表路由传id跟课堂名字
            goClassroom(Id, courseName) {
                        if (Id === this.current) {
                            this.newborder = 0
                            this.$emit("messageout",{"message": null, "type": 1})
                        }
                this.$router.push({
                    path: '@/pages/student/classroom/show',
                    name: 'classroom',
                    query: {
                        courseId: Id,
                        courseName: courseName
                    }
                });
                //调用加入课堂接口
                goCLassroom(Id)
                    .then(res => {
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(err);
                    });
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
                    _this.subscription = _this.stompClient.subscribe('/topic/group/student/'+_this.classId, function (response) {
                        _this.classData(response);
                    }, subHeader);
                });
            },
            //上课提示回调
            classData(response) {
                let classData = JSON.parse(response.body);
                console.log(classData);
                if (classData.data) {
                    for (let i = 0; i < this.classList.length; i++) {
                        if (classData.data.courseId === this.classList[i].courseId) {
                            this.classList[i].courseStatus = 'PROGRESS'
                            // sessionStorage.setItem("message", "提示");
                            this.current = this.classList[i].courseId
                            let index_i = i
                            let first = this.classList.splice(index_i,1)[0]
                            this.classList.unshift(first)
                            this.newborder = 1
                            this.$emit("message",{"message": "提示", "type": 1})
                            Toast({
                                message: this.classList[0].courseName + '上课了',
                                position: 'middle',
                                duration: 5000
                            });
                        }
                    }
                }
            }
        },
        beforeDestroy() {
            //取消订阅
            this.stompClient.unsubscribe('/topic/group/student/'+this.classId);
        }
    }
</script>

<style lang="scss" scoped>
    .classroomList {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('../../assets/allbj.png') no-repeat;
        .navbox {
            margin-top: 40px;
            div {
                font-size: 18px;
                display: inline-block;
                padding: 5px 10px;
                text-decoration:underline;
                margin-left: 10px;
            }
            .navcolor {
                color:#fff;
                background-color: #5ea6ec;
                border-radius: 5px;
                text-decoration:none;
            }
        }
        .mescroll {
            box-sizing: border-box;
            position: absolute;
            top: 3.15rem;
            bottom: 6rem;
            padding: 0 2rem;
            height: auto !important;
            /*background-color: #f4f4f4;*/
            .empty {
                text-align: center;
                font-size: 18px;
                padding-top: 1.79rem
            }
            .tips {
                width: 13.57rem;
                height: 2.71rem;
                display: flex;
                align-items: center;
                padding: 0 1.79rem;
                margin: 2.29rem auto 0;
                border: 1px solid #888888;
                box-sizing: border-box;
                border-radius: 32px;
                .point {
                    display: inline-block;
                    width: .43rem;
                    height: .43rem;
                    background-color: rgba(254, 218, 62, 1);
                    border-radius: 50%;
                    margin-right: .57rem;
                }
                .text {
                    font-size: 14px;
                    line-height: 2.71rem;
                    display: inline-block;
                    color: rgba(136, 136, 136, 1);
                }
            }
            .list {
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 18px;
                margin-top: 2.29rem;
                padding: 1.43rem 1.43rem;
                background-color: white;
                border-radius: 18px;
                box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.18);
                .subject {
                    display: flex;
                    .subject_img {
                        width: 9rem;
                        height: 9rem;
                        margin-right: 1.43rem;
                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 18px;
                        }
                    }
                    .subject_details {
                        .name {
                            box-sizing: border-box;
                            padding-top: 1.57rem;
                            font-size: 24px;
                            color: rgba(53, 53, 53, 1);
                        }
                        .teacher {
                            box-sizing: border-box;
                            padding-top: 1.57rem;
                            font-size: 22px;
                            color: rgba(136, 136, 136, 1);
                            padding-bottom: .5rem;
                        }
                        .time {
                            display: flex;
                            font-size: 18px;
                            line-height: 30px;
                            color: rgba(136, 136, 136, 1);
                            span:nth-child(1) {
                                font-size: 20px;
                                padding-right: .71rem;
                            }
                        }
                    }
                }
                .subjectState {
                    font-size: 22px;
                    color: rgba(142, 120, 240, 1);
                }
                .processing {
                    position: relative;
                    border-radius: 27px;
                    padding: .5rem 2rem .5rem 1rem;
                    background-color: #5ea6ec;
                    color: white;
                    &:before {
                        content: " ";
                        display: inline-block;
                        height: 8px;
                        width: 8px;
                        border-width: 2px 2px 0 0;
                        border-color: white;
                        border-style: solid;
                        -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) translateY(-50%);
                        position: absolute;
                        top: 50%;
                        right: 18px;
                        margin-top: -2px;
                    }
                }
                .startTime {
                    color: rgba(105, 180, 130, 1);
                }
                .end {
                    color: rgba(136, 136, 136, 1);
                }
            }
            .nowClass {
                box-shadow: inset 0 0px 10px rgba(0, 0, 0, 0.18), 0 2px 10px 0 rgba(0, 0, 0, 0.3);
            }
            .newClass {
                border: 1px solid #80d59c;
            }
            .history {
                padding: 2.29rem 0 0;
                font-size: 18px;
                text-align: center;
            }
        }
    }
</style>
