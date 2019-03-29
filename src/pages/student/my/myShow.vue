<template>
  <div class="myShow">
    <public-header :header="header"/>
    <div class="content">
      <div class="avatar clearfix">
        <div class="title">头像</div>
        <div class="img_warp">
          <img :src="userimg">
        </div>
      </div>
      <div class="row">
        <div class="title">名字</div>
        <div class="text">{{this.user.name}}</div>
      </div>
      <div class="row">
        <div class="title">学校</div>
        <div class="text">{{this.user.school}}</div>
      </div>
      <div class="row">
        <div class="title">年级</div>
        <div class="text">{{this.user.grade}}</div>
      </div>
      <div class="row">
        <div class="title">班级</div>
        <div class="text">{{this.user.primaryClass}}</div>
      </div>
      <div class="row" @click="setclick">
        <div class="title">蓝牙设备</div>
        <div class="text">{{this.id}}</div>
      </div>
      <div class="set_box" v-if="setshow" @click="setshow = false">
        <div class="setbox" @click.stop="setshow = true">
          <div class="title">提示</div>
          <div class="text">请输入蓝牙设备</div>
          <div class="int">
            <input type="text" v-model="a1" v-focus @keyup="a1click">:
            <input type="text" v-model="a2" ref="inputa2" @keyup="a2click">:
            <input type="text" v-model="a3" ref="inputa3" @keyup="a3click">:
            <input type="text" v-model="a4" ref="inputa4" @keyup="a4click">:
            <input type="text" v-model="a5" ref="inputa5" @keyup="a5click">:
            <input type="text" v-model="a6" ref="inputa6" @keyup="a6click">
          </div>
          <div class="btn">
            <div class="cancel" @click.stop="setshow = false">取消</div>
            <div class="confirm" @click.stop="confirm">确认</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PublicHeader from "../../../components/public/PublicHeader"
  export default {
    name: "myShow",
    components: {
      PublicHeader
    },
    data() {
      return {
        header: {                       //头部信息
          title: "个人信息",
          url: '/studentIndex'
        },
        userimg: '',
        username:'韩梅梅',
        user: {name:'',school:'',grade:'',primaryClass:''},
        id:'', //蓝牙设备
        setshow: false,
        a1:'',
        a2:'',
        a3:'',
        a4:'',
        a5:'',
        a6:''
      }
    },
    directives: {
      focus: {
        // 指令的定义
        inserted: function (el) {
          el.focus()
        }
      }
    },
    mounted(){
      this.getstudent()
      this.id = localStorage.getItem("bluetooth")?localStorage.getItem("bluetooth"):''
    },
    methods:{
      getstudent(){
        let userInStorage = JSON.parse(localStorage.getItem('user'))
        if(userInStorage){
            this.user.name = userInStorage.userName;
            if(userInStorage.roles&&userInStorage.roles.length>0){
                this.user.school = userInStorage.roles[0].school.schoolName;
                this.user.grade = userInStorage.roles[0].primaryGrade.gradeName;
                this.user.primaryClass = userInStorage.roles[0].primaryClass.className;
            }
            if(userInStorage.userSex=="FEMALE"){
                this.userimg = require('../../../assets/女学生.png')
            }else{
                this.userimg = require('../../../assets/男学生.png')
            }
        }


      },
      setclick() {
        this.setshow = true
        if(this.id) {
          let arr = this.id.split(':')
          this.a1 = arr[0]
          this.a2 = arr[1]
          this.a3 = arr[2]
          this.a4 = arr[3]
          this.a5 = arr[4]
          this.a6 = arr[5]
        } else {
          this.a1 = ''
          this.a2 = ''
          this.a3 = ''
          this.a4 = ''
          this.a5 = ''
          this.a6 = ''
        }
      },
      a1click(){
        this.a1.length>=2?this.a2show = true :this.a2show=false
        if(this.a2show) {
          this.a1=this.a1.substring(0,2)
          this.$refs.inputa2.focus()
        }
      },
      a2click(){
        this.a2.length>=2?this.a3show = true:this.a3show=false
        if(this.a3show) {
          this.a2=this.a2.substring(0,2)
          this.$refs.inputa3.focus()
        }
      },
      a3click(){
        this.a3.length>=2?this.a4show = true:this.a4show=false
        if(this.a4show) {
          this.a3=this.a3.substring(0,2)
          this.$refs.inputa4.focus()
        }
      },
      a4click(){
        this.a4.length>=2?this.a5show = true:this.a5show=false
        if(this.a5show) {
          this.a4=this.a4.substring(0,2)
          this.$refs.inputa5.focus()
        }
      },
      a5click(){
        this.a5.length>=2?this.a6show = true:this.a6show=false
        if(this.a6show) {
          this.a5=this.a5.substring(0,2)
          this.$refs.inputa6.focus()
        }
      },
      a6click(){
        if(this.a6.length>=2){
          this.a6=this.a6.substring(0,2)
          this.$refs.inputa6.blur()
        }
      },
      confirm(){
        this.id = this.a1.toUpperCase() +":"+ this.a2.toUpperCase() +":"+ this.a3.toUpperCase() +":"+ this.a4.toUpperCase() +":"+ this.a5.toUpperCase() +":"+ this.a6.toUpperCase()
        this.setshow = false
        console.log(this.id)
        localStorage.setItem('bluetooth',this.id)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .myShow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .content {
      width: 100%;
      padding-top: 3.14rem;
      padding-left: 2.14rem;
      background-color: white;
      box-sizing: border-box;
      .avatar {
        width: 100%;
        height: 13.21rem;
        padding-right: 6.64rem;
        box-sizing: border-box;
        position: relative;
        &:before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          border-bottom: 1px solid rgba(222, 222, 222, 1);
          -webkit-transform: scaleY(.5);
          -webkit-transform-origin: 0 0;
        }
        .title {
          line-height: 13.21rem;
          float: left;
          font-size: 28px;
          color: rgba(97, 97, 97, 1);
        }
        .img_warp {
          width: 8.93rem;
          height: 8.93rem;
          margin-top: 2.14rem;
          float: right;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        &:after {
          content: " ";
          display: inline-block;
          height: 12.7px;
          width: 12.7px;
          border-width: 4px 4px 0 0;
          border-color: rgba(137, 137, 137, 1);
          border-style: solid;
          -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
          transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) translateY(-50%);
          position: absolute;
          top: 50%;
          right: 2.19rem;
          margin-top: -4px;
        }
      }
      .row {
        height: 6.21rem;
        line-height: 6.21rem;
        padding-right: 6.64rem;
        box-sizing: border-box;
        position: relative;
        &:before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          border-bottom: 1px solid rgba(222, 222, 222, 1);
          -webkit-transform: scaleY(.5);
          -webkit-transform-origin: 0 0;
        }
        .title {
          float: left;
          font-size: 28px;
        }
        .text {
          float: right;
          font-size: 24px;
          color: #A5A5A5;;
        }
      }
    }
  }
  .set_box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: rgba(0, 0, 0, 0.3);
    .setbox {
      width: 85%;
      position: absolute;
      top: 50%;
      left: 50%;
      text-align: center;
      background-color: #fff;
      transform: translate(-50%,-50%);
      .title {
        font-size: 24px;
        color:#333;
        font-weight: 700;
        padding-top: 10px;
      }
      .text {
        font-size: 22px;
        color:#A5A5A5;
        padding-top: 20px;
      }
      .int {
        width: 100%;
        padding: 40px 140px;
        line-height: 40px;
        font-size: 22px;
        text-align: center;
        display: flex;
        justify-content: space-between;
        input {
          display: inline-block;
          width: 10%;
          height: 40px;
          font-size: 22px;
          text-align: center;
          border: 1px solid #666;
        }
      }
      .btn {
        width: 100%;
        font-size: 22px;
        display: flex;
        div {
          flex: 1;
          height: 40px;
          line-height: 40px;
          border: 1px solid #ddd;
          border-bottom: none;
        }
        .cancel {
          border-left: none;
        }
        .confirm {
          color: #26a2ff;
          border-right: none;
        }
      }
    }
  }
</style>
