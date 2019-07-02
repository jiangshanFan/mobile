<template>
  <div class="detailList h100">
    <div class="h100 w100" v-if="show">
      <q-header elevated>
        <q-toolbar class="bg-primary text-white">
          <q-btn round dense>
            <q-icon name="fas fa-angle-left" @click.native="showDefault('edit')" />
          </q-btn>
          <q-toolbar-title>
            {{detailList.projectName}}
          </q-toolbar-title>
          <span>{{detailList.mouldNo}}</span>
        </q-toolbar>
      </q-header>
      <q-scroll-area class="h100 w100">
        <q-page class="q-pa-sm">
          <q-list dense class="rounded-borders">
            <div class="col" v-for="(items,index) in detailListInfo" :key="index">
              <q-expansion-item
                expand-separator
                :label="items.largeClass"
              >
                <q-card>
                  <q-card-section>
                    <q-list dense class="smallList" @click="edits(items,index)">
                      <!-- TOOL INFORMATION -->
                      <div class="row justify-start" v-if="items.largeClass === 'TOOL INFORMATION'">
                        <div class="col-8 offset-2">
                          <img src="../assets/tool_information.png" alt="tool information" />
                        </div>

                        <div class="col-6">
                          <p>A <b class="border_solid_bottom_c pl5 pr5">{{items.alength}}</b> mm</p>
                          <p>B1 <b class="border_solid_bottom_c pl5 pr5">{{items.b1Length}}</b> mm</p>
                          <p>B2 <b class="border_solid_bottom_c pl5 pr5">{{items.b2Length}}</b> mm</p>
                          <p>模具总重量 <b class="border_solid_bottom_c pl5 pr5">{{items.totalWeight}}</b> kg</p>
                          <p>定模侧重量 <b class="border_solid_bottom_c pl5 pr5">{{items.fixedWeight}}</b> kg</p>
                          <p>动模侧重量 <b class="border_solid_bottom_c pl5 pr5">{{items.dynamicWeight}}</b> kg</p>
                        </div>

                        <div class="col-6">
                          <p>a <b class="border_solid_bottom_c pl5 pr5">{{items.a1Length}}</b> mm</p>
                          <p>b <b class="border_solid_bottom_c pl5 pr5">{{items.blength}}</b> mm</p>
                          <p>c <b class="border_solid_bottom_c pl5 pr5">{{items.clength}}</b> mm</p>
                          <p>一级顶行程 <b class="border_solid_bottom_c pl5 pr5">{{items.firstTopTrip}}</b> kg</p>
                          <p>二级顶行程 <b class="border_solid_bottom_c pl5 pr5">{{items.secondTopTrip}}</b> kg</p>
                          <p>三级顶行程 <b class="border_solid_bottom_c pl5 pr5">{{items.thirdTopTrip}}</b> kg</p>
                        </div>
                      </div>
                      <!-- DETAIL LIST -->
                      <div v-else>
                        <div class="col mb20" v-for="(item,index) in items.list" :key="index">
                          <div v-if="(item.confirmor !== 'YFPO 工厂确认'&& items.largeClass === 'T1认可前检查') || item.largeClass !=='T1认可前检查'">
                            <q-item-label header class="text-black">{{item.confirmor}}</q-item-label>
                            <q-item clickable v-ripple>
                              <q-item-section>
                                <div class="row">
                                  <div class="col-8">
                                    <q-item-label caption lines="1">
                                      <q-toolbar>
                                        <span>未确认</span>
                                        <span class="text-black ml20">{{item.unconfirm}}</span>
                                      </q-toolbar>
                                      <q-toolbar>
                                        <span>OK with reserves</span>
                                        <span class="text-black ml20">{{item.okWithReserves}}</span>
                                      </q-toolbar>
                                    </q-item-label>
                                  </div>

                                  <div class="col-4">
                                    <q-item-label caption lines="1">
                                      <q-toolbar>
                                        <span>OK</span>
                                        <span class="text-black ml20">{{item.ok}}</span>
                                      </q-toolbar>
                                      <q-toolbar>
                                        <span>Not OK</span>
                                        <span class="text-black ml20">{{item.notOk}}</span>
                                      </q-toolbar>
                                    </q-item-label>
                                  </div>
                                </div>
                              </q-item-section>
                            </q-item>
                            <q-separator />
                          </div>

                        </div>
                      </div>
                    </q-list>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-separator />
            </div>
          </q-list>
        </q-page>
      </q-scroll-area>
    </div>
    <!--  edit -->
    <AddOrEdit v-else @showDefault="showDefault" :largeClass="largeClass" :tabs="tabs"></AddOrEdit>
  </div>
</template>

<script>
/* eslint-disable */
import { getToolInformationByMouldNo, getApproveStatistics } from '../axios/api'
import detailListEdit from './detailListEdit'

export default {
  name: "detailList",
  components: {
    'AddOrEdit': detailListEdit,
  },

  created() {
    this.detailList = this.$store.getters.mould_list;
    console.log(this.detailList);
    this.getTool();
    this.getDetailListInfo();
  },

  methods: {
    // get toolInformation
    async getTool() {
      let res = await getToolInformationByMouldNo({mouldNo:this.$store.getters.mould_list.mouldNo});
      if (res.status === 1) {
        this.toolInfo = JSON.parse(JSON.stringify(res.msg));
        this.toolInfo.largeClass = 'TOOL INFORMATION';
      }
    },

    // get detailListInfo
    async getDetailListInfo() {
      let res = await getApproveStatistics({mouldNo:this.$store.getters.mould_list.mouldNo});
      if (res.status === 1) {
        // change the structure of the Array
        let arr = [];
        let init = JSON.parse(JSON.stringify(res.msg));
        let c;
        let single;
        for (let index = 0; index >= 0; index++) {
          if (init.length) {
            arr[index] = {largeClass: '', list: [],};
            c= init[0].largeClass;
            // console.log(c);
            for (let i = 0; i < init.length; i++) {
              if (init[i].largeClass === c) {
                single = JSON.parse(JSON.stringify(init[i]));
                arr[index].list.push(single);
                arr[index].largeClass = c;
                init.splice(i,1);
                i = i - 1;
                // console.log(init.length)
              }
            }
          } else {
            this.detailListInfo = [this.toolInfo,...arr];
            break;
          }
        }
      }
    },

    // edit detailList_edit
    edits(item, index) {
      if (item.largeClass !== 'TOOL INFORMATION') {
        this.show = false;
        this.tabs = this.allDetail[index];
        this.largeClass = item.largeClass;
        console.log(this.tabs);
      }
    },

    showDefault(val) {
      if (this.show) {
        this.$emit('showDefault',val);
      } else {
        this.show = true;
      }
    },
  },
  data() {
    return {
      detailList: {},

      toolInfo: {},  // toolInformation
      detailListInfo: [],

      show: true,
      // 所有认可清单项
      allDetail: [
        [],
        [
          { name: 'A', label: 'A 吊装存放安全确认'},
          { name: 'B', label: 'B 顶块研配状态确认'},
          { name: 'C', label: 'C 分型面合模状态确认'},
        ],
        [
          { name: 'D', label: 'D 模具试模状态确认'},
          { name: 'E', label: 'E 产品质量状态确认'},
          { name: 'F', label: 'F 注塑工艺状态确认'},
          { name: 'G', label: 'G 产品取件确认'},
        ],
        [
          { name: 'H', label: 'H 模具试模状态确认'},
          { name: 'I', label: 'I 产品质量状态确认'},
          { name: 'J', label: 'J注塑工艺状态确认'},
          { name: 'K', label: 'K 产品取件确认'},
        ],
        [
          { name: 'L', label: 'L 空运转情况'},
          { name: 'M', label: 'M 模具匹配磨损情况'},
          { name: 'N', label: 'N顶出抽芯系统'},
          { name: 'O', label: 'O 热流道系统'},
          { name: 'P', label: 'P 冷却系统'},
          { name: 'Q', label: 'Q 信号系统'},
          { name: 'R', label: 'R 注塑设备匹配'},
          { name: 'S', label: 'S 模具总体考虑'},
        ],
        [
          { name: 'T', label: 'T产品质量状态确认'},
          { name: 'U', label: 'U 模具状态确认'},
          { name: 'V', label: 'V注塑工艺状态确认'},
          { name: 'W', label: 'W产品取件确认'},
        ],
        [
          { name: 'X', label: 'X 外围油漆、喷字、铭牌'},
          { name: 'Y', label: 'Y 模板与设备的匹配'},
          { name: 'Z', label: 'Z 发运检查测试报告'},
        ],
      ],
      tabs: [],
      largeClass: '',
    }
  },
}
</script>

<style lang="scss" scoped>
  .smallList {
    padding: 0;
    cursor: pointer;
    *{
      padding: 0;
    }
    .q-item {
      padding: 5px 0 !important;
      .q-toolbar {
        padding: 0;
        max-height: 30px !important;
        min-height: unset !important;
        line-height: 30px;
      }
    }
  }
</style>
