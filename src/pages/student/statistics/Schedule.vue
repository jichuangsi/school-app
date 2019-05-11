<template>
  <div class="Schedule">
    <Public-header :header="header"/>
    <h3>{{className}}</h3>
    <div class="Schedulebox" v-if="statustext != '暂无数据'">
        <div class="heng">
            <div class="green">时间</div>
            <div @click="str = '周一'"><span>周一</span><em class="red" :class="{heightclass:str == '周一'}"></em></div>
            <div @click="str = '周二'"><span>周二</span><em class="skyblue" :class="{heightclass:str == '周二'}"></em></div>
            <div @click="str = '周三'"><span>周三</span><em class="purple" :class="{heightclass:str == '周三'}"></em></div>
            <div @click="str = '周四'"><span>周四</span><em class="blue" :class="{heightclass:str == '周四'}"></em></div>
            <div @click="str = '周五'"><span>周五</span><em class="orange" :class="{heightclass:str == '周五'}"></em></div>
        </div>
        <div class="heng" v-for="(item,index) in nav" :key="index">
            <div :class="{green:valindex == 0}" v-for="(val,valindex) in item" :key="valindex"><span>{{val}}</span></div>
        </div>
    </div>
    <div class="Scheduletext" v-if="statustext == '暂无数据'">
        暂无数据
    </div>
  </div>
</template>

<script>
import PublicHeader from "../../../components/public/PublicHeader"
import {getStudentTimeTable} from '@/api/student/statistics'
export default {
  name: 'Schedule',
  components: {
    PublicHeader
  },
  data () {
    return {
      header:{
        //title是课堂列表传过来的
        title: "课程表",
        url: "/studentIndex"
      },
      str: '',
      className:'',
      nav:[],
      statustext:'暂无数据'
    }
  },
  methods:{
  },
  mounted() {
      $("html, body").scrollTop(0+"px");
      //$('html,body').stop().animate({scrollTop: '0px'}, 1500);
      this.str = "周" + "日一二三四五六".charAt(new Date().getDay());
      let id = JSON.parse(localStorage.getItem('user')).userId
      let val = ['12:00','午休','午休','午休','午休','午休']
      getStudentTimeTable(id).then(res=>{
          console.log(res)
          if(res.data.code == '0010'){
            //   console.log(res.data.data.dataInfo.slice(1,9))
            this.className = res.data.data.className
            this.nav = res.data.data.dataInfo.slice(1,9)
            this.nav.splice(4,0,val);
            this.statustext = ''
          }else {
              this.statustext = '暂无数据'
          }
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.Schedule {
  width: 100%;
  margin-top: 119px;
  margin-bottom: 108px;
  h3 {
      text-align: center;
      font-weight: 700;
      font-size: 30px;
      letter-spacing:5px;
  }
  .Schedulebox {
      width: 100%;
      padding: 60px 60px;
      .heng {
          width: 100%;
          border-radius: 30px;
          background-color: #d9d9d9;
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          div {
              width: 90px;
              height: 60px;
              line-height: 60px;
              display: inline-block;
              text-align: center;
              font-size: 24px;
              color: #fff;
              margin-left: 10px;
              vertical-align: top;
              position: relative;
              em {
                  display: inline-block;
                  width: 100%;
                  height: 80px;
                  position: absolute;
                  top: -20px;
                  left: 0px;
                  z-index: 5;
                  border-radius: 30px 30px 10px 10px;
                  transition: height 0.5s linear;
              }
              .heightclass {
                height: 710px;
              }
              span {
                  width: 100%;
                  text-align: center;
                  position: absolute;
                  top: 0px;
                  left: 0px;
                  z-index: 10;
                //   transform: translateX(25%);
              }
              .red {
                  background-color: #f15f5f;
              }
              .skyblue {
                  background-color: #509ef3;
              }
              .purple {
                  background-color: #6d3fd6;
              }
              .blue {
                  background-color: #454fd2;
              }
              .orange {
                  background-color: #f17849;
              }
          }
          div:last-child{
              margin-right: 20px;
          }
          .green {
              width: 100px;
              margin-left: 0px;
              background-color: #66d3c0;
              border-top-left-radius: 30px;
              border-bottom-left-radius: 30px;
              span{
                  left: 0px;
              }
          }
      }
  }
  .Scheduletext {
      text-align: center;
      font-size: 38px;
      font-weight: 700;
  }
}
</style>
