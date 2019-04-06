<template>
    <div class="student">
        <classroom v-show="linkState === 0" v-on:message="zxc($event)" v-on:messageout="qwe($event)"/>
        <homework v-show="linkState === 1" v-on:message="zxc($event)" v-on:messageout="qwe($event)"/>
        <my v-show="linkState === 2" v-on:message="zxc($event)" v-on:messageout="qwe($event)"/>
        <div class="footers">
            <div
                    class="link"
                    :class="{link_hover:index===linkState}"
                    v-for="(item,index) in footerArr"
                    :key="item.index"
                    @click="State(index)"
            >
                <!--<div :class="{msgC:Type === 1,msgH:Type === 2,msgM:Type === 3}" v-if="linkState!=2&&Message"></div>-->
                <div class="msgC" v-if="index === 0&&Message1"></div>
                <div class="msgH" v-if="index === 0&&Message2">{{Message2}}</div>
                <div class="msgM" v-if="index === 0&&Message3"></div>
                <span class="iconfont icon" v-html="item.icon"></span>
                <div class="text">{{item.text}}</div>
            </div>
        </div>
        <Upgrade/>
    </div>
</template>

<script>
    import classroom from '../../components/studentIndex/classroom'
    import homework from '../../components/studentIndex/homework'
    import my from '../../components/studentIndex/my'
    import {mapGetters} from 'vuex'
    import Upgrade from '../../components/public/Upgrade'

    export default {
        name: "student",
        components: {
            classroom,
            homework,
            my,
            Upgrade
        },
        data() {
            return {
                Message1 : '',
                Message2 : '',
                Message3 : '',
                Type : '',
                linkState: 0,
                footerArr: [{
                    icon: '&#xe617;',
                    text: '课堂'
                }, {
                    icon: '&#xe618;',
                    text: '习题'
                }, {
                    icon: '&#xe616;',
                    text: '我的'
                }]
            }
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'setState',
                'isBlueTooth'
            ])
        },
        mounted(){
        },
        methods: {
            qwe(val){
                /*this.Message = val.message;
                this.Type = val.type;*/
                switch (val.type) {
                    case 1: this.Message1 = val.message;break;
                    case 2: this.Message2 = val.message;break;
                    case 3: this.Message3 = val.message;break;
                }
            },
            zxc(val){console.log(val);
                /*this.Message = val.message;
                this.Type = val.type;*/
                switch (val.type) {
                    case 1: this.Message1 = val.message;break;
                    case 2: this.Message2 = val.message;break;
                    case 3: this.Message3 = val.message;break;
                }
            },
            State(index) {
                this.linkState = index;
            },
            switchTab(tab){
                let _self = this;
                switch (tab) {
                    case '0': _self.linkState = 0; break;
                    case '1': _self.linkState = 1; break;
                    case '2': _self.linkState = 2; break;
                    default: _self.linkState = 0;
                }
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.name == 'classroom' || from.name == 'objectiveWork' || from.name == 'subjectiveWork' || from.name == 'myShow') {
                to.meta.isBack = true;
                next();
            } else {
                next();
            }
        },
        activated() {
            if(this.$route.query.tab) this.switchTab(this.$route.query.tab);
            if (!this.$route.meta.isBack) {
                setTimeout(function () {
                    // initialize();
                }, 1000)
            }
            // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
            this.$route.meta.isBack = false
        },
    }

</script>

<style lang="scss">
    .student {
        width: 100%;
        height: 100%;
        // background-size: 100% 100%;
        background: url('../../assets/allbj.png') no-repeat;
        position: relative;
        .footers {
            width: 100%;
            height: 6rem;
            display: flex;
            justify-content: space-between;
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 1000;
            background: #FFFFFF;
            box-shadow: 0 -2px 6px 0 rgba(0, 0, 0, 0.12);
            .link {
                position: relative;
                padding: .79rem 0 .36rem;
                flex: 1;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                color: rgba(203, 203, 203, 1);
                .icon {
                    line-height: 35px;
                    font-size: 35px;
                    position: relative;
                    .message {
                        position: absolute;
                        top: -5%;
                        left: 52%;
                        width: 1rem;
                        height: 1rem;
                        background-color: rgba(255, 82, 82, 1);
                        border-radius: 50%;
                    }
                }
                .text {
                    line-height: 28px;
                    font-size: 20px;
                }
                .msgC {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    top: 10%;
                    left: 54%;
                    background-color: red;
                    z-index: 2;
                    color: white;
                }
                .msgH {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    top: 10%;
                    left: 153%;
                    background-color: red;
                    z-index: 2;
                    color: white;
                }
                .msgM {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    top: 10%;
                    left: 200%;
                    background-color: red;
                    z-index: 2;
                    color: white;
                }
            }
            .link_hover {
                color: #3d72fe;
            }
        }
    }
</style>
