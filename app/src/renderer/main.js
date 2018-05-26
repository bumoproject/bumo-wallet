//
import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import * as filters from './filters' // 全局filter
import App from './App'
import router from './router'
import store from './store'
import VueI18n from 'vue-i18n'
// import VueResource from 'vue-resource'
import EasyScroll from 'easyscroll'
import baseService from '../renderer/controllers/baseService'
import LangZhCn from '../renderer/assets/i18n/zh-cn'
import LangEnUs from '../renderer/assets/i18n/en-us'
import LangZhCt from '../renderer/assets/i18n/zd-ct'

Vue.use(EasyScroll)
Vue.use(VueI18n)
Vue.use(iView)
Vue.locale = () => {}
// Vue.use(VueResource)
const i18n = new VueI18n({
  locale: baseService.getLang(),
  messages: {
    'cn': LangZhCn,
    'en': LangEnUs,
    'ct': LangZhCt
  }
})
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  if (store.state.loadingStatus === 10) {
    store.commit('LOADING_STATUS', 1)
  }
  next()
})
router.afterEach((to, from, next) => {
  iView.LoadingBar.finish()
  store.commit('LOADING_STATUS', 2)
})
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
/* eslint-disable no-new */
baseService.getRecentVersion(store)
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
