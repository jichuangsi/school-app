  <template>
    <div class="My">
        <div class="top" ref='slide' @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd'>
            <div class="fl">
                版本：{{this.appVersion}}
            </div>
            <h2>个人中心</h2>
            <div class="fr">
                <router-link to="/myShow">
                    <i class="iconfont icon-xinxi" style="font-size:2rem"></i><span>资料</span>
                </router-link>
            </div>
            <!--<div  class="fm">
                <div class="slide" ref='slide' @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd' :style="{transform: translateX}">
                    <slot></slot>
                </div>
            </div>-->
        </div>
        <div class="center">
            <div class="user">
                <div class="userimg">
                    <div class="img"><img :src="userimg" alt="" style="width: 100%;height: 100%;"></div>
                </div>
                <div class="username">{{username}}</div>
                <div class="usertext">{{usertext}}</div>
            </div>
            <div class="nav">
                <ul>
                    <router-link to="/studentenquiry">
                        <li>
                            <div class="left">我的成绩</div>
                            <div class="right">
                                <i class="iconfont icon-icon-arrow-right2"></i>
                            </div>
                        </li>
                    </router-link>
                    <router-link to="/studenthomework">
                        <li>
                            <div class="left">习题详情</div>
                            <div class="right">
                                <i class="iconfont icon-icon-arrow-right2"></i>
                            </div>
                        </li>
                    </router-link>
                    <router-link to="/studentCollection">
                        <li>
                            <div class="left">我的收藏</div>
                            <div class="right">
                                <i class="iconfont icon-icon-arrow-right2"></i>
                            </div>
                        </li>
                    </router-link>
                    <router-link to="/mistakescollection">
                        <li>
                            <div class="left">错题集</div>
                            <div class="right">
                                <i class="iconfont icon-icon-arrow-right2"></i>
                            </div>
                        </li>
                    </router-link>
                    <router-link to="/Schedule">
                        <li>
                            <div class="left">课程表</div>
                            <div class="right">
                                <i class="iconfont icon-icon-arrow-right2"></i>
                            </div>
                        </li>
                    </router-link>
                    <li @click="loginout">
                        <div class="left">退出登录</div>
                        <div class="right">
                            <i class="iconfont icon-icon-arrow-right2"></i>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <loading v-if="loading" />
    </div>
</template>
<script>
import Loading from "../public/Loading";
import store from '@/store'

export default {
  name: "my",
  components: {
    Loading
  },
  data() {
    return {
      loading: true, //加载状态
      pageShow: false, //内容状态
      username: "韩梅梅",
      usertext: "学如逆水行舟，不进则退。",
      userimg: '',
      appVersion: '',
      startX: 0, //开始触摸的位置
      startY: 0, //滑动时的位置
      endX: 0, //结束触摸的位置
      disX: 0, //移动距离
      lastX: 0, //上一次X坐标
      lastY: 0, //上一次Y坐标
      //translateX: 'translateX(0px)'
    };
  },
  activated() {
    this.getMy();
  },
  methods: {
      touchStart: function (ev) {
          ev = ev || event;
          // console.log(ev.targetTouches);
          // console.log(ev.changedTouches);
          if (ev.touches.length == 1) { //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
              this.startX = this.lastX = ev.touches[0].clientX; // 记录开始位置
              //this.startY = this.lastY = ev.touches[0].clientX;
          }
      },
      touchMove: function (ev) {
          ev = ev || event;
          //let slideWidth = this.$refs.slide.offsetWidth; //$refs 减少获取dom节点的消耗
          // console.log(ev.targetTouches);
          // console.log(ev.changedTouches);
          if (ev.touches.length == 1) {
              // 实时的滑动的距离-起始位置=实时移动的位置
              //this.disX = this.lastX - this.startX;
              // 计算两次移动距离Y>X就不启动滑动动画,防止误滑
              let disX = ev.touches[0].clientX - this.lastX
              //var disY = ev.touches[0].clientY - this.lastY
              // console.log(disX, disY);
              /*if (Math.abs(disX) > Math.abs(disY)) {
                  this.translateX = 'translateX(' + this.disX + 'px)';
              }*/

              if (Math.abs(disX) > 0) {
                  console.log("disX:" + disX);
                  if (disX < 0) {
                      console.log('左滑');
                      //this.$emit('change', 'left')
                  } else {
                      console.log('右滑');
                      //this.$emit('change', 'right')
                  }
                  let brightness = cordova.plugins.brightness;
                  //let self = this;
                  brightness.getBrightness(function (r) {
                      console.log("get brightness success");
                      let res = parseFloat(r);
                      console.log("success res:" + res);
                      if(res===-1.0) res = 0.5;
                      let adjust = res + Math.round(disX)/1000;
                      console.log("adjust:" + adjust);
                      if(adjust<0) adjust = 0;
                      if(adjust>1) adjust = 1;
                      brightness.setBrightness(adjust, function () {
                          console.log("set brightness success");
                      }, function () {
                          console.error("set brightness fail");
                      });
                  }, function (res) {
                      console.error("get brightness fail");
                  });
              }
              // 记录一次坐标值
              this.lastX = ev.touches[0].clientX;
              //this.lastY = ev.touches[0].clientY;
          }
      },
      touchEnd: function (ev) {
          ev = ev || event;
          let slideWidth = this.$refs.slide.offsetWidth;//$refs 减少获取dom节点的消耗
          console.log("slideWidth:" + slideWidth);
          if (ev.changedTouches.length == 1) {
              let endX = ev.changedTouches[0].clientX;
              console.log("endX:" + endX);
              this.disX = endX - this.startX;
              console.log("disX:" + this.disX);
              // console.log(this.disX, 'this.disX')
              // console.log((slideWidth / 2), 'slideWidth/2');
              //this.translateX = 'translateX(0px)';
              // 只有滑动大于一半距离才触发
              /*if (Math.abs(this.disX) > 0) {
                  console.log("disX:" + this.disX);
                  if (this.disX < 0) {
                      console.log('左滑');
                      //this.$emit('change', 'left')
                  } else {
                      console.log('右滑');
                      //this.$emit('change', 'right')
                  }
                  let brightness = cordova.plugins.brightness;
                  let self = this;
                  brightness.getBrightness(function (r) {
                      console.log("get brightness success");
                      let res = parseFloat(r);
                      console.log("success res:" + res);
                      if(res===-1.0) res = 0.5;
                      let adjust = res + Math.round(self.disX)/1000;
                      console.log("adjust:" + adjust);
                      if(adjust<0) adjust = 0;
                      if(adjust>1) adjust = 1;
                      brightness.setBrightness(adjust, function () {
                          console.log("set brightness success");
                      }, function () {
                          console.error("set brightness fail");
                      });
                  }, function (res) {
                      console.error("get brightness fail");
                  });
              }*/
          }
      },
    //获取数据
    getMy() {
        this.pageShow = true;
        this.loading = false;
        var img = localStorage.getItem("HeadPortrait")
        ? localStorage.getItem("HeadPortrait")
        : "";
      let user = JSON.parse(localStorage.getItem("user"));
      if (img) {
        this.userimg = "data:image/jpeg;base64," + img;
      } else {
        if (user.userSex == "FEMALE") {
          this.userimg = require("../../assets/女学生.png");
        } else {
          this.userimg = require("../../assets/男学生.png");
        }
      }
      this.username = user.userName;
        let _this = this;
        cordova.getAppVersion.getVersionNumber().then(function (version) {
            _this.appVersion = version;
            _this.$forceUpdate();
        });
    },
    loginout() {
      localStorage.removeItem("HeadPortrait");
      localStorage.removeItem('token');
      //localStorage.removeItem('user');
      store.commit('IS_CNEW', false);
      store.commit('IS_HNEW', false);
      window.HandwrittenBoard.disconnect();
      this.$router.push({ path: "/", name: "login" })
    }
  }
};
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  height: 31rem;
  background: url("../../assets/教师端-我的_01.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  position: relative;
    .fl {
        float: left;
        position: absolute;
        top: 2.7rem;
        left: 3.1rem;
        font-size: 2rem;
        color: #fff;
    }
  h2 {
    text-align: center;
    font-size: 3.8rem;
    padding-top: 6.8rem;
    color:#fff;
  }
  .fr {
    float: right;
    position: absolute;
    top: 2.7rem;
    right: 3.1rem;
    font-size: 2rem;
    color: #fff;
    i {
        font-size: 2.8rem !important;
        vertical-align: middle !important;
    }
    span {
        vertical-align: middle;
    }
  }
}
.center {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  padding: 0 3.4rem 0 2.4rem;
  position: relative;
  .user {
    width: 100%;
    height: 24.3rem;
    border-radius: 10px;
    background-color: #ffffff;
    margin-top: -10rem;
    float: left;
    .userimg {
      width: 13.3rem;
      height: 13.3rem;
      background-color: #fff;
      margin: -6.65rem auto;
      border-radius: 50%;
      padding: 8px;
      .img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
      }
    }
    .username {
      width: 100%;
      font-size: 3.4rem;
      margin-top: 7.9rem;
      text-align: center;
    }
    .usertext {
      width: 100%;
      text-align: center;
      font-size: 2.7rem;
      margin-top: 4.9rem;
      color: #666666;
    }
  }
  .nav {
    width: 100%;
    // height: 68.7rem;
    padding-top: 23rem;
    margin-bottom: 10rem;
    ul {
      li {
        width: 100%;
        height: 8.1rem;
        line-height: 8.1rem;
        padding-left: 2.5rem;
        padding-right: 2.5rem;
        font-size: 2.6rem;
        border-bottom: 2px solid #e1e1e2;
        color: #333333;
        div {
          display: inline-block;
        }
        .right {
          display: inline-block;
          height: 100%;
          float: right;
          color: #888;
          opacity: 0.6;
          .iconfont {
            font-size: 2.6rem;
          }
        }
      }
    }
  }
}
</style>
