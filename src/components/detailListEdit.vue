<template>
  <div class="detailListEdit h100 bgcolor">
    <q-layout v-if="show" view="lHh Lpr lFf" container class="h100 shadow-2 rounded-borders">
      <q-header reveal elevated>
        <q-toolbar class="bg-top_Nav-color text-top">
          <!-- <q-icon size="32px" name="fas fa-angle-left" @click.native="showDefault('edit')" /> -->
          <q-icon class="f17" @click.native="showDefault('edit')"></q-icon>
          <q-toolbar-title>{{largeClass}}</q-toolbar-title>
          <q-btn
            class="bg-white text-black"
            dense
            label="保存"
            @click="saveInfo($store.getters.userLoginVO.role)"
          />
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page padding style="padding-top: 36px">
          <!-- echarts图表 -->
          <div
            v-if="show"
            id="main"
            style="width:100%; height:200px; margin-top:10px; background-color:#fff;"
          >
            <template>
              <q-inner-loading :showing="visible">
                <q-spinner-ios size="20px" color="black" />
                <div style="font-size:12px;">加载中···</div>
              </q-inner-loading>
            </template>
          </div>
          <q-list>
            <div
              v-for="(item,index) in allInfo.checkList"
              :key="index"
              style="margin-top:10px; background-color:#fff;"
            >
              <q-item>
                <q-item-section>
                  <q-item-label lines="1">
                    <span class="font">{{item.serialNo}}</span>
                    <q-btn
                      flat
                      color="primary"
                      label="详情"
                      dense
                      size="xs"
                      @click="lookDetails(item)"
                    />
                  </q-item-label>
                  <q-item-label caption v-html="item.checkContent" @click="lookDetails(item)"></q-item-label>
                  <div></div>

                  <q-item>
                    <q-item-section>
                      <q-item-label caption lines="2">
                        <template v-slot>
                          <q-select
                            outlined
                            dense
                            options-dense
                            v-model="item.makeConfirm"
                            :options="options"
                            emit-value
                            map-options
                            :disable="$store.getters.userLoginVO.role !== 1"
                            dropdown-icon="fa fa-angle-down"
                          >
                            <template v-slot:before>
                              <div class="f13">
                                <span class="f12">制造商确认</span>
                              </div>
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
                            :disable="$store.getters.userLoginVO.role !== 2"
                            dropdown-icon="fa fa-angle-down"
                          >
                            <template v-slot:before>
                              <div class="f13">
                                <span class="f12">YFPO TC 确认</span>
                              </div>
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
                          <q-select
                            outlined
                            dense
                            options-dense
                            v-model="item.factoryConfirm"
                            :options="options"
                            emit-value
                            map-options
                            :disable="$store.getters.userLoginVO.role !== 2"
                            dropdown-icon="fa fa-angle-down"
                          >
                            <template v-slot:before>
                              <div class="f13">
                                <span class="f12">YFPO 工厂确认</span>
                              </div>
                            </template>
                          </q-select>
                        </template>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-item-section>
              </q-item>
            </div>
          </q-list>

          <!-- place QPageSticky at end of page -->
          <q-page-sticky expand position="top">
            <div class="w100">
              <q-tabs
                v-model="activeName"
                inline-label
                dense
                class="bg-white"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
                @click="getList"
              >
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
import {
  getApproveInfoByMouldNo,
  updateApproveInfoByInnerUser,
  updateApproveInfoByCustomer
} from "../axios/api.js";
import detail from "./detailListEdit_detail";
/** 导入echarts*/

import Echarts from "echarts";
export default {
  name: "detailListEdit",
  components: {
    detail: detail
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
        return "";
      }
    }
  },
  created() {},
  mounted() {
    this.activeName = this.tabs[0].name;
    this.getList();
    this.visible=true;
  },

  updated() {
    this.saveInfo();
  },
  methods: {
    //echarts
    async echart(ec, sc, lc) {
      //引入echarts
      let myEcharts = Echarts.init(document.getElementById("main"));
      let option = {
        color: ["#A9D769", "#5CC4DE", "#EFAD5C", "#E23220"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["未确认", "OK", "", "OK with reserves", "Not Ok"],
          bottom: 0,
          orient: "vertical"
        },
        grid: {
          top: "6%",
          left: "3%",
          right: "4%",
          bottom: "40%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          splitLine: { show: false },
          axisTick: {
            show: false
          },
          axisLine: {
            symbol: ["none", "arrow"],
            symbolSize: [5, 5],
            lineStyle: {
              color: "#B4B4B4"
            }
          }
        },
        yAxis: {
          type: "category",
          data:
            this.tabs[0].name !== "A"
              ? ["YFPO 工厂确认", "YFPO TC确认", "制造商确认"]
              : ["YFPO TC确认", "制造商确认"],
          max: this.tabs[0].name !== "A" ? 2 : 1,
          axisLabel: {
            interval: 0,
            textStyle: {
              fontSize: 10,
              color: "#333333"
            }
          },
          axisLine: {
            symbol: ["none", "arrow"],
            symbolSize: [5, 5],
            lineStyle: {
              color: "#B4B4B4"
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: "未确认",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position:
                  this.tabs[0].name !== "A"
                    ? ["35%", "-100%"]
                    : ["40%", "-50%"],
                formatter: function(params) {
                  if (params.value > 0) {
                    return params.value;
                  } else {
                    return "";
                  }
                },
                fontSize: 13,
                color: "#000"
              }
            },
            data:
              this.tabs[0].name !== "A"
                ? [lc.noSure, sc.noSure, ec.noSure]
                : [sc.noSure, ec.noSure]
          },
          {
            name: "OK",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position:
                  this.tabs[0].name !== "A"
                    ? ["35%", "-100%"]
                    : ["40%", "-50%"],
                formatter: function(params) {
                  if (params.value > 0) {
                    return params.value;
                  } else {
                    return "";
                  }
                },
                fontSize: 13,
                color: "#000"
              }
            },
            data:
              this.tabs[0].name !== "A"
                ? [lc.okData, sc.okData, ec.okData]
                : [sc.okData, ec.okData]
          },
          {
            name: "OK with reserves",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position:
                  this.tabs[0].name !== "A"
                    ? ["35%", "-100%"]
                    : ["40%", "-50%"],
                formatter: function(params) {
                  if (params.value > 0) {
                    return params.value;
                  } else {
                    return "";
                  }
                },
                fontSize: 13,
                color: "#000"
              }
            },
            data:
              this.tabs[0].name !== "A"
                ? [lc.okWithServer, sc.okWithServer, ec.okWithServer]
                : [sc.okWithServer, ec.okWithServer]
          },
          {
            name: "Not Ok",
            type: "bar",
            barCategoryGap: this.tabs[0].name !== "A" ? "60%" : "50%",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position:
                  this.tabs[0].name !== "A"
                    ? ["35%", "-100%"]
                    : ["40%", "-50%"],
                formatter: function(params) {
                  if (params.value > 0) {
                    return params.value;
                  } else {
                    return "";
                  }
                },
                fontSize: 13,
                color: "#000"
              }
            },
            data:
              this.tabs[0].name !== "A"
                ? [lc.notOkData, sc.notOkData, ec.notOkData]
                : [sc.notOkData, ec.notOkData]
          }
        ]
      };

      myEcharts.setOption(option);
      window.onresize = myEcharts.resize;
    },
    // get dataList of table
    async getList() {
      this.echartsData = {
        notOkData: 0,
        okData: 0,
        okWithServer: 0,
        noSure: 0
      };
      this.secondData = {
        notOkData: 0,
        okData: 0,
        okWithServer: 0,
        noSure: 0
      };
      this.lastData = {
        notOkData: 0,
        okData: 0,
        okWithServer: 0,
        noSure: 0
      };
      // console.log(this.activeName)
      let params = {
        mouldNo: this.$store.getters.mould_list.mouldNo,
        smallClass: this.activeName
      };

      let res = await getApproveInfoByMouldNo(params);

      if (res.status === 1) {
        this.allInfo = JSON.parse(JSON.stringify(res.msg));
        this.allInfo.checkList.forEach(item => {
          if (item.makeConfirm == 0) {
            this.echartsData.notOkData++;
          } else if (item.makeConfirm == 1) {
            this.echartsData.okData++;
          } else if (item.makeConfirm == 2) {
            this.echartsData.okWithServer++;
          } else if (item.makeConfirm == null) {
            this.echartsData.noSure++;
          }
          // YFPO TC确认
          if (item.tcConfirm == 0) {
            this.secondData.notOkData++;
          } else if (item.tcConfirm == 1) {
            this.secondData.okData++;
          } else if (item.tcConfirm == 2) {
            this.secondData.okWithServer++;
          } else if (item.tcConfirm == null) {
            this.secondData.noSure++;
          }
          //工厂确认

          if (item.factoryConfirm == 0) {
            this.lastData.notOkData++;
          } else if (item.factoryConfirm == 1) {
            this.lastData.okData++;
          } else if (item.factoryConfirm == 2) {
            this.lastData.okWithServer++;
          } else if (item.factoryConfirm == null) {
            this.lastData.noSure++;
          }
        });
        //调用echarts
        this.echart(this.echartsData, this.secondData, this.lastData);
        //关闭loading图
        this.visible=false
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
      let inputs = document.getElementsByClassName("param");

      // console.log(inputs);

      for (let i = 0; i < inputs.length; i++) {
        // inputs divide 3, because of the attribute of "fixed"(is-hidden), create three different part & same content
        inputs[i].disabled = this.$store.getters.userLoginVO.role !== 1;
        inputs[i].addEventListener("click", function(e) {
          e.preventDefault();
          e.stopPropagation();
        });
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
            color: "green-5",
            message: "保存成功！"
          });
          this.getList();
        }
      }
    },

    showDefault(val) {
      if (this.show) {
        this.$emit("showDefault", val);
      } else {
        this.show = true;
        this.getList();
      }
    },

    // look detailList detail
    lookDetails(item) {
      this.show = false;
      this.$store.dispatch("detail_list", item);
    }
  },
  data() {
    return {
      // table
      allInfo: {},

      currentPage: 1,
      size: 10,

      activeName: "",
      //echartsloading图
      visible: true,
      remark: "",

      //  confirm buttons
      options: [
        { value: 0, label: "Not OK" },
        { value: 1, label: "OK" },
        { value: 2, label: "OK with reserves" }
      ],

      show: true,
      // echarts参数
      echartsData: {
        notOkData: 0,
        okData: 0,
        okWithServer: 0,
        noSure: 0
      },
      // yfpo tc
      secondData: {
        notOkData: 0,
        okData: 0,
        okWithServer: 0,
        noSure: 0
      },
      // 工厂确认
      lastData: {
        notOkData: 0,
        okData: 0,
        okWithServer: 0,
        noSure: 0
      }
    };
  }
};
</script>

<style lang="scss">
.q-inner-loading {
  background: #fff;
}
.q-icon {
  font-size: 16px;
}
.font {
  font-size: 20px;
  font-family: "Source Han Sans CN";
  font-weight: 400;
  color: rgba(35, 35, 35, 1);
}
.bgcolor {
  background-color: #f5f5f5;
}
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
