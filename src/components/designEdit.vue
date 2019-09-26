<template>
  <div class="designEdit h100 bgcolor">
    <div class="h100 w100" v-if="show">
      <q-header reveal elevated>
        <q-toolbar class="bg-top_Nav-color text-top">
          <!-- <q-icon size="32px" name="fas fa-angle-left" @click.native="showDefault('edit')" /> -->
          <q-icon class="f17" @click.native="showDefault('edit')"></q-icon>
          <q-toolbar-title class="f16">{{largeClass}}</q-toolbar-title>
          <q-btn
            class="bg-white text-black"
            dense
            label="保存"
            @click="saveInfo"
            :disable="!canSave"
          />
        </q-toolbar>
      </q-header>
      <q-scroll-area class="h100 w100">
        <q-page class="q-pa-sm">
          <div
            v-if="show"
            id="main"
            style="width:100%; height:150px; margin-top:10px; background-color:#fff;"
          >
            <template>
              <q-inner-loading :showing="visible">
                <q-spinner-ios size="20px" color="black" />
                <div style="font-size:12px;">加载中···</div>
              </q-inner-loading>
            </template>
          </div>
          <q-list dense class="smallList">
            <q-item
              v-for="(item,index) in detailListInfo"
              :key="index"
              style="margin-top:10px; background-color:#fff;"
            >
              <q-item-section>
                <q-item-label>
                  <span class="font">{{item.name}}</span>
                </q-item-label>
                <div>
                  <q-separator />
                </div>
                <q-item-label style="margin-top:15px;" caption @click="lookDetails(item)">
                  <div>
                    <span v-html="item.verification"></span>
                  </div>
                  <q-btn flat color="primary" label="详情" dense size="xs" />
                </q-item-label>
                <q-item style="padding:0; margin-top:15px;">
                  <q-item-section>
                    <template>
                      <span class="f15">STATUS</span>
                    </template>
                    <q-item-label caption lines="2" style="margin-top:10px;">
                      <template v-slot>
                        <q-select
                          outlined
                          dense
                          options-dense
                          v-model="item.status"
                          :options="options"
                          emit-value
                          map-options
                          :disable="$store.getters.userLoginVO.role !== 1"
                          dropdown-icon="fa fa-angle-down"
                        ></q-select>
                      </template>
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item style="padding:0 0 10px 0; margin-top:15px;">
                  <q-item-section>
                    <template>
                      <span class="f15">REMARKS</span>
                    </template>
                    <q-item-label caption lines="2" style="margin-top:10px;">
                      <template v-slot>
                        <q-input v-model="item.remarks" outlined type="textarea"></q-input>
                      </template>
                    </q-item-label>
                  </q-item-section>
                </q-item>
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
import { getDesignInfoByMouldNo, updateDesignInfo } from "../axios/api.js";
import designEdit_detail from "./designEdit_detail";
import Echarts from "echarts";
export default {
  name: "designEdit",
  components: {
    AddOrEdit: designEdit_detail
  },
  props: {
    type: {
      type: Number,
      default: function() {
        return "";
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
    this.getList();
    this.visible = true;
  },

  methods: {
    //echarts
    async echart(gyr) {
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
          data: ["未确认", "G", "", "Y", "R"],
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
          data: ["STATUS"],
          axisTick: {
            show: false
          },
          axisLine: {
            symbol: ["none", "arrow"],
            symbolSize: [5, 5],
            lineStyle: {
              color: "#B4B4B4"
            }
          },
          max: 1,
          axisLabel: {
            interval: 0,
            textStyle: {
              fontSize: 10,
              color: "#333333"
            }
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
                position: "top",
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
            data: [gyr.noSure]
          },
          {
            name: "G",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top",
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
            data: [gyr.g]
          },
          {
            name: "Y",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top",
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
            data: [gyr.y]
          },
          {
            name: "R",
            type: "bar",
            barCategoryGap: "30%",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top",
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
            data: [gyr.r]
          }
        ]
      };
      myEcharts.setOption(option);
      window.onresize = myEcharts.resize;
    },
    // get dataList of table
    async getList() {
      this.statusData = {
        g: 0,
        y: 0,
        r: 0,
        noSure: 0
      };
      // console.log(this.activeName)
      let params = {
        mouldNo: this.$store.getters.mould_list.mouldNo,
        type: this.type
      };

      let res = await getDesignInfoByMouldNo(params);

      if (res.status === 1) {
        this.initInfo = JSON.parse(JSON.stringify(res.msg));
        this.allInfo = JSON.parse(JSON.stringify(res.msg));
        this.detailListInfo = this.allInfo.reviewList;

        this.allInfo.reviewList.forEach(item => {
          if (item.status == "G") {
            this.statusData.g++;
          } else if (item.status == "Y") {
            this.statusData.y++;
          } else if (item.status == "R") {
            this.statusData.r++;
          } else {
            this.statusData.noSure++;
          }
        });

        //调用echarts
        this.echart(this.statusData);
        //关闭loading
        this.visible = false;
        // this.remark = this.allInfo.remark;

        // setTimeout(this.saveInfo,500);  // maybe the web's delay will cause the error
      }
    },

    // SAVE THE INFO OF DESIGN LIST INFO
    async saveInfo(val) {
      this.canSave = false;
      setTimeout(() => {
        this.canSave = true;
      }, 1000);
      if (JSON.stringify(this.allInfo) !== JSON.stringify(this.initInfo)) {
        let res = await updateDesignInfo(this.allInfo);

        if (res.status === 1) {
          this.$q.notify({ color: "green-5", message: "保存成功！" });
          this.getList();
          this.initInfo = JSON.parse(JSON.stringify(this.allInfo));
        }
      } else {
        this.$q.notify({ color: "red-5", message: "请更新内容，再点击提交！" });
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
      this.$store.dispatch("design_list", item);
    }
  },
  data() {
    return {
      // table
      allInfo: {},
      detailListInfo: [],

      currentPage: 1,
      size: 10,
      //loading图
      visible: true,

      //  confirm buttons
      options: [
        { value: "G", label: "G" },
        { value: "Y", label: "Y" },
        { value: "R", label: "R" }
      ],

      show: true,
      canSave: true,
      initInfo: {},
      statusData: {
        g: 0,
        y: 0,
        r: 0,
        noSure: 0
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.q-inner-loading {
  background: #fff;
}
.q-icon {
  font-size: 16px;
}
.font {
  display: block;
  width: 100%;
  height: 60px;
  font-size: 20px;
  font-family: "Source Han Sans CN";
  font-weight: 400;
  line-height: 60px;
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
