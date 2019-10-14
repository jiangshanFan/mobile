<template>
  <div class="designEdit_detail h100">
    <q-layout view="lHh Lpr lFf" container class="h100 shadow-2 rounded-borders">
      <q-header reveal elevated>
        <q-toolbar class="bg-top_Nav-color text-top">
          <!-- <q-icon size="32px" name="fas fa-angle-left" @click.native="showDefault('edit')" /> -->
          <q-icon class="f17" @click.native="showDefault('edit')"></q-icon>
          <q-toolbar-title class="f16">{{allInfo.name}}</q-toolbar-title>
          <q-btn
            class="bg-white text-black"
            dense
            label="保存"
            @click="saveInfo"
            :disable="!canUpdate"
          />
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page class="q-pa-xs">
          <q-list dense class="rounded-borders">
            <!--  检查内容 -->
            <div class="col mb40">
              <div style="background-color:#fff;">
                <span class="checkStyle">检查内容：</span>
                <q-separator />
                <p v-html="allInfo.verification" class="pStyle"></p>
              </div>
              <!-- 新增留言板区域 -->
              <div class="textarStylea">
                <q-expansion-item
                  expand-icon-class="text-blue-3"
                  expand-separator
                  expand-icon="keyboard_arrow_down"
                  :header-style="{ padding: '12px' }"
                >
                  <template v-slot:header>
                    <q-item-section>
                      <div>
                        <span
                          style="color:#333333; font-family:Microsoft YaHei; font-weight:bold;"
                        >INFORMATION / REMARKS / ACTION</span>
                      </div>
                    </q-item-section>
                  </template>
                  <q-card>
                    <q-card-section>
                      <div class="textStyle">
                        <div v-for="(item,index) in listData" :key="index">
                          <div class="topHead">
                            <span>{{item.companyName}}</span>
                            <span>{{item.name}}</span>
                            <span>{{item.createTime}}</span>
                          </div>
                          <p>{{item.content}}</p>
                        </div>
                      </div>
                      <div>
                        <div style="margin-top:10px;">
                          <span
                            style="color:#333333; font-family:Microsoft YaHei; font-weight:bold; padding-left:10px;"
                          >新增描述</span>
                          <button class="btn1" @click="subData">
                            <span style="color:#fff;">提交</span>
                          </button>
                        </div>
                        <q-input
                          class="mb20"
                          type="textarea"
                          v-model="remarkOne"
                          placeholder="请输入评论"
                          style="margin-top:10px;"
                          bg-color="grey-1"
                          outlined
                        />
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </div>
              <!-- 新增添加附件区域 -->
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
              <!-- 描述组 -->
              <div class="col mb20 textarStyle">
                <span class="topPublic">评审标准:</span>
                <q-input
                  class="mb20 inputStyle"
                  type="textarea"
                  v-model="allInfo.assessDescribe"
                  placeholder="请输入评审标准的备注"
                  bg-color="white"
                  outlined
                />
                <q-uploader
                  ref="assessImageUploaded"
                  url="/api/upload/file/uploadManyFile"
                  label="评审标准图片上传"
                  auto-upload
                  multiple
                  :max-file-size="5242880"
                  style="max-width: 100%;width: 100%; background-color:#fff;"
                  :headers="headers"
                  :form-fields="[{name: 'path', value: 'details'}]"
                  field-name="file"
                  @uploaded="uploadAssessImage"
                  @start="startUpload(1)"
                  @finish="finishUpload(1)"
                  flat
                >
                  <template v-slot:header="scope">
                    <div
                      style="background-color:#fff; padding-left:10px;"
                      class="row no-wrap items-center q-pa-sm q-gutter-xs"
                    >
                      <q-btn type="a" dense flat>
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
                        <q-item-section>
                          <q-item-label class="full-width ellipsis">{{ file.name }}</q-item-label>

                          <q-item-label caption></q-item-label>
                        </q-item-section>

                        <q-item-section v-if="file.__img" thumbnail>
                          <img :src="file.__img.src" />
                        </q-item-section>

                        <q-item-section side>
                          <q-btn
                            size="12px"
                            flat
                            dense
                            @click="deleteImg(file,'assessImageUploaded', 1)"
                          >
                            <q-icon name="fas fa-trash" />
                          </q-btn>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </template>
                  <q-separator />
                </q-uploader>
                <q-list separator>
                  <q-item v-for="file in assessImage" :key="file.name">
                    <q-item-section>
                      <q-item-label class="full-width ellipsis">{{ file.name }}</q-item-label>

                      <q-item-label caption></q-item-label>
                    </q-item-section>

                    <q-item-section style="width: 100px;height:50px;" v-if="file.__img" thumbnail>
                      <q-img :src="file.__img.src" class="imgStyle">
                        <template v-slot:loading>
                          <div class="text-#c0c4cc divStyle">
                            <q-spinner-ios color="#c0c4cc" :size="16" />
                            <div class="q-mt-md fontStyle">Loading...</div>
                          </div>
                        </template>
                      </q-img>
                    </q-item-section>

                    <q-item-section side>
                      <q-btn size="12px" flat dense @click="deleteImg(file,'assessImage')">
                        <q-icon name="fas fa-trash" />
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </q-list>

                <!--<q-btn class="mt20" label="提交" size="sm" @click="saveInfos" />-->
              </div>
              <div class="col mb20 textarStyle">
                <span class="topPublic">模具现状:</span>
                <q-input
                  class="mb20 inputStyle"
                  type="textarea"
                  v-model="allInfo.presentSituationDescribe"
                  placeholder="请输入模具现状的备注"
                  bg-color="white"
                  outlined
                />
                <q-uploader
                  ref="presentSituationImageUploaded"
                  url="/api/upload/file/uploadManyFile"
                  label="模具现状图片上传"
                  auto-upload
                  multiple
                  :max-file-size="5242880"
                  :headers="headers"
                  :form-fields="[{name: 'path', value: 'details'}]"
                  field-name="file"
                  style="max-width: 100%;width: 100%;background-color:#fff;"
                  @uploaded="uploadPresentSituationImage"
                  @start="startUpload(2)"
                  @finish="finishUpload(2)"
                  flat
                >
                  <template v-slot:header="scope">
                    <div
                      style="background-color:#fff; padding-left:10px;"
                      class="row no-wrap items-center q-pa-sm q-gutter-xs"
                    >
                      <q-btn type="a" dense flat>
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
                        <q-item-section>
                          <q-item-label class="full-width ellipsis">{{ file.name }}</q-item-label>

                          <q-item-label caption></q-item-label>
                        </q-item-section>

                        <q-item-section
                          v-if="file.__img"
                          thumbnail
                          style="width: 100px;height:50px;"
                        >
                          <img :src="file.__img.src" />
                        </q-item-section>

                        <q-item-section side>
                          <q-btn
                            size="12px"
                            flat
                            dense
                            @click="deleteImg(file,'presentSituationImageUploaded', 1)"
                          >
                            <q-icon name="fas fa-trash" />
                          </q-btn>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </template>
                  <q-separator />
                </q-uploader>

                <q-list separator>
                  <q-item v-for="file in presentSituationImage" :key="file.name">
                    <q-item-section>
                      <q-item-label class="full-width ellipsis">{{ file.name }}</q-item-label>

                      <q-item-label caption></q-item-label>
                    </q-item-section>

                    <q-item-section style="width: 100px;height:50px;" v-if="file.__img" thumbnail>
                      <q-img :src="file.__img.src" class="imgStyle">
                        <template v-slot:loading>
                          <div class="text-#c0c4cc divStyle">
                            <q-spinner-ios color="#c0c4cc" :size="16" />
                            <div class="q-mt-md fontStyle">Loading...</div>
                          </div>
                        </template>
                      </q-img>
                    </q-item-section>

                    <q-item-section side>
                      <q-btn
                        size="12px"
                        flat
                        dense
                        @click="deleteImg(file,'presentSituationImage')"
                      >
                        <q-icon name="fas fa-trash" />
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </q-list>

                <!--<q-btn class="mt20" label="提交" size="sm" @click="saveInfos" />-->
              </div>

              <div class="col mb20 textarStyle">
                <span class="topPublic">改善后:</span>
                <q-input
                  class="mb20 inputStyle"
                  type="textarea"
                  v-model="allInfo.improveDescribe"
                  placeholder="请输入改善后的备注"
                  bg-color="white"
                  outlined
                />
                <q-uploader
                  ref="improveImageUploaded"
                  url="/api/upload/file/uploadManyFile"
                  label="改善后图片上传"
                  auto-upload
                  multiple
                  :max-file-size="5242880"
                  :headers="headers"
                  :form-fields="[{name: 'path', value: 'details'}]"
                  field-name="file"
                  style="max-width: 100%;width: 100%;"
                  @uploaded="uploadImproveImage"
                  @start="startUpload(3)"
                  @finish="finishUpload(3)"
                  flat
                >
                  <!--<template v-slot:header="scope">
                      <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                        <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                        <div class="col">
                          <div class="q-uploader__title">上传</div>
                          &lt;!&ndash;<div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>&ndash;&gt;
                        </div>

                        <q-btn icon="add_box" round dense flat>
                          <q-uploader-add-trigger />
                        </q-btn>

                      </div>
                  </template>-->
                  <template v-slot:header="scope">
                    <div
                      style="background-color:#fff; padding-left:10px;"
                      class="row no-wrap items-center q-pa-sm q-gutter-xs"
                    >
                      <q-btn type="a" dense flat>
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
                        <q-item-section>
                          <q-item-label class="full-width ellipsis">{{ file.name }}</q-item-label>

                          <q-item-label caption></q-item-label>
                        </q-item-section>

                        <q-item-section v-if="file.__img" thumbnail>
                          <img :src="file.__img.src" />
                        </q-item-section>

                        <q-item-section side>
                          <q-btn
                            size="12px"
                            flat
                            dense
                            @click="deleteImg(file,'improveImageUploaded', 1)"
                          >
                            <q-icon name="fas fa-trash" />
                          </q-btn>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </template>
                  <q-separator />
                </q-uploader>

                <q-list separator>
                  <q-item v-for="file in improveImage" :key="file.name">
                    <q-item-section>
                      <q-item-label class="full-width ellipsis">{{ file.name }}</q-item-label>

                      <q-item-label caption></q-item-label>
                    </q-item-section>

                    <q-item-section style="width: 100px;height:50px;" v-if="file.__img" thumbnail>
                      <q-img :src="file.__img.src" class="imgStyle">
                        <template v-slot:loading>
                          <div class="text-#c0c4cc divStyle">
                            <q-spinner-ios color="#c0c4cc" :size="16" />
                            <div class="q-mt-md fontStyle">Loading...</div>
                          </div>
                        </template>
                      </q-img>
                    </q-item-section>

                    <q-item-section side>
                      <q-btn size="12px" flat dense @click="deleteImg(file,'improveImage')">
                        <q-icon name="fas fa-trash" />
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </q-list>

                <!--<q-btn class="mt20" label="提交" size="sm" @click="saveInfos" />-->
              </div>
            </div>
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
  updateDesignInfo,
  getRemarkList,
  submitRemarks,
  deleteEnclosure,
  getEnclosureList
} from "../axios/api.js";
import { async } from "q";
export default {
  name: "designEdit_detail",

  created() {},

  mounted() {
    this.assessWork = true;
    this.presentSituationWork = true;
    this.improveWork = true;
    this.allInfo = JSON.parse(JSON.stringify(this.$store.getters.design_list));
    this.StringToImg("assessImage");
    this.StringToImg("presentSituationImage");
    this.StringToImg("improveImage");
    this.getInfo();
    this.dataObj[1].value = this.allInfo.id;
    this.getEnclosure();
    this.remarkOne = "";
  },

  methods: {
    //获取附件
    async getEnclosure() {
      let res = await getEnclosureList({
        mouldNo: this.$store.getters.mould_list.mouldNo,
        classId: this.allInfo.id,
        type: 2
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
    //提交评论
    async subData() {
      if (this.remarkOne == "") {
        this.$q.notify({ color: "green-5", message: "请输入之后提交" });
        return;
      } else if (this.remarkOne !== "") {
        let res = await submitRemarks({
          mouldNo: this.$store.getters.mould_list.mouldNo,
          reviewId: this.allInfo.reviewId,
          content: this.remarkOne
        });
        if (res.status === 1) {
          this.$q.notify({ color: "green-5", message: "提交成功" });
          this.getInfo();
          this.remarkOne = "";
        }
      }
    },

    //获取留言数据
    async getInfo() {
      let params = {
        mouldNo: this.$store.getters.mould_list.mouldNo,
        reviewId: this.allInfo.reviewId
      };
      let res = await getRemarkList(params);
      if (res.status === 1) {
        this.listData = res.msg;
      }
    },
    // transfer string to img array
    StringToImg(val) {
      if (this.allInfo[val]) {
        let imgeUrl = this.allInfo[val];
        if (imgeUrl !== undefined && imgeUrl !== null && imgeUrl) {
          if (imgeUrl.length > 1) {
            /** 需要先判断imgeUrl ！== null，才能获取length */ /*test:.map((item,index) => {return {url: item.url, name: index} })*/
            this.allInfo[val] = imgeUrl.split("|");
            this.getImgList(val);
          } else {
            this.allInfo[val] = imgeUrl.split("");
            this.getImgList(val);
          }
        } else {
          this.allInfo[val] = [];
        }
      } else {
        this.allInfo[val] = [];
      }
    },

    // get img list & generate the src list
    getImgList(val) {
      this[val] = this.allInfo[val].map((item, index) => {
        let url = item.split("/");
        return {
          __img: { src: item },
          name: url[url.length - 1],
          __progressLabel: "100%"
        };
      });
    },
    getSrcList(obj) {
      return obj.map((item, index) => item.__img.src);
    },
    //上传钩子
    successCallback() {
      this.$q.notify({ color: "green-5", message: "上传成功" });
      this.$refs.uploadAdd.removeUploadedFiles();
      this.getEnclosure();
    },
    uploadEnclosure(file, xhr) {
      // console.log(file);
    },

    // upload images
    uploadAssessImage(info) {
      /*console.log(info.files);
      console.log(info.xhr);*/
      let res = JSON.parse(info.xhr.response);
      let img = res.msg[0].url;
      this.assessImageUploaded.push(img);
    },
    uploadPresentSituationImage(info) {
      let res = JSON.parse(info.xhr.response);
      let img = res.msg[0].url;
      this.presentSituationImageUploaded.push(img);
    },
    uploadImproveImage(info) {
      let res = JSON.parse(info.xhr.response);
      let img = res.msg[0].url;
      this.improveImageUploaded.push(img);
    },

    // start & finish upload working
    startUpload(val) {
      if (val === 1) {
        this.assessWork = false;
      } else if (val === 2) {
        this.presentSituationWork = false;
      } else {
        this.improveWork = false;
      }
    },
    finishUpload(val) {
      if (val === 1) {
        this.assessWork = true;
      } else if (val === 2) {
        this.presentSituationWork = true;
      } else {
        this.improveWork = true;
      }
    },

    // delete updated list of images
    deleteImg(file, type, val = 0) {
      if (val) {
        let res = JSON.parse(file.xhr.response);
        this.$refs[type].removeFile(file);
        this[type].forEach((item, index) => {
          if (item === res.msg[0].url) {
            this[type].splice(index, 1);
          }
        });
      } else {
        this[type].forEach((item, index) => {
          if (item.name === file.name) {
            this[type].splice(index, 1);
          }
        });
      }
    },

    // save info
    async saveInfo() {
      let condition = true;
      this.canUpdate = false;
      setTimeout(() => {
        this.canUpdate = true;
      }, 1000);
      if (
        this.allInfo.assessDescribe ||
        this.allInfo.presentSituationDescribe ||
        this.allInfo.improveDescribe ||
        this.allInfo.assessImage.length ||
        this.allInfo.presentSituationImage.length ||
        this.allInfo.improveImage.length ||
        this.assessImageUploaded.length ||
        this.presentSituationImageUploaded.length ||
        this.improveImageUploaded.length
      ) {
        if (
          this.allInfo.assessDescribe ||
          this.allInfo.presentSituationDescribe ||
          this.allInfo.improveDescribe
        ) {
          condition = true;
        }

        if (this.improveWork && this.assessWork && this.presentSituationWork) {
          condition = true;
        } else {
          condition = false;
          this.$q.notify({
            color: "red-5",
            message: "请耐心等待文件上传完成，再点击保存！"
          });
        }

        if (condition) {
          let allInfo = {};
          allInfo = { ...this.allInfo };
          allInfo.assessImage = this.getSrcList(this.assessImage)
            .concat(this.assessImageUploaded)
            .join("|");
          allInfo.presentSituationImage = this.getSrcList(
            this.presentSituationImage
          )
            .concat(this.presentSituationImageUploaded)
            .join("|");
          allInfo.improveImage = this.getSrcList(this.improveImage)
            .concat(this.improveImageUploaded)
            .join("|");

          let params = {
            mouldNo: this.$store.getters.mould_list.mouldNo,
            reviewList: [allInfo]
          };
          if (
            JSON.stringify(allInfo) !==
            JSON.stringify(this.$store.getters.design_list)
          ) {
            let res = await updateDesignInfo(params);
            if (res.status === 1) {
              // updated the info of designEdit_detail
              this.allInfo = allInfo;
              this.$q.notify({ color: "green-5", message: "更新信息成功！" });
              this.$emit("showDefault", "edit");

              // load the updated list of img again
              this.StringToImg("assessImage");
              this.StringToImg("presentSituationImage");
              this.StringToImg("improveImage");

              // real clear the image of upload container
              this.assessImageUploaded = [];
              this.presentSituationImageUploaded = [];
              this.improveImageUploaded = [];

              // virtual clear
              this.$refs.assessImageUploaded.removeUploadedFiles();
              this.$refs.presentSituationImageUploaded.removeUploadedFiles();
              this.$refs.improveImageUploaded.removeUploadedFiles();
            }
          } else {
            this.$q.notify({
              color: "red-5",
              message: "请更新相关内容，再点击提交！"
            });
          }
        }
      } else {
        this.$q.notify({
          color: "red-5",
          message: "请至少填写一项相关内容，再点击提交！！"
        });
      }
    },

    showDefault(val) {
      this.$emit("showDefault", val);
    }
  },

  data() {
    return {
      allInfo: "",
      list: "",

      remark: "",
      //留言板数据
      remarkOne: "",
      headers: [
        { name: "Authorization", value: sessionStorage.getItem("token") }
      ],

      imgUrl: "",

      // new one detail
      nD: 0,

      assessImage: [], // 已经更新成功的照片
      assessImageUploaded: [], //上传成功后的图片
      presentSituationImage: [], // 已经更新成功的照片
      presentSituationImageUploaded: [], //上传成功后的图片
      improveImage: [], // 已经更新成功的照片
      improveImageUploaded: [], //上传成功后的图片

      // upload work status
      assessWork: true,
      presentSituationWork: true,
      improveWork: true,

      canUpdate: true,
      //留言数据列表
      listData: {},
      //上传附件携带参
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
          value: 2
        }
      ],
      //下载列表数据源
      fileData: []
    };
  }
};
</script>

<style lang="scss" scoped>
.bg-btn {
  background: #79b8fd;
}
.q-card__section {
  position: relative;
  padding: 13px;
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
  margin-top: 5px;
  font-size: 12px;
  font-family: "Source Han Sans CN";
  font-weight: 300;
  color: rgba(102, 102, 102, 1);
  margin-bottom: 10px;
  padding-right: 10px;
}
.q-pa-xs {
  padding: 0;
}
.textarStyle {
  margin-top: 10px;
  background-color: #fff;
}
.textarStylea {
  margin-top: 10px;
  background-color: #fff;
}
.imgStyle {
  height: 140px;
  max-width: 150px;
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
.textStyle {
  height: 200px;
  margin: 0 auto;
  border: 1px solid rgba(221, 221, 221, 1);
  overflow: auto;
  padding: 7px;
  word-break: break-all;
  word-wrap: break-word;
  border-radius: 4px;
  .topHead {
    width: 100%;
    height: 32px;
    background: rgba(238, 242, 244, 1);
    border-radius: 2px;
    box-sizing: border-box;
    font-size: 10px;
    font-family: "MicrosoftYaHei";
    line-height: 32px;
    padding-left: 5px;
    padding-right: 5px;
    overflow: hidden;
    color: #333333;
    // display: flex;
    // span{
    //   display: inline-block;
    //   flex:2;
    // }
    span:nth-child(2) {
      margin-left: 17%;
    }
    span:last-child {
      color: #999999;
      float: right;
    }
  }
  p {
    display: block;
    color: #999999;
    margin-top: 5px;
  }
}
.btn1 {
  width: 60px;
  height: 25px;
  background-color: #237ae5;
  outline: none;
  border: none;
  border-radius: 6px;
  margin-left: 20px;
  font-size: 12px;
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
