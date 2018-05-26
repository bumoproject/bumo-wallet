<template>
  <section>
    <div class="page-content">
      <div class="container">
        <div class="ost-card-box">
          <div class="ost-card-title"><label>{{$t('mySet.walletLanguage.title')}}</label></div>
          <div class="pane pane-lang">
            <div class="toggle-lang-btn-wrapper">
              <div class="toggle-lang-btn" 
                  @click="changeLangEvent('cn')"
                  :class="currentLang === 'cn' ? 'toggle-lang-btn-active' : ''">
                简体中文
                <i v-show="currentLang === 'cn'" 
                  class="iconfont current-lang-right">&#xe672;
                </i>
              </div>
              <div class="toggle-lang-btn" 
                  @click="changeLangEvent('en')"
                  :class="currentLang === 'en' ? 'toggle-lang-btn-active' : ''">
                English
                <i v-show="currentLang === 'en'" 
                  class="iconfont current-lang-right">&#xe672;</i>
              </div>
              <div class="toggle-lang-btn" 
                  @click="changeLangEvent('ct')"
                  :class="currentLang === 'ct' ? 'toggle-lang-btn-active' : ''">
                繁體中文
                <i v-show="currentLang === 'ct'" 
                  class="iconfont current-lang-right">&#xe672;</i>
              </div>
            </div>
          </div>
        </div>
        <div class="ost-card-box">
          <div class="ost-card-title">
            <label>{{$t('mySet.basicInfo.title')}}</label>
          </div>
          <div class="pane">
            <ul>
              <li>
                <label>{{$t('mySet.basicInfo.walletName')}}</label>
                <div class="cont"><b>{{loginAccount.nick}}</b></div>
              </li>
              <li>
                <label>{{$t('mySet.basicInfo.walletAddress')}}</label>
                <div class="cont"><b>{{loginAccount.address}}</b></div>
              </li>
            </ul>
          </div>
        </div>
        <div class="ost-card-box">
          <div class="ost-card-title"><label>{{$t('mySet.privKeyInfo.title')}}</label></div>
          <div class="pane priv-key-label-box">
            <ul>
              <li>
                <label class="priv-key-label">{{$t('mySet.privKeyInfo.privKey')}}</label>
                <div class="cont">
                  <span>{{accountPrivKeyStr}}</span><div class="security-opts-wraper">
                    <small @click="showPalyPwdDialog" v-if="showTx == true">{{$t('mySet.privKeyInfo.button.show')}}</small>
                    <small @click="hiddenAccountPrivateStr" v-else>{{$t('mySet.privKeyInfo.button.hide')}}</small>
                    <small @click="saveAccountPrivKeyFile">{{$t('mySet.privKeyInfo.button.backup')}}</small>
                  </div>
                </div>
              </li>
              <li>
                <label></label>
                <div class="cont warning-con">
                  <div class="warn-msg">
                    {{$t('mySet.privKeyInfo.warningTxt')}}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="ost-card-box">
          <div class="ost-card-title">
            <label>{{$t('mySet.walletStorePath.title')}}</label>
          </div>
          <div class="pane">
            <ul>
              <li>
                <label>{{$t('mySet.walletStorePath.ledgerPath')}}</label>
                <div class="cont"><b>{{ledgerPath}}</b></div>
              </li>
              <li>
                <label>{{$t('mySet.walletStorePath.keyStorePath')}}</label>
                <div class="cont"><b>{{storeFilePath}}</b></div>
              </li>
            </ul>
          </div>
        </div>
        <div class="ost-card-box">
          <div class="ost-card-title version-info"><label>{{$t('mySet.versionInfo.title')}}</label></div>
          <div class="pane">
            <ul>
              <li>
                <label>{{$t('mySet.versionInfo.currentVersion')}}</label>
                <div class="cont">
                  <b>V{{ver}}</b>
                  <div class="last-version-wraper" v-if="lastVersion.ver === ver">{{$t('mySet.versionInfo.nowIsLast')}}</div>
                  <div class="has-new-ver-con" v-else>
                    {{$t('mySet.versionInfo.content')}}V{{lastVersion.ver}}, {{$t('mySet.versionInfo.clickThere')}}<a @click="downloadInstallPackage" >{{$t('mySet.versionInfo.updateNow')}}</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
    <Modal
        v-model="playPwdDialog"
        :mask-closable="false"
        :loading="playPwdLoading"
        @on-ok="palyPwdSubmit"
        @on-cancel="cancelPlayPwdDiagl">
        <p slot="header" class="bm-dialog-header">
            <span>{{$t('mySet.privKeyInfo.dialog.title')}}</span>
        </p>
        <div style="text-align:center">
            <p style="color: #999;padding-bottom:5px;">{{$t('mySet.privKeyInfo.dialog.notice')}}</p>
            <div class="play-pwd-wraper">
            <Form ref="playPwdData" :model="playPwdData" :rules="palyPwdRuleValidate">
              <FormItem prop="accountPwd">
                <Input v-model="playPwdData.accountPwd" :placeholder="$t('mySet.privKeyInfo.dialog.inputPwdPlaceholder')" type="password" height="36"></Input>
              </FormItem>
            </Form>
          </div>
        </div>
        <div slot="footer" style="text-align:center">
            <Button class="btn-cattle" @click="cancelPlayPwdDiagl">{{$t('common.dialogButton.cancel')}}</Button>
            <Button v-show="playPwdData.accountPwd !== ''" class="pwd-btn-main"  @click="palyPwdSubmit('playPwdData')">{{$t('common.dialogButton.confirm')}}</Button>
            <Button v-show="playPwdData.accountPwd === ''" class="pwd-btn-main-inactive"  >{{$t('common.dialogButton.confirm')}}</Button>
        </div>
    </Modal>
  </section>
</template>
<script>
const {shell} = require('electron')
import accountService from '../../controllers/accountService'
import errorUtil from '../../constants'
import baseService from '../../controllers/baseService'
import tools from '../../utils/tools'
import cfg from '../../../config'
const { dialog, app } = require('electron').remote
export default {
  computed: {
    loginAccount () {
      return this.$store.state.recentLoginWalletAccount
    }
  },
  data () {
    return {
      showTx: true,
      currentLang: 'cn',
      asset: {
        balance: 0,
        availableBalance: 0,
        txs: []
      },
      accountPrivKeyStr: '********************************************************',
      playPwdDialog: false,
      playPwdLoading: true,
      ver: cfg.version,
      lastVersion: this.$store.state.walletVersion,
      playPwdData: {
        accountPwd: ''
      },
      palyPwdRuleValidate: {
        accountPwd: [
            { required: true, message: this.$t('error.walletPwdEmpty'), trigger: 'blur' }
        ]
      },
      ledgerPath: ((process.platform === 'darwin') ? app.getPath('appData') + '/' + cfg.walletCatalog + '/buchain/data' : tools.getAppPath() + '\\buchain\\data'),
      storeFilePath: tools.getAppPath() + ((process.platform === 'darwin') ? '/wallets/' + this.$store.state.recentLoginWalletAccount.nick + '.wallet' : '\\wallets\\' + this.$store.state.recentLoginWalletAccount.nick + '.wallet')
    }
  },
  methods: {
    palyPwdSubmit () {
      var that = this
      this.$refs['playPwdData'].validate((valid) => {
        if (valid) {
          var reqData = {
            accountNick: that.$store.state.recentLoginWalletAccount.nick,
            accountPwd: that.playPwdData.accountPwd
          }
          accountService.getAccountPrivKeyStr(reqData).then(respData => {
            if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
              that.$Message.error(that.$t('error.pwd.wrong'))
              setTimeout(function () {
                that.playPwdLoading = false
                that.$nextTick(() => {
                  that.playPwdLoading = true
                })
              }, 10)
            } else {
              that.accountPrivKeyStr = respData.data.privKeyStr
              that.showTx = false
              that.showAccountPrivStrDialog = true
              that.$refs['playPwdData'].resetFields()
              that.playPwdDialog = false
            }
          }).catch(data => {
            console.log('err data:', data)
          })
        } else {
          setTimeout(function () {
            that.playPwdLoading = false
            that.$nextTick(() => {
              that.playPwdLoading = true
            })
          }, 30)
        }
      })
    },
    hiddenAccountPrivateStr () {
      var that = this
      that.accountPrivKeyStr = '********************************************************'
      that.showTx = true
    },
    showPalyPwdDialog () {
      var that = this
      that.playPwdDialog = true
    },
    show () {
      shell.showItemInFolder(this.storeFilePath)
    },
    cancelPlayPwdDiagl () {
      var that = this
      that.playPwdDialog = false
      that.playPwdData.accountPwd = ''
      this.$refs['playPwdData'].resetFields()
    },
    saveAccountPrivKeyFile () {
      var that = this
      var reqSaveAccountPrivatekeyFileData = {
        accountNick: that.$store.state.recentLoginWalletAccount.nick,
        savePrivPath: ''
      }
      dialog.showSaveDialog({title: this.$t('mySet.privKeyInfo.savePrivKeyFile'), filters: [{name: 'wallet', extensions: ['wallet']}]}, function (filePaths) {
        if (filePaths !== undefined) {
          reqSaveAccountPrivatekeyFileData.savePrivPath = filePaths
          accountService.saveAccountPrivKeyFile(reqSaveAccountPrivatekeyFileData).then(respData => {
            if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
              that.$Message.error(that.$t(respData.msg))
              return
            }
            that.$Message.success(that.$t('msg.succ.privKeyBackup'))
          }).catch(data => {
            console.log('err data:', data)
          })
        }
      })
    },
    changeLangEvent (lang) {
      this.$i18n.locale = lang
      this.currentLang = lang
      baseService.setLang(lang)
    },
    downloadInstallPackage () {
      shell.openExternal(this.lastVersion.downloadURl)
    }
  },
  mounted () {
    this.$i18n.locale && (this.currentLang = this.$i18n.locale)
    console.log('---------------------' + JSON.stringify(this.$store.state.walletVersion))
  }
}
</script>
<style scoped>
@import '../../assets/css/cardTitle.css';
.page-content {padding: 0;overflow: visible;}
.myset-wrapper{background-color: #fff;height: 418px;padding: 15px 0;}
.container {overflow: auto;padding-top: 10px;height: 500px;}
.security-opts-wraper {display: inline-block;}
.security-opts-wraper small{padding-left: 10px;color: #00D080;cursor:pointer;font-size: 12px;}
.ivu-row {height: 35px;line-height: 35px;}
.ivu-row .ivu-col label{color: #999;}
.priv-key-label {text-align: center;margin-left: 20px;}
.ivu-tabs-content .ivu-tabs-tabpane{padding-bottom: 15px;}
.privateKey-store-path{color: #00D080;cursor: pointer;}
.ost-card-box {margin-bottom: 10px;width: auto !important;}
.pane {margin-bottom: 10px;padding-left: 20px;}
.pane ul {margin-bottom:0}
.pane ul li{padding-left:10px;margin-bottom: 5px;}
.priv-key-label-box ul li{padding-left:50px;margin: 0;}
.priv-key-label-box ul li:first-child {padding: 0;}
.pane ul li label{display: inline-block;font-size: 12px;color: #666;width: auto;padding-right: 10px;text-align: right;}
.pane ul li .cont{display: inline-block;font-size: 12px;}
.pane ul li .cont.warning-con{
  display: block;
}
.pane ul li .cont.warning-con .warn-msg{
  width: auto;
}
.last-version-wraper{display: inline-block;padding-left: 25px;color: #666;}
.last-version-wraper a{color: #00D080;text-decoration: underline;}
.warn-msg {padding: 9px;}
.pane-lang {
  height: 25px;
  padding-left: 32px;
}
.toggle-lang-btn-wrapper {
  width: 300px;
  margin-bottom: 10px;
}
.toggle-lang-btn {
  float: left;
  position: relative;
  width: 80px;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  border-radius: 4px;
  padding: 0;
  margin-right: 20px;
  border: 1px solid #DFDFDF;
  text-align: center;
  cursor: pointer;
  color: #666;
}
.toggle-lang-btn i {
  font-size: 12px;
}
.toggle-lang-btn-active {
  padding-left: 6px;
  background: #00D080;
  border: 1px solid #00D080;
  color: #fff;
  text-align: left;
}
.current-lang-right {
  position: absolute;
  right: 2px;
  top: 0;
}

.container::-webkit-scrollbar {
  width: 4px;     
  height: 4px;
}
.container::-webkit-scrollbar-thumb {
  border-radius: 2px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: rgba(0,0,0,0.2);
}
.container::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 0;
  background: rgba(0,0,0,0.1);
}

.version-info {
  clear: both;
}
.has-new-ver-con{
  display: inline-block;
  padding-left: 12px;
}
</style>
