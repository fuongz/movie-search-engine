export default {
  ssr: false,
  components: true,
  generate: {
    interval: 2000,
  },

  head: {
    title: 'Phim Phake: The free forever movie search engine',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'The free forever movie search engine',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: ['~assets/css/app.css'],

  plugins: [],

  buildModules: [
    '@nuxt/typescript-build',
    'nuxt-windicss',
    '@nuxtjs/google-fonts',
    '@nuxtjs/device',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-analytics',
    '@nuxtjs/composition-api/module',
  ],

  modules: ['@nuxtjs/axios', '@nuxtjs/svg'],

  googleAnalytics: {
    id: 'UA-163272788-4',
  },

  colorMode: {
    classSuffix: '',
  },

  googleFonts: {
    families: {
      Inter: true,
      Merriweather: true,
    },
    display: 'swap',
    subsets: '',
    prefetch: true,
    preload: true,
  },

  axios: {
    baseURL: process.env.API_URL,
  },

  build: {},
}
