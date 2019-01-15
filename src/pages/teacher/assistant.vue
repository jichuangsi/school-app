<template>
  <div class="assistant">
    <img
      src="../../assets/zsbj.png"
      alt=""
    >
    <div class="text">{{textname}}</div>
    <div class="selet" @click="seletshow= !seletshow">
        {{selet}}<i></i>
        <ul v-if="seletshow">
            <i></i>
            <li v-for="(item,index) in seletnav" :key="index" @click.stop="seletclick(item,index)">{{item}}</li>
        </ul>
    </div>
    <div class="img" v-if="type=='小组'||type=='计时'" @click="message"><img src="../../assets/形状 1.png" alt=""></div>
    <div class="state" @click="state">开始</div>
    <div class="stop" @click="stop">停止</div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
export default {
  name: "assistant",
  data() {
    return {
        textname:'xuesheng001',
        selet:'请选择',
        studentlist:[],
        studentid:[],
        studentname:[],
        clear: false,
        seletshow:false,
        seletnav:['个人','小组','计时'],
        type:'',
        xiaozu:''
    };
  },
  methods: {
      //选择
      seletclick(val,index){
          this.selet = val
          this.seletshow = false
          this.type = val
      },
      // 输入
      message(){
          if(this.type=='小组'){
              MessageBox.prompt('请输入小组个数').then((value) => {
              console.log(value)
              this.xiaozu = value.value
            }).catch(err=>{
                console.log(err)
            })
          }
          if(this.type=='计时'){
              MessageBox.prompt('请输入分钟').then((value) => {
            }).catch(err=>{
                console.log(err)
            })
          }
      },
      //开始
      state(){
          let self = this
            self.clear = false
          if(this.type=='个人'){
            let interval = setInterval(function(){
                if(self.clear){
                clearInterval(interval)
                }
            let i = Math.floor(Math.random()*(Number(self.studentname.length)+1));
            self.textname = self.studentname[i]
            },60)
          }
          if(this.type=='小组'){
                let interval = setInterval(function(){
                if(self.clear){
                clearInterval(interval)
                }
            let i = Math.floor(Math.random()*(Number(self.xiaozu)+1));
            console.log(i)
            if(i == 10){
                clearInterval(interval)
            }
            self.textname = i
            },60)
          }
          if(this.type=='计时'){
          }
      },
      //停止
      stop(){
          this.clear = true
      }
  },
  mounted() {
      this.studentlist = this.$route.query.students
      let self = this
      if(self.studentlist){
        self.seletnav=['个人','小组','计时']
        for(let i = 0 ;i < self.studentlist.length;i++){
            self.studentname.push(self.studentlist[i].studentName)
        }
      }else {
        self.seletnav=['小组','计时']
      }
  }
};
</script>

<style lang="scss" scoped>
.assistant {
  width: 100%;
  position: relative;
  img {
    width: 100%;
  }
  .img {
      position: absolute;
      width: 9%;
      height: 4%;
      left: 50%;
      margin-left: -4.5%;
      top: 40%;
  }
    .text {
        width: 56%;
        position: absolute;
        left: 50%;
        top: 26.5%;
        font-size: 5rem;
        text-align: center;
        color: #B8784A;
        margin-left: -28%;
    }
    .selet {
        width: 36.2%;
        position: absolute;
        left: 50%;
        top: 61.2%;
        height: 6.8%;
        line-height: 5rem;
        text-align: center;
        color: #fff;
        font-size: 2rem;
        margin-left: -18.1%;
        letter-spacing:1rem;
        vertical-align: top;
        i {
            display: inline-block;
            border: 0.5rem solid #fff;
            border-color: transparent #fff #fff transparent;
            position: absolute;
            top: 50%;
            right: 20%;
            margin-top: -0.6rem;
            transform: rotate(-45deg)
        }
        ul {
            width: 40%;
            position: absolute;
            background-color: #3591B6;
            left: 100%;
            top: 10%;
            z-index: 10;
            transition: height 1s;
            border-radius: 1rem;
            margin-left: 1rem;
            li {
                line-height: 5rem;
            }
            i {
                display: inline-block;
                width: 0px;
                border: 0.5rem solid #fff;
                border-color: #3591B6 transparent transparent #3591B6;
                position: absolute;
                top: 15%;
                left: 0%;
                margin-left: -0.5rem;
            }
        }
    }
    .state {
        width: 36.2%;
        position: absolute;
        left: 50%;
        top: 71.2%;
        height: 6.8%;
        line-height: 5rem;
        text-align: center;
        color: #fff;
        font-size: 2rem;
        margin-left: -18.1%;
        letter-spacing:1rem;
    }
    .stop {
        width: 36.2%;
        position: absolute;
        left: 50%;
        top: 81.2%;
        height: 6.8%;
        line-height: 5rem;
        text-align: center;
        color: #fff;
        font-size: 2rem;
        margin-left: -18.1%;
        letter-spacing:1rem;
    }
}
</style>
