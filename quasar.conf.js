// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'i18n',
      'axios'
    ],

    css: [
      'app.styl'
    ],

    extras: [
      'ionicons-v4',
      // 'mdi-v3',
      'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    framework: {
      iconSet: 'ionicons-v4',
      // lang: 'de', // Quasar language

      // all: true, // --- includes everything; for dev only!

      components: [
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QPageSticky',
        'QInput',
        'QForm',
        'QToggle',
        'QField',
        'QSpace',
        'QMenu',
        'QSeparator',
        'QExpansionItem',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QAvatar',
        'QScrollArea',
        'QDialog',
        'QImg',
        'QTabs',
        'QTab',
        'QRouteTab',
        'QRadio',
        'QSelect',
        'QPageScroller',
        'QUploader',
        'QUploaderAddTrigger',
        'QSpinner',
        'QSpinnerBars',
        'QSpinnerIos',
        'QTimeline',
        'QTimelineEntry',
        'QInnerLoading'
      ],

      directives: [
        'Ripple',
        'ClosePopup'
      ],

      // Quasar plugins
      plugins: [
        'Notify'
      ],

      config: {
        notify: { /* Notify defaults */ }
      }
    },

    // framework: 'all',

    supportIE: true,

    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      distDir: 'dist',
      scssLoaderOptions: {

      },
      extendWebpack(cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        })
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true, // opens browser window automatically
      proxy: {
        // proxy all requests starting with /api to jsonplaceholder
        '/api': {
          target: 'http://10.9.1.79:62568',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar App',
        // description: 'A Quasar Framework app',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [

        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack(cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'yfpo_mobile'
      }
    }
  }
}
