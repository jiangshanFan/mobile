<template>
  <div class="w100 h100">
    <q-page class="ovwh" style="height: 100%;">
      <div class="col h100" v-if="show">
        <!-- header -->
        <q-header elevated>
          <q-toolbar class="text-top bg-top_Nav-color">
            <span @click="clearStorage" class="exit">退出</span>
            <!-- <q-btn round dense icon="menu" class="q-mr-xs"> -->
            <!-- Menu -->
            <!-- <q-menu :content-style="{ fontSize: '0.5em' }" auto-close>
            <q-list style="min-width: 100px">-->
            <!--<q-item clickable v-close-popup>
                    <q-item-section>修改密码</q-item-section>
                  </q-item>
            <q-separator />-->
            <!-- <q-item clickable v-close-popup>
                    <q-item-section @click="clearStorage">退出</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>-->
            <q-space />
            <q-input
              outlined
              v-model="search.value"
              placeholder="请输入项目名称或模号"
              dense
              style="width:90%;"
              color="white"
              bg-color="white"
              :input-style="{ color: '#999' }"
            >
              <template v-slot:append>
                <q-icon
                  v-if="search.value !== ''"
                  name="far fa-times-circle"
                  color="white"
                  @click="search.value = ''"
                  class="cursor-pointer"
                  style="font-size:0.8em;"
                />
                <q-icon name="fas fa-search" color="#878787" @click="searchInfo" />
              </template>
            </q-input>
          </q-toolbar>
        </q-header>
        <!-- mouldList -->
        <div style="height:100%;overflow-y: auto;">
          <div v-if="projectList.length" class="q-pa-sm" style="max-width: 100%;width:100%;">
            <!--<div class="text-h6 q-mb-md">项目列表</div>-->
            <q-list class="rounded-borders">
              <div class="col" v-for="(items,index) in projectList" :key="index">
                <q-expansion-item
                  expand-separator
                  expand-icon="keyboard_arrow_down"
                  :label="items.projectName"
                >
                  <q-card>
                    <q-card-section>
                      <q-list>
                        <div class="col" v-for="(item,index) in items.mouldList" :key="index">
                          <q-item
                            clickable
                            v-ripple
                            @click="edits({...item, projectName: items.projectName})"
                          >
                            <q-item-section avatar>
                              <q-avatar>
                                <img src="../assets/null_img.png" />
                              </q-avatar>
                            </q-item-section>

                            <q-item-section>
                              <q-item-label class="text-weight-bold" lines="1">{{item.mouldNo}}</q-item-label>
                              <q-item-label caption lines="1">{{item.partName}}</q-item-label>
                            </q-item-section>

                            <q-item-section side>{{item.leader}}</q-item-section>
                          </q-item>
                          <q-separator inset="item" />
                        </div>
                      </q-list>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
                <q-separator />
              </div>
            </q-list>
          </div>
        </div>
      </div>

      <AddOrEdit v-else @showDefault="showDefault"></AddOrEdit>
    </q-page>
  </div>
</template>

<style>
</style>

<script>
/* eslint-disable */
import { getProjectList, loginOut } from "../axios/api";
import detailList from "../components/detailList";

export default {
  name: "mould",
  components: {
    AddOrEdit: detailList
  },
  async created() {
    this.getProjectList();
  },

  methods: {
    // get project list
    async getProjectList() {
      let params = {};
      let res;
      try {
        if (this.search.value) {
          params.param = this.search.value;
          res = await getProjectList(params);
        } else {
          res = await getProjectList();
        }
        if (res.status === 1) {
          this.projectList = res.msg;
          if (!res.msg.length) {
            this.$q.notify({
              color: "yellow-5",
              textColor: "orange",
              icon: "fas fa-exclamation-triangle",
              position: "center",
              timeout: 1000,
              message: "暂无相关信息！"
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    },

    // search
    searchInfo() {
      this.getProjectList();
    },

    //点击退出，退出登陆后，需要刷新页面，因为我们是通过addRoutes添加的，router没有deleteRoutes这个api，所以清除token,清除permissionList等信息，刷新页面是最保险的。
    async clearStorage() {
      let res = await loginOut();
      if (res.status === 1) {
        sessionStorage.clear(); /* only clear all info, the routes will be right, or not go to the method of set_router.js */
        this.$router.push("/login");
      }
    },

    // edit info
    edits(item) {
      this.show = !this.show;
      this.$store.dispatch("mould_list", item);
    },

    // show default module
    showDefault(val) {
      if (val) {
        this.show = !this.show;
        this.getProjectList();
      }
    }
  },

  data() {
    return {
      search: {
        value: ""
      },
      projectList: [],

      // if show the components
      show: true
    };
  }
};
</script>
<style lang="scss" scoped>
.exit {
  font-size: 16px;
  font-family: "Source Han Sans CN";
  font-weight: 400;
  color: rgba(35, 35, 35, 1);
}
.q-card > div:last-child,
.q-card > img:last-child {
  border-bottom: 0;
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
  background-color: rgba(245, 245, 245, 1);
}

</style>