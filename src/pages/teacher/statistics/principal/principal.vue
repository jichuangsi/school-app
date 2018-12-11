<template>
    <div class="principal">
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
            <div class="text">
                <h4>{{msg}}</h4>
                <span class="grade">年级：{{grade}}</span>
                <span class="time">考试创建时间：{{time}}</span>
            </div>
            <div class="achievement">
                <div class="printing">
                    <span v-print="'#table'"><i class="iconfont icon-dayin"></i> 打印</span>
                </div>
                <div class="all">
                    <ul>
                        <li v-for="(item,index) in all" @click="allclick(item,index)" :key="index">
                            <span :class="{'color':index==current1}">{{item}}</span>
                        </li>
                    </ul>
                </div>
                <div class="single">
                    <ul>
                        <li v-for="(item,index) in single" @click="singleclick(item,index)" :key="index">
                            <span :class="{'color':index==current2}">{{item}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="title">
                <h3>{{title}}</h3>
            </div>
            <div id="table">
                <table style="width: 100%;
      font-size: 1.2rem;
      overflow: hidden;
      border: 1px solid #f6f6f6;">
                    <tr style="height: 3rem;
        text-align: center;
        display: flex;
        overflow: hidden;">
                        <th v-for="(item,index) in tableth" :key="index" style="flex: 1;
          height: 3rem;
          padding-top: 0.9rem;
          display: inline;
          background-color: #cdf9f7;
        border-bottom: 1px solid #f6f6f6;">{{item}}</th>
                    </tr>
                    <tr v-for="(item,index) in tabletd" :key="index" style="height: 3rem;
        text-align: center;
        display: flex;
        overflow: hidden;">
                        <td v-for="(value,index) in item.value" :key="index" style="flex: 1;
          height: 3rem;
          padding-top: 0.9rem;
          display: inline;
          background-color: #ffffff;
          border-left: 1px solid #f6f6f6;
          border-bottom: 1px solid #f6f6f6;">{{value}}</td>
                    </tr>
                </table>
            </div>
            <div class="title">
                <h3>{{title1}}</h3>
            </div>
            <div class="echarts">
                <div class="charts">
                    <div id="myChart"></div>
                    <div class="average">平均分</div>
                    <div class="grade">班级</div>
                    <div class="total">满分：{{Total}}分</div>
                    <div class="allgrade all" @click="Choice">{{Choicegrade}}
                        <span></span>
                    </div>
                    <div class="allsingle all" @click="Choice1">{{Choicesingle}}
                        <span></span>
                    </div>
                    <div class="show" v-show="show">
                        <ul>
                            <li v-for="(item,index) in allgrade" @click="allgradeclick(item,index)" :key="index" :class="{'color':index==current3}">{{item}}</li>
                        </ul>
                    </div>
                    <div class="show" v-show="show1">
                        <ul>
                            <li v-for="(item,index) in allsingle" @click="allsingleclick(item,index)" :key="index" :class="{'color':index==current4}">{{item}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'principal',
  data () {
    return {
      current: 0,
      current1: 0,
      current2: 0,
      current3: 0,
      current4: 0,
      Total: 720,
      show: false,
      show1: false,
      Choicegrade: '全年级',
      Choicesingle: '总分',
      allgrade: [
        '全年级',
        '高二年级1班',
        '高二年级2班',
        '高二年级3班',
        '高二年级4班',
        '高二年级5班',
        '高二年级6班',
        '高二年级7班',
        '高二年级8班',
        '高二年级9班',
        '高二年级10班'
      ],
      allsingle: ['总分', '语文', '数学', '英语', '政治', '地理', '历史'],
      nav: ['校级报告', '班级报告', '选题组卷', '考试中心'],
      value: '校级报告',
      msg: '2018下半年高二科中考考试报告',
      time: '218-11-14',
      grade: '高二',
      all: ['班级成绩对比', '学生成绩汇总', '校验成绩对比'],
      single: ['多学科', '语文', '数学', '英语', '政治', '地理', '历史'],
      title: '各科目校级考试总体统计',
      title1: '各科目平均分及排名',
      tableth: [
        '学科',
        '满分',
        '平均分',
        '最高分',
        '最低分',
        '实考人数',
        '缺考人数'
      ],
      tabletd: [
        {
          id: 1,
          value: ['语文', '150', '102.6', '125', '0', '680', '21']
        },
        {
          id: 2,
          value: ['数学', '150', '102.6', '125', '0', '680', '21']
        },
        {
          id: 3,
          value: ['英语', '150', '102.6', '125', '0', '680', '21']
        },
        {
          id: 4,
          value: ['政治', '150', '102.6', '125', '0', '680', '21']
        },
        {
          id: 4,
          value: ['地理', '150', '102.6', '125', '0', '680', '21']
        },
        {
          id: 4,
          value: ['历史', '150', '102.6', '125', '0', '680', '21']
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
    allclick (item, index) {
      this.current1 = index
    },
    singleclick (item, index) {
      this.current2 = index
    },
    Choice () {
      this.show = true
      this.show1 = false
    },
    Choice1 () {
      this.show1 = true
      this.show = false
    },
    allgradeclick (item, index) {
      this.current3 = index
      this.Choicegrade = item
      this.show = false
    },
    allsingleclick (item, index) {
      this.current4 = index
      this.Choicesingle = item
      this.show1 = false
    },
    back (){
      this.$router.go(-1);//返回上一层
    },
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        color: ['#3090f3'],
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            rotate: 40
          },
          data: [
            '高二年级1班',
            '高二年级2班',
            '高二年级3班',
            '高二年级4班',
            '高二年级5班',
            '高二年级6班',
            '高二年级7班',
            '高二年级8班',
            '高二年级9班',
            '高二年级10班'
          ]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [
              488.3,
              526.6,
              504.5,
              556.3,
              560.1,
              572.3,
              548.5,
              514.2,
              501.8,
              555.5
            ],
            type: 'bar',
            barWidth: 15,
            itemStyle: {
              normal: {
                label: {
                  show: true, // 开启显示
                  position: 'top', // 在上方显示
                  textStyle: {
                    // 数值样式
                    color: '#666666',
                    fontSize: 14
                  }
                }
              }
            }
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
        margin-left: 3rem;
        span {
          display: inline-block;
          height: 4.7rem;
          padding: 0 1rem;
        }
        .color {
          //   border-bottom: 4px solid #347cf9;
          background-color: #347cf9;
        }
      }
      :nth-child(1) {
        margin-left: 0;
      }
    }
  }
  .topimg {
    width: 100%;
    height: 20rem;
    background: url("../../../../assets/banner图.png");
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
  margin-bottom: 4rem;
  .text {
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    padding: 0 2rem;
    margin-top: 4.8rem;
    margin-bottom: 2rem;
    h4 {
      display: inline-block;
      font-size: 2rem;
    }
    .time {
      float: right;
    }
    .grade {
      float: right;
      margin-left: 2rem;
    }
  }
  .achievement {
    width: 100%;
    height: 7.1rem;
    background-color: #f0f0f0;
    padding: 1rem 2.5rem 0 2.5rem;
    margin-bottom: 1rem;
    .all {
      margin-bottom: 1rem;
      display: inline-block;
      ul {
        display: inline-block;
        li {
          line-height: 2rem;
          display: inline-block;
          font-size: 1.7rem;
          padding: 0.3rem 1rem;
          border-left: 1px solid #d8d8d8;
          span {
            padding: 0.6rem 1rem;
            border-radius: 5px;
          }
          .color {
            background-color: #3090f3;
            color: #fff;
          }
        }
        :nth-child(1) {
          border-left: none;
        }
      }
    }
    .single {
      display: inline-block;
      ul {
        display: inline-block;
        li {
          line-height: 2rem;
          display: inline-block;
          font-size: 1.5rem;
          margin-right: 1.5rem;
          span {
          }
          .color {
            color: #3090f3;
          }
        }
        :nth-child(1) {
          margin-left: 0.3rem;
        }
      }
    }
    .printing {
      float: right;
      span {
        display: inline-block;
        padding: 0.6rem 1rem;
        background-color: #3090f3;
        color: #fff;
        border-radius: 5px;
      }
    }
  }
  .title {
    margin: 0 2.8rem;
    height: 3.3rem;
    line-height: 3.3rem;
    font-size: 1.7rem;
    color: #3090f3;
    border-bottom: 3px solid #f0f0f0;
    position: relative;
    h3 {
      display: inline-block;
      border-bottom: 3px solid #6497f4;
      position: absolute;
      top: -3px;
    }
  }
  #table {
    width: 100%;
    padding: 0 2.8rem;
    margin-bottom: 3rem;
    table {
      width: 100%;
      font-size: 1.2rem;
      margin-top: 1.8rem;
      overflow: hidden;
      border: 1px solid #f6f6f6;
      tr {
        height: 3rem;
        text-align: center;
        display: flex;
        overflow: hidden;
        th {
          flex: 1;
          height: 3rem;
          padding-top: 0.9rem;
          display: inline;
          background-color: #cdf9f7;
        }
        :nth-child(1) {
          border-left: none;
        }
        td {
          flex: 1;
          height: 3rem;
          padding-top: 0.9rem;
          display: inline;
          background-color: #ffffff;
          border-left: 1px solid #f6f6f6;
          border-bottom: 1px solid #f6f6f6;
        }
      }
    }
  }
  .echarts {
    width: 100%;
    height: 35rem;
    padding: 0 2.8rem;
    margin-top: 1.5rem;
    .charts {
      width: 100%;
      height: 100%;
      border: 2px solid #f0f0f0;
      position: relative;
      #myChart {
        width: 100%;
        height: 100%;
      }
      .grade {
        position: absolute;
        color: #6497f4;
        font-size: 1.2rem;
        bottom: 2rem;
        right: 4rem;
      }
      .average {
        position: absolute;
        color: #6497f4;
        font-size: 1.2rem;
        top: 5.5rem;
        left: 0rem;
      }
      .total {
        position: absolute;
        font-size: 1.4rem;
        top: 2rem;
        left: 1rem;
      }
      .all {
        position: absolute;
        padding: 0 4rem 0 2rem;
        height: 2.4rem;
        line-height: 2.4rem;
        font-size: 1.2rem;
        color: #fff;
        border-radius: 5px;
        background-color: #3090f3;
        top: 0rem;
        top: 0rem;
        span {
          position: absolute;
          border: 0.6rem solid #ffff;
          border-color: #fff transparent transparent transparent;
          top: 0.9rem;
          right: 1.5rem;
        }
      }
      .allgrade {
        right: 10rem;
      }
      .allsingle {
        right: 0rem;
      }
      .show {
        width: 20rem;
        position: absolute;
        top: 0rem;
        right: 0rem;
        font-size: 1.2rem;
        color: #666666;
        padding: 1rem;
        top: 2.4rem;
        background-color: #fff;
        ul {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          li {
            width: 45%;
            height: 2.4rem;
            line-height: 2.4rem;
            text-align: center;
            background-color: #dcdcdc;
            border-radius: 5px;
            margin-bottom: 1rem;
          }
          .color {
              background-color: #3090f3;
              color: #fff;
          }
        }
      }
    }
  }
}
</style>
