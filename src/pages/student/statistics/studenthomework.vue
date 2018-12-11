<template>
    <div class="studenthomework">
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
export default {
  name: 'studenthomework',
  data () {
    return {
      current: 1,
      nav: ['全科', '语文', '数学', '英语', '政治', '地理', '历史'],
      value: '语 文',
      Total: '150',
      Fraction: '96.5', // 分数
      Average: '96.3', // 平均分
      Highestscore: '56', // 最高分
      beat: '138', // 击败同学
      tableth: ['知识模块', '权重占比', '您的正确率', '年级平均正确率'],
      tabletd: [
        {id: 1,
          value: ['基础知识', '75%', '75%', '80%']
        },
        {id: 2,
          value: ['基础知识', '75%', '75%', '80%']
        },
        {id: 3,
          value: ['基础知识', '75%', '75%', '80%']
        },
        {id: 4,
          value: ['基础知识', '75%', '75%', '80%']
        }
      ]
    }
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    // 判断当前选中哪个
    allocation (item, index) {
      this.current = index
      this.value = item
    },
    back (){
      this.$router.go(-1);//返回上一层
    },
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: [
            {
              name: '基础知识',
              textStyle: {
                fontSize: 14
              },
              icon: 'circle'
            },
            {
              name: '背诵默读',
              textStyle: {
                fontSize: 14
              },
              icon: 'circle'
            },
            {
              name: '诗词鉴赏',
              textStyle: {
                fontSize: 14
              },
              icon: 'circle'
            },
            {
              name: '现代文阅读',
              textStyle: {
                fontSize: 14
              },
              icon: 'circle'
            },
            {
              name: '文言文阅读理解',
              textStyle: {
                fontSize: 14
              },
              icon: 'circle'
            },
            {
              name: '作文',
              textStyle: {
                fontSize: 14
              },
              icon: 'circle'
            }
          ]
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
        // calculable: true,
        series: [
          {
            type: 'pie',
            radius: [100, 160],
            center: ['50%', '40%'],
            data: [
              {
                value: 10,
                name: '基础知识',
                itemStyle: { normal: { color: '#347cf9' } }
              },
              {
                value: 20,
                name: '背诵默读',
                itemStyle: { normal: { color: '#58ce52' } }
              },
              {
                value: 15,
                name: '诗词鉴赏',
                itemStyle: { normal: { color: '#ffc051' } }
              },
              {
                value: 25,
                name: '现代文阅读',
                itemStyle: { normal: { color: '#4ba8ff' } }
              },
              {
                value: 20,
                name: '文言文阅读理解',
                itemStyle: { normal: { color: '#ff7d8b' } }
              },
              {
                value: 35,
                name: '作文',
                itemStyle: { normal: { color: '#ba61e8' } }
              }
            ]
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="scss">
.top {
  .nav {
    width: 100%;
    height: 4.7rem;
    line-height: 4.7rem;
    background-color: #80d59c;
    color: #ffffff;
    font-size: 2rem;
    padding-left: 2rem;
    display: flex;
    .iconfont{
    font-size: 2rem;
    display: inline-block;
    padding-right:1rem;
    }
    ul {
      flex: 1;
      height: 4.7rem;
      overflow: hidden;
      li {
        display: inline-block;
        text-align: center;
        padding-left: 3rem;
        span {
          display: inline-block;
          height: 4.7rem;
        }
        .color {
          border-bottom: 4px solid #347cf9;
        }
      }
      :nth-child(1) {
        padding-left: 0;
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
      margin-left: -2rem;
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
    padding: 0 5.75rem;
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
      overflow: hidden;
      border: 1px solid #b3b3b3;
      tr {
        height: 7.9rem;
        text-align: center;
        display: flex;
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
          display: inline;
          background-color: #f5f5f5;
          padding-top: 2.5rem;
        border-left: 1px solid #b3b3b3;
        border-bottom: 1px solid #b3b3b3;
        }
      }
    }
  }
}
</style>
