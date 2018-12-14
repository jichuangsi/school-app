<template>
    <div class="subjective">
        <div class="topic_warp">
            <div class="title">{{subjectiveTopic.title}}</div>
            <div class="topic" v-html="subjectiveTopic.questionContent">
                {{subjectiveTopic.questionContent}}
            </div>
        </div>
        <div class="remind" v-if="subjectiveTopic.questionPic" @click.stop="picimg(subjectiveTopic.questionPic)">
            此题有图片（点开查看图片）
        </div>
        <div class="bigimg" v-if="dsadsa">
            <div class="btn" @click.stop="picimgshow">x</div>
            <img :src="bigimg" alt="">
        </div>
    </div>
</template>

<!--主观题-->

<script>
import { getSubjectPic } from "@/api/teacher/classroom";
export default {
  name: "subjective",
  props: {
    subjectiveTopic: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      bigimg: "",
      dsadsa: false
    };
  },
  methods: {
    picimgshow() {
      let self = this;
      self.dsadsa = false;
    },
    picimg(src) {
      let self = this;
      self.dsadsa = true;
      getSubjectPic(src).then(res => {
        // console.log(res.data.data.content)
        self.bigimg = res.data.data.content;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.subjective {
  width: 100%;
  .bigimg {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #fff;
    z-index: 101;
      padding: 4rem 2rem;
    .btn {
      font-size: 4rem;
      font-weight: 700;
      color: yellowgreen;
      position: absolute;
      right: 2rem;
      top: 1rem;
    }
    img {
    }
  }
  .remind {
    font-size: 16px;
    color: #666;
    position: absolute;
    right: 40%;
    z-index: 11;
    // bottom: 0%
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
</style>
