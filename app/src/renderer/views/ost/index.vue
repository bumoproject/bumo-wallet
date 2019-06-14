<template>
  <section>
    <div class="page-content">
      <div class="ost-tab">
        <div class="ost-tab-item" 
             :class="currentTab === 'buildTx' ? 'ost-tab-item-active' : ''"
             @click="handleTabClick('buildTx')">
             <i class="iconfont ost-tab-icon"
                :class="currentTab === 'buildTx' ? 'tab-icon-active' : ''">&#xe671;</i>
             <div class="ost-tab-item-text">{{$t('ost.buildTx.title')}}</div>
             <div class="net-icon"
                  :class="currentTab === 'buildTx' ? 'net-icon-active' : ''"></div>
        </div>
        <div class="ost-tab-item"
             :class="currentTab === 'outlineSign' ? 'ost-tab-item-active' : ''"
             @click="handleTabClick('outlineSign')">
             <i class="iconfont ost-tab-icon"
                :class="currentTab === 'outlineSign' ? 'tab-icon-active' : ''">&#xe663;</i>
             <div class="ost-tab-item-text">{{$t('ost.outlineSign.title')}}</div>
             <div class="net-icon"
                  :class="currentTab === 'outlineSign' ? 'net-icon-active' : ''"></div>
        </div>
        <div class="ost-tab-item"
             :class="currentTab === 'submitTx' ? 'ost-tab-item-active' : ''"
             @click="handleTabClick('submitTx')">
             <i class="iconfont ost-tab-icon"
                :class="currentTab === 'submitTx' ? 'tab-icon-active' : ''">&#xe661;</i>
             <div class="ost-tab-item-text">{{$t('ost.submitTx.title')}}</div>
             <div class="net-icon"
                  :class="currentTab === 'submitTx' ? 'net-icon-active' : ''"></div>
        </div>
      </div>
      <div class="ost-tab-content">
        <component :is="currentTab" 
                  :isBuildTx="isBuildTx"
                  :txDetail="txDetail"
                  :txBlobRemb="txBlob"
                  :signedTxStr="signedTxStr"
                  :unsubmittedBlob="unsubmittedBlob"
                  :isSubmit="isSubmit"
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
  import BuildTx from './buildTx'
  import OutlineSign from './outlineSign'
  import SubmitTx from './submitTx'
  import BottomBarComp from './bottomBarComp'
  export default {
    name: 'ost',
    data () {
      return {
        buildTx: true,
        outlineSign: false,
        submitTx: false,
        currentTab: 'buildTx',
        isBuildTx: true,
        isSubmit: false,
        txBlob: '', // 待签名的交易串
        unsubmittedBlob: '', // 待提交的交易串
        signedTxStr: '', // 签过名的交易串
        txDetail: {}
      }
    },
    components: {
      BuildTx,
      OutlineSign,
      SubmitTx,
      BottomBarComp
    },
    methods: {
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
      handleTxSucc () {
        this.isSubmit = true
      },
      handleSubmitTxClear () {
        this.unsubmittedBlob = ''
        this.isSubmit = false
      }
    }
  }
</script>

<style scoped>
  .page-content {
    position: relative;
    left: 0;
    top: 0;
    display: flex;
    width: 100%;
    height: 500px;
    padding: 0;
  }
  .page-content .ost-tab {
    width: 150px;
    height: 500px;
    /* position: absolute;
    left: 0;
    top: 0; */
    padding-left: 10px;
    padding-top: 20px;
    background: #F4FFFB;
  }
  .ost-tab .ost-tab-item {
    position: relative;
    width: 140px;
    min-height: 36px;
    line-height: 1.5;
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
  .ost-tab .ost-tab-item .ost-tab-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    margin-right: 4px;
    color: #666;
  }
  .ost-tab .ost-tab-item .ost-tab-item-text {}
  .ost-tab .ost-tab-item .tab-icon-active {
    color: #00D080;
  }
  .ost-tab .ost-tab-item-active {
    background: #fff;
    color: #00D080;
    border: 1px solid #F8F8F8;
    border-right: 0;
  }
  .ost-tab-content {
    /* position: absolute;
    top: 0;
    left: 150px; */
    width: 850px;
    height: 420px;
    overflow: auto
  }
  .ost-tab-content::-webkit-scrollbar {
    width: 4px;     
    height: 4px;
  }
  .ost-tab-content::-webkit-scrollbar-thumb {
    border-radius: 2px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .ost-tab-content::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
</style>
