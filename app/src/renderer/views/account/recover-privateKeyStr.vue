<template>
  <section class="login-wrap account-login">
    <template>
      <div class="frameTitle">
        <Titlebtn type="min" class="iconfont icon-jianhao"/>
        <Titlebtn type="close" class="iconfont icon-guanbi"/>
      </div>
    </template>
    <div class="page wallet-bg import-private-key-str">
      <div class="box frm-box">
        <div class="box-title-img wallet-title-text" :class="{'private-key-import-title': isChina}">{{$t('importPrivKey.title')}}</div>
        <div class="box-title-txt">{{$t('importPrivKey.notice')}}</div>
        <div class="box-body">
          <div class="frm import-priv-str-frm">
            <div class="frm-header-wraper">
              <h4>{{$t('importPrivKey.form.cleartext.title')}}</h4>
              <div class="frm-img" @click="go2RecoverAccountByPrviateKeyFile">
                <div class="frm-img-text">{{$t('importPrivKey.form.cleartext.chooseFile')}}
                  <div class="arrow-right"></div>
                  <div class="arrow-left"></div>
                </div>
              </div>
              <div class="frm-img-hack"></div>
              <div class="frm-img-hack-right"></div>
            </div>
          <div class="frm-group">
            <label>{{$t('importPrivKey.form.cleartext.privKry.label')}}</label>
            <input v-model.trim="recoverAccountFrm.accountPrivKeyStr" class="form-control" type="text" :placeholder="$t('importPrivKey.form.cleartext.privKry.placeholder')">
          </div>
          <div class="frm-group">
            <label>{{$t('importPrivKey.form.cleartext.walletName.label')}}</label>
            <input v-model.trim="recoverAccountFrm.accountNick" class="form-control" type="text" :placeholder="$t('importPrivKey.form.cleartext.walletName.placeholder')">
          </div>
          <div class="frm-group">
            <label>{{$t('importPrivKey.form.cleartext.pwd.label')}}</label>
            <input v-model.trim="recoverAccountFrm.accountPwd" class="form-control" type="password" :placeholder="$t('importPrivKey.form.cleartext.pwd.placeholder')">
          </div>
          <div class="frm-group">
            <label>{{$t('importPrivKey.form.cleartext.confirmPwd.label')}}</label>
            <input v-model.trim="recoverAccountFrm.rePassword" class="form-control" type="password" :placeholder="$t('importPrivKey.form.cleartext.confirmPwd.placeholder')">
          </div>
        </div>
        <Button @click='handleRecoverAccount' long class="btn-main import-priv-str-btn" :loading="loading" style="margin-top:10px;width:440px;">
            <span v-if="!loading">{{$t('importPrivKey.button.importPrivKey')}}</span>
            <span v-else>{{$t('importPrivKey.button.importPrivKeyLoading')}}...</span>
        </Button>
        <ul class="link-opts">
          <li><a href="#/">{{$t('common.feature.loginWallet')}}</a></li>
          <li><a href="#/account/create">{{$t('common.feature.createWallet')}}</a></li>
        </ul>
      </div>
    </div>
    <p class="copyright">{{$t('common.copyright')}} V{{walletVersion}}</p>
    <language-select></language-select>
    <logo></logo>
    </div>
  </section>
</template>
<script>
import accountService from '../../controllers/accountService'
import walletCfg from '../../../config'
import errorUtil from '../../constants'
import Titlebtn from '../../components/Titlebtn.vue'
import LanguageSelect from '../../components/languageSelect.vue'
import Logo from '../../components/logo.vue'
export default {
  components: {
    Titlebtn,
    LanguageSelect,
    Logo
  },
  computed: {
    isChina () {
      return this.$i18n.locale === 'cn' 
    }
  },
  data () {
    return {
      submitRecoverAccountBtnStyle: 'btn-disabled',
      submitRecoverAccountBtn: this.$t('importPrivKey.button.importPrivKey'),
      recoverAccountFrm: {
        accountPrivKeyStr: '',
        accountPwd: '',
        rePassword: '',
        accountNick: ''
      },
      loading: false,
      walletVersion: walletCfg.version
    }
  },
  methods: {
    handleRecoverAccount () {
      var that = this
      var frmParams = that.recoverAccountFrm
      if (that.inputBlur()) {
        that.loading = true
        accountService.recoverAccountByPrviateKeyStr(frmParams).then(respData => {
          if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
            that.$Message.error({
              content: that.$t(respData.msg),
              duration: 3
            })
            that.loading = false
          } else {
            that.$Message.success(that.$t('msg.succ.privKeyImport'))
            setTimeout(() => {
              that.$router.push({
                name: 'login'
              })
            }, 2000)
          }
        }).catch(data => {
          console.log('err data:', data)
        })
      }
    },
    go2RecoverAccountByPrviateKeyFile () {
      this.$router.push({
        name: 'accountRecoverByPrivateKeyFile'
      })
    },
    inputBlur () {
      var that = this
      var frmParams = that.recoverAccountFrm
      var walletNick = frmParams.accountNick
      var walletPwd = frmParams.accountPwd
      var walletAccountPrivateKeyStr = frmParams.accountPrivKeyStr
      if (walletAccountPrivateKeyStr === '') {
        that.$Message.warning({
          content: that.$t('msg.warning.clearTextEmpty'),
          duration: 3
        })
        return false
      }
      if (walletNick === '') {
        that.$Message.warning({
          content: that.$t('msg.warning.walletNameEmpty'),
          duration: 3
        })
        return false
      }

      const walletNickReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]{1,20}$/
      if (!walletNickReg.test(walletNick)) {
        that.$Message.warning({
          content: that.$t('msg.warning.walletNameLimit'),
          duration: 3
        })
        return false
      }

      if (walletPwd === '') {
        that.$Message.warning({
          content: that.$t('msg.warning.walletPwdEmpty'),
          duration: 3
        })
        return false
      }

       const walletPwdReg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![~!@#$%^&*()_+{}|:"<>?/*-.`\[';,/\]]+$)[~!@#$%^&*()_+{}|:"<>?/*-.`\[';,/\]0-9A-Za-z]{8,20}$/
      if (!walletPwdReg.test(walletPwd)) {
        that.$Message.warning({
          content: that.$t('msg.warning.pwdLimit'),
          duration: 3
        })
        return false
      }

      if (frmParams.rePassword === '') {
        that.$Message.warning({
          content: that.$t('msg.warning.confirmPwdEmpty'),
          duration: 3
        })
        return false
      }

      if (walletPwd !== frmParams.rePassword) {
        that.$Message.warning({
          content: that.$t('msg.warning.differentPwdInput'),
          duration: 3
        })
        return false
      }
      return true
    }
  }
}
</script>
<style scoped>
.frm-header-wraper {position: relative;padding: 10px 0;}
.frm-header-wraper .frm-img{position: absolute;right: -17px;top:0px;background:url('../../assets/img/choose-file.png') no-repeat right;width: 179px;height: 50px;}
.import-private-key-str .box-title-txt {text-align: center;color: #fff;}
.import-private-key-str .frm-img .frm-img-text {position: relative;width: 120px;min-height: 20px;border: 1px solid #00D080;border-radius: 2px;font-size: 12px;color: #00D080;line-height: 20px;text-align: center;background: #E8FFF5;}
.import-private-key-str .frm-img .frm-img-text .arrow-right {position: absolute;top: 6px;right: -6px;height: 0px;width: 0px;border-top: 3px solid transparent;border-left: 5px solid #00D080;border-bottom: 4px solid transparent;}
.import-private-key-str .frm-img .frm-img-text .arrow-right:after {content: '';position: absolute;top: -3px;right: 1px;border-top: 3px solid transparent;border-left: 5px solid #E8FFF5;border-bottom: 4px solid transparent;}
.frm .frm-group label{color: #666;font-weight: 700}
.frm-img-hack {position: absolute; top: 21px; right: 11px; width: 152px; height: 28px;}
.frm-img-hack::before{content: ''; position: absolute; right: -13px; top: 16px; width: 13px; height: 12px;}
.frm-img-hack::after{content: ''; position: absolute; right: -11px; top: 8px; width: 11px; height: 8px;}
.frm-img-hack-right{position: absolute; top: 37px; right: -5px; width: 4px; height: 12px;}
.frm-img-hack-right::before{content: ''; position: absolute; right: -10px; top: 8px; width: 10px; height: 4px;}
.frm-img-hack-right::after{content: ''; position: absolute; right: -10px; top: 8px; width: 10px; height: 4px;}
.frm-header-wraper {margin-bottom: 10px;}
.import-priv-str-frm .frm-group{height: 51px;}
.box-body .import-priv-str-btn {margin: 12px auto 16px !important; background: #fff;color: #00d080;}
</style>
