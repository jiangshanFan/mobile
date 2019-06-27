<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round aria-label="Back">
          <q-icon name="fas fa-angle-left" />
        </q-btn>

        <q-toolbar-title>
          yfpo
        </q-toolbar-title>

        <!--<div>Quasar v{{ $q.version }}</div>-->
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
/* eslint-disable */
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  },
  created() {

  },
}
</script>

<style>
</style>
