<template>
    <div class="topic_content">
        <div class="title">{{title}}</div>
        <div class="item">
            {{preview}}
        </div>
        <div class="row" v-for="(item,index) in attachmentsfile" :key="index" v-if="item.publishFlag == '1' || item.sub == attachmentsstatus">附件 &nbsp;
          <a @click.capture="downloadAttachment4App(item)">{{item.name}}</a>
        </div>
    </div>
</template>

<!--预习要点-->

<script>
    import '../../../src/assets/styles/topicList.scss'
    import { Indicator, Toast } from "mint-ui";
    import {
        getAttachment
    } from '@/api/teacher/classroom'

    export default {
        name: 'previewPoints',
        props: {
            preview: {
                type: String,
                default: function () {
                    return []
                }
            },
            attachmentsfile: {
                type: Array,
                default: function() {
                    return {
                    };
                }
            },
            attachmentsstatus: {
                type: String,
                default: function() {
                    return {
                    };
                }
            },
        },
        data() {
            return {
                title: '预习要点',
                ready: false
            }
        },
        mounted() {
            this.preview?this.title='预习要点':this.title=''
            console.log(this.attachmentsfile)+'这个数据'
            this.initialize();
        },
        methods:{
            initialize() {
                let _this = this;
                document.addEventListener(
                    'deviceready',
                    _this.onDeviceReady.bind(this),
                    false
                );
            },
            // deviceready Event Handler
            onDeviceReady() {
                this.ready = true;
            },
            // 创建文件路径
            downloadAttachment4App(attachmentInfo) {
                let _this = this;
                if (_this.ready) {
                    Indicator.open({
                        text: '加载中...',
                        spinnerType: 'fading-circle'
                    });
                    window.resolveLocalFileSystemURL(
                        //cordova.file.externalCacheDirectory,
                        cordova.file.externalDataDirectory,
                        /*window.requestFileSystem(
                        LocalFileSystem.PERSISTENT,
                        0,*/
                        //5 * 1024 * 1024,
                        function (fs) {
                            console.log('file system open: ' + fs.nativeURL);
                            _this.createFile(fs, attachmentInfo);
                    }, function(error) {
                        Toast('进入文件系统失败！');
                    });
                } else {
                    Toast('设备没响应，请稍后重试');
                }
            },

            async createFile(dirEntry, attachmentInfo) {
                let _this = this;

                    // Creates a new file or returns the file if it already exists.
                    dirEntry.getFile(attachmentInfo.name, {create: true, exclusive: true}, function(fileEntry) {
                        _this.requestAttachment(fileEntry, attachmentInfo);
                    }, function(error) {
                        Indicator.close();
                        console.log(error);
                        dirEntry.getFile(
                            attachmentInfo.name,
                            { create: false },
                            function(fileEntry) {
                                // 成功读取文件后调用cordova-plugin-file-opener2插件打开文件
                                _this.previewfile(fileEntry, attachmentInfo);
                            },
                            function(err) {
                                Toast('读取文件失败');
                            }
                        );
                    });
            },
            async requestAttachment(fileEntry, attachmentInfo) {
                try{
                    let attachment = await getAttachment(attachmentInfo.sub);
                    Indicator.close();
                    if(!attachment||!attachment.data) {Toast('下载失败，请稍后重试'); throw new Error("返回值为空:" + attachment + "," + attachment.data);}
                    let myBlob = new Blob([attachment.data]);
                    this.writeFile(fileEntry, myBlob, attachmentInfo);
                }catch (e) {
                    console.log(e);
                    Indicator.close();
                    Toast({
                        message: "下载失败，请稍后重试！",
                        duration: 1000
                    });
                    fileEntry.remove(
                        function () {
                            console.log("删除成功");
                        },
                        function (file_error) {
                            console.log("删除错误：" + file_error);
                        }
                    );
                }
            },
            writeFile(fileEntry, dataObj, attachmentInfo) {
                let _this = this;
                // Create a FileWriter object for our FileEntry (log.txt).
                fileEntry.createWriter(function (fileWriter) {

                    fileWriter.onwriteend = function() {
                        console.log("Successful file write...");
                        //_this.readFile(fileEntry);
                        _this.previewfile(fileEntry, attachmentInfo);
                    };

                    fileWriter.onerror = function (e) {
                        console.log("Failed file write: " + e.toString());
                    };

                    // If data object is not passed in,
                    // create a new Blob instead.
                    if (!dataObj) {
                        throw new Error("返回值为空:" + dataObj);
                    }

                    fileWriter.write(dataObj);
                });
            },
            /*readFile(fileEntry) {

                fileEntry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function() {
                        console.log("Successful file read: " + this.result);
                        console.log(fileEntry.fullPath + ": " + this.result);
                    };

                    reader.readAsArrayBuffer(file);

                }, function(error) {
                    Toast('读取文件系统失败！');
                });
            },
            // fileTransfer plugin
            downloadFile(fileEntry) {
                let _this = this;
                //实例化
                let fileTransfer = new window.FileTransfer();
                //监听下载进度
                fileTransfer.onprogress = function(e) {
                    //opener.showOpenWithDialog()
                };
                // 使用fileTransfer.download开始下载
                fileTransfer.download(
                    encodeURI(_this.savePath), //uri网络下载路径
                    fileEntry.toURL(), //文件本地存储路径
                    function(entry) {
                        // 下载完成执行本地预览
                        if (_this.progress > 1 || _this.progress === 1) {
                            _this.showProgress = false;
                            entry.file(data => {
                                //_this.preView(fileEntry);
                                // 此处data.type可以直接得到文件的MIME-TYPE类型
                            });
                        }
                    },
                    function(error) {
                        Toast('下载失败！');
                    },
                    null,
                    {
                        //headers: {
                        //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                        //}
                    }
                );
            },*/
            previewfile(fileEntry, attachmentInfo){
                console.log("file name:" + fileEntry.name + ",file path:"+ fileEntry.toInternalURL());
                // 调用cordova-plugin-file-opener2插件实现用第三方app打开文件
                cordova.plugins.fileOpener2.showOpenWithDialog(
                    // 此处必须填写cdvfile://地址，不然android7.0+会报文件权限错误
                    fileEntry.toInternalURL(), //文件本地地址转cdvfile://地址
                    attachmentInfo.contentType, //文件类型
                    function onSuccess(data) {
                        console.log('成功预览:' + data);
                    },
                    function onError(error) {
                        Toast(
                            '出错！请在' + cordova.file.externalDataDirectory + '目录下查看'
                        );
                    }
                );
            },
            //网页下载附件
            async downloadAttachment4Web(attachmentInfo){
                let attachment = await getAttachment(attachmentInfo.sub);
                console.log(attachment);
                let myBlob = new Blob([attachment.data]);
                let URL = window.URL || window.webkitURL;
                let bloburl = URL.createObjectURL(myBlob);
                let anchor = document.createElement("a");
                if ('download' in anchor) {
                    anchor.style.visibility = "hidden";
                    anchor.href = bloburl;
                    anchor.download = attachmentInfo.name;
                    document.body.appendChild(anchor);
                    let evt = document.createEvent("MouseEvents");
                    evt.initEvent("click", true, true);
                    anchor.dispatchEvent(evt);
                    document.body.removeChild(anchor);
                } else if (navigator.msSaveBlob) {
                    navigator.msSaveBlob(myBlob, name);
                } else {
                    location.href = bloburl;
                } //移除链接释放资源
            }
        }
    }
</script>

<style lang="scss">
</style>
