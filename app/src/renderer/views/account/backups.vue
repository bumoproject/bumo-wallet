<template>
  <section>
    <template>
      <div class="frameTitle">
        <Titlebtn type="min" class="iconfont icon-jianhao"/>
        <Titlebtn type="close" class="iconfont icon-guanbi"/>
      </div>
    </template>
    <div class="page wallet-bg backups-pk">
      <div class="box frm-box">
          <div class="box-title-img backups-pk-title wallet-title-text">{{$t('backups.title')}}</div>
          <div class="box-title-txt backups-pk-notice">{{$t('backups.notice')}}</div>
          <div class="box-body">
              <Button @click="showPwdDiag()" class="btn-mouse">{{$t('backups.button.exportCleartextPrivKey')}}</Button>
              <Button @click="saveAccountPrivKeyFile" class="btn-main export-keystore">{{$t('backups.button.exportPrivKeyFile')}}</Button>
          </div>
          <div class="explain-privkey-keystore">{{$t('backups.explain')}}
            <Tooltip placement="right-start" class="explain-privkey-keystore-tip">
              <i class="iconfont icon-wenhao"></i>
              <div slot="content"><p v-html="$t('backups.explainTip')"></p></div>
            </Tooltip>
          </div>
      </div>
      <ul class="link-opts">
        <li><a href="#/">{{$t('common.feature.loginWallet')}}</a></li>
        <li>
          <a href="#/account/recover">{{$t('common.feature.importPrivKey.name')}}</a>
          <Tooltip placement="right-start" class="import-str-tip">
            <i class="iconfont icon-wenhao"></i>
            <div slot="content"><p v-html="$t('common.feature.importPrivKey.toolTip')"></p></div>
          </Tooltip>
        </li>
      </ul>
      <p class="copyright">{{$t('common.copyright')}} V{{walletVersion}}</p>
      <language-select></language-select>
      <logo></logo>
    </div>
    <Modal class="backups-export-private-dialog" v-model="playPwdDialog" :loading="playPwdLoading" :mask-closable="false" width="480">
        <p slot="header" class="bm-dialog-header">
            <span>{{$t('backups.dialog.exportCleartextPrivKey.title')}}</span>
        </p>
        <div style="text-align:center">
            <p style="color: #999;padding-bottom:5px;">{{$t('backups.dialog.exportCleartextPrivKey.notice')}}</p>
            <div class="play-pwd-wraper">
            <Form ref="playPwdData" :model="playPwdData" :rules="palyPwdRuleValidate">
              <FormItem prop="accountPwd">
                <Input v-model="playPwdData.accountPwd" :placeholder="$t('backups.dialog.exportCleartextPrivKey.pwdPlaceholder')" type="password" height="36"></Input>
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
    <!-- <Modal
        title="当前账户明文私钥"
        v-model="showAccountPrivStrDialog"
        :closable="false">
        <Card>
            <p slot="title">请复制明文私钥</p>
            <p>{{accountPrivKeyStr}}</p>
        </Card>
        <div slot="footer">
            <Button type="primary" size="large" long @click="showAccountPrivStrDialog = false">确认</Button>
        </div>
    </Modal> -->
    <Modal class="backups-copy-private-key-wrapper" v-model="showAccountPrivStrDialog"  width="580">
        <p slot="header" class="bm-dialog-header">
            <span>{{$t('backups.dialog.exportCleartextPrivKey.title')}}</span>
        </p>
        <div>
            <p style="color: #999;padding-bottom:5px;">{{$t('backups.dialog.exportCleartextPrivKey.tip')}}</p>
            <div class="play-pwd-wraper">
            <Form>
              <FormItem >
                <Input v-model="accountPrivKeyStr" height="36"></Input>
              </FormItem>
            </Form>
          </div>
        </div>
        <div slot="footer">
        </div>
    </Modal>
  </section>
</template>
<script>
import Titlebtn from '../../components/Titlebtn.vue'
import accountService from '../../controllers/accountService'
import walletCfg from '../../../config'
import errorUtil from '../../constants'
import LanguageSelect from '../../components/languageSelect.vue'
import Logo from '../../components/logo.vue'
const { dialog } = require('electron').remote
// const {clipboard} = require('electron')
export default {
  components: {
    Titlebtn,
    LanguageSelect,
    Logo
  },
  computed: {
    loginAccount () {
      return this.$store.state.recentLoginWalletAccount
    }
  },
  data () {
    return {
      loading: true,
      accountPrivKeyStr: '',
      showAccountPrivStrDialog: false,
      playPwdDialog: false,
      showDialogType: 'showAccountPrivKeyStr',
      walletVersion: walletCfg.version,
      playPwdLoading: true,
      playPwdData: {
        accountPwd: ''
      },
      palyPwdRuleValidate: {
        accountPwd: [
            { required: true, message: this.$t('error.walletPwdEmpty'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    palyPwdSubmit (name) {
      var that = this
      this.$refs[name].validate((valid) => {
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
    showPwdDiag () {
      this.playPwdDialog = true
      this.$refs.playPwdData.resetFields()
    },
    saveAccountPrivKeyFile () {
      var that = this
      var reqSaveAccountPrivatekeyFileData = {
        accountNick: that.$store.state.recentLoginWalletAccount.nick,
        savePrivPath: ''
      }
      dialog.showSaveDialog({title: that.$t('backups.savePrivKeyFile'), filters: [{name: 'wallet', extensions: ['wallet']}]}, function (filePaths) {
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
    cancelPlayPwdDiagl () {
      var that = this
      that.playPwdData.accountPwd = ''
      that.playPwdDialog = false
      that.$refs['playPwdData'].resetFields()
    }
    // handleCopyBtnClick () {
    //   clipboard.writeText(this.accountPrivKeyStr)
    //   this.$Message.success('复制成功')
    // }
  },
  created () {
    // console.log('---')
  }
}
</script>
<style scoped>
.wallet-title-text {font-size: 18px; padding-top:38px;}
.import-priv-str {margin-bottom: 10px !important;}
.icon-wenhao{color: #fff;padding-left: 5px;opacity: 0.5;}
.backups-pk .box-title-txt {text-align: left;}
.box .backups-pk {color: #000;}
.backups-pk {position: relative;}
.backups-pk .explain-privkey-keystore {position: absolute;right: 24px;bottom: 11px;font-size: 12px;color: #00d080;}
.backups-pk .explain-privkey-keystore-tip i {color: #00d080;padding-left: 0;opacity: 0.9;font-weight: 400;}
.link-opts {text-align: center;position: absolute;top: 441px;left: 50%;transform: translateX(-50%);}
.link-opts li{list-style:none;display: inline-block;margin: 0 15px;}
.link-opts li:first-child{position: relative;}
.link-opts li:first-child::after{content: ''; position: absolute; top: 10px; right: -19px; width: 1px; height: 10px; background: #DFDFDF; opacity: 0.4;}
.link-opts li a{color: #fff;line-height: 30px;font-size:14px;font-weight:400;}
</style>
