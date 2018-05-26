<template>
  <section>
    <template>
      <div class="frameTitle">
        <Titlebtn type="min" class="iconfont icon-jianhao"/>
        <Titlebtn type="close" class="iconfont icon-guanbi"/>
      </div>
    </template>
    <div class="page wallet-bg create-wallet">
      <div class="box frm-box">
          <div class="box-title-img wallet-title-text" :class="{'create-wallet-title': isChina}">{{$t('create.title')}}</div>
          <div class="box-title-txt">{{$t('create.friendlyReminder')}}</div>
          <div class="box-body">
              <div class="frm">
                <div class="frm-group">
                  <label>{{$t('create.form.walletName.label')}}</label>
                  <input v-model="createFrm.name" class="form-control" type="text" :placeholder="$t('create.form.walletName.placeholder')">
                </div>
                <div class="frm-group" :class="{'create-en-pwd-ipt': !isChina}">
                  <label>{{$t('create.form.password.label')}}</label>
                  <input v-model="createFrm.password" class="form-control" type="password" :placeholder="$t('create.form.password.placeholder')">
                </div>
                <div class="frm-group">
                  <label>{{$t('create.form.confirmPassword.label')}}</label>
                  <input v-model="createFrm.rePassword" class="form-control" type="password" :placeholder="$t('create.form.confirmPassword.placeholder')">
                </div>
              </div>
              <Button @click='createWallet' class="btn-main create-btn" :loading="loading" style="margin-top:10px;width:390px;">
                  <span v-if="!loading">{{$t('create.button.createWallet')}}</span>
                  <span v-else>{{$t('create.button.createWalletLoading')}}...</span>
              </Button>
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
      submitCreateWalletBtnStyle: 'btn-disabled',
      createFrm: {
        password: '',
        name: '',
        rePassword: ''
      },
      loading: false,
      walletVersion: walletCfg.version
    }
  },
  methods: {
    createWallet () {
      var that = this
      var frmParams = that.createFrm
      var flag = that.inputBlur()
      if (flag) {
        accountService.create(frmParams).then(respData => {
          if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
            that.$Message.error({
              content: this.$t(respData.msg),
              duration: 3
            })
            that.loading = false
            console.log(respData.msg)
            return
          }
          var recentWalletAccount = {
            nick: that.createFrm.name
          }
          that.$store.commit('RECENT_LOGIN_WALLET_ACCOUNT', recentWalletAccount)
          that.$router.push({
            name: 'accountCreateSuccess'
          })
        }).catch(data => {
          console.log('err data:', data)
        })
      }
    },
    inputBlur () {
      var that = this
      var frmParams = that.createFrm
      var walletNick = frmParams.name
      var walletPwd = frmParams.password
      if (walletNick === '') {
        that.$Message.warning({
          content: that.$t('error.walletName.createEmpty'),
          duration: 3
        })
        return false
      }
      const walletNickReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]{1,20}$/
      if (!walletNickReg.test(walletNick)) {
        that.$Message.warning({
          content: that.$t('error.walletName.limit'),
          duration: 3
        })
        return false
      }

      if (walletPwd === '') {
        that.$Message.warning({
          content: that.$t('error.pwd.createEmpty'),
          duration: 3
        })
        return false
      }

      const walletPwdReg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![~!@#$%^&*()_+{}|:"<>?/*-.`\[';,/\]]+$)[~!@#$%^&*()_+{}|:"<>?/*-.`\[';,/\]0-9A-Za-z]{8,20}$/
      if (!walletPwdReg.test(walletPwd)) {
        that.$Message.warning({
          content: that.$t('error.pwd.limit'),
          duration: 3
        })
        return false
      }

      if (frmParams.rePassword === '') {
        that.$Message.warning({
          content: that.$t('error.pwd.confirmPwdEmpty'),
          duration: 3
        })
        return false
      }

      if (walletPwd !== frmParams.rePassword) {
        that.$Message.warning({
          content: that.$t('error.pwd.differentPwdInput'),
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
.icon-wenhao{color: #fff;padding-left: 5px;opacity: 0.5;}
.create-wallet .box-title-txt {text-align: center;color: #fff;}
.box-body .create-btn {margin: 12px auto 16px !important; background: #fff;color: #00d080;}
.create-wallet .create-en-pwd-ipt input {padding-left: 0;}
</style>
