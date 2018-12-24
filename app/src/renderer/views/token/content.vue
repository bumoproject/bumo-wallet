<template>
  <div class="page-content token-cont">
    <div id="pageLoading" v-if="loading">
      <div class="spinner">
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
      </div>
    </div>
    <div class="container">
      <div class="asset-panel">
        <p>{{$t('token.content.overallBalance.title')}}<span class="index-account-address-title">{{$t('token.content.overallBalance.accountAddress')}}</span></p>
        <b class="banlace">
          <div style="min-height: 32px;" v-if="!blockStatus">
            <span v-if="!loadingBalance">
              <span>{{asset.intPart | commafy}}</span>
              <span :class="{'balance-point-part': asset.intPart !== '0'}">{{asset.pointPart ? '.' + asset.pointPart: ''}}</span>
              <span> {{currentToken}}</span>
            </span>
            <span v-else class="loading-balance">
              <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
              <span class="loading-balance-words">{{$t('token.content.overallBalance.loadingBalance')}}</span>
            </span>
          </div>
          <div v-else class="no-get-banlace">{{$t('token.content.overallBalance.unsyncBlock')}}</div>
          <div class="index-account-address">
            <span>{{loginAccount.address}}</span><div class="copy-btn" @click="handleCopyBtnClick">{{$t('token.content.overallBalance.copyBtn')}}</div>
          </div>
        </b>
      </div>
      <div class="recent-txs">
        <div class="txs-header-box">
          <label>{{$t('token.content.latestLocalTxRecord.title')}}</label>
          <Tooltip placement="right-start" class="recent-local-txs-explain">
            <i class="iconfont icon-wenhao"></i>
            <div slot="content"><p v-html="$t('token.content.latestLocalTxRecord.explain')"></p></div>
          </Tooltip>
          <a href="javascript:;" @click="goSend()" class="send-token-btn">{{$t('token.content.latestLocalTxRecord.sendToken')}}</a>
        </div>
        <div class="no-data" v-if="txs.length === 0">
          <p class="no-data-text">{{$t('token.content.latestLocalTxRecord.noData')}}</p>
        </div>
        <div v-else class="table-box">
          <dl class="table-header">
            <dt class="status">{{$t('token.content.latestLocalTxRecord.tableHeader.status')}}</dt>
            <dt class="time">{{$t('token.content.latestLocalTxRecord.tableHeader.time')}}</dt>
            <dt class="address">{{$t('token.content.latestLocalTxRecord.tableHeader.srcAddr')}}</dt>
            <dt class="address">{{$t('token.content.latestLocalTxRecord.tableHeader.destAddr')}}</dt>
            <dt class="amount">{{$t('token.content.latestLocalTxRecord.tableHeader.num')}}</dt>
          </dl>
          <div>
            <div class="table-body-box">
              <dl class="table-body clearfix" v-for="(item, index) in txs" :key="index" @click="showTxDetailDialog(item)">
                <dd class="status tx-status-success index-content-tx-list">
                  <p class="tx-status" v-if="item.status.code === 0">
                    <Tooltip :popper-class="'tx-status-tooltip'" :content="item.errMsg" :placement="index === 0 ? 'bottom-start' : 'top-start'"><i class="iconfont icon-chenggong1"></i></Tooltip>
                  </p>
                  <p class="tx-status" v-else-if="item.status.code === -1">
                    <Tooltip :popper-class="'tx-status-tooltip'" :content="item.errMsg" :placement="index === 0 ? 'bottom-start' : 'top-start'"><i class="iconfont icon-jinhangzhong"></i></Tooltip>
                  </p>
                  <p class="tx-status" v-else>
                    <Tooltip :popper-class="'tx-status-tooltip'" :content="item.errMsg" :placement="index === 0 ? 'bottom-start' : 'top-start'"><i class="iconfont icon-shibai1"></i></Tooltip>
                  </p>
                </dd>
                <dd class="time">{{item.time | fmtDate}}</dd>
                <dd v-if="item.srcAddress" class="address" :class="{'address-mark': (item.isIn === 0)}">{{item.srcAddress | fmtWalletAccountAddress}}</dd>
                <dd v-else class="address">--</dd>
                <dd v-if="item.destAddress" class="address" :class="{'address-mark': (item.isIn === 1)}">{{item.destAddress | fmtWalletAccountAddress}}</dd>
                <dd v-else class="address">--</dd>
                <dd v-if="item.amount" :class="['amount',item.isIn != 0 ? 'type-out' : 'type-in']">{{item.isIn != 0 ? '-' : '+'}}{{item.amount | commafy}} {{currentToken}}</dd>
                <dd v-else class="amount">--</dd>
              </dl>
              <Page :total="dataTotal" size="small"
                    v-if="showPagination" 
                    :current = "currentPage"
                    :page-size="pageSize"
                    show-total @on-change="changePage" 
                    class="tx-list-pagination"
                    @on-page-size-change="changePageSize">
                    <!-- {{$t('token.content.latestLocalTxRecord.pagination.total')}}{{pageTotal}}{{$t('token.content.latestLocalTxRecord.pagination.unit')}}， -->
                <span class="list-count">{{dataTotal}} {{$t('token.content.latestLocalTxRecord.pagination.content')}}</span>
              </Page>
            </div>
          </div>
          <Modal
              :title="$t('token.content.latestLocalTxRecord.dialog.title')"
              v-model="showTxDetail"
              :mask-closable="false"
              width="650px">
            <div class="bm-alert">
              <div class="show-tx-detail-wraper">
                <p><label>{{$t('token.content.latestLocalTxRecord.dialog.hash')}}</label><span>{{txDetail.hash}}</span></p>
                <p><label>{{$t('token.content.latestLocalTxRecord.dialog.time')}}</label><span>{{txDetail.time | fmtDate}}</span></p>
                <p><label>{{$t('token.content.latestLocalTxRecord.dialog.txStatus')}}</label><span>{{$t(txDetail.errMsg)}}</span></p>
                <p><label>{{$t('token.content.latestLocalTxRecord.dialog.srcAddr')}}</label><span :class="{'address-mark': (txDetail.isIn === 0)}">{{txDetail.srcAddress ? txDetail.srcAddress : '--'}}</span></p>
                <p><label>{{$t('token.content.latestLocalTxRecord.dialog.destAddr')}}</label><span :class="{'address-mark': (txDetail.isIn === 1)}">{{txDetail.destAddress ? txDetail.destAddress : '--'}}</span></p>
                <p><label>{{$t('token.content.latestLocalTxRecord.dialog.amount')}} ({{currentToken}})</label><span>{{txDetail.isIn != 0 ? '-' : '+'}}{{txDetail.amount | commafy}} </span></p>
                <p><label>{{$t('token.content.latestLocalTxRecord.dialog.actualFee')}} (BU)</label><span>{{(!txDetail.actualFee || txDetail.actualFee === '0' ) ? $t('token.content.latestLocalTxRecord.dialog.actualFeeComputing') : txDetail.actualFee}} </span></p>
                <p v-if="txDetail.activationFee && (txDetail.activationFee !== '0')"><label>{{$t('token.content.latestLocalTxRecord.dialog.activationFee')}} (BU)</label><span>{{txDetail.activationFee}}</span></p>
                <p><label>GasPrice (MO)</label><span>{{txDetail.gasPrice}} </span></p>
                <p><label>FeeLimit (BU)</label><span>{{txDetail.feeLimit}} </span></p>
                <p><label>{{$t('token.content.latestLocalTxRecord.dialog.note')}}</label><span class="tx-note">{{txDetail.note}}</span></p>
              </div>
            </div>
            <div slot="footer">
                <Button class="btn-main" long @click="showTxDetail = false">{{$t('token.content.latestLocalTxRecord.dialog.close')}}</Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import txService from '../../controllers/txService'
import errorUtil from '../../constants'
const {clipboard} = require('electron')
// import { setInterval, clearInterval } from 'timers'
export default {
  name: 'tokenContent',
  props: {
    currentToken: String,
    currentTokenAddress: String,
    currentTokenDecimals: Number
  },
  computed: {
    blockStatus () {
      var _blockStatus = this.$store.state.blockStatus
      if (_blockStatus.seqMax === 0) {
        return true
      }
      var flag = (_blockStatus.seqMax - _blockStatus.seq) > 10
      return flag
    },
    loginAccount () {
      return this.$store.state.recentLoginWalletAccount
    },
    pageTotal () {
      return Math.ceil(this.dataTotal / this.pageSize)
    },
    showPagination () {
      return this.pageTotal !== 1
    }
  },
  data () {
    return {
      asset: {
        balance: 0,
        intPart: '',
        pointPart: '',
        tokenReserve: 0,
        txs: []
      },
      txDetail: {
        destAddress: 'a0016aad53119a2027d88533171b8c80a6469f555a3a3b',
        srcAddress: 'a001a6b735d746651d4c710ff83f059f5974f9311565a6',
        fee: '0.0002',
        amount: '50,302',
        errMsg: '',
        status: {
          code: 0,
          msg: this.$t('msg.succ.default')
        },
        note: '',
        isIn: 0,
        time: '2018-1-13 21:11:16',
        hash: '47eb5332377c08e25b5f7ee5b58205e88fe7a55f0e063dfdde3eb16df052c1fa'
      },
      loading: false,
      loadingBalance: false,
      showTxDetail: false,
      txs: [],
      currentPage: 1,
      pageSize: 7,
      dataTotal: 0,
      timer: null
    }
  },
  methods: {
    goSend () {
      var that = this
      this.$store.commit('ACTIVE_HEADER_NAV', 'tx')
      this.$router.push({
        name: 'tx',
        query: {
          tokenType: that.currentToken + '-' + that.currentTokenAddress + '-' + that.currentTokenDecimals
        }
      })
    },
    handleBlockError (blockErrorCode) {
      var respStatus = {
        errorCode: 0,
        msg: 'token.content.txStatus.success'
      }
      if (blockErrorCode === 0) {
        return respStatus.msg
      } else if (blockErrorCode === -1) {
        respStatus.errorCode = 1
        respStatus.msg = 'token.content.txStatus.processing'
      } else if (blockErrorCode === 100) {
        respStatus.errorCode = 2
        respStatus.msg = 'token.content.txStatus.balanceNotEnougn'
      } else if (blockErrorCode === 106) {
        respStatus.errorCode = 2
        respStatus.msg = 'token.content.txStatus.feeNotEnoughActiveAccount'
      } else if (blockErrorCode === 5) {
        respStatus.errorCode = 2
        respStatus.msg = 'token.content.txStatus.timeOut'
      } else {
        respStatus.errorCode = 2
        respStatus.msg = 'token.content.txStatus.fail'
      }
      return respStatus.msg
    },
    showTxDetailDialog (obj) {
      this.txDetail = obj
      this.txDetail.errMsg = this.handleBlockError(this.txDetail.status.code)
      this.showTxDetail = true
    },
    changePage (e) {
      this.currentPage = e
      this.loadTxData()
    },
    changePageSize () {
      console.log('changePageSize')
    },
    loadData () {
      var that = this
      var reqData = {
        walletAddress: this.loginAccount.address,
        assetCode: that.currentToken,
        issuerAddress: that.currentTokenAddress,
        decimals: that.currentTokenDecimals
      }
      txService.getActiveTokenBalance(reqData).then(respData => {
        // console.log(respData)
        if (errorUtil.ERRORS.SUCCESS.CODE === respData.errCode && respData.data.assetCode === that.currentToken) {
          that.loadingBalance = false
          that.asset.balance = respData.data.tokenBalance
          that.asset.intPart = that.asset.balance.split('.')[0]
          that.asset.pointPart = that.asset.balance.split('.')[1]
        }
      })
    },
    loadTxData () {
      var that = this
      var reqData = {
        pageStartIndex: (that.currentPage - 1) * that.pageSize,
        pageSize: that.pageSize,
        assetCode: that.currentToken,
        issuerAddress: that.currentTokenAddress,
        decimals: that.currentTokenDecimals - 0
      }
      txService.getTokenTxList(reqData).then(respData => {
        // console.log(respData)
        if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
          return
        }
        that.txs = respData.data.txs
        that.dataTotal = respData.data.tx.total
        // let txsList = that.asset.txs
        that.txs.forEach((value) => {
          let errMsg = that.handleBlockError(value.status.code)
          // console.log('-------------------' + that.$t('msg.succ.copySucc') + '++++++++++++++++++++++++++++')
          value.errMsg = that.$t(errMsg)
        })
      })
    },
    setTime () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.loadData()
        this.loadTxData()
      }, 2000)
    },
    handleCopyBtnClick () {
      clipboard.writeText(this.loginAccount.address)
      this.$Message.success(this.$t('msg.succ.copySucc'))
    }
  },
  mounted () {},
  beforeDestroy () {
    clearInterval(this.timer)
  },
  watch: {
    currentToken: function (newVal, oldVal) {
      var that = this
      that.currentPage = 1
      that.loadingBalance = true
      that.loadData()
      that.loadTxData()
      that.setTime()
    }
  }
}
</script>
<style lang="less">
.token-cont{
height:100%;
width: 850px;
position: relative;
&.page-content{overflow: hidden;padding-top: 21px;}
.asset-panel{background-color: #fff;padding-bottom: 20px; position: relative;border-bottom:1px solid #F2F2F2;}
.asset-panel p{color: #999999;font-size: 12px;padding-bottom: 6px;}
.asset-panel p i{padding-left: 5px;font-size: 13px;}
.asset-panel b.banlace{font-size: 28px;font-weight: normal;display: block;position:relative;}
.asset-panel .balance-point-part {font-size: 18px;}
.asset-panel .no-get-banlace{font-size: 16px;font-weight: 400;line-height: 24px;color: #999; display: block;}
.asset-panel b{font-size: 16px;}
.asset-panel .asset-icon{position: absolute;right: 20px;top: 0;font-size: 60px;color: #EFEFEF;}
.recent-txs{background-color: #ffffff;}
// .recent-txs .tx-status{display: inline-block;position: absolute;top: 10px;left: 40px;}
.recent-txs .tx-status{}
.txs-header-box{padding: 20px 0;}
.recent-txs .txs-header-box {position: relative; padding: 0;height: 39px;line-height: 39px;}
.recent-txs .recent-local-txs-explain .ivu-tooltip-popper {top: 4px !important;}
.recent-txs .recent-local-txs-explain i{color: #999;padding-left: 3px;}
.txs-header-box label{color: #999;float: left;font-size: 12px;}
.txs-header-box span{display: inline-block;position: absolute;right: 20px;top: 14px;border-radius: 4px;width: 60px;height: 24px;line-height: 24px;border: 1px solid #00D080;color: #00D080;cursor: pointer;font-size: 12px;text-align: center;}
.no-data{position: relative; text-align: center;padding-top: 20px;}
.no-data .no-data-text{padding-top: 100px}
.no-data .no-data-icon{width: 145px;height: 135px;}
.no-data p{font-size: 12px;color: #C9C9C9;}

.table-body-box {
  overflow: auto;
  height: 330px;
}
.table-body-box::-webkit-scrollbar {
  width: 4px;     
  height: 4px;
}
.table-body-box::-webkit-scrollbar-thumb {
  border-radius: 2px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: rgba(0,0,0,0.2);
}
.table-body-box::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 0;
  background: rgba(0,0,0,0.1);
}
.table-body-box::-webkit-input-placeholder {
  font-size: 12px;
  color: #C9C9C9;
}
.table-header,.table-body{display: block;overflow:hidden;}
.table-body{border-bottom: 1px solid #f2f2f2;margin: 0 10px;display: flex;min-height: 40px;}
.table-header{background-color: #F8F8F8; padding: 0 10px;}
.table-header dt{text-align: center;color: #666;font-size: 12px;height: 40px;line-height: 40px;}
.table-header dt,.table-body dd{float: left;}
.table-body dd{text-align: center;font-size: 12px;padding: 15px 0;line-height: 1.2; color: #333;box-sizing: border-box;display: flex;justify-content: center;align-items: center;}
.table-body-box{border: 1px solid #F8F8F8;}
.table-header dt.status,.table-body dd.status{width: 100px;}
.table-body dd.status{text-align: center;position:relative;}
.table-body dd.status.tx-status-success{color: #00D080;}
.table-body dd.status.tx-status-fail{color: #d4237a;}
.table-body dd.status.tx-status-pending{color: #1296db;}
.table-header dt.time,.table-body dd.time{width: 150px;}
.table-body dd.time{text-align: center;color: #333;}
.table-header dt.type,.table-body dd.type{width: 80px;}
.table-body dd.type{text-align: center;color: #333;}
.table-header dt.address,.table-body dd.address{width: 200px;}
.table-body dd.address{color: #333;}
.table-body dd.address-mark{font-weight: 600;}
.table-header dt.amount,.table-body dd.amount{width: 128px;padding-right: 5px;text-align: center;}
.table-body dd.amount{text-align: right;text-align: center;word-wrap: break-word;word-break: break-all;}
.table-body .type-out{color: #FF8024;}
.table-body .type-in{color: #00D080;}
.icon-chenggong1 {color: #00D080}
.icon-jinhangzhong {color: #999999}
.icon-shibai1{color: #FF8024;}
.ivu-modal-content .ivu-modal-header{background:none;height:50px;border-bottom:1px solid #e9eaec;}
.bm-alert p{padding: 3px 0 6px 0;}
.warning-msg{background-color: #F8F8F8;padding: 4px 6px;}
.ivu-modal-footer{border-top: none;}
.ivu-page{text-align: center;padding-top: 15px;font-size: 12px;}
.ivu-page-item-active{background-color:#00D080;}
.send-token-btn{margin-top: 8px; float: right; display: inline-block; height: 24px;width: 60px;padding: 0;border-radius: 4px;text-align: center;line-height: 24px;cursor: pointer;background: #00D080;color: #fff;font-size: 14px;}
.tabs-header{position: relative; height: auto; padding-bottom: 12px;}
.tx-list-pagination {
  margin-top: 0;
  padding-top: 10px;
}
.list-count {
  font-size: 10px;
  color: #999;
}
.table-body-box .table-body:nth-last-child(1) {
  border-bottom: 0
}
.table-body-box .ivu-page  {
  height: 10px;
}
.clearfix{ 
  *zoom: 1;
  &:after{
    display:block;
    content:"";
    height:0;
    clear:both;
  }
}
.table-body.clearfix{
  overflow: visible !important;
}
.index-content-tx-list .tx-status .ivu-tooltip {
  position: relative;
}
.index-content-tx-list .tx-status .ivu-tooltip-popper{
  left: -12px !important;
  // top: -40px !important;
}
.tx-status-tooltip {
  position: relative;
}
.index-account-address-title {
  position: absolute;
  right: 0;
  top: 0;
}
.index-account-address {
  position: absolute;
  right: 0;
  top: 17px;
  font-size: 16px;
  line-height: 1.5px;
  color: #333;
}
.index-account-address .copy-btn {
  display: inline-block;
  width: 30px;
  height: 16px;
  line-height: 15px;
  font-size: 10px;
  border-radius: 2px;
  margin-left: 3px;
  border: 1px solid #00d080;
  background: #fff;
  color: #00d080;
  text-align: center;
  cursor: pointer;
}
}
.show-tx-detail-wraper{position: relative;}
.ivu-modal-body{position: relative;}
.ivu-modal-body .tx-status{position: absolute;right: 50%;top: 0px}
.tx-status i{font-size: 16px;}
.show-tx-detail-wraper{padding-top: 5px;padding-bottom: 5px;}
.show-tx-detail-wraper p{padding: 5px 0;display: flex;}
.show-tx-detail-wraper p label{min-width: 150px;display: block;text-align: right;}
.show-tx-detail-wraper span{padding-left: 15px;display: block;}
.show-tx-detail-wraper span.address-mark{font-weight: 600;}
.show-tx-detail-wraper b{padding-left: 15px;display: inline-block;}
.icon-jindutiaochulizhong {color: #FF8024}
.ivu-page .ivu-page-simple{text-align: center;padding-top: 20px;}
.ivu-page-simple .ivu-page-simple-pager{display: none;}
.show-tx-detail-wraper span.tx-note{float: inherit;word-break: break-all;}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
.loading-balance{
  color: #666;
  font-weight: bold;
  line-height: 28px;
  &>.demo-spin-icon-load{
    float: left;
    margin-right: 5px;
    margin-top: 8px;
    display: inline-block;
  }
  & .loading-balance-words{
    display: inline-block;
    font-size: 16px;
    font-weight: 500;
    color: #999;
  }
}
@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
</style>
