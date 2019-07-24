<template>
  <section>
    <div class="page-content">
      <div class="unite-tab">
        <div class="unite-tab-item" 
             :class="currentTab === 'listUniteAccountComponet' ? 'unite-tab-item-active' : ''"
             @click="handleTabClick('listUniteAccountComponet')">
             <i class="iconfont unite-tab-icon"
                :class="currentTab === 'listUniteAccountComponet' ? 'tab-icon-active' : ''">&#xe673;</i><div>{{$t('unite.listUniteAccount.title')}}</div>
             <div class="net-icon"
                  :class="currentTab === 'listUniteAccountComponet' ? 'net-icon-active' : ''"></div>
        </div>
        <div class="unite-tab-item"
             :class="currentTab === 'buildTxComponet' ? 'unite-tab-item-active' : ''"
             @click="handleTabClick('buildTxComponet')">
             <i class="iconfont unite-tab-icon"
                :class="currentTab === 'buildTxComponet' ? 'tab-icon-active' : ''">&#xe671;</i>
                <div>{{$t('unite.buildTx.title')}}</div>
             <div class="net-icon"
                  :class="currentTab === 'buildTxComponet' ? 'net-icon-active' : ''"></div>
        </div>
        <div class="unite-tab-item"
             :class="currentTab === 'signTxComponet' ? 'unite-tab-item-active' : ''"
             @click="handleTabClick('signTxComponet')">
             <i class="iconfont unite-tab-icon"
                :class="currentTab === 'signTxComponet' ? 'tab-icon-active' : ''">&#xe663;</i><div>{{$t('unite.outlineSign.title')}}</div>
             <div class="net-icon"
                  :class="currentTab === 'signTxComponet' ? 'net-icon-active' : ''"></div>
        </div>
        <div class="unite-tab-item"
             :class="currentTab === 'submitTxComponet' ? 'unite-tab-item-active' : ''"
             @click="handleTabClick('submitTxComponet')">
             <i class="iconfont unite-tab-icon"
                :class="currentTab === 'submitTxComponet' ? 'tab-icon-active' : ''">&#xe661;</i><div>{{$t('unite.submitTx.title')}}</div>
             <div class="net-icon"
                  :class="currentTab === 'submitTxComponet' ? 'net-icon-active' : ''"></div>
        </div>
      </div>
      <div class="unite-tab-content">
        <component :is="currentTab" 
                  :isBuildTx="isBuildTx"
                  :txDetail="txDetail"
                  :txBlobRemb="txBlob"
                  :signedTxStr="signedTxStr"
                  :unsubmittedBlob="unsubmittedBlob"
                  :isSubmit="isSubmit"
                  :creatSuccess="creatSuccess"
                  @setSucPage="setSucPage"
                  @buildTxSucc="handleTxBuild"
                  @clearTxStr="handleClearTxStr"
                  @parseSucc="handleParseSucc"
                  @clearOutlineSign="handleClearOutlineSign"
                  @signSucc="handleSignSucc"
                  @blobParseSucc="handleBlobParseSucc"
                  @clearSubmitTx="handleSubmitTxClear"
                  @txSucc="handleTxSucc">
        </component>
      </div>
      <bottom-bar-comp :currentTab="currentTab"></bottom-bar-comp>
    </div>
  </section>
</template>
<script>
import listUniteAccountComponet from './listUniteAccount.vue'
import buildTxComponet from './buildTx.vue'
import signTxComponet from './outlineSign.vue'
import submitTxComponet from './submitTx.vue'
import BottomBarComp from './bottomBarComp'
export default {
  components: {
    listUniteAccountComponet,
    buildTxComponet,
    signTxComponet,
    submitTxComponet,
    BottomBarComp
  },
  data () {
    return {
      currentTab: 'listUniteAccountComponet',
      buildTx: true,
      outlineSign: false,
      submitTx: false,
      isBuildTx: true,
      isSubmit: false,
      txBlob: '', // 待签名的交易串
      unsubmittedBlob: '', // 待提交的交易串
      signedTxStr: '', // 签过名的交易串
      txDetail: {},
      creatSuccess: { // 联名账户创建成功页面
        show: false,
        addr: ''
      }
    }
  },
  mounted () {
    console.log(this.$route)
  },
  methods: {
    setSucPage (obj) {
      this.creatSuccess = obj
    },
    handleTabClick (tabStr) {
      this.currentTab = tabStr
    },
    handleTxBuild (e) {
      this.isBuildTx = false
      this.txDetail = {...e}
    },
    handleClearTxStr () {
      this.isBuildTx = true
    },
    handleParseSucc (e) {
      this.txBlob = e
    },
    handleClearOutlineSign () {
      this.txBlob = ''
      this.signedTxStr = ''
    },
    handleSignSucc (e) {
      this.signedTxStr = e
    },
    handleBlobParseSucc (e) {
      this.unsubmittedBlob = e
    },
    handleSubmitTxClear () {
      this.unsubmittedBlob = ''
      this.isSubmit = false
    },
    handleTxSucc () {
      this.isSubmit = true
    }
  }
}
</script>
<style scoped lang="less">
  .page-content {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 500px;
    padding-top:0;
  }
  .unite-tab {
    width: 150px;
    height: 500px;
    position: absolute;
    left: 0;
    top: 0;
    padding-left: 10px;
    padding-top: 20px;
    background: #F4FFFB;
  }
  .unite-tab .unite-tab-item {
    position: relative;
    width: 140px;
    min-height: 36px;
    line-height: 21px;
    font-size: 14px;
    padding: 7px 0 7px 40px;
    margin-bottom: 10px;
    text-align: left;
    cursor: pointer;
    color: #777;
    border: 1px solid #F4FFFB;
    border-right: 0;
  }
  .net-icon {
    width: 17px;
    height: 17px;
    position: absolute;
    left: 0;
    top: 0;
  }
  .net-icon-active {
    background: url(../../assets/img/net-icon.png) 100% 100% no-repeat;
  }
  .net-icon-online {
    background: url(../../assets/img/ost-net-icon-online.png) 100% 100% no-repeat;
  }
  .net-icon-outline {
    background: url(../../assets/img/ost-net-icon-outline.png) 100% 100% no-repeat;
  }
  .unite-tab .unite-tab-item  .unite-tab-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    margin-right: 4px;
    color: #666;
  }
  .unite-tab .unite-tab-item .tab-icon-active {
    color: #00D080;
  }
  .unite-tab .unite-tab-item-active {
    background: #fff;
    color: #00D080;
    border: 1px solid #F8F8F8;
    border-right: 0;
  }
  .unite-tab-content {
    min-width: 1000px;
    padding-left: 150px;
    height: 420px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .unite-tab-content::-webkit-scrollbar {
    width: 4px;     
    height: 4px;
  }
  .unite-tab-content::-webkit-scrollbar-thumb {
    border-radius: 2px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .unite-tab-content::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
    
</style>
