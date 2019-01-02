<template>
  <div class="studentCollection">
    <div class="top">
      <div class="nav">
        <i
          class="iconfont icon-icon-arrow-left2"
          @click="back"
        ></i>
        <div class="text">我的收藏</div>
      </div>
    </div>
    <div class="objective">
      <div class="title">{{objective.title}}</div>
      <div
        class="topic"
        v-html="objective.questionContent"
      >
        {{objective.questionContent}}
      </div>
      <div
        class="select clearfix"
        v-for="(item,index) in objective.options"
        :key="index"
        @click="selectIndex(index,objective.questionId)"
        v-if="objective.answer.length==1"
      >
        <div class="round">
          <span
            class="point"
            v-if="pointIndex === index"
          ></span>
        </div>
        <div class="option">{{conversion(index)}}.</div>
        <div
          class="text"
          v-html="item"
        >{{item}}</div>
      </div>
      <div
        class="select clearfix"
        v-for="(item,index) in objective.options"
        :key="index"
        @click="selectsIndex(index,objective.questionId)"
        v-if="objective.answer.length>1"
      >
        <div class="round">
          <span
            class="point"
            v-if="answers.indexOf(index)>-1"
          ></span>
        </div>
        <div class="option">{{conversion(index)}}.</div>
        <div
          class="text"
          v-html="item"
        >{{item}}</div>
      </div>
      <PopupPic :questionPic="objective.questionPic" />
      <div
        class="anwers"
        v-if="objective.questionStatus == 'FINISH'"
      >
        此题答案为:<span v-html="objective.answer.split('|').join('')"></span>
      </div>
      <div
        class="remind"
        v-html="objective.parse"
        v-if="objective.questionStatus == 'FINISH'"
      >
      </div>
    </div>
    <div class="subjectiveTopic">
      <div class="topic_warp">
        <div class="title">{{subjectiveTopic.title}}</div>
        <div
          class="topic"
          v-html="subjectiveTopic.questionContent"
        >
          {{subjectiveTopic.questionContent}}
        </div>
      </div>
      <PopupPic :questionPic="subjectiveTopic.questionPic" />
      <div
        class="anwers"
        v-if="subjectiveTopic.questionStatus == 'FINISH'"
      >
        此题答案为:<span v-html="subjectiveTopic.answer"></span>
      </div>
      <div
        class="remind"
        v-html="subjectiveTopic.parse"
        v-if="subjectiveTopic.questionStatus == 'FINISH'"
      >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "studentCollection",
  data() {
    return {
      objective: [],
      subjectiveTopic: []
    };
  },
  mounted() {},
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    }
  }
};
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
    .iconfont {
      font-size: 2rem;
      display: inline-block;
      padding-right: 1rem;
      position: absolute;
      left: 2rem;
    }
    .text {
      text-align: center;
    }
  }
  .objective {
    .anwers {
      font-size: 18px;
      padding: 15px;
      line-height: 24px;
      span {
        color: red;
      }
    }
    .remind {
      font-size: 18px;
      line-height: 24px;
      padding: 15px;
    }
    .title {
      padding-bottom: 0.57rem;
      font-size: 18px;
      line-height: 1.79rem;
      color: rgba(105, 180, 130, 1);
    }

    .item {
      padding: 0 3.71rem;
      line-height: 2.43rem;
      font-size: 18px;
    }

    .topic {
      line-height: 2.43rem;
      font-size: 18px;
      padding: 0 3.71rem;
    }

    .select {
      position: relative;
      // height: 1.79rem;
      padding: 1.14rem 3.71rem 1.36rem;
      font-size: 0;
      cursor: pointer;

      .round {
        position: relative;
        display: inline-block;
        width: 1.43rem;
        height: 1.43rem;
        border-radius: 50%;
        border: 2px solid rgba(105, 180, 130, 1);
        // float: left;

        .point {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          width: 0.57rem;
          height: 0.57rem;
          border-radius: 50%;
          background-color: rgba(154, 132, 255, 1);
        }
      }
      .option {
        display: inline-block;
        height: 1.79rem;
        line-height: 1.79rem;
        padding-left: 0.57rem;
        padding-right: 0.79rem;
        font-size: 20px;
        color: rgba(105, 180, 130, 1);
        // float: left;
      }

      .text {
        display: inline-block;
        height: 3rem;
        line-height: 1.79rem;
        font-size: 18px;
        color: rgba(53, 53, 53, 1);
        // float: left;
      }
    }
  }
  .subjectiveTopic {
    .anwers {
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
    .topic_warp {
      position: relative;
      .title {
        font-size: 18px;
        color: #69b482;
      }
      .topic {
        color: #353535;
        font-size: 18px;
        line-height: 34px;
        padding: 0 2.57rem;
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
sub{
    vertical-align: sub;
}
}
</style>
