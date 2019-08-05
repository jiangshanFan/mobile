<template>
  <div id="login" class="tc posr">
    <div class="login posa">
      <div class="mb20">
        <p class="title f20 fwb">YFPO 模具品质管理系统</p>
        <span class="f12 c6">欢迎登录!</span>
      </div>

      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input
          class="user_info"
          rounded
          outlined
          bg-color="white"
          v-model="accountName"
          label="账户"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-user" style="color:#027be3;" />
          </template>
        </q-input>

        <q-input
          class="user_info"
          rounded
          outlined
          bg-color="white"
          type="password"
          v-model="pwd"
          label="密码"
          lazy-rules
          :rules="[val => val && val.length > 0 || 'Please type your password']"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-unlock-alt" style="color:#027be3;" />
          </template>
        </q-input>

        <div>
          <q-btn class="w100" label="登录" rounded type="submit" color="primary" text-color="white" size="20px" />
          <!--<q-btn label="Reset" type="reset" color="white" flat class="q-ml-sm" />-->
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import { login, } from '../axios/api'

  export default {
    name: "login",
    created() {
      sessionStorage.clear();
    },
    mounted() {
      // this.$store.commit('Auth/CLEAR_PERMISSION');  // avoid losing the efficacy of token, goto the page of login.vue, but the token still resist
    },
    methods: {
      async onSubmit () {
        if(this.accountName !== '' && this.pwd !== '') {
          let params = {
            accountName: this.accountName,
            pwd: this.pwd,
            type: 2,
          };
          try {
            let res = await login(params);
            if(res.status === 1) {
              sessionStorage.setItem('token',res.msg.authorization);
              sessionStorage.setItem('accountName',res.msg.userLoginVO.name);
              sessionStorage.setItem('userLoginVO',JSON.stringify(res.msg.userLoginVO));

              this.$store.dispatch('token', sessionStorage.getItem('token'));
              this.$store.dispatch('accountName', sessionStorage.getItem('accountName'));
              this.$store.dispatch('userLoginVO', JSON.parse(sessionStorage.getItem('userLoginVO')));

              // if(!this.$store.state.Auth.permissionList) {
              //   this.$store.dispatch('Auth/FETCH_PERMISSION').then(() => {  // 此处的then写法在旧版IE不支持
              //     if (this.$store.getters.userLoginVO.role) {
              //       this.$router.replace('/');
              //     } else {
              //       this.$router.push({path: '/mould/userName'});
              //     }
              //   }); //刷新界面就请求权限数据
              // }
              // this.$q.notify({
              //   color: 'green-4',
              //   textColor: 'white',
              //   icon: 'fas fa-check-circle',
              //   message: '验证通过！'
              // });
              this.$router.replace('/');
            }
          }catch (e) {
            console.log(e)
          }
        }
      },

      onReset () {
        this.accountName = null;
        this.pwd = null
      }
    },

    data() {
      return {
        accountName: '',
        pwd: '',
      }
    },
  }
</script>

<style lang="scss" scoped>
  .login {
    width: 100%;
    padding: 0 5px;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    align-items: center;
    background: url("../assets/login_bg.png") no-repeat center 0;
    background-size: cover;
    > form {
      width: 80%;
      min-width: 240px;
      .user_info {
        line-height: 100px;
        border-radius: 20px;
      }
    }
  }
</style>
