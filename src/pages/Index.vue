<template>
  <q-page>
    <!-- place QPageSticky at end of page -->
    <q-page-sticky expand position="top">
      <q-input outlined v-model="search" label="Label" placeholder="请输入项目名称或模号" dense>
        <template v-slot:append>
          <q-icon v-if="search !== ''" name="close" @click="search = ''" class="cursor-pointer" />
          <q-icon name="search" />
        </template>
      </q-input>
    </q-page-sticky>
  </q-page>
</template>

<style>
</style>

<script>
/* eslint-disable */
import { login, } from '../axios/api'
export default {
  name: 'PageIndex',
  async created() {
    let res = await login({accountName: 'admin', pwd: 'Ybsx#123', type: 1,});
    if (res.status === 1) {
      console.log('login');
    }

  },

  data() {
    return {
      search: '',
    }
  },
}
</script>
