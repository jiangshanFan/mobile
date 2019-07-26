<template>
  <div class="detailListEdit_detail h100">
    <q-layout view="lHh Lpr lFf" container class="h100 shadow-2 rounded-borders">
      <q-header elevated>
        <q-toolbar class="bg-primary text-white">
          <q-btn round dense>
            <q-icon name="fas fa-angle-left" @click.native="showDefault('edit')" />
          </q-btn>
          <q-toolbar-title>
            {{info.serialNo}}
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page class="q-pa-xs">
            <q-list dense class="rounded-borders">
              <!--  检查内容 -->
              <div class="col">
                <span>检查内容：</span>
                <p v-html="info.checkContent"></p>
                <q-separator />
                <!-- 新增 -->
                <div class="col mt20 mb20">
                  <span>新增描述:</span>
                  <q-input class="mb20" v-model="remark" filled autogrow />
                  <q-uploader
                    ref="uploaded"
                    url="/api/upload/file/uploadManyFile"
                    label="上传"
                    auto-upload
                    multiple
                    :max-file-size="5242880"
                    color="white"
                    text-color="black"
                    :headers="headers"
                    :form-fields="[{name: 'path', value: 'details'}]"
                    field-name="file"
                    style="max-width: 100%;width: 100%;"
                    @uploaded="uploadImg"
                    @start="startUpload"
                    @finish="finishUpload"
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
                            <q-btn size="12px" flat dense @click="deleteImg(file,'uploaded', 1)">
                              <q-icon name="fas fa-trash" />
                            </q-btn>
                          </q-item-section>
                        </q-item>

                      </q-list>
                    </template>
                  </q-uploader>

                  <q-btn class="mt20" color="primary" label="提交" size="sm" @click="saveInfos" :disable="!canUpdate"/>
                </div>
              </div>

              <q-separator />

              <div v-for="(item,index) in list" :key="index">
                <q-expansion-item
                  :header-style="{ padding: '5px' }"
                  expand-separator
                  expand-icon="keyboard_arrow_down"
                >
                  <template v-slot:header>
                    <q-item-section>
                      {{item.role === 1? 'Basis': '延峰彼欧'}}
                    </q-item-section>

                    <q-item-section>
                      {{item.name}}
                    </q-item-section>

                    <q-item-section side>
                      {{item.createTime}}
                    </q-item-section>
                  </template>

                  <q-card>
                    <q-card-section>
                      {{item.remark}}
                    </q-card-section>

                    <q-card-section>
                      <div class="q-col-gutter-md row">
                        <div class="col-6" v-for="(img,index) in item.imageUrl" :key="index">
                          <q-img
                            :src="img"
                            spinner-color="primary"
                            spinner-size="50px"
                          />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
                <q-separator />
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
import { getCheckDetailList, addCheckDetail, } from '../axios/api.js'
export default {
  name: "detailListEdit_detail",

  created() {
    this.info = this.$store.getters.detail_list;
    this.getList();
  },

  mounted() {
    this.ifUploaded = true;
    setTimeout(function () {  // 设置定时器避免渲染时被 info.checkContent 重新定义为 false
      let inputs = document.getElementsByClassName('param');
      // console.log(inputs)
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
      }
    },200)
  },

  methods: {
    // get dataList of table
    async getList() {
      // console.log(this.activeName)
      let params = {
        mouldNo: this.$store.getters.mould_list.mouldNo,
        smallClass: this.$store.getters.detail_list.serialNo,
      };

      let res = await getCheckDetailList(params);

      if(res.status === 1) {
        this.list = JSON.parse(JSON.stringify(res.msg));
        if (this.list) {
          //图片
          this.list.forEach(item => {
            let imgeUrl = item.imageUrl;
            if(imgeUrl !== undefined && imgeUrl !== null) {
              if(imgeUrl.length > 1) { /** 需要先判断imgeUrl ！== null，才能获取length */
                item.imageUrl = imgeUrl.split('|');
              }else {
                item.imageUrl = imgeUrl.split('');
              }
            }
          });
        }
      }
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
      this.imgUrl += img + '|';
      this.uploaded.push(img);
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
      }
    },

    // save infos
    async saveInfos() {
      this.canUpdate = false;
      setTimeout(() => {this.canUpdate = true;}, 1000);
      if (this.uploaded.length || this.remark) {
        if (this.uploaded.length && this.ifUploaded) {
          let params = {
            imageUrl: this.uploaded.join('|'),
            mouldNo: this.$store.getters.mould_list.mouldNo,
            smallClass: this.$store.getters.detail_list.serialNo,
            remark: this.remark,
          };
          let res = await addCheckDetail(params);
          if (res.status === 1) {
            this.$q.notify({color: 'green-5', message: '添加描述成功！'});
            this.getList();
            this.remark = '';
            this.imgUrl = '';
            this.uploaded = [];
            this.$refs.uploaded.removeUploadedFiles();
          }
        } else {
          this.$q.notify({color: 'red-5', message: '请耐心等待图片上传完成，再点击提交！'});
        }
      } else {
        this.$q.notify({color: 'red-5', message: '请填写相关内容，再点击提交！'});
      }
    },

    showDefault(val) {
      this.$emit('showDefault',val);
    }
  },

  data() {
    return {
      info: '',
      list: '',

      remark: '',

      headers: [{name: 'Authorization', value: sessionStorage.getItem('token')}],

      imgUrl: '',

      // new one detail
      nD: 0,

      uploaded: [],
      canUpdate: true,
      ifUploaded: true,
    }
  },
}
</script>

<style scoped>

</style>
