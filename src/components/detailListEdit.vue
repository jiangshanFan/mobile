<template>
  <div class="detailListEdit_Edit">
    <q-header elevated>
      <q-toolbar class="bg-primary text-white">
        <q-btn round dense>
          <q-icon name="fas fa-angle-left" @click.native="showDefault('edit')" />
        </q-btn>
        <q-toolbar-title>
          {{largeClass}}
        </q-toolbar-title>
        <q-btn class="bg-white text-black" dense label="保存" />
      </q-toolbar>
    </q-header>

    <q-tabs v-model="activeName" inline-label dense class="bg-grey-3"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator>
      <q-tab v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name" />
    </q-tabs>
  </div>
</template>

<script>
/* eslint-disable */
  /** 导入api.js */
  import { getApproveInfoByMouldNo, updateApproveInfoByInnerUser, updateApproveInfoByCustomer} from '../axios/api.js'

  export default {
    name: "detailListEdit",
    components: {

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

        for (let i = 0; i < inputs.length / 3; i++) {  // inputs divide 3, because of the attribute of "fixed"(is-hidden), create three different part & same content
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
          let c = [...this.table.content];
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
          // console.log(this.table.content);
          this.allInfo.remark = this.remark;
          let res;
          if (val === 1) {
            res = await updateApproveInfoByInnerUser(this.allInfo);
          } else {
            res = await updateApproveInfoByCustomer(this.allInfo);
          }
          if (res.status === 1) {
            // Message({showClose: true, type: 'success', message: '保存成功！'});
            this.getList();
          }
        }
      },

      showDefault(val) {
        this.$emit('showDefault',val);
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
