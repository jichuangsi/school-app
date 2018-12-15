<template>
    <div class="popupPic">
        <div class="remind" v-if="questionPic" @click.stop="picimg(questionPic)">
            （点开查看图片）
        </div>
        <div class="bigimg" v-if="dsadsa">
            <div class="btn" @click.stop="picimgshow">x</div>
            <img :src="bigimg" alt="">
        </div>
    </div>
</template>

<script>
    import {getQuestionPic} from '@/api/student/classroom'

    export default {
        name: "PopupPic",
        props: {
            questionPic: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                bigimg:'',
                dsadsa: false
            }
        },
        methods: {
            picimgshow(){
                let self = this
                self.dsadsa = false
            },
            picimg(src){
                let self = this;
                self.dsadsa = true;
                if(this.bigimg === ''){
                    getQuestionPic(src).then(res=>{
                        // console.log(res.data.data.content)
                        self.bigimg = //res.data.data.content;
                            "data:image/png;base64," +
                            res.data.data.content.replace(",", "");
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .popupPic{
        .bigimg {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background-color: #fff;
            z-index: 101;
            .btn {
                padding: 1rem 2rem;
                float: right;
                font-size: 2.5rem;
                color: yellowgreen;
            }
            img {
                height: 100%;
                width: 100%;
            //padding: 4.5rem 2rem;
            }
        }
        .remind {
            font-size: 16px;
            color: #666;
            position: absolute;
            right: 40%;
            z-index: 100;
            // bottom: 0%
        }
    }
</style>