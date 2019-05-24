<template>
    <div class="subjectiveWork">
        <classroom-header :header="headers" :jump="jump"/>
        <div class="subjectiveContent">
            <swiper ref="mySwiper" :options="swiperOption">
                <swiper-slide v-for="(item,index) in homeworkSubjectiveQs" :key="index" v-if="pageShow">
                    <scroll-content ref="myscrollfull" :mescrollValue="mescrollValue">
                        <div class="subjective_warp">
                            <!--<subjective :subjectiveTopic="item" :id="item.id"/>-->
                            <div class="subjective">
                                <div class="Collection" @click="Collection(item.questionId)">
                                    <img :src="Collectionsrc" alt="">
                                </div>
                                <div class="centertext">左右滑动切换题目</div>
                                <div class="topic_warp" :id="'qc'+item.questionId">
                                    <div class="title">主观题-{{index+1}} <span v-if="item.questionTypeInCN">({{item.questionTypeInCN}})</span></div>
                                    <div class="topic" :id="'tp'+item.questionId" v-html="item.questionContent">
                                        {{item.questionContent}}
                                    </div>
                                </div>
                                <PopupPic :questionPic="item.questionPic"/>
                                <div class="anwers" v-if="homeworkCompleted">
                                    此题答案为:<span v-html="item.answer"></span>
                                </div>
                                <div class="remind" v-html="item.parse" v-if="homeworkCompleted">
                                </div>

                            </div>
                            <div class="button_warp" v-if="!homeworkCompleted&&subjectiveAnswer[index].show">
                                <div class="subjective_submit Answerstart" v-show="!subjectiveAnswer[index].answer"
                                     @click="answerQuestions(item.questionId, item.questionContent, item.questionPic)">
                                </div>
                                <div class="subjective_submit Answermodify" v-show="subjectiveAnswer[index].answer"
                                     @click="modifyAnswer(item.questionId, item.questionContent, item.questionPic)">
                                </div>
                            </div>
                            <div class="load"  v-show="!subjectiveAnswer[index].answer" v-if="item.answerModelForStudent||item.answerModelForTeacher">
                                <div><span>loading...</span><i></i></div>
                            </div>
                            <board :subjectiveAnswer="subjectiveAnswer" :id="item.questionId" v-show="subjectiveAnswer[index].answer"/>
                        </div>
                    </scroll-content>
                </swiper-slide>
            </swiper>
        </div>
        <div class="textmessage" v-if="textmessage">
            此习题没有主观题
        </div>
        <loading v-if="loading"/>
    </div>
</template>

<script>
    import classroomHeader from "../../../components/public/PublicHeader"
    import board from "../../../components/board/Board"
    import Loading from '../../../components/public/Loading'
    import ScrollContent from '../../../components/public/ScrollContent'
    import {mapGetters} from 'vuex'
    import store from '@/store'
    import { addFavorQuestion, removeFavorQuestion } from "@/api/student/classroom";
    import { sendPicByString, sendSubjectiveAnswer, getPicByString } from "@/api/student/homework";
    import PopupPic from "@/components/topicList/PopupPic";
    import { Toast,Indicator } from "mint-ui";
    import html2canvas from 'html2canvas';

    let vm = null;
    export default {
        components: {
            classroomHeader,
            board,
            Loading,
            PopupPic,
            ScrollContent
        },
        data() {
            return {
                textmessage : false,
                objectiveAnswerbtn:false,
                loading: true,                      //加载状态
                pageShow: false,                    //页面显示状态
                headers: {                           //头部标题显示
                    title: '',
                    url: '/studentIndex'
                },
                jump: {name: '转至客观题', url: '/objectiveWork'},
                mescrollValue: {up: false, down: false},        //是否需要下拉上拉加载数据
                Collectionsrc:require('../../../assets/未收藏.png'),
                Collectiontype:false,
                swiperOption: {
                    notNextTick: true,
                    //循环
                    loop: false,
                    //设定初始化时slide的索引
                    initialSlide: 0,
                    //自动播放
                    // autoplay: true,
                    // autoplay: {
                    //     delay: 3000,
                    //     stopOnLastSlide: false,
                    //     disableOnInteraction: true,
                    // },
                    // 设置轮播
                    //   effect : 'flip',
                    //滑动速度
                    speed: 800,
                    //滑动方向
                    direction: "horizontal",
                    //小手掌抓取滑动
                    // grabCursor : true,
                    //滑动之后回调函数
                    on: {
                        /*slideChange: function(){
                            //console.log(this.activeIndex);
                            //console.log(this.realIndex);
                        },*/
                        slideChange: function() {
                            //console.log(this.activeIndex); //切换结束时，告诉我现在是第几个slide
                            vm.initCollection(this.realIndex);
                        }
                    },
                    //左右点击
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev"
                    }
                    //分页器设置
                    //   pagination: {
                    //       el: '.swiper-pagination',
                    //       clickable :true
                    //   }
                },
                subjectiveId: '',                   //主观题id
                subjectiveAnswer: []
            }
        },
        watch: {
            /*subjective: {
                handler() {
                    for (let i = 0; i < this.subjective.length; i++) {
                        this.subjectiveAnswer.push({id: this.subjective[i].id, answer: ''})
                    }
                    console.log("here1");
                    console.log(this.subjectiveAnswer);
                },
                //immediate: true,
                deep: true
            },*/
            boardImg(val) {
                let _this = this;
                _this.subjectiveAnswer.forEach((answer, index) => {
                    if (answer.id === _this.subjectiveId) {
                        answer.answer = val.data;
                        this.$set(_this.subjectiveAnswer, index, answer);
                    }
                });
                Indicator.open({
                    text: '答案提交中...',
                    spinnerType: 'fading-circle'
                });
                /*console.log("here2");
                console.log(_this.subjectiveAnswer);*/
                //主观题答案存根
                sendPicByString(val.data)
                    .then(res => {
                        Toast({
                            message: "图片存储成功！",
                            position: "middle",
                            duration: 1000
                        });
                        let sub = res.data.data;
                        //提交主观题答案
                        sendSubjectiveAnswer(
                            _this.homeworkId,
                            _this.subjectiveId,
                            sub
                        )
                            .then(res => {
                                console.log(res);
                                Toast({
                                    message: "答案提交成功！",
                                    position: "middle",
                                    duration: 1000
                                });
                                Indicator.close();
                                /*for(let i = 0; i < _this.homeworkSubjectiveQs.length; i++){
                                    if(_this.homeworkSubjectiveQs[i].questionId === _this.subjectiveId){
                                        if(_this.homeworkSubjectiveQs[i].answerModelForStudent){
                                            _this.homeworkSubjectiveQs[i].answerModelForStudent.stubForSubjective = sub;
                                        }else{
                                            let answer = {stubForSubjective:sub};
                                            _this.homeworkSubjectiveQs[i].answerModelForStudent = answer;
                                        }
                                        store.commit('SET_HOMEWORKSUBJECTIVEQS', _this.homeworkSubjectiveQs);
                                        break;
                                    }
                                }*/
                            })
                            .catch(err => {
                                Toast({
                                    message: "答案提交失败！",
                                    position: "middle",
                                    duration: 1000
                                });
                                Indicator.close();
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
        computed: {
            swiper() {
                return this.$refs.mySwiper.swiper
            },
            //vuex 调用
            ...mapGetters([
                'isBoard',
                'isBlueTooth',
                'boardImg',
                'homeworkId',
                'homeworkName',
                'homeworkCompleted',
                'homeworkSubjectiveQs'
            ])
        },
        created() {
            vm = this;
        },
        mounted() {
            this.getSubjectiveWork();
        },
        methods: {
            getSubjectiveWork() {
                this.headers.title = this.homeworkName;
                for (let i = 0; i < this.homeworkSubjectiveQs.length; i++) {
                    this.subjectiveAnswer.push({id: this.homeworkSubjectiveQs[i].questionId, answer: '', show: false})
                }
                if(this.subjectiveAnswer.length>0){
                    this.initCollection(0);
                    this.pageShow = true;
                    this.loading = false;
                    this.textmessage = false
                    this.initImgs();
                }else {
                    this.pageShow = true;
                    this.loading = false;
                    this.textmessage = true
                }
            },
            initImgs(){
                for (let i = 0; i < this.homeworkSubjectiveQs.length; i++) {
                    this.getSubjectiveImg(this.homeworkSubjectiveQs[i]);
                }
            },
            async getSubjectiveImg(t){
                //console.log(t);
                let self =this;
                if (t&&t.answerModelForStudent || t.answerModelForTeacher) {
                    let img = await getPicByString(
                        t.answerModelForTeacher
                            ? t.answerModelForTeacher.stubForSubjective
                            : t.answerModelForStudent.stubForSubjective
                    );
                    let i = self.subjectiveAnswer.findIndex(x => {
                        return x.id === t.questionId;
                    });
                    //console.log(i);
                    if(i != -1){
                        let answer = self.subjectiveAnswer[i];
                        if (img.data.data) {
                            answer.answer = img.data.data.content;
                            answer.show = true;
                            self.$set(self.subjectiveAnswer, i, answer);
                        }
                    }
                }else {
                    let i = self.subjectiveAnswer.findIndex(x => {
                        return x.id === t.questionId;
                    });
                    if(i != -1){
                        let answer = self.subjectiveAnswer[i];
                        answer.show = true;
                        self.$set(self.subjectiveAnswer, i, answer);
                    }
                }
            },
            //开始答题
            answerQuestions(id, content, pic) {
                if(!this.objectiveAnswerbtn){
                    this.objectiveAnswerbtn = true;
                }else{
                    return;
                }
               /* Indicator.open({
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
                    let dataURL = canvas.toDataURL("image/png").replace("data:image/png;base64,", "");
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
                                case 2:
                                    var q = {content:dataURL,pic:pic,base64img:""};
                                    window.HandwrittenBoard.getBase64img(q);
                                    console.log("第二个");
                                    self.objectiveAnswerbtn = false;
                                    break;
                                default:
                                    break;
                            }
                        }
                    );
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
                    let dataURL = canvas.toDataURL("image/png").replace("data:image/png;base64,", "");
                    //console.log(dataURL)
                    //document.getElementById('tp'+id).setAttribute('style', 'letter-spacing:"";padding-top: ""');
                    self.subjectiveId = id;
                    let answer = "";
                    for (let i = 0; i < this.subjectiveAnswer.length; i++) {
                        if (id === this.subjectiveAnswer[i].id) {
                            answer = this.subjectiveAnswer[i].answer;
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
                                case 2:
                                    var q = {content:dataURL,pic:pic,base64img:answer};
                                    window.HandwrittenBoard.getBase64img(q);
                                    console.log("第二个");
                                    self.objectiveAnswerbtn = false;
                                    break;
                                default:
                                    break;
                            }
                        }
                    );
                });
            },
            //点击收藏
            Collection(id){
                let self = this;
                if(this.Collectiontype){
                    removeFavorQuestion(id).then(res => {
                        if (res.data.code === '0010') {
                            this.Collectiontype = false
                            this.Collectionsrc = require('../../../assets/未收藏.png')
                            for(let i = 0; i < self.homeworkSubjectiveQs.length; i++){
                                if(self.homeworkSubjectiveQs[i].questionId === id){
                                    self.homeworkSubjectiveQs[i].favor = false;
                                    store.commit('SET_HOMEWORKSUBJECTIVEQS', self.homeworkSubjectiveQs);
                                    break;
                                }
                            }
                        }else{
                            Toast({
                                message: res.data.msg,
                                position: "middle",
                                duration: 1000
                            });
                        }
                    });
                } else{
                    addFavorQuestion(id).then(res => {
                        if (res.data.code === '0010') {
                            this.Collectiontype = true
                            this.Collectionsrc = require('../../../assets/已收藏.png')
                            for(let i = 0; i < self.homeworkSubjectiveQs.length; i++){
                                if(self.homeworkSubjectiveQs[i].questionId === id){
                                    self.homeworkSubjectiveQs[i].favor = true;
                                    store.commit('SET_HOMEWORKSUBJECTIVEQS', self.homeworkSubjectiveQs);
                                    break;
                                }
                            }
                        }else{
                            Toast({
                                message: res.data.msg,
                                position: "middle",
                                duration: 1000
                            });
                        }
                    });
                }
            },
            initCollection(index){
                //console.log(index);
                //console.log(this.homeworkSubjectiveQs[index]);
                if(this.homeworkSubjectiveQs[index].favor){
                    this.Collectionsrc = require('../../../assets/已收藏.png');
                }else{
                    this.Collectionsrc = require('../../../assets/未收藏.png');
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .subjectiveWork {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: white;
        overflow: auto;
        .jump {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 2.5rem;
            color: rgba(255, 255, 255, 1);
            font-size: 18px;
            &:before {
                content: " ";
                display: inline-block;
                height: 12px;
                width: 12px;
                border-width: 2px 2px 0 0;
                border-color: #ffffff;
                border-style: solid;
                -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) translateY(-50%);
                position: absolute;
                top: 50%;
                right: -.8rem;
                margin-top: -2px;
            }
        }
        .subjectiveContent {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
            .swiper-container {
                width: 100%;
                height: 100%;
                overflow-y: scroll;
                .mescroll {
                    box-sizing: border-box;
                    position: absolute;
                    top: 0rem;
                    bottom: 0;
                    padding: 0rem 1rem 0rem;
                    height: auto !important;
                    background-color: rgba(255, 255, 255, 1);
                    .subjective_warp {
                        width: 100%;
                        height: 100%;
                        padding: 4.29rem 1.14rem 1.14rem;
                        box-sizing: border-box;
                        .subjective {
                            width: 100%;
                            .Collection {
                                width: 2.5rem;
                                height: 2.5rem;
                                position: absolute;
                                right: 2rem;
                                z-index: 100;
                                img{
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                            .anwers{
                                font-size: 18px;
                                line-height: 24px;
                                padding: 15px;
                                span {
                                    color: red;
                                }
                            }
                            .remind {
                                font-size: 18px;
                                line-height: 24px;
                                padding: 15px;
                            }
                            .centertext {
                                text-align: center;
                                margin-top: 1rem;
                                font-size: 20px;
                                color: #3d72fe;
                                font-weight: 600;
                            }
                            .topic_warp {
                                position: relative;
                                padding-top: 5px;
                                .title {
                                    font-size: 24px;
                                    color: #69b482;
                                }
                                .topic {
                                    color: #353535;
                                    font-size: 22px;
                                    line-height: 34px;
                                    padding: 0 2.57rem;
                                }
                            }
                        }
                        .button_warp {
                            padding-bottom: 20px;
                            position: relative;
                            height: 2.7rem;
                            .subjective_submit {
                                position: absolute;
                                right: 3.71rem;
                                border-radius: 1.145rem;
                                color: #9A84FF;
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
                    }
                }
            }
        }
    }
    .textmessage {
        margin-top: 80px;
        font-size: 24px;
        color: #666;
        text-align: center;
    }
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
