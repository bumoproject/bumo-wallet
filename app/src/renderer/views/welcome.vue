<template>
  <section>
    <template>
      <div class="frameTitle">
        <Titlebtn type="min" class="iconfont icon-jianhao"/>
        <Titlebtn type="close" class="iconfont icon-guanbi"/>
      </div>
    </template>
    <div class="page wallet-bg">
        <div class="box welcome-box">
            <div class="box-title-img wallet-title-text" :class="{'init-wallet-title': isChina}">{{$t('welcome.title')}}</div>
            <div class="box-body" style="padding-top:10px;">
                <Button long class="btn-main welcome-create-wallet" @click="go2CreateAccountPage">{{$t('welcome.button.createWallet')}}</Button>
                <br/>
                <Button long class="btn-main welcome-import-priv-key" @click="go2RecoverPrivKeyPage">{{$t('welcome.button.importPrivKey')}}</Button>
            </div>
        </div> 
        <p class="copyright">{{$t('common.copyright')}} V{{walletVersion}}</p>  
        <language-select></language-select>
        <logo></logo>
    </div>
  </section>
</template>
<script>
import walletCfg from '../../config'
import Titlebtn from '../components/Titlebtn.vue'
import LanguageSelect from '../components/languageSelect.vue'
import Logo from '../components/logo.vue'
export default {
  components: {
    Titlebtn,
    LanguageSelect,
    Logo
  },
  data () {
    return {
      isChina: true,
      walletVersion: walletCfg.version
    }
  },
  methods: {
    go2CreateAccountPage () {
      this.$router.push({
        name: 'accountCreate'
      })
    },
    go2RecoverPrivKeyPage () {
      this.$router.push({
        name: 'accountRecoverByPrivateKeyStr'
      })
    }
  }
}
</script>
<style scoped>
.wallet-bg  {
  position: relative;
}
.welcome-box {
  position: relative;
  top: 0;
  left: 0;
  transform: translate(0);
  width: 542px;
  height: 164px;
  padding-top: 177px;
  padding-left: 229px;
}
.wallet-bg .welcome-box .box-body {
  width: 542px;
  padding: 0;
}
.box .box-body .btn-main {
  margin: 0;
}
.welcome-box .wallet-title-text {
  width: 542px;
  height:72px;
  padding-top: 32px;
  font-size: 24px;
  line-height: 36px;
  margin-bottom: 6px;
}
.wallet-bg .welcome-box .box-body .welcome-create-wallet {
  margin: 3px auto 3px;
}
.wallet-bg .welcome-box .box-body .welcome-import-priv-key {
  margin: 0 auto;
}
.welcome-create-wallet {
  margin-bottom: 3px;
}
.welcome-box .box-body .ivu-btn:last-child{margin-top: 0;}
</style>

