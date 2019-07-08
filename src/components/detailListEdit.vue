<template>
  <div class="detailListEdit h100">
    <q-layout v-if="show" view="lHh Lpr lFf" container class="h100 shadow-2 rounded-borders">
      <q-header reveal elevated>
        <q-toolbar class="bg-primary text-white">
          <q-btn round dense>
            <q-icon name="fas fa-angle-left" @click.native="showDefault('edit')" />
          </q-btn>
          <q-toolbar-title>
            {{largeClass}}
          </q-toolbar-title>
          <q-btn class="bg-white text-black" dense label="保存" @click="saveInfo($store.getters.userLoginVO.role)" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding style="padding-top: 36px">
          <q-list>
            <div v-for="(item,index) in allInfo.checkList" :key="index">
              <q-item>
                <q-item-section>
                  <q-item-label lines="1">{{item.serialNo}} <q-btn class="underline" flat color="primary" label="详情" dense size="xs" @click="lookDetails(item)" /></q-item-label>
                  <q-item-label caption v-html="item.checkContent"></q-item-label>
                  <div><q-separator spaced inset /></div>

                  <q-item>
                    <q-item-section>
                      <q-item-label caption lines="2">
                        <template v-slot>
                          <q-select outlined dense options-dense v-model="item.makeConfirm" :options="options" emit-value map-options :disable="$store.getters.userLoginVO.role !== 1">
                            <template v-slot:before>
                              <span class="f12">制造商确认</span>
                            </template>
                          </q-select>
                        </template>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="largeClass !== 'T1认可前检查'">
                    <q-item-section>
                      <q-item-label caption lines="2">
                        <template v-slot>
                          <q-select
                            outlined
                            dense
                            options-dense
                            v-model="item.tcConfirm"
                            :options="options"
                            emit-value
                            map-options
                            :disable="$store.getters.userLoginVO.role !== 2">
                            <template v-slot:before>
                              <span class="f12">YFPO  TC 确认</span>
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
                          <q-select outlined dense options-dense v-model="item.factoryConfirm" :options="options" emit-value map-options :disable="$store.getters.userLoginVO.role !== 2">
                            <template v-slot:before>
                              <span class="f12">YFPO  工厂确认</span>
                            </template>
                          </q-select>
                        </template>
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                </q-item-section>
              </q-item>
              <q-separator spaced inset />
            </div>
          </q-list>

            <!-- place QPageSticky at end of page -->
          <q-page-sticky expand position="top">
            <div class="w100">
              <q-tabs v-model="activeName" inline-label dense class="bg-grey-3"
                      active-color="primary"
                      indicator-color="primary"
                      align="justify"
                      narrow-indicator
                      @click="getList">
                <q-tab v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name" />
              </q-tabs>
            </div>
          </q-page-sticky>
        </q-page>
      </q-page-container>
    </q-layout>

    <detail v-else @showDefault="showDefault"></detail>
  </div>
</template>

<script>
/* eslint-disable */
  /** 导入api.js */
  import { getApproveInfoByMouldNo, updateApproveInfoByInnerUser, updateApproveInfoByCustomer} from '../axios/api.js'
  import detail from './detailListEdit_detail'

  export default {
    name: "detailListEdit",
    components: {
      'detail': detail,
    },
    props: {
      tabs: {
        type: Array,
        default: function() {
          return [];
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
      this.activeName = this.tabs[0].name;
      this.getList();
    },

    updated() {
      this.saveInfo()
    },
    methods: {
      // get dataList of table
      async getList() {
        // console.log(this.activeName)
        let params = {
          mouldNo: this.$store.getters.mould_list.mouldNo,
          smallClass: this.activeName,
        };

        let res = await getApproveInfoByMouldNo(params);

        if(res.status === 1) {
          this.allInfo = JSON.parse(JSON.stringify(res.msg));
          // this.table.content = this.allInfo.checkList;
          // this.remark = this.allInfo.remark;

          // setTimeout(this.saveInfo,500);  // maybe the web's delay will cause the error
        }
      },

      // toggle different tab
      handleClick(tab, event) {
        this.getList();
      },

      // GET INPUT INFO
      async saveInfo(val) {
        let arr = {};
        let inputs = document.getElementsByClassName('param');

        // console.log(inputs);

        for (let i = 0; i < inputs.length; i++) {  // inputs divide 3, because of the attribute of "fixed"(is-hidden), create three different part & same content
          inputs[i].disabled = this.$store.getters.userLoginVO.role !== 1;
          if (!inputs[i].disabled) {
            inputs[i].maxLength = 10;
          }
          let n = inputs[i].name - 1;
          if (!arr[n]) {
            arr[n] = [];
          }
          arr[n].push(inputs[i].value);
        }
        if (val) {
          let c = [...this.allInfo.checkList];
          c.forEach((item, index) => {
            if (arr[index]) {
              if (arr[index][0]) {
                item.firstParam = arr[index][0];
              }
              if (arr[index][1]) {
                item.secondParam = arr[index][1];
              }
            }

          });
          let res;
          if (val === 1) {
            res = await updateApproveInfoByInnerUser(this.allInfo);
          } else {
            res = await updateApproveInfoByCustomer(this.allInfo);
          }
          if (res.status === 1) {
            this.$q.notify({
              color: 'green-5',
              message: '保存成功！'
            });
            this.getList();
          }
        }
      },

      showDefault(val) {
        if (this.show) {
          this.$emit('showDefault',val);
        } else {
          this.show = true;
        }
      },

      // look detailList detail
      lookDetails(item) {
        this.show = false;
        this.$store.dispatch('detail_list', item);
      },
    },
    data() {
      return {
        // table
        allInfo: {},

        currentPage: 1,
        size: 10,

        activeName: '',

        remark: '',

        //  confirm buttons
        options: [
          {value: 0, label: 'Not OK'},
          {value: 1, label: 'OK'},
          {value: 2, label: 'OK with reserves'},
        ],

        show: true,
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
