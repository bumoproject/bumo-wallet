<template>
  <div v-if="!blockStatus">
    <div v-if="isBuildTx" class="build-tx-wrapper">
      <Form class="tx-blob-form" 
            ref="sendAssetData" :model="sendAssetData" 
            :rules="ruleValidate" :label-width="210">
        <FormItem :label="$t('ost.buildTx.buildBlobForm.srcAddr.label')" prop="srcAddr" class="form-item">
          <Input v-model="sendAssetData.srcAddr" :placeholder="$t('ost.buildTx.buildBlobForm.srcAddr.placeholder')"
                @on-blur="getAvailableAssetAmount" ></Input>
        </FormItem>
        <FormItem :label="$t('ost.buildTx.buildBlobForm.destAddr.label')" prop="destAddr" class="form-item">
          <Input v-model="sendAssetData.destAddr" :placeholder="$t('ost.buildTx.buildBlobForm.destAddr.placeholder')"></Input>
        </FormItem>
        <FormItem :label="$t('ost.buildTx.buildBlobForm.txAmount.label') + ' (BU)'" prop="txAmount" class="tx-amount">
          <Input class="ost-tx-amount-ipt" v-model="sendAssetData.txAmount" :placeholder="$t('ost.buildTx.buildBlobForm.txAmount.placeholder')">
          </Input>
          <div class="available-balance">
            <span>{{$t('ost.buildTx.buildBlobForm.txAmount.balance')}}</span>
            <span class="balance-unit">{{availableAssetAmount}}BU</span>
          </div>
        </FormItem>
        <FormItem :label="$t('ost.buildTx.buildBlobForm.fee.label') + ' (BU)'" prop="fee">
          <Input v-model="sendAssetData.fee"></Input>
        </FormItem>
        <FormItem :label="$t('ost.buildTx.buildBlobForm.note.label')" prop="remarks" class="build-tx-remarks">
              <Input v-model="sendAssetData.remarks" type="textarea" 
                    :autosize="{minRows: 2,maxRows: 2}" :placeholder="$t('ost.buildTx.buildBlobForm.note.placeholder')"/>
        </FormItem>
        <FormItem>
          <Button @click="handleBuildTxClick"
                  v-show="isSubmitBtnActive"
                  type="primary" 
                  long
                  class="build-tx-str btn-active">
                  {{$t('ost.buildTx.buildBlobForm.buildBlobBtn')}}
          </Button>
          <Button type="primary" 
                  v-show="!isSubmitBtnActive"
                  long
                  class="build-tx-str">
                  {{$t('ost.buildTx.buildBlobForm.buildBlobBtn')}}
          </Button>
        </FormItem>
      </Form>
    </div>
    <div v-else class="build-tx-detail-wrapper">
      <div class="build-tx-detail ost-card-box clearfix">
        <div class="ost-card-title">{{$t('ost.buildTx.blobParserDetail.txDetail.title')}}</div>
        <div class="ost-card-item ost-card-item-special">
          <div class="ost-card-item-name ost-card-item-name-special">{{$t('ost.buildTx.blobParserDetail.txDetail.srcAddr')}}</div>
          <div class="ost-card-item-content ost-card-item-content-special">{{txDetail.srcAddr}}</div>
        </div>
        <div class="ost-card-item ost-card-item-special">
          <div class="ost-card-item-name ost-card-item-name-special">{{$t('ost.buildTx.blobParserDetail.txDetail.destAddr')}}</div>
          <div class="ost-card-item-content ost-card-item-content-special">{{txDetail.destAddr}}</div>
        </div>
        <div class="ost-card-item ost-card-item-special">
          <div class="ost-card-item-name ost-card-item-name-special">{{$t('ost.buildTx.blobParserDetail.txDetail.txAmount')}} (BU)</div>
          <div class="ost-card-item-content ost-card-item-content-special">{{txDetail.txAmount}}</div>
        </div>
        <div class="ost-card-item ost-card-item-special">
          <div class="ost-card-item-name ost-card-item-name-special">{{$t('ost.buildTx.blobParserDetail.txDetail.fee')}} (BU)</div>
          <div class="ost-card-item-content ost-card-item-content-special">{{txDetail.fee}}</div>
        </div>
        <div class="ost-card-item ost-card-item-special ost-card-item-remarks">
          <div class="ost-card-item-name ost-card-item-name-special">{{$t('ost.buildTx.blobParserDetail.txDetail.note')}}</div>
          <!--  ? txDetail.remarks : $t('ost.buildTx.blobParserDetail.txDetail.noNote') -->
          <div class="ost-card-item-content ost-card-item-content-remarks">{{txDetail.remarks}}</div>
        </div>
      </div>
      <div class="unsigned-tx-str-wrapper ost-card-box">
        <div class="ost-card-title">{{$t('ost.buildTx.blobParserDetail.unsignedBlob.title')}}&nbsp;&nbsp;(BLOB)</div>
        <div class="unsigned-tx-notice">{{$t('ost.buildTx.blobParserDetail.unsignedBlob.notice')}}</div>
        <div class="unsigned-tx-content">{{txDetail.buildTxBlobStr}}</div>
      </div>
      <div class="clear-tx-str" @click="handleClearTxStrClick">{{$t('ost.buildTx.blobParserDetail.clearBtn')}}</div>
    </div>
  </div>
  <div v-else class="sync-process-wrapper ostSpecial">
    <div class="sync-process-box">  
      <div class="sync-process">
        <span class="sync-process-percent">{{syncProgress}}</span>
      </div>
      <div class="sync-process-text">{{$t('ost.buildTx.noSyncBlock')}}</div>
    </div>  
  </div>
</template>

<script>
  import txService from '../../controllers/txService'
  import utils from '../../utils/tools.js'
  import accountService from '../../controllers/accountService'
  import errorUtil from '../../constants'
  import config from '../../../config'
  export default {
    name: 'buildTx',
    props: {
      isBuildTx: Boolean,
      txDetail: Object
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
          return (Math.floor((_blockStatus.seq / _blockStatus.seqMax) * 100)) + '%'
        } else {
          return this.$t('common.computing')
        }
      },
      isSubmitBtnActive () {
        if ((this.sendAssetData.srcAddr === '') || (this.sendAssetData.destAddr === '') || (this.sendAssetData.txAmount === '') || (this.sendAssetData.fee === '')) {
          return false
        } else {
          return true
        }
      }
    },
    data () {
      return {
        detailShow: false,
        accountType: false,
        accountBalance: 0,
        availableAssetAmount: 0,
        destAddrValidate: '',
        sendAssetData: {
          srcAddr: '',
          destAddr: '',
          txAmount: '',
          fee: config.baseTxFee,
          remarks: '',
          buildTxBlobStr: ''
        },
        ruleValidate: {
          srcAddr: [
            { required: true, message: this.$t('error.srcAddr.empty'), trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                var srcAddress = value.trim()
                if (srcAddress === null) {
                  callback()
                }
                var checkAccountAddressReqOpts = {
                  address: srcAddress
                }
                accountService.getAccountInfo(srcAddress).then(resData => {
                  if (resData.data.priv.signers) {
                    callback(new Error(this.$t('errorUtil.ERRORS.NOT_NORMAL_ACCOUNT')))
                    this.accountType = false
                  } else {
                    this.accountType = true
                  }
                }).catch(data => {
                  console.log('err data:', data)
                })
                accountService.checkAddress(checkAccountAddressReqOpts).then(respData => {
                  if (errorUtil.ERRORS.NO_EXIST_ACCOUNT_ADDRESS.CODE === respData.errCode) {
                    callback()
                  } else if (errorUtil.ERRORS.INVALID_ACCOUNT_ADDRESS.CODE === respData.errCode) {
                    callback(new Error(this.$t('errorUtil.ERRORS.INVALID_ACCOUNT_ADDRESS')))
                  }
                }).catch(data => {
                  console.log('err data:', data)
                })
                // get balance of account
                var getAccountTokenBalanceReqData = {
                  walletAddress: srcAddress
                }
                accountService.getAccountTokenBalance(getAccountTokenBalanceReqData).then(respData => {
                  if (errorUtil.ERRORS.SUCCESS.CODE === respData.errCode) {
                    this.accountBalance = respData.data.tokenBalance
                    if (respData.data.tokenBalance <= respData.data.tokenReserve) {
                      callback(new Error(this.$t('errorUtil.ERRORS.ACCOUNT_NOT_ENOUGH_FOR_FEE_ERROR')))
                    } else {
                      callback()
                    }
                  }
                }).catch(data => {
                  console.log('getAccountTokenBalance err data:', data)
                })
              },
              trigger: 'blur'
            }
          ],
          destAddr: [
            { required: true, message: this.$t('error.destAddr.empty'), trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (value === null) {
                  callback()
                }
                var checkAccountAddressReqOpts = {
                  address: value.trim()
                }
                if (this.sendAssetData.srcAddr === value) {
                  callback(this.$t('error.destAddr.srcSameAsDest'))
                }

                accountService.checkAddress(checkAccountAddressReqOpts).then(respData => {
                  if (errorUtil.ERRORS.NOT_ACTIVE_ACCOUNT_ERROR.CODE === respData.errCode) {
                    if (this.destAddrValidate !== value) {
                      callback(this.$t('errorUtil.ERRORS.NOT_ACTIVE_ACCOUNT_ERROR'))
                      setTimeout(() => {
                        this.$refs.sendAssetData.validateField('destAddr')
                        this.destAddrValidate = value
                      }, 4000)
                    } else {
                      callback()
                    }
                  } else if (errorUtil.ERRORS.INVALID_ACCOUNT_ADDRESS.CODE === respData.errCode) {
                    callback(new Error(this.$t('errorUtil.ERRORS.INVALID_ACCOUNT_ADDRESS')))
                  } else {
                    callback()
                  }
                }).catch(data => {
                  console.log('err data:', data)
                })
              },
              trigger: 'blur'
            }
          ],
          txAmount: [
            { required: true, message: this.$t('error.txAmount.empty'), trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,8}|[1-9][0-9]*\.\d{1,8})))$/
                if (value < 0) {
                  callback(new Error(this.$t('error.txAmount.lessThanZero')))
                }
                if (parseFloat(value) === 0) {
                  callback(new Error(this.$t('error.txAmount.lessThanZero')))
                }
                if (parseFloat(value) > 999999999.99) {
                  callback(new Error(this.$t('error.txAmount.numTooBig')))
                }
                if (!reg.test(value)) {
                  callback(new Error(this.$t('error.txAmount.numLimit')))
                }
                if (parseFloat(utils.delcommafy(this.availableAssetAmount)) < parseFloat(value)) {
                  callback(new Error(this.$t('error.txAmount.moreThanAvailable')))
                }
                callback()
              },
              trigger: 'change, blur'
            }
          ],
          fee: [
            { required: true, message: this.$t('error.fee.empty'), trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (value === null) {
                  callback()
                }
                const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,8}|[1-9][0-9]*\.\d{1,8})))$/
                if (!reg.test(value)) {
                  callback(new Error(this.$t('error.fee.numLimit')))
                }
                if (parseFloat(value) === 0) {
                  callback(new Error(this.$t('error.fee.lessThanZero')))
                }
                if (value > config.defaultMaxTxFee) {
                  callback(new Error(this.$t('error.fee.numTooBig')))
                }
                callback()
              },
              trigger: 'change, blur'
            }
          ],
          remarks: [
            { type: 'string', max: 200, message: this.$t('error.note.limit200'), trigger: 'change, blur' }
          ]
        }
      }
    },
    created () {
      console.log(this.$route)
    },
    methods: {
      handleBuildTxClick () {
        if (!this.accountType) {
          this.$Message.error(this.$t('errorUtil.ERRORS.NOT_NORMAL_ACCOUNT'))
          return
        }
        if (!navigator.onLine) {
          this.$Message.error(this.$t('errorUtil.ERRORS.NET_OFFLINE'))
          return
        }
        var that = this
        this.$refs.sendAssetData.validate((valid) => {
          if (valid) {
            that.showBuildTxDialog = true
            var reqData = {
              srcAddr: that.sendAssetData.srcAddr,
              destAddr: that.sendAssetData.destAddr,
              sentAssetAmount: that.sendAssetData.txAmount,
              note: that.sendAssetData.remarks,
              fee: that.sendAssetData.fee,
              seqOffset: -1
            }
            txService.buildTxBlob(reqData).then(respData => {
              if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
                that.$Message.error({
                  content: that.$t(respData.msg),
                  duration: 3
                })
                return
              } else {
                that.sendAssetData.buildTxBlobStr = respData.data.blob
                that.$Message.success(that.$t('msg.succ.buildSucc'))
                that.$emit('buildTxSucc', that.sendAssetData)
              }
            }).catch(data => {
              console.log('err data:', data)
            })
          } else {
            that.$Message.error(this.$t('msg.srror.formErr'))
          }
        })
      },
      handleClearTxStrClick () {
        this.$emit('clearTxStr')
        this.sendAssetData = {
          srcAddr: '',
          destAddr: '',
          txAmount: '',
          fee: config.baseTxFee,
          remarks: ''
        }
        this.submitBtnActive = false
      },
      getAvailableAssetAmount () {
        var that = this
        var reqData = {
          walletAddress: that.sendAssetData.srcAddr
        }
        accountService.getAccountTokenBalance(reqData).then(respData => {
          if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
            that.$Message.error(that.$t(respData.msg))
            return
          }
          if ((respData.data.tokenBalance - 0) > (config.reserveAccountBalance - 0)) {
            that.availableAssetAmount = utils.commafy(utils.bigNumMinus(respData.data.tokenBalance, config.reserveAccountBalance))
          } else {
            that.availableAssetAmount = 0
          }
        }).catch(data => {
          console.log('err data:', data)
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../assets/css/cardTitle.css';
  @import '../../assets/less/base.less';
  .build-tx-wrapper {
    position: relative;
    width: 100%;
    padding: 21px 0 24px 0px;
  }
  .build-tx-wrapper .tx-blob-form {
    width: 660px;
  } 
  .build-tx-wrapper .tx-blob-form .form-item .ivu-form-item-content .ivu-input-wrapper input.ivu-input {
    font-size: 14px;
    color: #333;
  }
  
  .balance-unit {
    font-size: 12px;
    color: #0bdd60;
  }
  .tx-amount {
    position: relative;
    top: 0;
    left: 0;
  }
  .available-balance {
    position: absolute;
    right: 10px;
    top: 0;
  }
  .build-tx-remarks {
    font-size: 14px;
    color: #c9c9c9;
  }

  .build-tx-str {
    background: #7fe8c0;
    border-color: #7fe8c0;
  }
  .btn-active {
    background: #00D080;
    border-color: #00D080;
  }
  /* 交易详情容器 */
  .build-tx-detail-wrapper {
    padding: 20px 20px 0 20px;
  }
  /* 交易详情 */
  .build-tx-detail {
    min-height: 156px;
    .clearfix;
    padding-bottom: 10px;
  }

  /* 未签名的交易串 */
  .unsigned-tx-str-wrapper {
    min-height: 162px;
    padding: 0 20px 20px;
  }
  .unsigned-tx-str-wrapper .unsigned-tx-notice {
    width: 770px;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    margin-bottom: 9px;
    font-size: 12px;
    color: #FF3030;
    background: #F8F8F8;
  }
  .unsigned-tx-str-wrapper .unsigned-tx-content {
    width: 770px;
    min-height: 60px;
    font-size: 12px;
    line-height: 12px;
    word-wrap: break-word;
    color: #333;
  }

  /* 清空按钮 */
  .clear-tx-str {
    width: 450px;
    height: 36px;
    line-height: 36px;
    margin: 16px 200px;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    color: #fff;
    background: #0BDD80;
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

  .unsigned-tx-str-wrapper .ost-card-title::before {
    display: none;
  }
  .build-tx-detail-wrapper .ost-card-item-special {
    margin-top: 0;
}
</style>
