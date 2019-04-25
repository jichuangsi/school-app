<template>
    <div class="studentenquiry">
        <div class="top">
            <div class="nav">
              <i class="iconfont icon-icon-arrow-left2" @click="back"></i>
                <ul>
                    <li v-for="(item,index) in nav" @click="allocation(item,index)" :key="index">
                        <span :class="{'color':index==current}">{{item}}</span>
                    </li>
                </ul>
            </div>
            <div class="topimg">
                <h2>{{value}}</h2>
            </div>
        </div>
        <div class="center">
            <h4 v-if="false">总分:{{Total}}分</h4>
            <h2 v-if="false">{{Fraction}}
                <span>分</span>
            </h2>
            <div class="centernav" v-if="false">
                <ul>
                    <li>
                        <div>击败全班同学</div>
                        <span>{{beat}}</span>
                    </li>
                    <li>
                        <div>班级平均分</div>
                        <span>{{Average}}</span>
                    </li>
                    <li>
                        <div>班级最高分</div>
                        <span>{{Highestscore}}</span>
                    </li>
                </ul>
            </div>
            <div class="situation">
                <div class="xian"></div>
                <div class="text">知识模块得分情况</div>
                <div class="xian"></div>
            </div>
            <h3>
                <div></div>知识模块权重</h3>
            <div class="echarts">
                <div id="myChart"></div>
            </div>
            <h3>
                <div></div>知识模块权重</h3>
            <div class="table">
                <table>
                    <tr>
                        <th v-for="(item,index) in tableth" :key="index">{{item}}</th>
                    </tr>
                    <tr v-for="(item,index) in tabletd" :key="index">
                        <td v-for="(value,index) in item.value" :key="index">{{value}}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import {getCourseSubjectResult} from '@/api/student/statistics'
export default {
  name: 'studentenquiry',
  data () {
    return {
      resnumber:1,
      resnav:[],
      current: 1,
      nav: ['语文', '数学', '英语', '政治', '地理', '历史', '生物', '物理', '化学'],
      value: '语文',
      Total: '150',
      Fraction: '96.5', // 分数
      Average: '96.3', // 平均分
      Highestscore: '56', // 最高分
      beat: '138', // 击败同学
      tableth: ['知识模块', '权重占比', '您的正确率', '全班平均正确率'],
      tabletd: [],
      dataname:[],
      datalist:[],
        tabFired: false
    }
  },
  mounted () {
      let _self = this;
      let networkState = navigator.connection.type;
      //console.log(networkState);
      if (networkState === "unknown") {
          document.addEventListener("online", function(){
              //console.log(_self.tabFired);
              if(!_self.tabFired){
                  _self.drawLine();
                  _self.getdata();
                  _self.tabFired = true;
              }
          });
      }else{
          this.drawLine();
          this.getdata();
      }
  },
    activated(){
        this.tabFired = false;
    },
  methods: {
    getdata(){
      let arr = []
      let arr1 = []
      let arr2 = []
      getCourseSubjectResult(this.value).then(res=>{
        console.log(res)
        this.resnav = res.data.data
        for(let i = 0 ;i<this.resnav.length;i++){
          arr.push({id:i+1,value:[this.resnav[i].knowledgeName,(Number(this.resnav[i].knowledgeRate)*100).toFixed()+'%',(Number(this.resnav[i].resultRate)*100).toFixed()+'%',(Number(this.resnav[i].classResultRate)*100).toFixed()+'%']}) 
          arr1.push(this.resnav[i].knowledgeName)
          arr2.push({value:(Number(this.resnav[i].knowledgeRate)*100).toFixed(),name:this.resnav[i].knowledgeName})
        }
        this.tabletd = arr
        this.dataname = arr1
        this.datalist = arr2
        this.drawLine()
      }).catch(e=>{
        console.log(e)
      })
    },
    // 判断当前选中哪个
    allocation (item, index) {
      this.current = index
      this.value = item
      this.getdata()
    },
    back (){
      this.$router.push({
        path: '/studentIndex'
    })
    },
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let self = this
      let myChart = self.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br> {c} ({d}%)',
          // extraCssText:'width:120px; white-space:pre-wrap'
        },
        legend: {
          x: 'center',
          y: 'bottom',
              textStyle: {
                fontSize: 14
              },
              icon: 'circle',
          data: self.dataname
        },
        toolbox: {
          show: true,
          feature: {
            magicType: {
              show: true,
              type: ['pie', 'funnel']
            }
          }
        },
        formatter:function(val){    return val.split("-").join("\n");},
        // calculable: true,
        series: [
          {
            type: 'pie',
            radius: [100, 160],
            center: ['50%', '50%'],
            data: self.datalist,
            color:['#347cf9','#58ce52','#ffc051','#4ba8ff','#ff7d8b','#ba61e8','#c622e5','#2feaf6','#ff7f8b']
          }
        ]
      })
    },
    
  }
}
</script>

<style scoped lang="scss">
.top {
  .nav {
    width: 100%;
    height: 4.4rem;
    line-height: 4.4rem;
    // background-color: #80d59c;
    background:url('../../../assets/上方导航栏.png') no-repeat;
    background-size: 100% 110%;
    color: #ffffff;
    font-size: 2rem;
    padding-left: 1rem;
    display: flex;
    .iconfont{
    font-size: 2rem;
    display: inline-block;
    }
    ul {
      flex: 1;
      height: 4.4rem;
      overflow: hidden;
      li {
        display: inline-block;
        text-align: center;
        span {
          display: inline-block;
          height: 4.4rem;
          padding: 0rem 1rem;
          font-size: 1.8rem;
          opacity: 0.8;
        }
        .color {
          // border-bottom: 4px solid #347cf9;
          background: url('../../../assets/下标识.png') no-repeat;
          background-size: 100% 10%;
          background-position-y: 4rem;
          font-size: 2rem;
          opacity: 1;
        }
      }
    }
  }
  .topimg {
    width: 100%;
    height: 20rem;
    background: url("../../../assets/banner图.png");
    background-size: 100% 100%;
    overflow: hidden;
    h2 {
      font-size: 3.8rem;
      text-align: center;
      margin-top: 5rem;
      margin-left: -1rem;
      color:#fff;
    }
  }
}
.center {
  width: 100%;
  height: 100%;
  padding-bottom: 2rem;
  background-color: #f5f5f5;
  overflow: hidden;
  h4 {
    font-size: 2.9rem;
    margin-top: 3rem;
    margin-left: 4rem;
    color: #666666;
  }
  h2 {
    font-size: 6.2rem;
    color: #ff532b;
    text-align: center;
    margin-top: 3.7rem;
    span {
      font-size: 1.4rem;
    }
  }
  .centernav {
    width: 100%;
    padding: 0 2.2rem;
    height: 11.75rem;
    margin-top: 6.2rem;
    ul {
      width: 100%;
      height: 11.75rem;
      background-color: #94b8f7;
      border-radius: 1.5rem;
      overflow: hidden;
      display: flex;
      li {
        flex: 1;
        height: 11.75rem;
        color: #fff;
        text-align: center;
        border-right: 2px solid #cfddf6;
        div {
          font-size: 1.8rem;
          margin-top: 3rem;
          margin-bottom: 2rem;
        }
        span {
          font-size: 2.2rem;
        }
      }
      :nth-child(3) {
        border-right: none;
      }
    }
  }
  .situation {
    color: #347cf9;
    margin-top: 7rem;
    font-size: 2.8rem;
    text-align: center;
    display: flex;
    justify-content: center;
    .xian {
      width: 2.9rem;
      height: 0.4rem;
      background-color: #347cf9;
      margin-top: 1rem;
    }
    .text {
      padding: 0 1.3rem;
    }
  }
  h3 {
    font-size: 2.2rem;
    margin-top: 4.7rem;
    div {
      display: inline-block;
      background-color: #347cf9;
      width: 1.7rem;
      height: 1.7rem;
      margin-right: 2rem;
      margin-left: 4rem;
    }
  }
  .echarts {
    width: 100%;
    height: 42.25rem;
    // padding: 0 5.75rem;
    #myChart {
      width: 100%;
      height: 100%;
    }
  }
  .table {
    width: 100%;
    padding: 0 5rem;
    table {
      width: 100%;
      font-size: 2rem;
      margin-top: 3.9rem;
      // overflow: hidden;
      border: 1px solid #b3b3b3;
      tr {
        height: 7.9rem;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        th {
          flex: 1;
          height: 7.9rem;
          display: inline;
          background-color: #fff;
          padding-top: 2.5rem;
          border-left: 1px solid #b3b3b3;
          border-bottom: 1px solid #b3b3b3;
        }
        :nth-child(1){
            border-left: none;
        }
        td {
          flex: 1;
          height: 7.9rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.6rem;
          background-color: #f5f5f5;
          // padding-top: 2.5rem;
          border-left: 1px solid #b3b3b3;
          border-bottom: 1px solid #b3b3b3;
        }
        td:nth-child(1){
          font-size: 1.2rem;
        }
      }
    }
  }
}
</style>
