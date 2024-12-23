// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    // 开启对 server/api 的支持
    preset: 'node-server'
  },
  devtools: { enabled: true },
  compatibilityDate: "2024-12-20"
})