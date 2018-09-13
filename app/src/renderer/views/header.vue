<template>
  <section>
      <div class="page-header">
        <div class="frameTitle">
          <Titlebtn type="min" class="iconfont icon-jianhao"/>
          <Titlebtn type="close" class="iconfont icon-guanbi"/>
        </div>
        <div class="container">
          <div class="frame-header">
            <div class="frame-header-title-wraper">
              <!-- <i class="frame-header-icon iconfont icon-BUMO-LOGO"></i>-->
              <span>{{walletName}} V{{walletVersion}}</span>
            </div>
          </div>
          <div class="nav-wrapper">
            <ul class="nav navbar-nav">
              <li @click="clickNav('index')" :class="getActiveHeaderNav === 'index' ? 'active' : ''">
                <a href="#/index"><i class="iconfont icon-shouye"></i>{{$t('header.nav.home')}}</a>
              </li>
              <li @click="clickNav('token')" :class="getActiveHeaderNav === 'token' ? 'active' : ''">
                <a href="#/token"><i class="iconfont icon-token"></i>{{$t('header.nav.token')}}</a>
              </li>
              <li @click="clickNav('tx')" :class="getActiveHeaderNav === 'tx' ? 'active' : ''">
                <a href="#/tx"><i class="iconfont icon-zhuanzhang"></i>{{$t('header.nav.send')}}</a>
              </li>
              <li @click="clickNav('offLineSign')" :class="getActiveHeaderNav === 'offLineSign' ? 'active' : ''">
                <a href="#/ost"><i class="iconfont">&#xe670;</i>{{$t('header.nav.outlineSignTx')}}</a>
              </li>
              <li @click="clickNav('uniteAccount')" :class="getActiveHeaderNav === 'uniteAccount' ? 'active' : ''">
                <a href="#/unite"><i class="iconfont icon-lianmingzhanghu"></i>{{$t('header.nav.uniteAccountTx')}}</a>
              </li> 
            </ul>
            <div class="nav-right-wraper fr">
              <div class="nav-item login-avatar-wraper">
                <a @click="go2MysetPage">
                  <img class="default-account-login-avatar" src="../assets/img/default-account-login-avatar.png"/>
                  <span class="wallet-nick">{{loginAccount.nick}}</span>
                </a>
              </div>
              <div class="nav-item" @click="logout">
                <span class="iconfont icon-tuichu1"></span><small>{{$t('header.nav.logOut')}}</small>              
              </div>
            </div>
          </div>
        </div>
    </div>
  </section>
</template>
<script>
import Titlebtn from '../components/Titlebtn.vue'
import walletCfg from '../../config'
import { ipcRenderer } from 'electron'
var instance = null
ipcRenderer.on('show-wallet-advanced', (event, arg) => {
  instance.showAdvanced()
})
export default {
  name: 'walletHeader',
  components: {
    Titlebtn
  },
  computed: {
    loginAccount () {
      return this.$store.state.recentLoginWalletAccount
    },
    getActiveHeaderNav () {
      return this.$store.state.activeHeaderNav
    }
  },
  data () {
    return {
      walletName: walletCfg.name,
      walletVersion: walletCfg.version,
      active: 'index',
      login: {
        password: '',
        name: ''
      },
      showAdvancedNav: false
    }
  },
  methods: {
    logout () {
      location.href = '#/'
      this.$router.push({
        name: 'login'
      })
    },
    clickNav (navStr) {
      this.$store.commit('ACTIVE_HEADER_NAV', navStr)
    },
    showAdvanced () {
      this.showAdvancedNav = true
    },
    go2MysetPage () {
      this.$router.push({
        name: 'accountMySet'
      })
      this.$store.commit('ACTIVE_HEADER_NAV', '')
    }
  },
  created () {
    this.active = 'index'
    instance = this
  },
  beforeDestroy () {
    this.active = 'index'
  }
}
</script>
<style scoped>
.page-header {-webkit-app-region: drag;}
.frame-header{position: relative;padding: 5px 0 0;display: inline-block}
.frame-header .frame-header-title-wraper{display: inline-block;}
.frame-header .frame-header-title-wraper i{font-size: 24px;color: #fff;}
.frame-header .frame-header-title-wraper span{font-size: 12px;color: #fff;}
.frame-header .frame-header-opts-wraper{display: inline-block;position: absolute;right: 0;}
.frame-header .frame-header-opts-wraper a{padding-left: 10px;font-size: 20px;color: #fff;}
.nav-wrapper{position: relative;height: 60px;bottom: -2px;}
.nav-wrapper .navbar-nav {-webkit-app-region: no-drag;}
.nav-right-wraper {-webkit-app-region: no-drag;}
.nav-right-wraper{height: 38px;margin-top:8px}
.nav-right-wraper .nav-item{float: left;height: 40px;line-height: 40px;cursor: pointer;}
.nav-right-wraper .nav-item span,.nav-right-wraper .nav-item small{color: #fff; vertical-align: middle;}
.nav-right-wraper .nav-item span{font-size: 14px;}
.nav-right-wraper .nav-item small{font-size: 12px;}
.nav-right-wraper:hover .nav-right-opts{display: block;}
.login-avatar-wraper{padding-right: 18px;}
.nav-right-wraper .nav-item span.icon-tuichu1{font-size: 13px;padding-right: 5px; vertical-align: middle;}
.wallet-nick{color: #fff;padding: 0 5px;vertical-align: text-bottom;}
.wallet-address{color: #fff;}
.fr{float: right!important;}
.default-account-login-avatar{width: 36px;height: 36px; vertical-align: middle;}
</style>
