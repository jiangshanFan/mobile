<template>
  <div class="designEdit h100">
    <div class="h100 w100" v-if="show">
      <q-header reveal elevated>
        <q-toolbar class="bg-primary text-white">
          <q-btn round dense>
            <q-icon name="fas fa-angle-left" @click.native="showDefault('edit')" />
          </q-btn>
          <q-toolbar-title class="f16">
            {{largeClass}}
          </q-toolbar-title>
          <q-btn class="bg-white text-black" dense label="保存" @click="saveInfo" :disable="!canSave" />
        </q-toolbar>
      </q-header>
      <q-scroll-area class="h100 w100">
        <q-page class="q-pa-sm">
          <q-list dense class="smallList">
            <q-item v-for="(item,index) in detailListInfo" :key="index">
              <q-item-section>
                <q-item-label>{{item.name}}</q-item-label>
                <q-item-label caption @click="lookDetails(item)">
                  <span v-html="item.verification"></span>
                  <q-btn class="underline" flat color="primary" label="详情" dense size="xs" />
                </q-item-label>

                <div><q-separator spaced inset /></div>

                <q-item>
                  <q-item-section>
                    <q-item-label caption lines="2">
                      <template v-slot>
                        <q-select outlined dense options-dense v-model="item.status" :options="options" emit-value map-options :disable="$store.getters.userLoginVO.role !== 1">
                          <template v-slot:before>
                            <span class="f12">STATUS</span>
                          </template>
                        </q-select>
                      </template>
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption lines="2">
                      <template v-slot>
                        <q-input v-model="item.remarks" outlined type="textarea">
                          <template v-slot:before>
                            <span class="f12">REMARKS</span>
                          </template>
                        </q-input>
                      </template>
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <div><q-separator spaced color="grey-8" /></div>
              </q-item-section>

            </q-item>
          </q-list>
        </q-page>
      </q-scroll-area>
    </div>

    <AddOrEdit v-else @showDefault="showDefault"></AddOrEdit>
  </div>
</template>

<script>
/* eslint-disable */
  /** 导入api.js */
  import { getDesignInfoByMouldNo, updateDesignInfo } from '../axios/api.js'
  import designEdit_detail from './designEdit_detail'

  export default {
    name: "designEdit",
    components: {
      'AddOrEdit': designEdit_detail,
    },
    props: {
      type: {
        type: Number,
        default: function() {
          return '';
        }
      },
      largeClass: {
        type: String,
        default: function() {
          return '';
        }
      },
    },
    created() {

    },
    mounted() {
      this.getList();
    },

    methods: {
      // get dataList of table
      async getList() {
        // console.log(this.activeName)
        let params = {
          mouldNo: this.$store.getters.mould_list.mouldNo,
          type: this.type,
        };

        let res = await getDesignInfoByMouldNo(params);

        if(res.status === 1) {
          this.initInfo = JSON.parse(JSON.stringify(res.msg));
          this.allInfo = JSON.parse(JSON.stringify(res.msg));
          this.detailListInfo = this.allInfo.reviewList;
          // this.remark = this.allInfo.remark;

          // setTimeout(this.saveInfo,500);  // maybe the web's delay will cause the error
        }
      },

      // SAVE THE INFO OF DESIGN LIST INFO
      async saveInfo(val) {
        this.canSave = false;
        setTimeout(() => {this.canSave = true;}, 1000);
        if (JSON.stringify(this.allInfo) !== JSON.stringify(this.initInfo)) {
          let res = await updateDesignInfo(this.allInfo);

          if (res.status === 1) {
            this.$q.notify({color: 'green-5', message: '保存成功！'});
            this.getList();
            this.initInfo = JSON.parse(JSON.stringify(this.allInfo));
          }
        } else {
          this.$q.notify({color: 'red-5', message: '请更新内容，再点击提交！'});
        }

      },

      showDefault(val) {
        if (this.show) {
          this.$emit('showDefault',val);
        } else {
          this.show = true;
          this.getList();
        }
      },

      // look detailList detail
      lookDetails(item) {
        this.show = false;
        this.$store.dispatch('design_list', item);
      },
    },
    data() {
      return {
        // table
        allInfo: {},
        detailListInfo: [],

        currentPage: 1,
        size: 10,

        //  confirm buttons
        options: [
          {value: 'G', label: 'G'},
          {value: 'Y', label: 'Y'},
          {value: 'R', label: 'R'},
        ],

        show: true,
        canSave: true,
        initInfo: {},
      }
    },
  }
</script>

<style lang="scss">
  .el-tabs__item {
    height: 32px !important;
    line-height: 32px !important;
    font-size: 12px !important;
  }
  .param {
    /*outline*/
    width: 80px;
    outline: none;
    border: none;
    border-bottom: 1px solid #ddd;
    background: none;
    text-align: center;
  }
</style>
