<template>
  <section>
    <div class="page-content">
      <div class="token-tab">
        <div v-for="(item, index) in tokenList" class="token-tab-item" 
             :class="currentTab === item.assetCode  && currentTokenAddress === item.issuerAddress ? 'token-tab-item-active' : ''"
             @click="handleTabClick(item.assetCode, item.issuerAddress)">
             <img v-if="item.icon" class="token-tab-img" :src="item.icon" />
             <img v-else class="token-tab-img" src="../../assets/img/token-icon-repeat.png" />
             <div>{{item.assetCode}}</div>
             <div class="net-icon"
                  :class="currentTab === item.assetCode && currentTokenAddress === item.issuerAddress ? 'net-icon-active' : ''"></div>
        </div>
      </div>
      <div class="token-tab-content">
        <token-content :currentToken="currentTab" :currentTokenAddress="currentTokenAddress"></token-content>
      </div>
    </div>
  </section>
</template>
<script>
import accountService from '../../controllers/accountService'
import errorUtil from '../../constants'
import tokenContent from './content.vue'
export default {
  components: {
    tokenContent
  },
  data () {
    return {
      currentTab: '',
      currentTokenAddress: '',
      tokenList: []
    }
  },
  computed: {
    loginAccount () {
      return this.$store.state.recentLoginWalletAccount
    }
  },
  mounted () {
    console.log(this.$route)
    this.getTokenList()
  },
  methods: {
    handleTabClick (token, addr) {
      this.currentTab = token
      this.currentTokenAddress = addr
    },
    getTokenList () {
      var that = this
      var reqData = {
        address: that.loginAccount.address
      }
      accountService.getTokenList(reqData).then((respData) => {
        if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
          return
        }
        that.tokenList = respData.data.tokens
        if (!that.$route.query.tokenType) {
          that.currentTab = respData.data.tokens[0].assetCode
          that.currentTokenAddress = respData.data.tokens[0].issuerAddress
        } else {
          that.currentTab = that.$route.query.tokenType.split('-')[0]
          that.currentTokenAddress = that.$route.query.tokenType.split('-')[1]
        }
      })
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
  .token-tab {
    overflow-x: hidden;
    overflow-y: auto;
    width: 150px;
    height: 500px;
    position: absolute;
    left: 0;
    top: 0;
    padding-left: 10px;
    padding-top: 20px;
    background: #F4FFFB;
  }
  .token-tab .token-tab-item {
    position: relative;
    width: 140px;
    min-height: 36px;
    line-height: 21px;
    font-size: 14px;
    padding: 7px 0 7px 45px;
    margin-bottom: 10px;
    text-align: left;
    cursor: pointer;
    color: #777;
    border: 1px solid #F4FFFB;
    border-right: 0;
  }
  .token-tab-img{
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
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
  .token-tab .token-tab-item  .token-tab-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    margin-right: 4px;
    color: #666;
  }
  .token-tab .token-tab-item .tab-icon-active {
    color: #00D080;
  }
  .token-tab .token-tab-item-active {
    background: #fff;
    color: #00D080;
    border: 1px solid #F8F8F8;
    border-right: 0;
  }
  .token-tab-content {
    min-width: 1000px;
    padding-left: 150px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .token-tab-content::-webkit-scrollbar {
    width: 4px;     
    height: 4px;
  }
  .token-tab-content::-webkit-scrollbar-thumb {
    border-radius: 2px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .token-tab-content::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
  .token-tab::-webkit-scrollbar {
    width: 0px;     
    height: 0px;
  }
  .token-tab::-webkit-scrollbar-thumb {
    border-radius: 2px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0);
    background: rgba(0,0,0,0);
  }
  .token-tab::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0);
    border-radius: 0;
    background: rgba(0,0,0,0);
  }
    
</style>
