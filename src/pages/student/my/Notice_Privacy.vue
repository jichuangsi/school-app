<template>
  <div class="Notice_Privacy">
    <public-header :header="header"/>
    <div class="content">
        <div class="title">
            用户须知
        </div>
        <div class="text">

        </div>
        <div class="title_text">
            n、注销用户信息
        </div>
        <div class="text">
            注销账号请联系本校管理员
        </div>
        <div class="title">
            隐私权限
        </div>
        <div class="text">
            集创思智慧课堂系统（以下或称“我们”）非常注重保护用户（“您”）的个人信息及隐私，我们深知个人信息对您的重要性，并将按照法律法规要求和业界成熟的安全标准，采取相应的安全保护措施来保护您的个人信息。我们希望通过本隐私政策向您清晰地介绍在使用我们的产品\服务时，我们如何处理您的个人信息，以及我们为您提供的访问、更正、删除和保护这些信息的方式。
        </div>
        <div class="title_text">
            一、帮助您成为我们的用户
        </div>
    </div>
  </div>
</template>

<script>
import PublicHeader from "../../../components/public/PublicHeader";
import { Toast } from "mint-ui";
export default {
  name: "Notice_Privacy",
  components: {
    PublicHeader
  },
  data() {
    return {
      header: {
        //头部信息
        title: "用户须知及隐私权限",
        url: "/myShow"
      }
    };
  },
  mounted() {
  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
.Notice_Privacy {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .content {
    width: 100%;
    padding: 2rem;
    padding-top: 4.4rem;
    background-color: white;
    box-sizing: border-box;
    .title {
        text-align: center;
        font-size: 28px;
        line-height: 36px;
        margin: 2rem auto;
    }
    .title_text {
        font-size: 20px;
        line-height: 28px;
        font-weight: 600;
    }
    .text {
        font-size: 18px;
        line-height: 24px;
        text-indent: 2rem;
    }
  }
}
</style>
