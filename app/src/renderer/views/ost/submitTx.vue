<template>
  <div v-if="!blockStatus" class="ost-submit-tx-wrapper">
    <div class="unsubmitted-tx-str ost-card-box ost-card-box-background">
      <div class="ost-card-title ost-card-title-background">{{$t('ost.submitTx.unsubmittedBlob.title')}}</div>
      <textarea @blur="handleBlobIptBlur" 
                class="unsubmitted-tx-str-ipt" 
                v-model="txBlob"
                :placeholder="$t('ost.submitTx.unsubmittedBlob.placeholder')"
                autofocus name="" id="" cols="100" rows="5">
      </textarea>
    </div>
    <div class="unsubmitted-tx-str-analysis ost-card-box clearfix">
      <div class="ost-card-title">{{$t('ost.submitTx.parserDetail.title')}}</div>
      <div class="analysis-wrapper">
        <div v-if="noData" class="default-no-data">
          <svg class="icon no-data-icon" aria-hidden="true">
            <use xlink:href="#icon-zanwushuju"></use>
          </svg>
          <div class="default-no-data-text">{{$t('ost.submitTx.parserDetail.noData')}}</div>
        </div>
        <div v-else class="analysis-content">
          <div class="ost-card-item ost-card-item-special">
            <div class="ost-card-item-name ost-card-item-name-special">{{$t('ost.submitTx.parserDetail.srcAddr')}}</div>
            <div class="ost-card-item-content ost-card-item-content-special">{{txInfo.params.srcAddress}}</div>
          </div>
          <div class="ost-card-item ost-card-item-special">
            <div class="ost-card-item-name ost-card-item-name-special">{{$t('ost.submitTx.parserDetail.destAddr')}}</div>
            <div class="ost-card-item-content ost-card-item-content-special">{{txInfo.params.destAddress}}</div>
          </div>
          <div class="ost-card-item ost-card-item-special">
            <div class="ost-card-item-name ost-card-item-name-special">{{$t('ost.submitTx.parserDetail.txAmount')}} (BU)</div>
            <div class="ost-card-item-content ost-card-item-content-special">{{txInfo.params.amount}}</div>
          </div>
          <div class="ost-card-item ost-card-item-special">
            <div class="ost-card-item-name ost-card-item-name-special">gasPrice (MO)</div>
            <div class="ost-card-item-content ost-card-item-content-special">{{txInfo.params.gasPrice}}</div>
          </div>
          <div class="ost-card-item ost-card-item-special">
            <div class="ost-card-item-name ost-card-item-name-special">feeLimit (BU)</div>
            <div class="ost-card-item-content ost-card-item-content-special">{{txInfo.params.feeLimit}}</div>
          </div>
          <div class="ost-card-item ost-card-item-special">
            <div class="ost-card-item-name ost-card-item-name-special">Nonce</div>
            <div class="ost-card-item-content ost-card-item-content-special">{{txInfo.params.nonce}}</div>
          </div>
          <div class="ost-card-item ost-card-item-special">
            <div class="ost-card-item-name ost-card-item-name-special">Hash</div>
            <div class="ost-card-item-content ost-card-item-content-special">{{txInfo.params.hash}}</div>
          </div>
          <div class="ost-card-item ost-card-item-special ost-card-item-remarks">
            <div class="ost-card-item-name ost-card-item-name-special">{{$t('ost.submitTx.parserDetail.note')}}</div>
            <!--  ? txInfo.params.note : $t('ost.submitTx.parserDetail.noNote') -->
            <div class="ost-card-item-content ost-card-item-content-remarks">{{txInfo.params.note}}</div>
          </div>
        </div>
      </div>    
      
    </div>
    <div class="ost-btn submit-tx-btn" 
         :class="{'submit-tx-btn-active': submitBtnActive}"
         @click="handleSubmitTx">
         {{submitBtnText ? $t('ost.submitTx.signBtn') : $t('ost.submitTx.clearBtn')}}
    </div>
  </div>
  <div v-else class="sync-process-wrapper ostSpecial">
    <div class="sync-process-box">  
      <div class="sync-process">
        <span class="sync-process-percent">{{syncProgress}}</span>
      </div>
      <div class="sync-process-text">{{$t('ost.submitTx.noSyncBlock')}}</div>
    </div>  
  </div>
</template>

<script>
  import txService from '../../controllers/txService'
  import errorUtil from '../../constants'
  import tools from '../../utils/tools'
  export default {
    name: 'submitTx',
    props: {
      unsubmittedBlob: String,
      isSubmit: Boolean
    },
    data () {
      return {
        txBlob: '',
        noData: true,
        submitBtnActive: false,
        submitBtnText: true,
        satus: 2,
        txInfo: null
      }
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
      syncProgress () {
        var _blockStatus = this.$store.state.blockStatus
        if (_blockStatus.seqMax) {
          var blockSeqUpdatePercent = tools.percentage(_blockStatus.seq, _blockStatus.seqMax)
          if (_blockStatus.seqMax === 0) {
            return '0%'
          } else {
            return blockSeqUpdatePercent + '%'
          }
        } else {
          return this.$t('common.computing')
        }
      }
    },
    methods: {
      handleBlobIptBlur () {
        if (this.txBlob) {
          this.txParserFun()
        } else {
          this.noData = true
        }
      },
      txParserFun () {
        var that = this
        if (that.txBlob === null || that.txBlob === '') {
          that.status = 2
          return
        }
        var reqData = {
          txBlob: that.txBlob
        }
        that.status = 1
        txService.txParser(reqData).then(respData => {
          if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
            that.$Message.error(that.$t(respData.msg))
            that.status = 2
            that.submitBtnActive = false
            that.noData = true
            return
          } else {
            that.status = 0
            that.txInfo = respData.data
            that.noData = false
            that.submitBtnActive = true
            that.$emit('blobParseSucc', that.txBlob)
          }
        }).catch(data => {
          console.log('err data:', data)
        })
      },
      handleSubmitTx () {
        if (this.submitBtnText) {
          if (!this.submitBtnActive) {
            return
          }
          if (!navigator.onLine) {
            this.$Message.error(this.$t('errorUtil.ERRORS.NET_OFFLINE'))
            return
          }
          var reqData = {
            txBlob: this.txBlob
          }
          this.loading = true
          txService.submitTx(reqData).then(respData => {
            if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
              this.$Message.error(this.$t(respData.msg))
              this.loading = false
              this.submitBtnText = true
              return
            }
            this.loading = false
            this.status = 2
            this.showResultOfSubmitTxDialog = true
            this.txHash = respData.data.hash
            this.$Message.success(this.$t('msg.succ.acceptTx'))
            this.$emit('txSucc')
            this.submitBtnText = false
          }).catch(data => {
            console.log('err data:', data)
          })
        } else {
          this.noData = true
          this.txBlob = ''
          this.submitBtnText = true
          this.submitBtnActive = false
          this.$emit('clearSubmitTx')
        }
      }
    },
    mounted () {
      if (this.unsubmittedBlob) {
        this.txBlob = this.unsubmittedBlob
        this.txParserFun()
      }
      this.submitBtnText = !this.isSubmit
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/less/base.less";
  @import '../../assets/css/cardTitle.css';
  .ost-submit-tx-wrapper {
    padding: 20px 20px 0 20px;
  }
  .ost-submit-tx-wrapper .unsubmitted-tx-str {
    height: 126px;
  }
  .unsubmitted-tx-str-ipt {
    height: 60px;
    font-size: 12px;
    border: 0;
    flex: 1;
    padding: 10px 20px 20px;
    background: #F7F7F7;
    color: #333;
    outline: none;
    resize: none;
    overflow: auto;
  }
  .unsubmitted-tx-str-ipt::-webkit-scrollbar {
    width: 4px;     
    height: 4px;
  }
  .unsubmitted-tx-str-ipt::-webkit-scrollbar-thumb {
    border-radius: 2px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .unsubmitted-tx-str-ipt::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
  .unsubmitted-tx-str-ipt::-webkit-input-placeholder {
    font-size: 12px;
    color: #C9C9C9;
  }
  .ost-submit-tx-wrapper .unsubmitted-tx-str-analysis {
    padding-bottom: 20px;
    min-height: 188px;
  }
  .submit-tx-btn {
    clear: both;
    margin: 0 auto 15px;
  }
  .submit-tx-btn-active {
    background: #0BDD80;
  }

  /* 待签名的交易串的解析 */
  .analysis-wrapper {
    position: relative;
    width: 764px;
    min-height: 123px;
  }
  .default-no-data {
    position: absolute;
    width: 228px;
    height: 80px;
    left: 50%;
    top: 50%;
    transform: translate(-114px, -40px)
  }
  .default-no-data .no-data-icon {
    width: 80px;
    height: 75px;
    font-size: 30px;
    margin-left: 75px;
    color: #ccc;
  }
  .default-no-data .default-no-data-text {
    font-size: 12px;
    color: #C9C9C9;
    text-align: center;
  }

  .analysis-content {
    width: 100%;
    .clearfix
  }

  .sync-process-wrapper.ostSpecial{
    width: 100%;
    height: 100%;
    position: relative;
    .sync-process {
      width: 100px;
      height: 100px;
      line-height: 100px;
      margin: 0 auto;
      text-align: center;
      background: url(../../assets/img/loading.gif) no-repeat center;
    }
    .sync-process-box {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      text-align: center;
      height: 150px;
    }
    .sync-process-text {
      font-size: 12px;
      color: #333;
    }
  }

  .unsubmitted-tx-str-analysis .ost-card-title::before {
    display: none;
  }
</style>
