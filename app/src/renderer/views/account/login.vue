<template>
  <section class="login-wrap account-login">
    <template>
      <div class="frameTitle">
        <Titlebtn type="min" class="iconfont icon-jianhao"/>
        <Titlebtn type="close" class="iconfont icon-guanbi"/>
      </div>
    </template>
    <div class="page wallet-bg">
      <div class="box frm-box">
        <div class="box-title-img wallet-title-text" :class="{'login-wallet-title': isChina}">{{$t('login.title')}}</div>
        <div class="box-body">
          <div class="frm">
            <div class="frm-group account-avatar-box">
              <label>{{$t('login.form.chooseWallet.label')}}</label>
              <!-- <img class="default-account-login-avatar" src="../../assets/img/default-account-login-avatar.png"/> -->
              <Select class="login-name" v-model="loginFrm.name" @on-change="handleWalletNameChange"  :placeholder="$t('login.form.chooseWallet.placeholder')">
                  <Option v-for="(item,index) in walletNames" :value="item" :key="index">{{ item }}</Option>
              </Select>
            </div>
            <div class="frm-group login-pwd-wraper">
              <label>{{$t('login.form.password.label')}}</label>
              <input v-model="loginFrm.password" class="form-control" type="password" :placeholder="$t('login.form.password.placeholder')">
            </div>
          </div>
          <Button @click="loginWallet" long class="btn-main login-btn" :loading="loading" style="margin-top:10px;width:343px;">
              <span v-if="!loading">{{$t('login.button.login')}}</span>
              <span v-else>{{$t('login.button.loginLoading')}}...</span>
          </Button>
          <ul class="link-opts">
            <li><a href="#/account/create">{{$t('common.feature.createWallet')}}</a></li>
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
import baseService from '../../controllers/baseService'
import walletCfg from '../../../config'
import errorUtil from '../../constants'
import Titlebtn from '../../components/Titlebtn.vue'
import LanguageSelect from '../../components/languageSelect.vue'
import Logo from '../../components/logo.vue'
export default {
  name: 'login',
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
      loginFrm: {
        password: '',
        name: ''
      },
      walletVersion: walletCfg.version,
      loading: false,
      walletNames: []
    }
  },
  methods: {
    loginWallet () {
      var that = this
      var loginParams = this.loginFrm
      if (that.inputBlur()) {
        that.loading = true
        accountService.login(loginParams).then(respData => {
          if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
            that.$Message.error(that.$t('error.pwd.wrong'))
            that.loading = false
          }
          var recentLoginWalletAccount = {
            address: respData.data.address,
            nick: respData.data.nick
          }
          that.$store.commit('RECENT_LOGIN_WALLET_ACCOUNT', recentLoginWalletAccount)
          location.href = '#/index'
          that.$store.commit('ACTIVE_HEADER_NAV', 'index')
        }).catch(data => {
          console.log('err data:', data)
        })
      }
    },
    inputBlur () {
      var that = this
      var frmParams = that.loginFrm
      var walletName = frmParams.name
      var walletPwd = frmParams.password
      if (walletName === '') {
        that.$Message.error(that.$t('error.walletName.empty'))
        return false
      }
      if (walletPwd === '') {
        that.$Message.error(that.$t('error.pwd.empty'))
        return false
      }
      return true
    },
    handleWalletNameChange () {
      this.loginFrm.password = ''
    }
  },
  // created () {
  //   instance = this
  // },
  mounted () {
    accountService.loadWalletName().then(respData => {
      if (respData.errCode === 14 || respData.data.length === 0) {
        this.$router.push({
          name: 'welcome'
        })
      }
      this.walletNames = respData.data
    })
  }
}
</script>
<style scoped>
.page .frm-box {height: 278px;}
.account-avatar-box{height: 47px;line-height: 47px;padding-top: 2px;position: relative;}
.account-avatar-box .default-account-login-avatar{width: 36px;height: 36px;position: absolute;top: 10px;left: -3px;}
.icon-wenhao{color: #fff;padding-left: 5px;opacity: 0.5;}
.login-name {height: 40px;line-height: 40px;text-align: left;width: 245px;}
.login-pwd-wraper {height: 47px;padding-top: 2px;line-height: 47px;padding-right:20px;}
/* .login-pwd-wraper label{width: 56px;min-width:inherit;} */
/* .login-pwd-wraper input{padding-left: 35px;} */
.box-body .login-btn {margin: 12px auto 16px !important; background: #fff;color: #00d080;}
/* {height: 40px;line-height: 40px;text-align: left;width: 280x;margin-left: 30px;} */
.ivu-select-single .ivu-select-selection .ivu-select-selected-value{height: 40px;line-height: 40px;}
.ivu-select-single .ivu-select-selection .ivu-select-placeholder{font-size: 14px;}
.ivu-select-single .ivu-select-selection{border: none;}
.ivu-select-single .ivu-select-selection .ivu-select-placeholder{font-size: 13.5px;}
.ivu-select-item{text-align: left}
.link-opts li a {color: rgba(255, 255, 255, 0.7);}
</style>
