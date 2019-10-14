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
                      <q-item v-for="file in scope.files" :key="file.name">
                        <q-item-section v-if="file.__img" thumbnail>
                          <img :src="file.__img.src" />
                        </q-item-section>

                        <q-item-section>
                          <q-input placeholder="请输入备注" v-model="text[file.__img.src]" outlined />
                        </q-item-section>

                        <q-item-section side>
                          <q-btn size="12px" flat dense @click="deleteImg(file,'uploaded', 1)">
                            <q-icon name="fas fa-trash" />
                          </q-btn>
                        </q-item-section>
                      </q-item>
                    </q-list>
                    <!-- <q-list separator>
                      <q-item v-for="(item,index) in imgList" :key="index">
                        <q-item-section v-if="item" thumbnail>
                          <img :src="item" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label class="full-width ellipsis">
                            <q-input placeholder="请输入备注" v-model="text[item]" outlined />
                          </q-item-label>
                        </q-item-section>

                        <q-item-section side>
                          <q-btn size="12px" flat dense @click="deleteShowImg(index)">
                            <q-icon name="fas fa-trash" />
                          </q-btn>
                        </q-item-section>
                      </q-item>
                    </q-list> -->
                    <!-- 上传展示区 -->
                    <!-- <q-list separator>
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
                            <q-input outlined />
                          </q-item-label>
                        </q-item-section>

                        <q-item-section side>
                          <q-btn size="12px" flat dense @click="deleteShowImg(item)">
                            <q-icon name="fas fa-trash" />
                          </q-btn>
                        </q-item-section>
                      </q-item>
                    </q-list>-->
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
                          <div style="margin-top:10px; border:1px solid #ddd;">
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
    console.log(this.text);
    // colors.setBrand("primary", "#F33", document.getElementById("dom元素")); 不获取dom元素全局变色及单个组件元素变色必须获取dom元素 必须在dom元素生成之后变色
    this.ifUploaded = true;
    setTimeout(function() {
      // 设置定时器避免渲染时被 info.checkContent 重新定义为 false
      let inputs = document.getElementsByClassName("param");
      // console.log(inputs)
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
      }
    }, 200);
  },

  methods: {
    // 添加文件到上传区
    addUploadedFile() {
      let files = [];
      this.url.forEach((item,index) => {
        files[index] = new File([''], `${item}`);
        files[index].__img = {
          src: item
        }
      })
      this.files = files;
      console.log(this.files);
      this.$refs.uploaded.files = this.files;
    },
    //图片备注处理方法
    upImgRemarks() {
      let res = this.$refs.uploaded.files.map(item => item.__img.src);
      let obj = JSON.parse(JSON.stringify(this.text));
      // 清空 textOne，避免在删除某一项后 textOne没有清除
      this.textOne = [];
      // 保存前需要判断是否还存在图片，如果没有需要清空 textOne,否则会造成 imageDescribe 不为空
      if (res.length) {
        res.forEach((item, index) => {
          if (Object.keys(obj).indexOf(item) === -1) {
            this.textOne[item] = "";
          } else {
            this.textOne[item] = obj[item];
          }
        });
      }
      
      console.log(Object.keys(this.textOne).map(item => this.textOne[item]));
      let arr = [];
      for (let [key, value] of Object.entries(this.textOne)) {
        arr.push(value);
      }
      this.upImgData = arr.join("|");
    },
    // 保存详情
    async saveCheck(val = 1) {
      let canUpdate = false;
      if (val) {
        this.upImgRemarks();
      }
      if (
        !this.messageShow ||
        this.remark !== "" ||
        this.imgList.length !== 0 ||
        this.$refs.uploaded.files.length !== 0
      ) {
        if (
          !this.messageShow ||
          this.remark !== "" ||
          this.imgList.length !== 0
        ) {
          canUpdate = true;
        }
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
              // // 暂存后清空当前的 uploaded 上传组件的文件选择，避免删除某一张图片后无法再次选择此照片
              // this.$refs.uploaded.reset();
            } else {
              // imgList 表示展示照片，需要在暂存时清空
              this.imgList = [];
              this.remark = "";
              this.uploaded = [];
              this.messageShow = true;
            }
          }
        }
      } else {
        this.$q.notify({ color: "red-5", message: "请输入之后保存" });
      }
    },
    async getDetail() {
      //获取详情草稿
      let data = await getCheckDetail({
        mouldNo: this.$store.getters.mould_list.mouldNo,
        smallClass: this.$store.getters.detail_list.serialNo
      });
      if (data.status === 1 && data.msg !== null) {
        
        this.id = data.msg.id;
        this.remark = data.msg.remark;
        if (data.msg.imageUrl !== "") {
          this.url = data.msg.imageUrl.split("|");
          
          let arr = [];
          if (data.msg.imageDescribe) {
            arr = data.msg.imageDescribe.split("|");
          }
          let obj = {};
          for (let i = 0; i < this.url.length; i++) {
            this.imgList.push(this.url[i]);
            obj[this.url[i]] = arr[i];
            this.uploaded.push(this.url[i]);
          }
          console.log(this.imgList)
          this.addUploadedFile();
          this.text = Object.assign({}, obj);
        }
      }
      if (!this.messageShow) {
        this.imgList = [];
        this.remark = "";
        this.uploaded = [];
        this.saveCheck();
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
            item.url + `?filename=${item.fileName.replace(/[&,#\\]/g, "")}`;
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
      let img = res.msg[0].url;
      this.imgUrl += img + "|";
      this.uploaded.push(img);
      this.imgList.push(img);
    },

    // delete updated list of images
    // deleteShowImg(index) {
    //   for (let i = 0; i < this.imgList.length; i++) {
    //     if (i == index) {
    //       this.imgList.splice(i, 1);
    //       // this.$refs.uploaded.removeFile(file);
    //     }
    //   }
    // },

    deleteImg(file, type, val=0) {
      if (val) {
        this.$refs[type].removeFile(file);
        this.imgList.forEach((item, index) => {
          if (item === file.__img.src) {
            this.imgList.splice(index, 1);
            delete this.text[file.__img.src];
          } else if (file.xhr) {
            if (item === JSON.parse(file.xhr.response).msg[0].url) {
              this.imgList.splice(index, 1);
              // 可以不要
              delete this.text[file.__img.src];
            }
          }
        });
        console.log(this.imgList)
      }
    },

    // save infos
    async saveInfos() {
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
          this.upImgRemarks();
          let params = {
            imageUrl: this.uploaded.join("|"),
            mouldNo: this.$store.getters.mould_list.mouldNo,
            smallClass: this.$store.getters.detail_list.serialNo,
            remark: this.remark,
            imageDescribe: this.upImgData
          };
          let res = await addCheckDetail(params);
          if (res.status === 1) {
            this.messageShow = false;
            this.$q.notify({ color: "green-5", message: "添加描述成功！" });
            this.imgUrl = "";
            this.uploaded = [];
            this.fileList = [];
            this.url = [];
            // 提交后清空当前上传区的所有信息
            this.$refs.uploaded.reset();
            //上传清空图片数据源
            this.imgList = [];
            this.uploaded = [];
            //上传后清空备注数据
            this.upImgData = "";
            this.getList();
            // this.getDetail();
            this.remark = "";
            this.saveCheck(0);
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
      //暂存区数据
      imgList: [],
      //上传附件携带参
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
      messageShow: true,
      //图片备注数据
      text: {},
      //照片数据处理
      upImgData: "",
      // 获取暂存的图片的信息
      files: [],
      // 保存已经上传过并保存或提交的图片的备注
      textOne: {},
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
  height: 130px;
  max-width: 130px;
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
