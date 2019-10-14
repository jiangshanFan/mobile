<template>
  <div id="q-app">
    <transition name="slide-fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
// let resizeTimer = null;
// window.addEventListener('resize', function (){
//   if (resizeTimer) clearTimeout(resizeTimer);
//   resizeTimer = setTimeout(function(){
//     if (window.innerWidth > 720) {
//       window.location.href = 'http://10.9.1.77:65379'
//     } else {
//       window.location.href = 'http://10.9.1.77:65380'
//     }
//     setMainHeight();
//   } , 100);
// });

export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    };
  },

  created() {
    // 在页面加载时读取 sessionStorage 里的状态信息 ---------------------- 可能考虑使用 sessionStorage 会更好，尤其是在token会失效的情况下
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      function replacer(key, value) {
        // Filtering out properties
        if (key === "Auth") {
          return undefined;
        }
        return value;
      }
      console.log(this.$store.state);
      sessionStorage.setItem(
        "store",
        JSON.stringify(this.$store.state, replacer)
      ); // replacer delete Auth
    });
  },

  mounted() {
    let path = sessionStorage.getItem("currentUrl");
    if (
      sessionStorage.getItem("token") === "" ||
      sessionStorage.getItem("token") === null ||
      sessionStorage.getItem("token") === undefined
    ) {
      this.$router.push("/login");
    } else {
      this.$router.push(path);
    }
  },

  beforeUpdate() {
    window.sessionStorage.setItem("currentUrl", this.$route.path);
  },

  watch: {
    //通过路由的更新可以直接赋值
    $route: function(to, from, next) {
      console.log(this.$route);
    }
  },

  methods: {
    //刷新子路由
    reload() {
      window.location.reload();
      // this.$store.dispatch('isLogin', false);
      // this.$nextTick(function () {
      //   this.$store.dispatch('isLogin', true);
      // });
    }
  },

  data() {
    return {};
  }
};
</script>

<style lang="scss">
@import "style/common";
.q-uploader__list {
  min-height: 1px;
  padding: 0;
}
.top_nav {
  padding: 1px 6px !important;
}
.q-timeline__dot:after {
  width: 1px;
  opacity: 0.4;
  top: 24px;
  bottom: 0;
  left: 6px;
}

.text-top {
  color: #232323;
}
.text-brand {
  color: #79b8fd !important;
}
.text-back_top {
  color: #666;
}
.bg-top_Nav-color {
  background: #a0c5fc !important;
}
.q-layout-padding {
  padding: 0;
}
.q-pa-sm {
  padding: 0;
}
.f17 {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url("./assets/develoop.png");
}
.q-item {
  padding: 0 10px;
}
</style>
