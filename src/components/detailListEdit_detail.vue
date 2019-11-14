<template>
  <div class="detailListEdit_detail h100">
    <q-layout view="lHh Lpr lFf" container class="h100 shadow-2 rounded-borders">
      <q-header elevated>
        <q-toolbar class="bg-top_Nav-color text-top">
          <!-- <q-icon size="32px" name="fas fa-angle-left" @click.native="showDefault('edit')" /> -->
          <q-icon class="f17" @click.native="showDefault('edit')"></q-icon>
          <q-toolbar-title>{{info.serialNo}}</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page class="q-pa-xs">
          <q-list dense class="rounded-borders">
            <!--  检查内容 -->
            <div class="col">
              <div style="background-color:#fff;">
                <span class="checkStyle">检查内容：</span>
                <q-separator />
                <p v-html="info.checkContent" class="pStyle"></p>
              </div>
              <!-- 新增附件区域 -->
              <div class="textarStylea">
                <q-uploader
                  ref="uploadAdd"
                  url="/api/upload/file/uploadManyEnclosure"
                  label="添加附件"
                  auto-upload
                  multiple
                  :form-fields="dataObj"
                  field-name="files"
                  style="max-width: 100%;width: 100%;"
                  @finish="successCallback"
                  @uploaded="uploadEnclosure"
                  no-thumbnails
                  flat
                >
                  <template v-slot:header="scope">
                    <div style="background-color:#fff; padding:0;">
                      <div>
                        <q-expansion-item
                          expand-icon-class="text-blue-3"
                          expand-separator
                          expand-icon-toggle
                          expand-icon="keyboard_arrow_down"
                        >
                          <template v-slot:header>
                            <q-item-section>
                              <div>
                                <span
                                  style="color:#333333; font-family:Microsoft YaHei; font-weight:bold;"
                                >内容附件</span>
                                <q-btn color="btn" label="添加附件" size="xs" style="margin-left:20px;">
                                  <q-uploader-add-trigger />
                                </q-btn>
                              </div>
                            </q-item-section>
                          </template>
                          <q-card>
                            <q-card-section style="height:200px; overflow:auto;">
                              <q-list style="padding-left:7px;">
                                <q-item v-for="(item,index) in fileData" :key="index">
                                  <q-item-section
                                    v-if="item.filename"
                                    thumbnail
                                    style="word-wrap: break-word;word-break: break-all;overflow: hidden;"
                                  >{{item.filename}}</q-item-section>
                                  <q-item-section side>
                                    <div class="downloadStyle">
                                      <span>
                                        <a class="imga" :href="item.url" :download="item.filename"></a>
                                      </span>
                                      <span>
                                        <img
                                          class="imgb"
                                          src="../assets/deletefile.png"
                                          @click="deletefile(item.id)"
                                          alt
                                        />
                                      </span>
                                    </div>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                            </q-card-section>
                          </q-card>
                        </q-expansion-item>
                      </div>
                    </div>
                  </template>
                </q-uploader>
              </div>
              <q-separator />
              <!-- 新增 -->
              <div class="col mb20" style="background-color:#fff; margin-top:10px;">
                <span class="topPublic">新增描述:</span>
                <q-input class="mb20 inputStyle" v-model="remark" outlined />
                <q-uploader
                  ref="uploaded"
                  url="/api/upload/file/uploadManyFile"
                  label="上传"
                  accept="image/*"
                  auto-upload
                  multiple
                  :max-file-size="5242880"
                  :headers="headers"
                  :form-fields="[{name: 'path', value: 'details'}]"
                  field-name="file"
                  style="max-width: 100%;width: 100%;"
                  @uploaded="uploadImg"
                  @start="startUpload"
                  @finish="finishUpload"
                  flat
                >
                  <template v-slot:header="scope">
                    <div style="background-color:#fff; padding-left:10px;">
                      <q-btn dense flat>
                        <q-avatar square>
                          <q-uploader-add-trigger />
                          <img src="../assets/upload.svg" style="width:100%;" />
                        </q-avatar>
                      </q-btn>
                    </div>
                  </template>
                  <template v-slot:list="scope">
                    <q-list separator>
                      <q-item v-for="(file,index) in scope.files" :key="index">
                        <q-item-section v-if="file.__img" thumbnail>
                          <img :src="file.__img.src" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label class="full-width ellipsis">
                            <q-input
                              placeholder="请输入备注"
                              type="textarea"
                              :input-style="{ height: '56px' }"
                              v-model="text[file.name]"
                              outlined
                            />
                          </q-item-label>
                        </q-item-section>

                        <q-item-section side>
                          <q-btn size="12px" flat dense @click="deleteImg(file,'uploaded', 1)">
                            <q-icon name="fas fa-trash" />
                          </q-btn>
                        </q-item-section>
                      </q-item>
                    </q-list>
                    <!-- 上传展示区 -->
                    <q-item v-for="(item,index) in fileList" :key="index">
                      <q-item-section v-if="item.url" thumbnail style="width:116px;">
                        <q-img :src="item.url" class="imageStyle">
                          <template v-slot:loading>
                            <div class="text-#c0c4cc divVstyle">
                              <q-spinner-ios color="#c0c4cc" :size="16" />
                              <div class="q-mt-md fzStyle">Loading...</div>
                            </div>
                          </template>
                        </q-img>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label class="full-width ellipsis">
                          <q-input
                            outlined
                            type="textarea"
                            :input-style="{ height: '56px' }"
                            v-model="text[item.url]"
                          />
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-btn size="12px" flat dense @click="deleteShowImg(item)">
                          <q-icon name="fas fa-trash" />
                        </q-btn>
                      </q-item-section>
                    </q-item>
                    <!-- 结束 -->
                  </template>
                </q-uploader>

                <div style="padding-bottom: 20px;">
                  <q-btn
                    class="mt20"
                    style="width:93%; display:block; margin:0 auto;"
                    color="btn"
                    label="提交"
                    size="sm"
                    @click="saveInfos"
                    :disable="!canUpdate"
                  />
                  <q-btn
                    style="width:93%; display:block; margin:0 auto;"
                    class="mt20"
                    color="btn1"
                    text-color="brand"
                    label="保存"
                    size="sm"
                    @click="saveCheck"
                    unelevated
                  />
                </div>
              </div>
            </div>

            <template>
              <div style="background-color:#fff;">
                <div class="history">历史记录</div>
                <div class="q-px-lg q-pb-md" style="margin-top:35px;">
                  <q-timeline color="brand">
                    <q-timeline-entry
                      v-for="(item,index) in list"
                      :key="index"
                      style="margin-top:-15px;"
                    >
                      <div class="titleStyle">
                        <span>{{item.role === 1? 'Basis': '延峰彼欧'}}</span>
                        <span>{{item.name}}</span>
                        <span>{{item.createTime}}</span>
                      </div>
                      <div
                        style="margin-top:10px; padding-left:10px; padding-right:10px;"
                      >{{item.remark}}</div>
                      <div
                        class="q-col-gutter-md row"
                        style="margin-top:0; padding-left:10px; padding-right:10px;"
                      >
                        <div
                          class="col-6"
                          style="width:100%; height:100%;"
                          v-for="(img,index) in item.imageUrl"
                          :key="index"
                        >
                          <q-img :src="img" class="imgStyle" contain>
                            <template v-slot:loading>
                              <div class="text-#c0c4cc divStyle">
                                <q-spinner-ios color="#c0c4cc" :size="16" />
                                <div class="q-mt-md fontStyle">Loading...</div>
                              </div>
                            </template>
                          </q-img>
                          <div
                            style="margin-top:10px; border:1px solid #ddd; padding:8px;"
                            v-if="item.imageDescribe"
                          >
                            <div style="color:#333;">图片说明：</div>
                            <pre
                              style="white-space:pre-wrap; overflow:auto; height:80px; margin-top:-3px;"
                            >{{item.imageDescribe?item.imageDescribe.split("|")[index]:''}}</pre>
                          </div>
                        </div>
                      </div>
                    </q-timeline-entry>
                  </q-timeline>
                </div>
              </div>
            </template>
            <!-- </div> -->
          </q-list>

          <!-- place QPageScroller at end of page -->
          <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[10, 10]">
            <q-btn size="12px" icon="keyboard_arrow_up" class="text-back_top bg-white top_nav" />
          </q-page-scroller>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
/* eslint-disable */
import {
  getCheckDetailList,
  addCheckDetail,
  saveCheckDetail,
  getCheckDetail,
  deleteEnclosure,
  getEnclosureList
} from "../axios/api.js";
import { type } from "os";
import { log } from "util";
import { colors } from "quasar";
export default {
  name: "detailListEdit_detail",

  created() {
    this.info = this.$store.getters.detail_list;
    this.getList();
    this.getDetail();
    this.getEnclosure();
  },

  mounted() {
    // colors.setBrand("primary", "#F33", document.getElementById("dom元素")); 不获取dom元素全局变色及单个组件变色必须获取dom元素 必须在dom元素生成之后变色
    this.ifUploaded = true;
    setTimeout(function() {
      // 设置定时器避免渲染时被 info.checkContent 重新定义为 false
      let inputs = document.getElementsByClassName("param");
      // console.log(inputs)
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
      }
    }, 200);
    let rse = window.location;
    this.downloadUrl = rse.origin;
  },

  methods: {
    //图片备注处理方法
    upImgRemarks() {
      let obj = JSON.parse(JSON.stringify(this.text));
      // console.log(obj)
      // let obj1=Object.keys(obj)
      // let arr1 = [];
      // for (let i in obj) {
      //   arr1.push(obj[i]);
      //   console.log(obj[i])
      // }
      // this.text = {};
      // for (let i = 0; i < this.imgList.length; i++) {
      //   for (let j = 0; j < arr1.length; j++) {
      //     if (i == j) {
      //       this.text[i] = arr1[j];
      //     }
      //   }
      // }
      let res = this.$refs.uploaded.files;
      res.forEach(item => {
        if (Object.keys(obj).indexOf(item.name) === -1) {
          this.text[JSON.parse(item.xhr.response).msg[0].url] = " ";
        } else {
          this.text[JSON.parse(item.xhr.response).msg[0].url] = obj[item.name];
        }
      });
      let arr = [];
      // console.log(this.text)
      for (let [key, value] of Object.entries(this.text)) {
        if (this.imgList.indexOf(key) !== -1) {
          arr.push(value);
        }
      }
      this.upImgData = arr.join("|");
    },
    // 保存详情
    async saveCheck() {
      this.upImgRemarks();
      this.canUpdate = false;
      setTimeout(() => {
        this.canUpdate = true;
      }, 1000);
      if (
        !this.messageShow ||
        this.remark !== "" ||
        this.imgList.length !== 0
      ) {
        let canUpdate = true;
        if (this.ifUploaded) {
          canUpdate = true;
        } else {
          canUpdate = false;
          this.$q.notify({
            color: "red-5",
            message: "请耐心等待图片上传完成，再点击保存！"
          });
        }
        if (canUpdate) {
          let image = this.imgList.join("|");
          let res = await saveCheckDetail({
            id: this.id,
            imageUrl: image,
            mouldNo: this.$store.getters.mould_list.mouldNo,
            remark: this.remark,
            smallClass: this.$store.getters.detail_list.serialNo,
            imageDescribe: this.upImgData
          });
          if (res.status == 1) {
            if (this.messageShow) {
              this.$q.notify({ color: "green-5", message: "保存成功" });
              this.$refs.uploaded.removeUploadedFiles();
              this.imgList = [];
              this.fileList = [];
              this.getDetail();
            } else {
              this.fileList = [];
              this.imgList = [];
              this.remark = "";
              this.messageShow = true;
            }
          }
          // console.log(this.fileList);
          // console.log(this.imgList);
        } else {
          if (!this.ifUploaded) {
            this.$q.notify({
              color: "red-5",
              message: "请耐心等待图片上传完成，再点击保存！"
            });
          } else {
            this.$q.notify({
              color: "red-5",
              message: "请填写相关内容，再点击保存！"
            });
          }
        }
      }
    },
    async getDetail() {
      this.uploaded = [];
      //获取详情草稿
      let data = await getCheckDetail({
        mouldNo: this.$store.getters.mould_list.mouldNo,
        smallClass: this.$store.getters.detail_list.serialNo
      });
      if (data.status === 1 && data.msg !== null) {
        this.id = data.msg.id;
        this.remark = data.msg.remark;
        if (data.msg.imageUrl !== "") {
          // url为获取到的imageurl切割之后的数组
          this.url = data.msg.imageUrl.split("|");
          let arr = [];
          if (data.msg.imageDescribe) {
            arr = data.msg.imageDescribe.split("|");
          }
          let obj = {};
          this.url = this.url.map((item, index) => ({
            name: index,
            url: item
          }));
          for (let i = 0; i < this.url.length; i++) {
            // 赋值给展示数据源
            this.fileList.push({ url: this.url[i].url });
            // 赋值给上传携带图片路径数据
            this.imgList.push(this.url[i].url);
            obj[this.url[i].url] = arr[i];
            this.uploaded.push(this.url[i].url);
          }
          this.text = Object.assign({}, obj);
        }
      }
      if (!this.messageShow) {
        // 获取详情是如果messageShow的bool值为false  则证明他是被提交过得  这个时候清空所有路径及备注  然后调用保存方法  避免已提交的照片再次出现
        this.fileList = [];
        this.imgList = [];
        this.remark = "";
        this.saveCheck();
      }
    },
    //删除暂存数据
    deleteShowImg(item) {
      this.imgList = [];
      this.uploaded = [];
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].url === item.url) {
          this.fileList.splice(i, 1);
          this.fileList.forEach(item => {
            this.imgList.push(item.url);
            this.uploaded.push(item.url);
          });
        }
      }
      if (this.fileList.length == 0) {
        this.messageShow = false;
      }
    },
    //获取附件
    async getEnclosure() {
      let res = await getEnclosureList({
        mouldNo: this.$store.getters.mould_list.mouldNo,
        classId: this.$store.getters.detail_list.serialNo,
        type: 1
      });
      if (res.status == 1) {
        this.fileData = [];
        res.msg.forEach(item => {
          let download =
            this.downloadUrl +
            item.url +
            `?filename=${item.fileName.replace(/[&,#\\]/g, "")}`;
          this.fileData.push({
            url: download,
            filename: item.fileName,
            id: item.id
          });
        });
      }
    },
    //删除附件
    async deletefile(id) {
      let res = await deleteEnclosure({
        id: id
      });
      if (res.status == 1) {
        this.$q.notify({ color: "green-5", message: "删除成功" });
        this.fileData = [];
        this.getEnclosure();
      }
    },
    // get dataList of table
    async getList() {
      // console.log(this.activeName)
      let params = {
        mouldNo: this.$store.getters.mould_list.mouldNo,
        smallClass: this.$store.getters.detail_list.serialNo
      };

      let res = await getCheckDetailList(params);

      if (res.status === 1) {
        this.list = JSON.parse(JSON.stringify(res.msg));
        if (this.list) {
          //图片
          this.list.forEach(item => {
            let imgeUrl = item.imageUrl;
            if (imgeUrl !== undefined && imgeUrl !== null) {
              if (imgeUrl.length > 1) {
                /** 需要先判断imgeUrl ！== null，才能获取length */
                item.imageUrl = imgeUrl.split("|");
              } else {
                item.imageUrl = imgeUrl.split("");
              }
            }
          });
        }
      }
    },
    successCallback() {
      this.$q.notify({ color: "green-5", message: "上传成功" });
      this.$refs.uploadAdd.removeUploadedFiles();
      this.getEnclosure();
    },
    uploadEnclosure(file, xhr) {
      // console.log(file);
    },
    // start & finish upload working
    startUpload() {
      this.ifUploaded = false;
    },
    finishUpload() {
      this.ifUploaded = true;
    },

    // upload images
    uploadImg(info) {
      let res = JSON.parse(info.xhr.response);
      console.log(info);
      this.text[res.msg[0].url] = this.text[info.files[0].name];
      // console.log(this.text)
      let img = res.msg[0].url;
      this.imgUrl += img + "|";
      this.uploaded.push(img);
      this.imgList.push(img);
    },

    // delete updated list of images
    deleteImg(file, type, val = 0) {
      if (val) {
        this.imgList = [];
        let res = JSON.parse(file.xhr.response);
        this.$refs[type].removeFile(file);
        console.log(this[type]);
        console.log(res.msg[0].url);
        this[type].forEach((item, index) => {
          if (item === res.msg[0].url) {
            this[type].splice(index, 1);
            this[type].forEach(item => {
              this.imgList.push(item);
            });
          }
        });
      }
    },

    // save infos
    async saveInfos() {
      this.upImgRemarks();
      this.canUpdate = false;
      setTimeout(() => {
        this.canUpdate = true;
      }, 1000);
      if (this.uploaded.length || this.remark) {
        let canUpdate = true;
        if (this.ifUploaded) {
          canUpdate = true;
        } else {
          canUpdate = false;
          this.$q.notify({
            color: "red-5",
            message: "请耐心等待图片上传完成，再点击提交！"
          });
        }
        if (canUpdate) {
          let params = {
            imageUrl: this.uploaded.join("|"),
            mouldNo: this.$store.getters.mould_list.mouldNo,
            smallClass: this.$store.getters.detail_list.serialNo,
            remark: this.remark,
            imageDescribe: this.upImgData
          };
          let res = await addCheckDetail(params);
          if (res.status === 1) {
            // 点击提交之后messageShow 的bool值为false
            this.messageShow = false;
            this.$q.notify({ color: "green-5", message: "添加描述成功！" });
            this.imgUrl = "";
            this.uploaded = [];
            this.$refs.uploaded.removeUploadedFiles();
            this.fileList = [];
            this.imgList = [];
            this.text = {};
            this.url = [];
            this.upImgData = "";
            this.getList();
            this.getDetail();
          }
        }
      } else {
        if (!this.ifUploaded) {
          this.$q.notify({
            color: "red-5",
            message: "请耐心等待图片上传完成，再点击提交！"
          });
        } else {
          this.$q.notify({
            color: "red-5",
            message: "请填写相关内容，再点击提交！"
          });
        }
      }
    },

    showDefault(val) {
      this.$emit("showDefault", val);
    }
  },

  data() {
    return {
      info: "",
      list: "",

      remark: "",

      headers: [
        { name: "Authorization", value: sessionStorage.getItem("token") }
      ],

      imgUrl: "",

      // new one detail
      nD: 0,

      uploaded: [],
      canUpdate: true,
      ifUploaded: true,
      //上传附件携带参
      imgList: [],
      //暂存区数据
      fileList: [],
      dataObj: [
        {
          name: "mouldNo",
          value: this.$store.getters.mould_list.mouldNo
        },
        {
          name: "classId",
          value: this.$store.getters.detail_list.serialNo
        },
        {
          name: "type",
          value: 1
        }
      ],
      //下载列表数据源
      fileData: [],
      url: [],
      id: "",
      //图片备注数据
      text: {},
      //照片数据处理
      upImgData: "",
      // 当前页面下载前缀地址
      downloadUrl: "",
      //依据不同的的情景改变bool值来进行判断
      messageShow: true
    };
  }
};
</script>

<style lang="scss" scoped>
.q-card__section {
  padding: 0;
}
.q-item > .q-item__section--thumbnail:first-child,
.q-item > .q-focus-helper + .q-item__section--thumbnail {
  margin-left: 0;
}
.inputStyle {
  width: 93%;
  margin: 0 auto;
}
.topPublic {
  width: 100%;
  height: 53px;
  font-size: 15px;
  font-family: "Source Han Sans CN";
  font-weight: 400;
  color: rgba(35, 35, 35, 1);
  line-height: 53px;
  padding-left: 12px;
}
.textarStylea {
  background-color: #fff;
}
.checkStyle {
  display: block;
  height: 53px;
  width: 100%;
  line-height: 53px;
  padding-left: 10px;
  font-size: 14px;
  font-family: "Source Han Sans CN";
  font-weight: 400;
  color: rgba(35, 35, 35, 1);
  padding-right: 10px;
}
.pStyle {
  padding-left: 10px;
  margin-top: 10px;
  font-size: 12px;
  font-family: "Source Han Sans CN";
  font-weight: 300;
  color: rgba(102, 102, 102, 1);
  margin-bottom: 10px;
  padding-right: 10px;
}
.bg-btn {
  background: #79b8fd;
}
.bg-btn1 {
  background-color: #fff;
  border: 1px solid rgba(121, 184, 253, 1);
}
.q-pa-xs {
  padding: 0;
}
.history {
  width: 80px;
  height: 19px;
  font-size: 20px;
  font-family: "Microsoft YaHei";
  font-weight: bold;
  color: rgba(102, 102, 102, 1);
  line-height: 14px;
  margin-left: 15px;
  margin-top: 15px;
  padding-top: 10px;
}
.titleStyle {
  width: 100%;
  height: 32px;
  background-color: rgba(234, 243, 255, 1);
  border-radius: 2px;
  line-height: 32px;
  padding-left: 10px;
  padding-right: 10px;
  span:first-child {
    font-size: 14px;
    font-family: "Microsoft YaHei";
    font-weight: 400;
    color: rgba(68, 68, 68, 1);
  }
  span:nth-child(2) {
    margin-left: 17%;
    font-size: 14px;
    font-family: "Microsoft YaHei";
    font-weight: 400;
    color: rgba(68, 68, 68, 1);
  }
  span:last-child {
    float: right;
  }
}
.imageStyle {
  height: 56px;
  max-width: 100px;
  background-color: #f5f7fa;
  background-size: 100%;
  .divVstyle {
    text-align: center;
    padding-top: 5px;
    .fzStyle {
      text-align: center;
      margin: 5px;
      font-size: 12px;
    }
  }
}

.imgStyle {
  height: 140px;
  max-width: 160px;
  background-color: #f5f7fa;
  .divStyle {
    text-align: center;
    padding-top: 5px;
    .fontStyle {
      text-align: center;
      margin: 5px;
      font-size: 12px;
    }
  }
}
.btn1 {
  width: 45px;
  height: 25px;
  background-color: #237ae5;
  outline: none;
  border: none;
  border-radius: 6px;
  margin-left: 20px;
}
.downloadStyle {
  width: 62px;
  height: 31px;
  line-height: 32px;
  margin-left: 20px;
  .imga {
    display: inline-block;
    width: 13px;
    height: 13px;
    background: url("../assets/downloadfile.png");
    background-size: 100%;
  }
  .imgb {
    display: inline-block;
    width: 13px;
    height: 13px;
    margin-left: 20px;
  }
}
</style>
