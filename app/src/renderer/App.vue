<template>
  <div id="app">
    <div id="pageLoading" v-if="loadingStatus == 1 && checkWalletVersion.status != 1">
      <div class="spinner">
        <h3>{{$t('common.welcome')}}</h3>
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
    <div v-if="checkWalletVersion.status == 1" class="page wallet-bg">
      <template>
        <Modal
          v-model="updateNoticeModal"
          :closable="false"
          :mask-closable="false"
          width="480" class="version-box">
          <p slot="header" class="version-info-header" style="color:#f60;text-align:center;"></p>
          <div style="text-align: center;">
              <p class="version-num"><b>{{$t('update.latestVersion')}}V{{checkWalletVersion.ver}}</b></p>
              <p class="update-content-title"><b>{{$t('update.updateContent')}}</b></p>
            <div class="update-content">
              <ul>
                <li v-for="(item, index) in checkWalletVersion.content" :key="index">{{item}}</li>
              </ul>
              <ul>
                <li v-for="(item, index) in checkWalletVersion.englishContent" :key="index">{{item}}</li>
              </ul>
            </div>
            <div class="version-info-btn" :class="checkWalletVersion.verType == 1 ? 'force-update-btn': '' " >
              <Button class="btn-cattle"  @click="skipUpdate" v-if="checkWalletVersion.verType == 0">{{$t('update.button.skip')}}</Button>
              <Button class="btn-main"  @click="downloadInstallPackage">{{$t('update.button.updateNow')}}</Button>
            </div>
            <p class="version-info-warning">{{$t('update.updateNotice')}}</p>
          </div>
          <div slot="footer"></div>          
        </Modal>
      </template>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
  import './assets/iconfont/iconfont.js'
  import baseService from '../renderer/controllers/baseService'
  const shell = require('electron').shell
  export default {
    name: 'app',
    data () {
      return {
        updateNoticeModal: true
      }
    },
    methods: {
      downloadInstallPackage () {
        shell.openExternal(this.checkWalletVersion.downloadURl)
      },
      skipUpdate () {
        this.updateNoticeModal = false
        baseService.setSkipUpdate()
        this.$router.push({
          name: 'login'
        })
        var walletVersionStore = {
          ver: this.checkWalletVersion.ver,
          content: this.checkWalletVersion.content,
          englishContent: this.checkWalletVersion.englishContent,
          downloadURl: this.checkWalletVersion.downloadURl,
          verType: this.checkWalletVersion.verType,
          createTime: this.checkWalletVersion.createTime,
          status: 0
        }
        this.$store.commit('WALLET_VERSION', walletVersionStore)
      },
      cancelFrm () {
        //
      }
    },
    computed: {
      loadingStatus () {
        return this.$store.state.loadingStatus
      },
      checkWalletVersion () {
        return this.$store.state.walletVersion
      }
    }
    // created () {
    //   if (navigator.language === 'en' || navigator.language === 'en-us') {
    //     this.$i18n.locale = 'en'
    //     baseService.setLang('en')
    //   } else {
    //     this.$i18n.locale = 'cn'
    //     baseService.setLang('cn')
    //   }
    // }
  }
</script>

<style>
  /* CSS */
  @import './assets/iconfont/iconfont.css';
  @import './assets/css/global.css';
  @import './assets/css/main1.css';
  .update-content {padding-left: 14px;height: 82px;overflow: auto;}
  .update-content::-webkit-scrollbar {width: 4px;height: 4px;}
  .update-content::-webkit-scrollbar-thumb {border-radius: 2px;box-shadow: inset 0 0 5px rgba(0,0,0,0.2);background: rgba(0,0,0,0.2);}
  .update-content::-webkit-scrollbar-track {box-shadow: inset 0 0 5px rgba(0,0,0,0.2);border-radius: 0;background: rgba(0,0,0,0.1);}
  .version-num{margin-bottom: 10px;text-align: left;padding-left: 12px;}
  .version-num b{font-size: 14px;color: #333;}
  .update-content-title {text-align: left;margin-bottom: 5px;padding-left: 12px;}
  .update-content-title b {font-size: 14px;color: #333;}
  .update-content li{text-align: left;list-style-type:decimal;margin-left: 14px;font-size: 12px;color: #666;}
  .btn-cattle{width: 112px;}
  .version-info-btn{margin-top: 21px;}
  .version-info-btn .ivu-btn{margin: 0 15px;}
  .force-update-btn .ivu-btn{width: 420px;height: 36px;margin-bottom: 4px;}
  .wallet-bg .version-box .ivu-modal {height: 362px;}
  .version-box .ivu-modal-header{background: url(./assets/img/new-version.png) no-repeat center;height: 140px;border-bottom:none;}
  .version-info-warning{padding-top: 5px;color: #999;font-size: 12px;}
  .version-box .ivu-modal-footer{display: none;}
</style>
