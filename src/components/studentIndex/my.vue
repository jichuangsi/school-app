<template>
    <div class="My">
        <div class="header">
            <div class="img_warp">
                <img src="../../../public/images/Bitmap.png">
            </div>
            <div class="name">韩梅梅</div>
            <div class="class">初一(3)班</div>
        </div>
        <div class="content">
            <router-link tag="div" to="/myShow" class="setting clearfix">
                <div class="img_warp">
                    <img src="../../../public/images/set.png">
                </div>
                <div class="text">设置</div>
                <div class="enter"></div>
            </router-link>
            <div class="drop_out">退出登录</div>
        </div>
        <loading v-if="loading"/>
    </div>
</template>

<script>
    import Loading from '../public/Loading'

    export default {
        name: "my",
        components: {
            Loading
        },
        data() {
            return {
                loading: true,                              //加载状态
                pageShow: false,                            //内容状态
            }
        },
        mounted() {
            this.getMy();
        },
        methods: {
            //获取数据
            getMy() {
                this.pageShow = true;
                this.loading = false;
                // let _this = this;
                // this.api.getMy()
                //     .then(function (res) {
                //         _this.pageShow = true;
                //         _this.loading = false;
                //     })
                //     .catch(function (err) {
                //
                //     });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .My {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        .header {
            width: 100%;
            height: 30rem;
            background: url("../../../public/images/beijin.png") no-repeat;
            text-align: center;
            .img_warp {
                width: 11.43rem;
                height: 11.43rem;
                margin: 0 auto;
                padding-top: 8.75rem;
                img {
                    width: 11.43rem;
                    height: 11.43rem;
                    border-radius: 50%;
                }
            }
            .name {
                padding: 1.14rem 0 .79rem;
                font-size: 32px;
                color: #353535;
            }
            .class {
                color: #424242;
                padding: .5rem 1.1rem;
                display: inline-block;
                font-size: 20px;
                border: 1px solid #696969;
                border-radius: 100px;
            }
        }
        .content {
            padding: 4.36rem 0;
            .setting {
                width: 100%;
                height: 5rem;
                padding: 0 1.43rem 0 5.14rem;
                border-top: 1px solid #D7D7D7;
                border-bottom: 1px solid #D7D7D7;
                box-sizing: border-box;
                background-color: white;
                .img_warp {
                    margin-top: 1rem;
                    width: 3rem;
                    height: 3rem;
                    float: left;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .text {
                    line-height: 5rem;
                    padding-left: 1.36rem;
                    float: left;
                    font-size: 22px;
                    color: rgba(53, 53, 53, 1);
                }
                .enter {
                    line-height: 5rem;
                    float: right;
                    height: 100%;
                    position: relative;
                    &:before {
                        content: " ";
                        display: inline-block;
                        height: 15px;
                        width: 15px;
                        border-width: 4px 4px 0 0;
                        border-color: #C7C7CC;
                        border-style: solid;
                        -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) translateY(-50%);
                        position: absolute;
                        top: 50%;
                        right: 1.43rem;
                        margin-top: -4px;
                    }
                }
            }
            .drop_out {
                width: 100%;
                height: 5rem;
                line-height: 5rem;
                text-align: center;
                font-size: 22px;
                margin-top: 2.86rem;
                border-top: 1px solid #D7D7D7;
                border-bottom: 1px solid #D7D7D7;
                box-sizing: border-box;
                color: rgba(100, 100, 100, 1);
                background-color: white;
            }
        }
    }
</style>
