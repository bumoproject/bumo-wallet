<template>
  <section>
    <template>
      <div class="frameTitle">
        <Titlebtn type="min" class="iconfont icon-jianhao"/>
        <Titlebtn type="close" class="iconfont icon-guanbi"/>
      </div>
    </template>
    <div class="page wallet-bg">
      <language-select></language-select>
      <p class="copyright">{{$t('common.copyright')}}</p>
    </div>
    <Modal class="create-succ" v-model="successOfCreateAccountModal" :mask-closable="false" :closable="false" width="480">
        <div class="bm-alert">
          <div class="bm-alert-status-icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-chuangjianchenggong"></use>
            </svg>
          </div>
          <h3>{{$t('createSucc.title')}}</h3>
          <p class="create-succ-notice">{{$t('createSucc.notice')}}</p>
          <div class="warning-msg">
            {{$t('createSucc.friendlyReminder.title')}}：
            {{$t('createSucc.friendlyReminder.warningContent')}}
          </div>
        </div>
        <div slot="footer">
            <Button long class="btn-main" @click="go2AccountBackupsPage">{{$t('createSucc.button.backupPrivKey')}}</Button>
        </div>
    </Modal>
  </section>
</template>
<script>
import Titlebtn from '../../components/Titlebtn.vue'
import LanguageSelect from '../../components/languageSelect.vue'
const shell = require('electron').shell
import tools from '../../utils/tools'
export default {
  components: {
    Titlebtn,
    LanguageSelect
  },
  data () {
    return {
      successOfCreateAccountModal: true,
      storeFilePath: tools.getAppPath() + ((process.platform === 'darwin') ? '/wallets/' + this.$store.state.recentLoginWalletAccount.nick + '.wallet' : '\\wallets\\' + this.$store.state.recentLoginWalletAccount.nick + '.wallet')
    }
  },
  methods: {
    go2AccountBackupsPage () {
      this.$router.push({
        name: 'accountBackups'
      })
    },
    show () {
      shell.showItemInFolder(this.storeFilePath)
    }
  }
}
</script>
<style scoped>
/* .box{width: 320px;margin: 0 auto;}
.box .warn-msg{margin-top: 15px;margin-bottom: 5px;padding: 15px;background-color: #FDEFCE;font-size: 12px;color: #CC0033;border-radius: 5px;}
.page .link{margin-top: 30px;position:absolute;left:20px;bottom:40px;}
.page .link ul li{list-style:none;}
.page .link ul li a{color: #fff;line-height: 30px;font-size:14px;font-weight:400;} */
.bm-alert .bm-alert-status-icon, .bm-alert h3{text-align: center;}
.bm-alert h3{font-size: 16px;}
.bm-alert p{padding: 3px 0 6px 0;}
.bm-alert-status-icon{text-align: center}
.bm-alert-status-icon svg{width: 76px;height: 92px;}
.create-succ-notice {text-align: center; color: #666;}
.warning-msg{width: 420px;min-height: 18px;word-wrap: wrap;line-height: 1.5; background-color: #F8F8F8;padding: 4px 6px;color: #FF3030;text-align: center;}
</style>
