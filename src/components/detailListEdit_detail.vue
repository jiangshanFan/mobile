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
                    ref="upload"
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
                  />
                  <q-btn class="mt20" label="提交" size="sm" @click="saveInfos" />
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
                        <div class="col-6" v-for="(img,index) in item.imageUrl" :key="index"><img :src="img"></div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
                <q-separator />
              </div>
            </q-list>

            <!-- place QPageScroller at end of page -->
            <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
              <q-btn fab icon="keyboard_arrow_up" color="accent" />
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
              if(imgeUrl.length > 1 && imgeUrl.charAt(imgeUrl.length - 1) === '|') { /** 需要先判断imgeUrl ！== null，才能获取length */
                item.imageUrl = imgeUrl.substr(0,imgeUrl.length - 1).split('|');
              }else {
                item.imageUrl = imgeUrl.split('|');
              }
            }
          });
        }
      }
    },

    // upload images
    uploadImg(info) {
      let res = JSON.parse(info.xhr.response);
      let img = res.msg[0].url;
      this.imgUrl += img + '|';
    },

    // save infos
    async saveInfos() {
      let params = {
        imageUrl: this.imgUrl,
        mouldNo: this.$store.getters.mould_list.mouldNo,
        smallClass: this.$store.getters.detail_list.serialNo,
        remark: this.remark,
      };
      let res = await addCheckDetail(params);
      if (res.status === 1) {
        this.$q.notify({color: 'green-5', message: '添加描述成功！'});
        this.getList();
        this.remark = '';
        this.$refs.upload.removeUploadedFiles();
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
    }
  },
}
</script>

<style scoped>

</style>
