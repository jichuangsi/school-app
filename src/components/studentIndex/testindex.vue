<template>
    <div class="testindex">
        <public-header :header="header" @click="bollen=!bollen"/>
        <scroll-content ref="myscrollfull" @load="loadData" @reload="reloadData" v-if="pageShow" @init="mescrollInit"
                        :tips="tips">
            <div class="navbox">
                <div v-for="(item,index) in nav" :key="index" :class="{navcolor:navindex == index}" @click="navclick(item,index)">{{item}}</div>
            </div>
            <div slot="empty">无任何数据</div>
            <testlist v-for="item in workList" :key="item.index"
                    v-if="item.subjectName == navtext || navtext == '全科'"
                           :studenttest="item"/>
                <div class="history" v-if="testState">上拉查看历史信息</div>
        </scroll-content>
        <loading v-if="loading"/>
    </div>
</template>

<!--作业簿-->

<script>
    import PublicHeader from '../public/PublicHeader'
    import ScrollContent from '../public/ScrollContent'
    import Loading from '../public/Loading'
    import {mapGetters} from 'vuex'
    import store from '@/store'
    import {gettestHistory} from '@/api/student/test'
    import testlist from '../test/testlist'

    export default {
        data() {
            return {
                bollen:true,
                navtext:'全科',
                navindex:0,
                nav: ['全科', '语文', '数学', '英语', '政治', '地理', '历史', '生物', '物理', '化学'],
                header: {                         //头部标题
                    title: '考试',
                },
                title: '考试',                   //标题
                workList: [],
                testPage: 100,
                //判断课堂还有没有
                testState: true,
                loading: true,                    //加载状态
                pageShow: false,                  //内容状态
                tips: "没有更多考试",              //加载完提示
                mescroll: null,
                tabFired: false
            }
        },
        components: {
            PublicHeader,
            ScrollContent,
            Loading,
            testlist
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'testList',
                'isTNew'
            ])
        },
        mounted() {
            //console.log(this.testList)
            if (!this.testList||this.testList.length === 0) {
                let _self = this;
                let networkState = navigator.connection.type;
                //console.log(networkState);
                if (networkState === "unknown") {
                    document.addEventListener("online", function(){
                        //console.log(_self.tabFired);
                        if(!_self.tabFired){
                            _self.gettestList();
                            _self.tabFired = true;
                        }
                    });
                }else{
                    this.gettestList();
                }
            } else {
                this.pageShow = true;
                this.loading = false;
                this.workList = this.testList
            }
        },
        activated(){
            this.tabFired = false;
            if(this.isTNew){
                store.commit('SET_TESTHISTORY', []);
                this.gettestList();
                this.mescroll.resetUpScroll();
                store.commit('IS_TNEW', false);
            }else{
                this.checkComplete(this.workList);
            }
        },
        methods: {
            //选择科目
            navclick(item,index) {
                this.navindex = index
                this.navtext = item
            },
            mescrollInit (mescroll) {
                this.mescroll = mescroll;
            },
            //获取数据加载
            gettestList() {
                this.$store.dispatch('getTestList').then((res) => {
                    //console.log(res)
                    this.pageShow = true;
                    this.loading = false;
                    this.workList = this.testList;
                    this.checkComplete(this.workList);
                    //console.log(this.workList)
                }).catch((err) => {
                    console.log('err in getTestList' + err);
                    this.pageShow = true;
                    this.loading = false;
                    /*let msg = this.getMsg(err);
                    if(msg){
                        Toast({
                            message: msg,
                            position: 'middle',
                            duration: 2000
                        });
                    }*/
                });
            },
            //上拉加载
            loadData(pageIndex) {
                setTimeout(() => {
                    gettestHistory(pageIndex)
                        .then(res => {
                            console.log(res.data.data.content);
                            store.commit('SET_TESTHISTORY', res.data.data.content);
                            this.workList = this.testList;
                            this.removeRepeat(this.workList, 'testId');
                            this.testPage = res.data.data.pageCount;
                            if (this.testPage === pageIndex) {
                                this.testState = false
                            }
                            this.$refs.myscrollfull.endByPage(res.data.data.pageSize, res.data.data.pageCount);
                        })
                        .catch(err => {
                            console.log('err', err);
                            this.mescroll.endErr();
                            /*let msg = this.getMsg(err);
                            if(msg){
                                Toast({
                                    message: msg,
                                    position: 'middle',
                                    duration: 2000
                                });
                            }*/
                        })
                }, 2000)
            },
            //下拉刷新数据
            reloadData() {
                let _this = this;
                setTimeout(function () {
                    let arr1 = [];
                    //if(!_this.homeworkState){
                        arr1 = _this.workList;
                    //}
                    //console.log(arr1);
                    _this.$store.dispatch('getTestList').then((res) => {
                        _this.workList = _this.testList;
                        //if(!_this.homeworkState){
                            let arr2 = _this.workList;
                            //console.log(arr2);
                            if(arr1&&arr1.length>0){
                                let arr3 = [];
                                arr1.forEach((item, index)=>{
                                    let i = arr2.findIndex(x=>{
                                        return x.testId === item.testId;
                                    });
                                    if(i === -1){
                                        arr3.push(arr1[index]);
                                    }
                                    //console.log(arr3);
                                });
                                let j = arr2.findIndex(x=>{
                                    return x.testStatus === 'FINISH'||x.testStatus === 'COMPLETED';
                                });
                                arr3.forEach((item, index)=>{
                                    item.testStatus = 'FINISH';
                                    if(j === -1){
                                        _this.workList.push(item);
                                    }else{
                                        _this.workList.splice(j++, 0, item);
                                    }

                                })
                                //console.log(_this.workList);
                                _this.removeRepeat(_this.workList, 'testId');
                                _this.checkComplete(_this.workList);
                            }
                        //}
                    }).catch((err)=>{
                        console.log(err);
                        _this.mescroll.endErr();
                    });
                    _this.$refs.myscrollfull.endSuccess();
                }, 1000)
            },
            removeRepeat(arr, key){
                for(let i = 0; i < arr.length; i++) {
                    for(let j = i+1; j < arr.length; j++) {
                        if(arr[i][key] === arr[j][key]){
                            arr.splice(j, 1);
                            j = j-1;  // 关键，因为splice()删除元素之后，会使得数组长度减小，此时如果没有j=j-1的话，会导致相同id项在重复两次以上之后无法进行去重，且会错误删除id没有重复的项。
                        }
                    }
                }
            },
            checkComplete(arr){
              let count = 0;
              arr.forEach((item, index)=>{
                  if(!item.completed) count++;
              });
              if(count === 0){
                  this.$emit("messageout",{"message": null, "type": 2});
              }else{
                  this.$emit("message",{"message": count, "type": 2});
              }
            },
            //把毫秒换算成正常时间
            time(time) {
                let times = parseInt(time);
                let date = new Date(times);
                let month = (date.getMonth() + 1 > 10 ? 0 + (date.getMonth() + 1) : date.getMonth() + 1);
                let day = date.getDate();
                let hours = date.getHours();
                let minutes = date.getMinutes();
                return month + '月' + day + '日\t' + hours + ':' + minutes;
            },
        }
    }
</script>

<style lang="scss">
    .testindex {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        //background-color: white;
        
        .navbox {
            margin-top: 40px;
            div {
                font-size: 18px;
                display: inline-block;
                padding: 5px 10px;
                text-decoration:underline;
                margin-left: 10px;
            }
            .navcolor {
                color:#fff;
                background-color: #5ea6ec;
                border-radius: 5px;
                text-decoration:none;
            }
        }
        .mescroll {
            box-sizing: border-box;
            position: absolute;
            top: 3.15rem;
            bottom: 6rem;
            padding: 0rem 2rem 0;
            font-size: 18px;
            height: auto !important;
            .empty {
                text-align: center;
                padding-top: 1.79rem
            }
            .history {
                padding: 2.29rem 0 0;
                font-size: 18px;
                text-align: center;
            }
        }
    }
</style>
