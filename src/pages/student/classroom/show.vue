<template>
  <div class="classroom">
    <public-header :header="header" />
    <scroll-content ref="myscrollfull" :mescrollValue="mescrollValue" v-if="pageShow">
      <!--时间-->
      <div class="time">{{hours}}:{{minutes}}</div>
      <!--预习要点-->
      <preview-points :preview="preview" :attachmentsfile="attachments" :attachmentsstatus="attachmentsstatus" v-if="preview||attachments.length>0||attachmentsstatus" />
      <div class="class_topic_warp" v-for="(item,index) in showTopicList" :key="index">
        <!--客观题-->
        <div class="objective_warp" v-if="item.quesetionType==='objective'">
          <class-objective :objective="item" @selectAnswer="selectAnswer" @Multipleanswers="Multipleanswers"/>
          <div class="submit_warp" v-if="item.questionStatus !== 'FINISH'">
            <div class="objective_submit" @click="objective_submit(item.questionId)">
            </div>
          </div>
          <reply :reply="reply" :type="item.type" :id="item.questionId" />
          <!--老师关闭回答-->
          <div class="closeReply" v-if="item.questionStatus === 'FINISH'">
            <span class="text">老师已终止{{item.title}}的作答</span>
          </div>
        </div>
        <!--主观题-->
        <div class="subjective_warp" v-if="item.quesetionType ==='subjective'">
          <subjective :subjectiveTopic="item" />
          <div class="button_warp" v-if="item.questionStatus !=='FINISH'&&objectiveAnswer[index].show">
            <div class="subjective_submit Answerstart" v-show="!objectiveAnswer[index].answer" @click="answerQuestions(item.questionId, item.questionContent, item.questionPic)">
            </div>
            <div class="subjective_submit Answermodify" v-show="objectiveAnswer[index].answer" @click="modifyAnswer(item.questionId, item.questionContent, item.questionPic)">
            </div>
          </div>
          <div class="load"  v-show="!isAnswer(objectiveAnswer[index].answer)" v-if="item.answerForStudent||item.answerForTeacher">
              <div><span>loading...</span><i></i></div>
          </div>
          <board :subjectiveAnswer="objectiveAnswer" :id="item.questionId" v-show="isAnswer(objectiveAnswer[index].answer)" />
          <!--老师关闭回答-->
          <div class="closeReply" v-if="item.questionStatus === 'FINISH'">
            <span class="text">老师已终止{{item.title}}的作答</span>
          </div>
        </div>
      </div>
      <div id="btn" :class="{'awbtn':btn===current}" @click="Answerbtn">
        <img src="@/assets/答案.png" alt="">
      </div>
    </scroll-content>
    <div class="AnswerShare" v-show="AnswerShareshow">
      <span class="btnout" @click="btnout">x</span>
      <div class="AnswerShareList" v-for="(item,index) in AnswerShareList" :key="index">
        <div :id="item.id" class="question" v-html="item.title">{{item.title}}</div>
        <div class="answerimg"><img :src="item.img" alt=""></div>
      </div>
    </div>
    <loading v-if="loading" />
        <div class="Responderbox" v-if="qdshow">
            <div class="qdbox">
                <div class="text">是否抢答</div>
                <div class="cancel" @click="qdshow = false">取消</div>
                <div class="confirm" @click="qdconfirm">确认</div>
            </div>
        </div>
    <!--<div class="imgbox" v-if="imgboxshow">
      <img :src="imgsrc" alt="">
    </div>-->
  </div>
</template>

<!--课堂详情-->

<script>
import ClassObjective from "../../../components/topicList/classObjective";
import PublicHeader from "../../../components/public/PublicHeader";
import ScrollContent from "../../../components/public/ScrollContent";
import PreviewPoints from "../../../components/topicList/previewPoints";
import Subjective from "../../../components/topicList/subjective";
import Reply from "../../../components/classroom/Reply";
import Board from "../../../components/board/Board";
import Loading from "../../../components/public/Loading";
import {
  getCourse,
  getSubjectPic,
  sendObjectiveAnswer,
  sendSubjectiveAnswer,
  sendSubjectPicByString,
  raceAnswer
} from "@/api/student/classroom";
import { MessageBox,Indicator, Toast } from "mint-ui";
import { mapGetters } from "vuex";
import store from "@/store";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import html2canvas from 'html2canvas'
// import topic from "../../../store/modules/teacher/topic";

export default {
  components: {
    PublicHeader,
    ScrollContent,
    PreviewPoints,
    Subjective,
    Reply,
    Board,
    Loading,
    ClassObjective
  },
  data() {
    return {
      timeweb:'',
        /*imgboxshow:false,
        imgsrc:'',*/
        raceId:'',
      qdshow:false,
      attachmentsstatus:'',
      attachments:[],
      objectiveAnswerbtn:false,
      AnswerShareList: [],
      AnswerShareshow: false,
      btn: 1,
      current: 0,
      //计算现在是第几个客观题
      objectiveCount: 0,
      //计算现在是第几个主观题
      subjectiveCount: 0,
      //课堂传过来的id
      course: "",
      progress: 0,
      subjectiveId: "",
      //题目列表
      topicList: [],
      //发过来的id
      topicListId: [],
      //渲染的数组
      showTopicList: [],
      //页面是否需要滚动
      mescrollValue: {
        up: false,
        down: false
      },
      //页面加载状态
      loading: true,
      //页面显示状态
      pageShow: false,
      //头部显示标题
      header: {
        //title是课堂列表传过来的
        title: "",
        url: "/studentIndex"
      },
      //预习要点内容
      preview: "",
      //题目当前选择答案
      objectiveAnswer: [],
      //客观题历史答案答案
      reply: [],
      //时
      hours: 0,
      //分
      minutes: 0,
      wsUrl: this.apiHost(), //'http://api.jichuangsi.com',
      stompClient: null,
      subscription: null,
      token: localStorage.getItem("token")
    };
  },
  watch: {
    boardImg(val) {
      let _this = this;
      _this.objectiveAnswer.forEach((answer, index) => {
        if (answer.id === _this.subjectiveId) {
          answer.answer = val.data;
          this.$set(_this.objectiveAnswer, index, answer);
        }
      });
      //主观题答案存根
      sendSubjectPicByString(val.data)
        .then(res => {
          Toast({
            message: "图片存储成功！",
            position: "middle",
            duration: 1000
          });
          //提交主观题答案
          sendSubjectiveAnswer(
            this.course,
            this.subjectiveId,
            123,
            "test",
            res.data.data.stubForSubjective
          )
            .then(res => {
              console.log(res);
              Toast({
                message: "答案提交成功！",
                position: "middle",
                duration: 1000
              });
            })
            .catch(err => {
              Toast({
                message: "答案提交失败！",
                position: "middle",
                duration: 1000
              });
              console.log(err);
            });
        })
        .catch(err => {
          Toast({
            message: "图片存储失败！",
            position: "middle",
            duration: 1000
          });
          console.log(err);
        });
    }
  },
  mounted() {
    this.getCourseId();
    this.getClassrooms();
    let time = new Date(); //修改数据date
    this.hours = time.getHours();
    this.minutes = time.getMinutes();
    if (this.minutes < 10) {
      this.minutes = "0" + this.minutes;
    }
    this.time();
    this.connect();
    this.connectfile()
    this.setTime()
  },
  computed: {
    //vuex 调用
    ...mapGetters(["isBoard", "isBlueTooth", "boardImg"])
  },
  methods: {
            setTime(){
                let self = this
                this.timeweb = setInterval(() => {
                try {
                self.stompClient.send("test");
                } catch (err) {
                console.log("断线了: " + err);
                self.connect();
                }
                }, 20000);
            },
    //抢答
    qdconfirm(){
      var timestamp=new Date().getTime()
      raceAnswer(this.course,this.raceId,timestamp).then(res=>{
              this.qdshow = false
        })
    },
    Answerbtn(){
      this.AnswerShareshow = true;
    },
    btnout() {
      this.btn = 1;
      this.AnswerShareshow = false;
    },
    //判断学生有没有回答主观题，终止作答时图片位置显不显示
    isAnswer(answer) {
      if (answer) {
        return true;
      } else {
        return false;
      }
    },
    //开始回答
    answerQuestions(id, content, pic) {
        if(!this.objectiveAnswerbtn){
            this.objectiveAnswerbtn = true;
        }else{
            return;
        }
        /*Indicator.open({
            text: "正在启动手写板...",
            spinnerType: "fading-circle"
        });*/
        let self = this;
        //document.getElementById('tp'+id).setAttribute('style', 'letter-spacing: 4px !important;padding-top: 8px !important');
        html2canvas(document.getElementById('tp'+id),{
            useCORS: true,
            logging:false,
            /*ignoreElements(element){
                let type = element.type
                if ( type && type === 'text' ) {
                    console.log(element);
                    return true;
                }
                return false;
            }*/
            //backgroundColor: null
        }).then((canvas) => {
          // console.log(canvas.toDataURL("image/png"))
            let dataURL = canvas.toDataURL("image/png").replace("data:image/png;base64,","");
            //console.log(dataURL)
            //document.getElementById('tp'+id).setAttribute('style', 'letter-spacing:"";padding-top: ""');
            self.subjectiveId = id;
            window.HandwrittenBoard.isConnect(
                function(res) {
                    console.log(res);
                },
                function(res) {
                    console.log(res);
                    //Indicator.close();
                    switch (res.data.status) {
                        case 0:
                            if(!localStorage.getItem("bluetooth")) store.commit("SET_BLUETOOTH", true);
                            window.HandwrittenBoard.exploration();
                            console.log("第一个");
                            self.objectiveAnswerbtn = false;
                            break;
                        case 1:
                            console.log("第二个");
                            self.objectiveAnswerbtn = false;
                            break;
                        case 2:
                            var q = {content:dataURL,pic:pic,base64img:""};
                            window.HandwrittenBoard.getBase64img(q);
                            console.log("第三个");
                            self.objectiveAnswerbtn = false;
                            break;
                        default:
                            break;
                    }
                }
            );
        });
    },
    //添加题目
    addTopic(topicId) {
      let self = this;
      self.topicList.forEach(topic => {
        if (topic.questionId === topicId) {
          let tmp = JSON.parse(JSON.stringify(topic));
          switch (topic.quesetionType) {
            case "objective":
              self.objectiveCount++;
              tmp.title = "客观题-" + self.objectiveCount;
              break;
            case "subjective":
              self.subjectiveCount++;
              tmp.title = "主观题-" + self.subjectiveCount;
              break;
            default:
              //TODO:UNUSE CASE
              return;
          }
          self.showTopicList.push(tmp);
          self.objectiveAnswer.push({ id: topic.questionId, answer: "", show: false });
        }
      });
    },
    //修改答案
    modifyAnswer(id, content, pic) {
        if(!this.objectiveAnswerbtn){
            this.objectiveAnswerbtn = true;
        }else{
            return;
        }
        /*Indicator.open({
            text: "正在启动手写板...",
            spinnerType: "fading-circle"
        });*/
        let self = this;
        //document.getElementById('tp'+id).setAttribute('style', 'letter-spacing: 4px !important;padding-top: 8px !important');
        html2canvas(document.getElementById('tp'+id),{
            useCORS: true,
            logging:false,
            /*ignoreElements(element){
                let type = element.type
                if ( type && type === 'text' ) {
                    console.log(element);
                    return true;
                }
                return false;
            }*/
            //backgroundColor: null
        }).then((canvas) => {
            // console.log(canvas.toDataURL("image/png"))
            let dataURL = canvas.toDataURL("image/png").replace("data:image/png;base64,","");
            //console.log(dataURL)
            /*let dataURL = canvas.toDataURL("image/png");
            this.imgsrc = dataURL
            this.imgboxshow = true*/
            //document.getElementById('tp'+id).setAttribute('style', 'letter-spacing:"";padding-top: ""');
            self.subjectiveId = id;
            let answer = "";
            for (let i = 0; i < this.objectiveAnswer.length; i++) {
                if (id === this.objectiveAnswer[i].id) {
                    answer = this.objectiveAnswer[i].answer;
                }
            }
            window.HandwrittenBoard.isConnect(
                function(res) {
                    console.log(res);
                },
                function(res) {
                    console.log(res);
                    //Indicator.close();
                    switch (res.data.status) {
                        case 0:
                            if(!localStorage.getItem("bluetooth")) store.commit("SET_BLUETOOTH", true);
                            window.HandwrittenBoard.exploration();
                            console.log("第一个");
                            self.objectiveAnswerbtn = false;
                            break;
                        case 1:
                            console.log("第二个");
                            self.objectiveAnswerbtn = false;
                            break;
                        case 2:
                            var q = {content:dataURL,pic:pic,base64img:answer};
                            window.HandwrittenBoard.getBase64img(q);
                            console.log("第三个");
                            self.objectiveAnswerbtn = false;
                            break;
                        default:
                            break;
                    }
                }
            );
        });
    },
    //选择题答案
    // 单选
    selectAnswer(id, title) {
      for (let i = 0; i < this.objectiveAnswer.length; i++) {
        if (this.objectiveAnswer[i].id === id) {
          this.objectiveAnswer[i].answer = title;
        }
      }
    },
    // 多选题答案
    Multipleanswers(id, title){
      for (let i = 0; i < this.objectiveAnswer.length; i++) {
        if (this.objectiveAnswer[i].id === id) {
          this.objectiveAnswer[i].answer = title;
          console.log(this.objectiveAnswer[i].answer)
        }
      }
    },
    //客观题点击提交
    objective_submit(id) {
      for (let i = 0; i < this.objectiveAnswer.length; i++) {
        //答案数组id跟当前选中题目id一致
        if (this.objectiveAnswer[i].id === id) {
          //当前选中题目的答案为空
          if (!this.objectiveAnswer[i].answer) {
            return false;
          }
          //答案数组长度为零的时候
          if (this.reply.length === 0) {
            this.reply.push({
              id: id,
              answer: [this.objectiveAnswer[i].answer]
            });
            this.sendObjective(id, this.objectiveAnswer[i].answer);
            return false;
          }

          let state = false;
          //答案数组不为零，但是又没有跟这个当前选中题目id相同的就是把state改成true
          for (let j = 0; j < this.reply.length; j++) {
            //判断上次一次的答案跟这一次是否一样
            if (this.reply[j].id === id) {
              if (
                this.reply[j].answer[this.reply[j].answer.length - 1] ===
                this.objectiveAnswer[i].answer
              ) {
                return false;
              } else {
                this.reply[j].answer.push(this.objectiveAnswer[i].answer);
                this.sendObjective(id, this.objectiveAnswer[i].answer);
                state = true;
                return false;
              }
            }
          }
          //当state状态为false执行
          if (state === false) {
            console.log(this.objectiveAnswer[i].answer);
            this.reply.push({
              id: id,
              answer: [this.objectiveAnswer[i].answer]
            });
            this.sendObjective(id, this.objectiveAnswer[i].answer);
            return false;
          }
        }
      }
    },
    //提交客观题答案
    sendObjective(id, answer) {
      //客观题答案提交
      sendObjectiveAnswer(this.course, id, 123, "test", answer)
        .then(res => {
          Toast({
            message: "答案提交成功！",
            position: "middle",
            duration: 1000
          });
          console.log(this.reply);
        })
        .catch(err => {
          Toast({
            message: "答案提交失败！",
            position: "middle",
            duration: 1000
          });
          console.log(err);
        });
    },
    questions() {
      if (this.isBoard) {
        Indicator.open({
          text: "正在获取手写板内容...",
          spinnerType: "fading-circle"
        });
        let self = this;
        setTimeout(function() {
          window.HandwrittenBoard.take(function(res) {
            console.log(res);
            self.img = res.data.image;
            Indicator.close();
            Toast("获取手写板内容成功!");
            window.HandwrittenBoard.cleanup(function() {});
          });
        }, 300);
      } else {
        window.HandwrittenBoard.exploration();
      }
    },
    //页面运行去获取数据
    async getClassrooms() {
      let self = this;
      let res = await getCourse(self.course);
      console.log(res);
      self.topicList = res.data.data.questions;
      self.preview = res.data.data.courseInfo;
      self.attachments = res.data.data.attachments;
      self.pageShow = true;
      self.loading = false;

      for (let index = 0; index < self.topicList.length; index++) {
        let t = self.topicList[index];
        if (t.questionStatus != "NOTSTART") {
          self.addTopic(t.questionId);
        }
        /*if (t.answerForStudent) {
          if (t.quesetionType === "objective") {
            self.reply.push({
              id: t.questionId,
              answer: [t.answerForStudent.answerForObjective]
            });
          } else {
            if (t.answerForStudent || t.answerForTeacher) {
              let img = await getSubjectPic(
                t.answerForTeacher
                  ? t.answerForTeacher.stubForSubjective
                  : t.answerForStudent.stubForSubjective
              );
              let i = self.objectiveAnswer.findIndex(x => {
                return x.id === t.questionId;
              });
              if(i != -1){
                let answer = self.objectiveAnswer[i];
                if (img.data.data) {
                  answer.answer = img.data.data.content;
                  answer.show = true;
                  self.$set(self.objectiveAnswer, i, answer);
                }
              }
            }
          }
        }else{
            let i = self.objectiveAnswer.findIndex(x => {
                return x.id === t.questionId;
            });
            if(i != -1){
                let answer = self.objectiveAnswer[i];
                answer.show = true;
                self.$set(self.objectiveAnswer, i, answer);
            }
        }*/
      }
        for (let index = 0; index < self.topicList.length; index++) {
            let t = self.topicList[index];
            if (t.answerForStudent) {
                if (t.quesetionType === "objective") {
                    self.reply.push({
                        id: t.questionId,
                        answer: [t.answerForStudent.answerForObjective]
                    });
                } else {
                    if (t.answerForStudent || t.answerForTeacher) {
                        let img = await getSubjectPic(
                            t.answerForTeacher
                                ? t.answerForTeacher.stubForSubjective
                                : t.answerForStudent.stubForSubjective
                        );
                        let i = self.objectiveAnswer.findIndex(x => {
                            return x.id === t.questionId;
                        });
                        if(i != -1){
                            let answer = self.objectiveAnswer[i];
                            if (img.data.data) {
                                answer.answer = img.data.data.content;
                                answer.show = true;
                                self.$set(self.objectiveAnswer, i, answer);
                            }
                        }
                    }
                }
            }else{
                let i = self.objectiveAnswer.findIndex(x => {
                    return x.id === t.questionId;
                });
                if(i != -1){
                    let answer = self.objectiveAnswer[i];
                    answer.show = true;
                    self.$set(self.objectiveAnswer, i, answer);
                }
            }
        }
    },
    //计算定时器
    time() {
      let _this = this;
      let timer = setInterval(function() {
        let time = new Date(); //修改数据date
        _this.hours = time.getHours();
        _this.minutes = time.getMinutes();
        if (_this.minutes < 10) {
          _this.minutes = "0" + _this.minutes;
        }
      }, 1000);
    },
    //获取课堂列表穿过来的数据
    getCourseId() {
      this.course = this.$route.query.courseId;
      this.header.title = this.$route.query.courseName;
    },
    //连接socket
    connect() {
      //地址+端点路径，构建websocket链接地址
      let socket = new SockJS(this.wsUrl + "/websocket/course");
      this.stompClient = Stomp.over(socket); //一些老的浏览器不支持WebSocket的脚本或者使用别的名字。默认下，stomp.js会使用浏览器原生的WebSocket class去创建WebSocket。利用Stomp.over(ws)这个方法可以使用其他类型的WebSockets。这个方法得到一个满足WebSocket定义的对象

      this.stompClient.heartbeat.outgoing = 400000; // client will send heartbeats every 40000ms
      this.stompClient.heartbeat.incoming = 0; // client does not want to receive heartbeats from the server
      //连接时的请求头部信息
      let headers = {
        login: "mylogin",
        passcode: "mypasscode",
        // additional header
        userId: "curUserId",
        accessToken: this.token
      };

      //创建连接并在连接成功后订阅班级为“2018001”班级的信息
      let _this = this;
      this.stompClient.connect(headers, function(frame) {
        console.log("Connected:" + frame);

        let subHeader = {
          userId: "curUserId",
          accessToken: _this.token
        }; //订阅时的头信息
        //监听的路径以及回调。返回的subscription用于取消订阅
        _this.subscription = _this.stompClient.subscribe(
          "/topic/course/student/" + _this.course,
          function(response) {
            _this.classData(response);
          },
          subHeader
        );
        //监听的路径以及回调。返回的subscription用于取消订阅
        // _this.subscription1 = _this.stompClient.subscribe(
        //   "/pubRaceQuestion/" + _this.course,
        //   function(response) {
        //     console.log(response)

        //   },
        //   subHeader
        // );
      },
        function errorCallBack(error) {
          // 连接失败时（服务器响应 ERROR 帧）的回调方法
          console.log("连接失败");
          setTimeout(function(){
            _this.connect()
          })
        });
    },
    //订阅课堂
    classData(response) {
      let classData = JSON.parse(response.body);
      let self = this;
      if (classData.data) {
        //发布题目
        if (classData.data.wsType === "QuestionForPublish") {
          this.addTopic(classData.data.questionId);
          this.objectiveAnswer[this.objectiveAnswer.length-1].show = true
        }
        if (classData.data.wsType === "QuestionClose") {
          //终止答题
          self.showTopicList.forEach((topic, index) => {
            if (
              topic.questionId &&
              topic.questionId === classData.data.questionId
            ) {
              topic.questionStatus = "FINISH";
              self.$set(self.showTopicList, index, topic);
            }
          });
        }
        if (classData.data.wsType === "AnswerShare") {
          let self = this;
          self.btn = 0;
          for (let i = 0; i < self.topicList.length; i++) {
            let val = self.topicList[i];
            if (val.questionId === classData.data.questionId) {
              getSubjectPic(classData.data.picPath).then(res => {
                console.log(res)
                if (res.data.data) {
                  let img =
                    "data:image/png;base64," +
                    res.data.data.content.replace(",", "");
                  self.AnswerShareList=[{
                    id: val.questionId,
                    title: val.questionContent,
                    img: img
                  }];
                }
              });
            }
          }
        }
        if(classData.data.wsType === "RACE") {
          console.log(classData.data)
          self.qdshow = true
          self.raceId = classData.data.raceId
          // MessageBox.confirm('是否抢答?').then(action => {
          //   var id = JSON.parse(localStorage.getItem('user')).userId
          //   var timestamp=new Date().getTime()
          //   console.log(id)
          //   raceAnswer(classData.data.courseId,timestamp).then(res=>{
          //     console.log(res)
          //   })
          //   console.log(timestamp)
          // })
        }
      }
    },
    connectfile() {

      let socket = new SockJS(this.wsUrl + "/websocket/course");

      // 获取 STOMP 子协议的客户端对象
      let stompClient = Stomp.over(socket);
      stompClient.heartbeat.outgoing = 400000; // client will send heartbeats every 40000ms
      stompClient.heartbeat.incoming = 0; // client does not want to receive heartbeats from the server

      let _this = this;
      // 向服务器发起websocket连接并发送CONNECT帧
      stompClient.connect({
          login: 'mylogin',
          passcode: 'mypasscode',
          // additional header
          userId: 'curUserId',
          accessToken: _this.token
        },
        function connectCallback(frame) {
          // 连接成功时（服务器响应 CONNECTED 帧）的回调方法
          console.log("连接成功");
          let subHeader = {
            userId: 'curUserId',
            accessToken: _this.token
          }; //订阅时的头信息
          //订阅消息
            stompClient.subscribe('/topic/publish/student/' + _this.course, function(response) {
              console.log(response)+'这是一段webstock'
              let res = JSON.parse(response.body).data
              if(res){
                Toast('老师已共享附件')
                _this.attachmentsstatus = res
              }
            }, subHeader);
        },
        function errorCallBack(error) {
          // 连接失败时（服务器响应 ERROR 帧）的回调方法
          console.log("连接失败");
          setTimeout(function(){
            _this.connectfile()
          })
        }
      );
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); //在vue实例销毁钱，清除我们的定时器
    }
    //取消订阅
    this.stompClient.unsubscribe("/topic/course/student/" + this.course);
  },
        destroyed: function () {
            console.log('离开了')
            clearInterval(this.timeweb)
        }
};
</script>

<style lang="scss" scoped>
.classroom {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .AnswerShare {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: #fff;
    z-index: 2000;
    top: 0;
    .btnout {
      font-size: 4rem;
      font-weight: 700;
      color: yellowgreen;
      position: absolute;
      right: 2rem;
      top: 1rem;
    }
    .AnswerShareList {
      padding: 3rem 1rem;
      .question {
        line-height: 2.43rem;
        font-size: 18px;
        padding: 0 3.71rem;
      }
      .answerimg {
        width: 100%;
        height: 100%;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
    }
      .MathJye table {
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
      #q_answer {
        display: none;
      }
      table.edittable {
        border-collapse: collapse;
        text-align: center;
        margin: 2px;
      }
      table.edittable td,
      table.edittable th {
        line-height: 30px;
        padding: 5px;
        white-space: normal;
        word-break: break-all;
        border: 1px solid #000;
        vertical-align: middle;
      }
      table.composition {
        border-collapse: collapse;
        text-align: left;
        margin: 2px;
        width: 98%;
      }
      table.composition td,
      table.composition th {
        line-height: 30px;
        white-space: normal;
        word-break: break-all;
        border-width: 0;
        vertical-align: middle;
      }
      table.composition2 {
        border-collapse: collapse;
        width: auto;
      }
      table.composition2 td,
      table.composition2 th {
        text-align: left;
        line-height: 30px;
        white-space: normal;
        word-break: break-all;
        border: none;
        border-width: 0;
        vertical-align: middle;
      }
      sup {
        vertical-align: super;
      }
      sub {
        vertical-align: sub;
      }
    }
  #btn {
    width: 10rem;
    height: 10rem;
    position: fixed;
    top: 40%;
    left: -10rem;
    color: #fff;
    border-radius: 50%;
    transition: left 1s;
    overflow: hidden;
    z-index: 900;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .awbtn {
    left: 18rem !important;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .mescroll {
    box-sizing: border-box;
    position: absolute;
    top: 4.29rem;
    bottom: 0;
    padding: 0 1.14rem 3rem;
    height: auto !important;
    .empty {
      text-align: center;
      font-size: 18px;
      padding-top: 1.79rem;
    }
    .time {
      width: 100%;
      height: 100%;
      line-height: 1.43rem;
      padding: 0.93rem 0 0.79rem;
      font-size: 18px;
      text-align: center;
      color: rgba(200, 200, 200, 1);
    }
    .class_topic_warp {
      position: relative;
      width: 100%;
      height: auto;
      margin-bottom: 13px;
      .objective_warp {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 18px;
        padding: 1.14rem 1.14rem;
        margin-bottom: 13px;
        background-color: white;
        box-sizing: border-box;
        .submit_warp {
          position: relative;
          height: 2.5rem;
          width: 100%;
          margin-bottom: 2.29rem;
          .objective_submit {
            position: absolute;
            right: 3.71rem;
            width: 118px;
            height: 46px;
            background: url('../../../assets/按钮.png') no-repeat;//
            background-position: -135px -1228px;
            border-radius: 1.145rem;
            color: #9a84ff;
            font-size: 18px;
          }
          .objective_submit:active {
            background: url('../../../assets/按钮.png') no-repeat;
            background-position: -592px -1228px;
          }
        }
        .closeReply {
          margin-top: 2.5rem;
          text-align: center;
          .text {
            font-size: 22px;
            padding: 0.14rem 1.4rem;
            border-radius: 100px;
            color: rgba(203, 203, 203, 1);
            background-color: rgba(244, 244, 244, 1);
          }
        }
      }
      .subjective_warp {
        /*width: 100%;*/
        /*height: 100%;*/
        padding: 1.14rem 1.14rem 3rem;
        border-radius: 18px;
        margin-bottom: 13px;
        background-color: white;
        /*box-sizing: border-box;*/
        .button_warp {
          padding-bottom: 20px;
          position: relative;
          height: 2.7rem;
          .subjective_submit {
            position: absolute;
            right: 3.71rem;
            text-align: center;
            border-radius: 1.145rem;
            color: #9a84ff;
            font-size: 18px;
          }
          .Answerstart {
            width: 154px;
            height: 46px;
            background: url('../../../assets/按钮.png') no-repeat;//
            background-position: -135px -1321px;
          }
          .Answerstart:active{
            background: url('../../../assets/按钮.png') no-repeat;
            background-position: -592px -1321px;
          }
          .Answermodify {
            width: 154px;
            height: 46px;
            background: url('../../../assets/按钮.png') no-repeat;//
            background-position: -135px -623px;
          }
          .Answermodify:active{
            background: url('../../../assets/按钮.png') no-repeat;
            background-position: -592px -623px;
          }
        }
        .closeReply {
          margin-top: 2.5rem;
          text-align: center;
          .text {
            font-size: 22px;
            padding: 0.14rem 1.4rem;
            border-radius: 100px;
            color: rgba(203, 203, 203, 1);
            background-color: rgba(244, 244, 244, 1);
          }
        }
      }
    }
  }
}

        .Responderbox {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
            background-color: rgba(0, 0, 0, 0.3);
            z-index: 2007;
            .qdbox {
                width: 600px;
                height: 295px;
                background: url('../../../assets/tc.png') no-repeat;
                background-position: -2px 0px;
                background-color:transparent;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
            }
            .text {
                font-size: 28px;
                text-align: left;
                font-weight: 700;
                margin: 100px 0;
                text-indent: 20px;
                color: #333;
            }
            .cancel {
                position: absolute;
                left: 0px;
                bottom: 0px;
                width: 50%;
                height: 50px;
                line-height: 50px;
                text-align: center;
                font-size: 22px;
                color: #333;
            }
            .confirm {
                position: absolute;
                right: 0px;
                bottom: 0px;
                width: 50%;
                height: 50px;
                line-height: 50px;
                text-align: center;
                font-size: 22px;
                color: #333;
            }
            .studentname {
                width: 100%;
                height: 50px;
                line-height: 50px;
                text-align: center;
                font-size: 22px;
                position: absolute;
                bottom: -50px;
                background-color: #fff;
                border: 1px solid #999;
            }
        }
/*.imgbox {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 100px;
  height: 0px;
  z-index: 101;
}*/
.load {
        width: 586px;
        height: 700px;
        margin: 0 auto;
        // background-color: blueviolet;
        position: relative;
        div {
            width: 150px;
            height: 150px;
            line-height: 150px;
            text-align: center;
            background-color: #fff;
            border-radius: 50%;
            font-size: 30px;
            text-align: center;
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translate(-50%,-50%);
            span {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #fff;
                position: absolute;
                top: 0px;
                left: 0px;
                z-index: 10;
            }
            i {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #69b482;
                position: absolute;
                top: 0px;
                left: 0px;
            }
            i:nth-child(2){
                animation: loading 1s linear infinite;
            }
        }
    }
    @keyframes loading {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(1.5);
            opacity: 0.1;
        }
    }
</style>
