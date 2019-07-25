<template>
  <div class="designEdit_detail h100">
    <q-layout view="lHh Lpr lFf" container class="h100 shadow-2 rounded-borders">
      <q-header reveal elevated>
        <q-toolbar class="bg-primary text-white">
          <q-btn round dense>
            <q-icon name="fas fa-angle-left" @click.native="showDefault('edit')" />
          </q-btn>
          <q-toolbar-title class="f16">
            {{allInfo.name}}
          </q-toolbar-title>
          <q-btn class="bg-white text-black" dense label="保存" @click="saveInfo" />
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page class="q-pa-xs">
            <q-list dense class="rounded-borders">
              <!--  检查内容 -->
              <div class="col mb40">
                <span>检查内容：</span>
                <p v-html="allInfo.verification"></p>
                <q-separator />
                <!-- 描述组 -->
                <div class="col mt20 mb20">
                  <span>评审标准:</span>
                  <q-input class="mb20" type="textarea" v-model="allInfo.assessDescribe" placeholder="请输入评审标准的备注" filled />
                  <q-list separator>

                    <q-item v-for="file in assessImage" :key="file.name">
                      <q-item-section>
                        <q-item-label class="full-width ellipsis">{{ file.name }}</q-item-label>

                        <q-item-label caption>{{ file.__progressLabel }}</q-item-label>
                      </q-item-section>

                      <q-item-section style="width: 100px;height:50px;" v-if="file.__img" thumbnail>
                        <q-img
                          :src="file.__img.src"
                          spinner-color="primary"
                          spinner-size="50px"
                        />
                      </q-item-section>

                      <q-item-section side>
                        <q-btn size="12px" flat dense @click="deleteImg(file,'assessImage')">
                          <q-icon name="fas fa-trash" />
                        </q-btn>
                      </q-item-section>
                    </q-item>

                  </q-list>
                  <q-uploader
                    ref="assessImageUploaded"
                    url="/api/upload/file/uploadManyFile"
                    label="评审标准图片上传"
                    auto-upload
                    multiple
                    :max-file-size="5242880"
                    color="white"
                    text-color="black"
                    :headers="headers"
                    :form-fields="[{name: 'path', value: 'details'}]"
                    field-name="file"
                    style="max-width: 100%;width: 100%;"
                    @uploaded="uploadAssessImage"
                    @start="startUpload(1)"
                    @finish="finishUpload(1)"
                  >
                    <template v-slot:list="scope">
                      <q-list separator>

                        <q-item v-for="file in scope.files" :key="file.name">
                          <q-item-section>
                            <q-item-label class="full-width ellipsis">{{ file.name }}</q-item-label>

                            <q-item-label caption>{{ file.__sizeLabel }} / {{ file.__progressLabel }}</q-item-label>
                          </q-item-section>

                          <q-item-section v-if="file.__img" thumbnail><img :src="file.__img.src" /></q-item-section>

                          <q-item-section side>
                            <q-btn size="12px" flat dense @click="deleteImg(file,'assessImageUploaded', 1)">
                              <q-icon name="fas fa-trash" />
                            </q-btn>
                          </q-item-section>
                        </q-item>

                      </q-list>
                    </template>
                  </q-uploader>
                  <!--<q-btn class="mt20" label="提交" size="sm" @click="saveInfos" />-->
                </div>

                <div class="col mt20 mb20">
                  <span>模具现状:</span>
                  <q-input class="mb20" type="textarea" v-model="allInfo.presentSituationDescribe" placeholder="请输入模具现状的备注" filled />
                  <q-list separator>

                    <q-item v-for="file in presentSituationImage" :key="file.name">
                      <q-item-section>
                        <q-item-label class="full-width ellipsis">{{ file.name }}</q-item-label>

                        <q-item-label caption>{{ file.__progressLabel }}</q-item-label>
                      </q-item-section>

                      <q-item-section style="width: 100px;height:50px;" v-if="file.__img" thumbnail>
                        <q-img
                          :src="file.__img.src"
                          spinner-color="primary"
                          spinner-size="50px"
                        />
                      </q-item-section>

                      <q-item-section side>
                        <q-btn size="12px" flat dense @click="deleteImg(file,'presentSituationImage')">
                          <q-icon name="fas fa-trash" />
                        </q-btn>
                      </q-item-section>
                    </q-item>

                  </q-list>
                  <q-uploader
                    ref="presentSituationImageUploaded"
                    url="/api/upload/file/uploadManyFile"
                    label="模具现状图片上传"
                    auto-upload
                    multiple
                    :max-file-size="5242880"
                    color="white"
                    text-color="black"
                    :headers="headers"
                    :form-fields="[{name: 'path', value: 'details'}]"
                    field-name="file"
                    style="max-width: 100%;width: 100%;"
                    @uploaded="uploadPresentSituationImage"
                    @start="startUpload(2)"
                    @finish="finishUpload(2)"
                  >
                    <template v-slot:list="scope">
                      <q-list separator>

                        <q-item v-for="file in scope.files" :key="file.name">
                          <q-item-section>
                            <q-item-label class="full-width ellipsis">{{ file.name }}</q-item-label>

                            <q-item-label caption>{{ file.__sizeLabel }} / {{ file.__progressLabel }}</q-item-label>
                          </q-item-section>

                          <q-item-section v-if="file.__img" thumbnail><img :src="file.__img.src" /></q-item-section>

                          <q-item-section side>
                            <q-btn size="12px" flat dense @click="deleteImg(file,'presentSituationImageUploaded', 1)">
                              <q-icon name="fas fa-trash" />
                            </q-btn>
                          </q-item-section>
                        </q-item>

                      </q-list>
                    </template>
                  </q-uploader>
                  <!--<q-btn class="mt20" label="提交" size="sm" @click="saveInfos" />-->
                </div>

                <div class="col mt20 mb20">
                  <span>改善后:</span>
                  <q-input class="mb20" type="textarea" v-model="allInfo.improveDescribe" placeholder="请输入改善后的备注" filled />
                  <q-list separator>

                    <q-item v-for="file in improveImage" :key="file.name">
                      <q-item-section>
                        <q-item-label class="full-width ellipsis">{{ file.name }}</q-item-label>

                        <q-item-label caption>{{ file.__progressLabel }}</q-item-label>
                      </q-item-section>

                      <q-item-section style="width: 100px;height:50px;" v-if="file.__img" thumbnail>
                        <q-img
                          :src="file.__img.src"
                          spinner-color="primary"
                          spinner-size="50px"
                        />
                      </q-item-section>

                      <q-item-section side>
                        <q-btn size="12px" flat dense @click="deleteImg(file,'improveImage')">
                          <q-icon name="fas fa-trash" />
                        </q-btn>
                      </q-item-section>
                    </q-item>

                  </q-list>
                  <q-uploader
                    ref="improveImageUploaded"
                    url="/api/upload/file/uploadManyFile"
                    label="改善后图片上传"
                    auto-upload
                    multiple
                    :max-file-size="5242880"
                    color="white"
                    text-color="black"
                    :headers="headers"
                    :form-fields="[{name: 'path', value: 'details'}]"
                    field-name="file"
                    style="max-width: 100%;width: 100%;"
                    @uploaded="uploadImproveImage"
                    @start="startUpload(3)"
                    @finish="finishUpload(3)"
                  >
                    <!--<template v-slot:header="scope">
                      <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                        <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                        <div class="col">
                          <div class="q-uploader__title">上传</div>
                          &lt;!&ndash;<div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>&ndash;&gt;
                        </div>

                        <q-btn v-if="scope.canAddFiles" icon="add_box" round dense flat>
                          <q-uploader-add-trigger />
                        </q-btn>

                      </div>
                    </template>-->
                    <template v-slot:list="scope">
                      <q-list separator>

                        <q-item v-for="file in scope.files" :key="file.name">
                          <q-item-section>
                            <q-item-label class="full-width ellipsis">{{ file.name }}</q-item-label>

                            <q-item-label caption>{{ file.__sizeLabel }} / {{ file.__progressLabel }}</q-item-label>
                          </q-item-section>

                          <q-item-section v-if="file.__img" thumbnail><img :src="file.__img.src" /></q-item-section>

                          <q-item-section side>
                            <q-btn size="12px" flat dense @click="deleteImg(file,'improveImageUploaded', 1)">
                              <q-icon name="fas fa-trash" />
                            </q-btn>
                          </q-item-section>
                        </q-item>

                      </q-list>
                    </template>
                  </q-uploader>
                  <!--<q-btn class="mt20" label="提交" size="sm" @click="saveInfos" />-->
                </div>

              </div>
            </q-list>

            <!-- place QPageScroller at end of page -->
            <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[10, 10]">
              <q-btn size="12px" icon="keyboard_arrow_up" color="accent" />
            </q-page-scroller>
          </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
/* eslint-disable */
import { updateDesignInfo, } from '../axios/api.js'
export default {
  name: "designEdit_detail",

  created() {

  },

  mounted() {
    this.assessWork = true;
    this.presentSituationWork = true;
    this.improveWork = true;
    this.allInfo = JSON.parse(JSON.stringify(this.$store.getters.design_list));
    this.StringToImg('assessImage');
    this.StringToImg('presentSituationImage');
    this.StringToImg('improveImage');
  },

  methods: {
    // transfer string to img array
    StringToImg(val) {
      if (this.allInfo[val]) {
        let imgeUrl = this.allInfo[val];
        if(imgeUrl !== undefined && imgeUrl !== null && imgeUrl) {
          if(imgeUrl.length > 1) { /** 需要先判断imgeUrl ！== null，才能获取length */  /*test:.map((item,index) => {return {url: item.url, name: index} })*/
            this.allInfo[val] = imgeUrl.split('|');
            this.getImgList(val);
          }else {
            this.allInfo[val] = imgeUrl.split('');
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
      this[val] = this.allInfo[val].map((item,index) => {
        let url = item.split('/');
        return {
          __img: { src: item },
          name: url[url.length - 1],
          __progressLabel: '100%',
        };
      });
    },
    getSrcList(obj) {
      return obj.map((item,index) => item.__img.src);
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
        this[type].forEach((item,index) => {
          if (item === res.msg[0].url) {
            this[type].splice(index,1);
          }
        });
      } else {
        this[type].forEach((item,index) => {
          if (item.name === file.name) {
            this[type].splice(index,1);
          }
        });
      }
    },

    // save info
    async saveInfo() {
      if (this.improveWork && this.assessWork && this.presentSituationWork) {
        let allInfo = {};
        allInfo = { ...this.allInfo };
        allInfo.assessImage = this.getSrcList(this.assessImage).concat(this.assessImageUploaded).join('|');
        allInfo.presentSituationImage = this.getSrcList(this.presentSituationImage).concat(this.presentSituationImageUploaded).join('|');
        allInfo.improveImage = this.getSrcList(this.improveImage).concat(this.improveImageUploaded).join('|');

        let params = {
          mouldNo: this.$store.getters.mould_list.mouldNo,
          reviewList: [allInfo]
        };
        let res = await updateDesignInfo(params);
        if (res.status === 1) {
          // updated the info of designEdit_detail
          this.allInfo = allInfo;
          this.$q.notify({color: 'green-5', message: '添加描述成功！'});

          // load the updated list of img again
          this.StringToImg('assessImage');
          this.StringToImg('presentSituationImage');
          this.StringToImg('improveImage');

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
        this.$q.notify({color: 'red-5', message: '请耐心等待文件上传完成，谢谢！'});
      }
    },

    showDefault(val) {
      this.$emit('showDefault',val);
    }
  },

  data() {
    return {
      allInfo: '',
      list: '',

      remark: '',

      headers: [{name: 'Authorization', value: sessionStorage.getItem('token')}],

      imgUrl: '',

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
    }
  },
}
</script>

<style scoped>

</style>
