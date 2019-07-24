<template>
  <section>
    <div class="page-content index-cont">
      <div id="pageLoading" ref="dataLoading">
        <div class="spinner">
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
        </div>
      </div>
      <div class="container">
        <div class="asset-panel">
          <p>{{$t('home.content.overallBalance.title')}}<span class="index-account-address-title">{{$t('home.content.overallBalance.accountAddress')}}</span></p>
          <b class="banlace">
            <!-- :class="{'balance-point-part': ((asset.intPart === '0') && (asset.pointPart === undefined))}" -->
            <div style="min-height: 32px;" v-if="!blockStatus">
              <span v-if="asset.intPart !== ''">
                <span>{{asset.intPart}}</span>
                <span v-if='asset.pointPart' class="balance-point-part">{{asset.pointPart ? '.' + asset.pointPart : ''}}</span>
                <span> BU</span>
              </span>
              <span v-else class="loading-balance">
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <span class="loading-balance-words">{{$t('token.content.overallBalance.loadingBalance')}}</span>
              </span>
            </div>
            <div v-else class="no-get-banlace">{{$t('home.content.overallBalance.unsyncBlock')}}</div>
            <div class="index-account-address">
              <span>{{loginAccount.address}}</span><div class="copy-btn" @click="handleCopyBtnClick">{{$t('home.content.overallBalance.copyBtn')}}</div>
            </div>
          </b>
        </div>
        <div class="recent-txs">
          <p class="txs-header-box">
            <label>{{$t('home.content.latestLocalTxRecord.title')}}</label>
            <Tooltip placement="right-start" class="recent-local-txs-explain">
              <i class="iconfont icon-wenhao"></i>
              <div slot="content"><p v-html="$t('home.content.latestLocalTxRecord.explain')"></p></div>
            </Tooltip>
          </p>
          <div class="no-data" v-if="txs.length === 0">
            <!-- <svg class="icon no-data-icon" aria-hidden="true">
              <use xlink:href="#icon-zanwushuju"></use>
            </svg> -->
            <p class="no-data-text">{{$t('home.content.latestLocalTxRecord.noData')}}</p>
          </div>
          <div v-else>
            <dl class="table-header">
              <dt class="status">{{$t('home.content.latestLocalTxRecord.tableHeader.status')}}</dt>
              <dt class="time">{{$t('home.content.latestLocalTxRecord.tableHeader.time')}}</dt>
              <dt class="address">{{$t('home.content.latestLocalTxRecord.tableHeader.srcAddr')}}</dt>
              <dt class="address">{{$t('home.content.latestLocalTxRecord.tableHeader.destAddr')}}</dt>
              <dt class="amount">{{$t('home.content.latestLocalTxRecord.tableHeader.num')}}</dt>
            </dl>
            <div>
              <div class="table-body-box">
                <dl class="table-body clearfix" v-for="(item, index) in txs" :key="index" @click="showTxDetailDialog(item)">
                  <dd class="status tx-status-success index-content-tx-list">
                    <p class="tx-status" v-if="item.status.code === 0" @click.stop="handleCatchBubble">
                      <Tooltip :content="item.errMsg" placement="top-start"><i class="iconfont icon-chenggong1"></i></Tooltip>
                    </p>
                    <p class="tx-status" v-else-if="item.status.code === -1" @click.stop="handleCatchBubble">
                      <Tooltip :content="item.errMsg" placement="top-start"><i class="iconfont icon-jinhangzhong"></i></Tooltip>
                    </p>
                    <p class="tx-status" v-else @click.stop="handleCatchBubble">
                      <Tooltip :content="item.errMsg" placement="top-start"><i class="iconfont icon-shibai1"></i></Tooltip>
                    </p>
                  </dd>
                  <dd class="time">{{item.time | fmtDate}}</dd>
                  <dd class="address" :class="{'address-mark': (item.isIn === 0)}">{{item.srcAddress | fmtWalletAccountAddress}}</dd>
                  <dd class="address" :class="{'address-mark': (item.isIn === 1)}">{{item.destAddress | fmtWalletAccountAddress}}</dd>
                  <dd :class="['amount',item.isIn != 0 ? 'type-out' : 'type-in']">{{item.isIn != 0 ? '-' : '+'}}{{item.amount | commafy}} BU</dd>
                </dl>
              </div>
            </div>
            <Page :total="dataTotal" size="small"
                  v-if="showPagination" 
                  :page-size="pageSize"
                  show-total @on-change="changePage" 
                  class="tx-list-pagination"
                  @on-page-size-change="changePageSize">
                  <!-- {{$t('home.content.latestLocalTxRecord.pagination.total')}}{{pageTotal}}{{$t('home.content.latestLocalTxRecord.pagination.unit')}}， -->
              <span class="list-count">{{dataTotal}} {{$t('home.content.latestLocalTxRecord.pagination.content')}}</span>
            </Page>
            <Modal
                :title="$t('home.content.latestLocalTxRecord.dialog.title')"
                v-model="showTxDetail"
                :mask-closable="false"
                width="650px">
              <div class="bm-alert">
                <div class="show-tx-detail-wraper">
                  <p><label>{{$t('home.content.latestLocalTxRecord.dialog.hash')}}</label><span>{{txDetail.hash}}</span></p>
                  <p><label>{{$t('home.content.latestLocalTxRecord.dialog.time')}}</label><span>{{txDetail.time | fmtDate}}</span></p>
                  <p><label>{{$t('home.content.latestLocalTxRecord.dialog.txStatus')}}</label><span>{{$t(txDetail.errMsg)}}</span></p>
                  <p><label>{{$t('home.content.latestLocalTxRecord.dialog.srcAddr')}}</label><span :class="{'address-mark': (txDetail.isIn === 0)}">{{txDetail.srcAddress}}</span></p>
                  <p><label>{{$t('home.content.latestLocalTxRecord.dialog.destAddr')}}</label><span :class="{'address-mark': (txDetail.isIn === 1)}">{{txDetail.destAddress}}</span></p>
                  <p><label>{{$t('home.content.latestLocalTxRecord.dialog.amount')}}</label><span>{{txDetail.isIn != 0 ? '-' : '+'}}{{txDetail.amount | commafy}} </span></p>
                  <p><label>{{$t('home.content.latestLocalTxRecord.dialog.actualFee')}}</label><span>{{(!txDetail.actualFee || txDetail.actualFee === '0' ) ? $t('home.content.latestLocalTxRecord.dialog.actualFeeComputing') : txDetail.actualFee}} </span></p>
                  <p><label>GasPrice (MO)</label><span>{{txDetail.gasPrice}} </span></p>
                  <p><label>FeeLimit (BU)</label><span>{{txDetail.feeLimit}} </span></p>
                  <p><label>{{$t('home.content.latestLocalTxRecord.dialog.note')}}</label><span class="tx-note">{{txDetail.note}}</span></p>
                </div>
              </div>
              <div slot="footer">
                  <Button class="btn-main" long @click="showTxDetail = false">{{$t('home.content.latestLocalTxRecord.dialog.close')}}</Button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import accountService from '../controllers/accountService'
import txService from '../controllers/txService'
import errorUtil from '../constants'
const {clipboard} = require('electron')
// import { setInterval, clearInterval } from 'timers'
export default {
  name: 'app',
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
      showTxDetail: false,
      txs: [],
      currentPage: 1,
      pageSize: 7,
      dataTotal: 0,
      timer: null
    }
  },
  methods: {
    handleCatchBubble () {},
    handleBlockError (blockErrorCode) {
      var respStatus = {
        errorCode: 0,
        msg: 'home.content.txStatus.success'
      }
      if (blockErrorCode === 0) {
        return respStatus.msg
      } else if (blockErrorCode === -1) {
        respStatus.errorCode = 1
        respStatus.msg = 'home.content.txStatus.processing'
      } else if (blockErrorCode === 100) {
        respStatus.errorCode = 2
        respStatus.msg = 'home.content.txStatus.balanceNotEnougn'
      } else if (blockErrorCode === 106) {
        respStatus.errorCode = 2
        respStatus.msg = 'home.content.txStatus.feeNotEnoughActiveAccount'
      } else if (blockErrorCode === 5) {
        respStatus.errorCode = 2
        respStatus.msg = 'home.content.txStatus.timeOut'
      } else {
        respStatus.errorCode = 2
        respStatus.msg = 'home.content.txStatus.fail'
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
        walletAddress: this.loginAccount.address
      }
      accountService.loadWalletTokenAndRecentTxs(reqData).then(respData => {
        if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
          return
        }
        // console.log(respData)
        that.asset.balance = respData.data.tokenBalance + ''
        that.asset.intPart = that.asset.balance.split('.')[0] || that.asset.balance
        that.asset.pointPart = that.asset.balance.split('.')[1] ? that.asset.balance.split('.')[1] : ''
        that.asset.tokenReserve = respData.data.tokenReserve
        that.asset.txs = respData.data.txs
        // console.log(respData.data)
      })
    },
    loadTxData () {
      var that = this
      var reqData = {
        pageStartIndex: (that.currentPage - 1) * that.pageSize,
        pageSize: that.pageSize
      }
      txService.getTxList(reqData).then(respData => {
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
      this.timer = setInterval(() => {
        this.loadData()
        this.loadTxData()
      }, 2000)
    },
    handleCopyBtnClick () {
      clipboard.writeText(this.loginAccount.address)
      this.$Message.success(this.$t('msg.succ.copySucc'))
    }
    // handleAddressDblClick (e) {
    //   clipboard.writeText(e.target.innerHTML)
    //   this.$Message.success(this.$t('msg.succ.copySucc'))
    // }
  },
  mounted () {
    this.loadData()
    this.loadTxData()
    this.setTime()
    this.$refs.dataLoading.style.display = 'none'
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
<style lang="less">
.page-content{overflow: hidden;padding-top: 21px;}
.index-cont{
&.page-content{overflow: hidden;padding-top: 21px;}
.asset-panel{background-color: #fff;padding-bottom: 20px; position: relative;border-bottom:1px solid #F2F2F2;}
.asset-panel p{color: #999999;font-size: 12px;padding-bottom: 6px;}
.asset-panel p i{padding-left: 5px;font-size: 13px;}
.asset-panel b.banlace{font-size: 28px;font-weight: normal;display: block;position:relative;}
.asset-panel .balance-point-part {font-size: 28px;}
.asset-panel .no-get-banlace{font-size: 16px;font-weight: 400;line-height: 24px;color: #999; display: block;}
.asset-panel b{font-size: 16px;}
.asset-panel .asset-icon{position: absolute;right: 20px;top: 0;font-size: 60px;color: #EFEFEF;}
.recent-txs{background-color: #ffffff;padding-bottom: 5px;width: 960px;}
.recent-txs .tx-status{display: inline-block;position: absolute;top: 0;left: 40px;}
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

.table-header,.table-body{display: block;overflow:hidden;}
.table-body{border-bottom: 1px solid #f2f2f2;margin: 0 10px;}
.table-header{background-color: #F8F8F8; padding: 0 10px;}
.table-header dt{text-align: center;color: #666;font-size: 12px;height: 40px;line-height: 40px;}
.table-header dt,.table-body dd{float: left;}
.table-body dd{height: 40px;text-align: center;line-height: 40px;font-size: 12px;color: #333;}
.table-body-box{border: 1px solid #F8F8F8;}
.table-header dt.status,.table-body dd.status{width: 100px;}
.table-body dd.status{text-align: center;position:relative;}
.table-body dd.status.tx-status-success{color: #00D080;}
.table-body dd.status.tx-status-fail{color: #d4237a;}
.table-body dd.status.tx-status-pending{color: #1296db;}
.table-header dt.time,.table-body dd.time{width: 176px;}
.table-body dd.time{text-align: center;color: #333;}
.table-header dt.type,.table-body dd.type{width: 80px;}
.table-body dd.type{text-align: center;color: #333;}
.table-header dt.address,.table-body dd.address{width: 250px;}
.table-body dd.address{color: #333;}
.table-body dd.address-mark{font-weight: 600;}
.table-header dt.amount,.table-body dd.amount{width: 130px;padding-right: 5px;text-align: center;}
.table-body dd.amount{text-align: right;text-align: center;}
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
.send-token-btn{position: absolute;right: 0;top: -13px; height: 28px;width: 80px;padding: 0;border-radius: 4px;text-align: center;line-height: 28px;cursor: pointer;}
.send-token-btn span{font-size: 14px;}
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
.index-content-tx-list .tx-status .ivu-tooltip-popper{
  left: -12px !important;
  top: -40px !important;
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
.index-cont .asset-panel .balance-point-part{
  margin-left: -7px;
}
</style>
