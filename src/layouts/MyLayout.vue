<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container style="height: 100%;">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
/* eslint-disable */
import { openURL, } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL,
  },
  created() {

  },
}
</script>

<style>
</style>
