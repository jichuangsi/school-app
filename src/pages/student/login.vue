<template>
    <div class="login">
        <div class="logo">
            <img src="../../../public/images/logo.png"
                 alt="logo">
        </div>
        <div class="login_content">
            <div class="account">
                <label class="iconfont">&#xe619;</label>
                <input type="text" placeholder="账号" v-model="account">
            </div>
            <div class="password">
                <label class="iconfont">&#xe61a;</label>
                <input type="password" placeholder="密码" v-model="password">
            </div>
            <div class="loginButton" @click="submitLogin">登录</div>
        </div>
    </div>
</template>

<!--登录-->

<script>
    import {login} from '@/api/login'
    import {Toast} from 'mint-ui';

    export default {
        name: "login",
        data() {
            return {
                account: '',          //账号
                password: ''         //密码
            }
        },
        methods: {
            async submitLogin() {
                try {
                    let userInfo = await login(this.account, this.password);
                    if (userInfo) {
                        this.$router.push({
                            path: '/studentIndex',
                            name: 'studentIndex'
                        })
                    }
                } catch (e) {
                    Toast({
                        message: e,
                        position: 'middle',
                        duration: 1000
                    });
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .login {
        .logo {
            padding: 8rem 0 5rem;
            text-align: center;
            img {
                width: 127px;
                height: 234px;
            }
        }
        .login_content {
            padding: 0 10rem 1rem;
            .account {
                display: flex;
                border-bottom: 1px solid rgba(204, 204, 204, 1);
                font-size: 18px;
                label {
                    font-size: 2.5rem;
                    color: rgba(178, 178, 178, 1);
                }
                input {
                    width: 100%;
                    line-height: 2.43rem;
                    background-color: transparent;
                    color: rgba(178, 178, 178, 1);
                }
            }
            .password {
                display: flex;
                margin-top: 3.07rem;
                border-bottom: 1px solid rgba(204, 204, 204, 1);
                font-size: 18px;
                label {
                    font-size: 2.5rem;
                    color: rgba(178, 178, 178, 1);
                }
                input {
                    width: 100%;
                    line-height: 2.43rem;
                    background-color: transparent;
                    color: rgba(178, 178, 178, 1);
                }
            }
            .loginButton {
                width: 100%;
                height: 4.29rem;
                line-height: 4.29rem;
                margin-top: 6rem;
                font-size: 24px;
                color: white;
                box-sizing: border-box;
                background: linear-gradient(to right, #08EBD0, #28A1EC);
                border-radius: 4.29rem;
                text-align: center;
                padding-bottom: 10px;
            }
            .loginButton:active{
                background-image: linear-gradient(-166deg, invalid gradient);
                box-shadow: 0 2px 6px 3px #62D8EF, 0 2px 23px 8px rgba(103,217,255,0.89);
            }
        }
    }
</style>
