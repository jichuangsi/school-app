<template>
    <div class="homeWork">
        <public-header :header="header"/>
        <scroll-content ref="myscrollfull" @load="loadData" @reload="reloadData" v-if="pageShow"
                        :tips="tips">
            <div slot="empty">无任何数据</div>
            <homeworks v-for="item in workList" :key="item.index"
                           :studentHomework="item"/>
                <div class="history" v-if="homeworkState">上拉查看历史信息</div>
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
    import {getHomeworkHistory} from '@/api/student/homework'
    import homeworks from '../homework/homeworkList'

    export default {
        data() {
            return {
                header: {                         //头部标题
                    title: '习题',
                },
                title: '作业簿',                   //标题
                workList: [],
                homeworkPage: 100,
                //判断课堂还有没有
                homeworkState: true,
                loading: true,                    //加载状态
                pageShow: false,                  //内容状态
                tips: "没有更多作业"                //加载完提示
            }
        },
        components: {
            PublicHeader,
            ScrollContent,
            Loading,
            homeworks
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'homeworkList'
            ])
        },
        mounted() {
            if (this.homeworkList.length === 0) {
                this.getHomeworkList();
            } else {
                this.pageShow = true;
                this.loading = false;
            }
        },
        methods: {
            //获取数据加载
            getHomeworkList() {
                this.$store.dispatch('getWrokList').then((res) => {
                    this.pageShow = true;
                    this.loading = false;
                    this.workList = this.homeworkList;
                    console.log(this.workList)
                }).catch((err) => {
                    console.log("err", err);
                });
            },
            //上拉加载
            loadData(pageIndex) {
                setTimeout(() => {
                    getHomeworkHistory(pageIndex)
                        .then(res => {
                            console.log(res.data.data.content);
                            store.commit('SET_HOMEWORKHISTORY', res.data.data.content);
                            this.workList = this.homeworkList;
                            this.homeworkPage = res.data.data.pageCount;
                            if (this.homeworkPage === pageIndex) {
                                this.homeworkState = false
                            }
                            this.$refs.myscrollfull.endByPage(res.data.data.pageSize, res.data.data.pageCount);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }, 2000)
            },
            //下拉刷新数据
            reloadData() {
                let _this = this;
                setTimeout(function () {
                    _this.getHomeworkList();
                    _this.$refs.myscrollfull.endSuccess();
                }, 1000)
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
    .homeWork {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        //background-color: white;
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
