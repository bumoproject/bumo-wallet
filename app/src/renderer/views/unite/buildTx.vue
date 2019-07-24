<template>
  <section>
    <div v-if="!blockStatus">
      <div v-if="isBuildTx" class="build-tx-wrapper">
        <Form class="tx-blob-form" 
              ref="sendAssetData" :model="sendAssetData" 
              :rules="ruleValidate" :label-width="250">
          <FormItem :label="$t('unite.buildTx.buildBlobForm.srcAddr.label')" prop="srcAddr" class="form-item">
            <Input v-model.trim="sendAssetData.srcAddr" :placeholder="$t('unite.buildTx.buildBlobForm.srcAddr.placeholder')"
                  @on-blur="getAvailableBalanceAndTokenList()"></Input>
          </FormItem>
          <FormItem :label="$t('unite.buildTx.buildBlobForm.destAddr.label')" prop="destAddr" class="form-item">
            <Input v-model.trim="sendAssetData.destAddr" :placeholder="$t('unite.buildTx.buildBlobForm.destAddr.placeholder')"></Input>
          </FormItem>
          <FormItem :label="$t('send.form.currentTokenType.label')" prop="currentTokenType">
            <Select :disabled="tokenList.length === 0" v-model="sendAssetData.currentTokenType">
              <Option v-for="(item, index) in tokenList" :key="index" :value="item.code">{{item.code}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('unite.buildTx.buildBlobForm.txAmount.label') + ' (' + (sendAssetData.currentTokenType || 'BU')  + ')'" prop="sentAssetAmount" class="tx-amount">
            <Input class="ost-tx-amount-ipt" v-model.trim="sendAssetData.sentAssetAmount" :placeholder="$t('unite.buildTx.buildBlobForm.txAmount.placeholder')">
            </Input>
            <div v-if="availableAssetAmount != ''" class="available-balance">
              <span>{{$t('unite.buildTx.buildBlobForm.txAmount.balance')}}</span>
              <span class="balance-unit">{{availableAssetAmount}}{{sendAssetData.currentTokenType}}</span>
            </div>
          </FormItem>
          <FormItem :label="$t('unite.buildTx.buildBlobForm.fee.label') + ' (BU)'" prop="fee">
            <Input v-model.trim="sendAssetData.fee"></Input>
          </FormItem>
          <FormItem :label="$t('unite.buildTx.buildBlobForm.note.label')" prop="note" class="build-tx-remarks">
                <Input v-model.trim="sendAssetData.note" type="textarea" 
                      :autosize="{minRows: 2,maxRows: 2}" :placeholder="$t('unite.buildTx.buildBlobForm.note.placeholder')"/>
          </FormItem>
          <FormItem>
            <Button @click="handleBuildTxClick"
                    v-show="isSubmitBtnActive"
                    type="primary" 
                    long
                    class="build-tx-str btn-active">
                    {{$t('unite.buildTx.buildBlobForm.buildBlobBtn')}}
            </Button>
            <Button type="primary" 
                    v-show="!isSubmitBtnActive"
                    long
                    class="build-tx-str">
                    {{$t('unite.buildTx.buildBlobForm.buildBlobBtn')}}
            </Button>
          </FormItem>
        </Form>
      </div>
      <div v-else class="build-tx-detail-wrapper">
        <div class="build-tx-detail ost-card-box">
          <div class="ost-card-title">{{$t('unite.buildTx.blobParserDetail.txDetail.title')}}</div>
          <div class="ost-card-item ost-card-item-special">
            <div class="ost-card-item-name ost-card-item-name-special">{{$t('unite.buildTx.blobParserDetail.txDetail.srcAddr')}}</div>
            <div class="ost-card-item-content ost-card-item-content-special">{{txDetail.srcAddr}}</div>
          </div>
          <div class="ost-card-item ost-card-item-special">
            <div class="ost-card-item-name ost-card-item-name-special">{{$t('unite.buildTx.blobParserDetail.txDetail.destAddr')}}</div>
            <div class="ost-card-item-content ost-card-item-content-special">{{txDetail.destAddr}}</div>
          </div>
          <div class="ost-card-item ost-card-item-special">
            <div class="ost-card-item-name ost-card-item-name-special">{{$t('unite.buildTx.blobParserDetail.txDetail.txAmount')}} ({{sendAssetData.currentTokenType}})</div>
            <div class="ost-card-item-content ost-card-item-content-special">{{txDetail.sentAssetAmount}}</div>
          </div>
          <div class="ost-card-item ost-card-item-special">
            <div class="ost-card-item-name ost-card-item-name-special">{{$t('unite.buildTx.blobParserDetail.txDetail.fee')}} (BU)</div>
            <div class="ost-card-item-content ost-card-item-content-special">{{txDetail.fee}}</div>
          </div>
          <div class="ost-card-item ost-card-item-special ost-card-item-remarks">
            <div class="ost-card-item-name ost-card-item-name-special">{{$t('unite.buildTx.blobParserDetail.txDetail.note')}}</div>
            <!--  ? txDetail.note : $t('unite.buildTx.blobParserDetail.txDetail.noNote') -->
            <div class="ost-card-item-content ost-card-item-content-remarks">{{txDetail.note}}</div>
          </div>
        </div>
        <div class="unsigned-tx-str-wrapper ost-card-box">
          <div class="ost-card-title">{{$t('unite.buildTx.blobParserDetail.unsignedBlob.title')}} (BLOB)</div>
          <div class="unsigned-tx-notice">{{$t('unite.buildTx.blobParserDetail.unsignedBlob.notice')}}</div>
          <div class="unsigned-tx-content">{{txDetail.buildTxBlobStr}}</div>
        </div>
        <div class="clear-tx-str" @click="handleClearTxStrClick">{{$t('unite.buildTx.blobParserDetail.clearBtn')}}</div>
      </div>
    </div>
    <div v-else class="sync-process-wrapper">
      <div class="sync-process-box">  
        <div class="sync-process">
          <span class="sync-process-percent">{{syncProgress}}</span>
        </div>
        <div class="sync-process-text">{{$t('unite.buildTx.noSyncBlock')}}</div>
      </div>  
    </div>
  </section>
</template>
<script>
import txService from '../../controllers/txService'
import accountService from '../../controllers/accountService'
import baseService from '../../controllers/baseService'
import utils from '../../utils/tools'
import errorUtil from '../../constants'
import config from '../../../config'
export default {
  name: 'buildTxComponet',
  props: {
    isBuildTx: Boolean,
    txDetail: Object
  },
  computed: {
    blockStatus () {
      console.log(this.$store.state.blockStatus)
      var _blockStatus = this.$store.state.blockStatus
      if (_blockStatus.seqMax === 0) {
        return true
      }
      var flag = (_blockStatus.seqMax - _blockStatus.seq) > 10
      console.log('_blockStatus1:' + flag)
      return flag
    },
    syncProgress () {
      var _blockStatus = this.$store.state.blockStatus
      if (_blockStatus.seqMax) {
        var blockSeqUpdatePercent = utils.percentage(_blockStatus.seq, _blockStatus.seqMax)
        if (_blockStatus.seqMax === 0) {
          return '0%'
        } else {
          return blockSeqUpdatePercent + '%'
        }
      } else {
        return this.$t('common.computing')
      }
    },
    isSubmitBtnActive () {
      if ((this.sendAssetData.srcAddr === '') || (this.sendAssetData.destAddr === '') || (this.sendAssetData.sentAssetAmount === '') || (this.sendAssetData.fee === '')) {
        return false
      } else {
        return true
      }
    },
    availableAssetAmount () {
      var result = ''
      for (var i = 0; i < this.tokenList.length; i++) {
        if (this.sendAssetData.currentTokenType === this.tokenList[i].code) {
          if (this.sendAssetData.currentTokenType === 'BU') {
            if ((this.tokenList[i].amount - 0) > (config.reserveAccountBalance - 0)) {
              result = utils.commafy(utils.bigNumMinus(this.tokenList[i].amount, config.reserveAccountBalance))
            } else {
              result = '0'
            }
          } else {
            result = this.tokenList[i].amount
          }
        }
      }
      return result
    },
    currentTokenIssuer () {
      var result = ''
      for (var i = 0; i < this.tokenList.length; i++) {
        if (this.sendAssetData.currentTokenType === this.tokenList[i].code) {
          if (this.sendAssetData.currentTokenType === 'BU') {
            result = ''
          } else {
            result = this.tokenList[i].issuer
          }
        }
      }
      return result
    },
    currentTokenDecimals () {
      var result = 0
      for (var i = 0; i < this.tokenList.length; i++) {
        if (this.sendAssetData.currentTokenType === this.tokenList[i].code) {
          result = this.tokenList[i].decimals
        }
      }
      return result
    }
  },
  data () {
    return {
      tokenList: [],
      detailShow: false,
      submitBtnActive: false,
      accountType: false,
      accountBalance: 0,
      destAddrValidate: '',
      signersCount: 1,
      blobBuildIng: false,
      sendAssetData: {
        currentTokenType: '',
        srcAddr: '',
        destAddr: '',
        sentAssetAmount: '',
        fee: config.baseTxFee,
        note: ''
      },
      ruleValidate: {
        srcAddr: [
            { required: true, message: this.$t('error.srcAddr.uniteEmpty'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              var srcAddress = value.trim()
              if (srcAddress === null || srcAddress === '') {
                callback(new Error(this.$t('error.srcAddr.uniteEmpty')))
              }
              var checkAccountAddressReqOpts = {
                address: srcAddress
              }
              accountService.checkAddress(checkAccountAddressReqOpts).then(respData => {
                if (errorUtil.ERRORS.SUCCESS.CODE === respData.errCode) {
                  callback()
                } else {
                  callback(new Error(this.$t('errorUtil.ERRORS.INVALID_ACCOUNT_ADDRESS')))
                }
              }).catch(data => {
                console.log('err data:', data)
              })
            },
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              var srcAddress = value.trim()
              accountService.getAccountInfo(srcAddress).then(resData => {
                if (errorUtil.ERRORS.SUCCESS.CODE === resData.errCode) {
                  if (resData.data.priv.signers.length > 0) {
                    this.accountType = true
                    callback()
                  } else {
                    this.accountType = false
                    callback(new Error(this.$t('errorUtil.ERRORS.NOT_UNIT_ACCOUNT')))
                  }
                } else {
                  callback(new Error(this.$t('errorUtil.ERRORS.NOT_UNIT_ACCOUNT')))
                }
              }).catch(data => {
                callback(new Error(this.$t('errorUtil.ERRORS.NOT_UNIT_ACCOUNT')))
                console.log('err data:', data)
              })
            },
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              var srcAddress = value.trim()
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
                } else {
                  // this.tokenList = []
                  this.$Message.error(this.$t('errorUtil.ERRORS.NETWORK_ERROR'))
                }
              }).catch(data => {
                // this.tokenList = []
                this.$Message.error(this.$t('errorUtil.ERRORS.NETWORK_ERROR'))
                console.log('getAccountTokenBalance err data:', data)
              })
            },
            trigger: 'blur'
          }
        ],
        destAddr: [
            { required: true, message: this.$t('error.inputDestAddr'), trigger: 'blur' },
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
        currentTokenType: [
          { required: true, message: this.$t('error.currentTokenType'), trigger: 'change' }
        ],
        sentAssetAmount: [
            { required: true, message: this.$t('error.txAmount.empty'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              // var testReg = /^(([1-9][0-9]*)|(([0]\.\d{1,8}|[1-9][0-9]*\.\d{1,8})))$/
              /* eslint-disable */
              var testReg = ''
              switch (this.currentTokenDecimals) {
                case 8: testReg = /^(([1-9][0-9]*)|(([0]\.\d{1,8}|[1-9][0-9]*\.\d{1,8})))$/
                break;
                case 7: testReg = /^(([1-9][0-9]*)|(([0]\.\d{1,7}|[1-9][0-9]*\.\d{1,7})))$/
                break;
                case 6: testReg = /^(([1-9][0-9]*)|(([0]\.\d{1,6}|[1-9][0-9]*\.\d{1,6})))$/
                break;
                case 5: testReg = /^(([1-9][0-9]*)|(([0]\.\d{1,5}|[1-9][0-9]*\.\d{1,5})))$/
                break;
                case 4: testReg = /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/
                break;
                case 3: testReg = /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/
                break;
                case 2: testReg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
                break;
                case 1: testReg = /^(([1-9][0-9]*)|(([0]\.\d{1}|[1-9][0-9]*\.\d{1})))$/
                break;
                case 0: testReg = /^[1-9]\d*$/
                break;
                default: testReg = /^(([1-9][0-9]*)|(([0]\.\d{1,8}|[1-9][0-9]*\.\d{1,8})))$/
              }
              if (value < 0) {
                callback(new Error(this.$t('error.txAmount.lessThanZero')))
              }
              if (parseFloat(value) === 0) {
                callback(new Error(this.$t('error.txAmount.lessThanZero')))
              }
              if (parseFloat(value) > 999999999.99) {
                callback(new Error(this.$t('error.txAmount.numTooBig')))
              }
              if (!testReg.test(value)) {
                callback(new Error(this.$t('error.txAmount.decimals') + this.currentTokenDecimals + this.$t('error.txAmount.decimalsUnit')))
              }
              console.log('availableAssetAmount: ' + this.availableAssetAmount + ', v: ' + value)
              if (parseFloat(utils.delcommafy(this.availableAssetAmount)) < parseFloat(value)) {
                callback(new Error(this.$t('error.txAmount.moreThanAvailable')))
              }
              callback()
            },
            trigger: 'change, blur' }
        ],
        fee: [
          { required: true, message: this.$t('error.fee.empty'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === null) {
                callback()
              }
              var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,8}|[1-9][0-9]*\.\d{1,8})))$/
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
        note: [
          {
            validator: (rule, value, callback) => {
              if (value !== '') {
                var nodeLength = value.length
                if (nodeLength > 200) {
                  callback(new Error(this.$t('error.note.limit200')))
                }
              }
              callback()
            },
            trigger: 'change, blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * Not written in validate
     * When submitted, validate will be executed, which will modify the transaction fee again.
     */
    getAvailableBalanceAndTokenList () {
      var that = this
      if (!that.sendAssetData.srcAddr) {
        return
      }
      var reqData = {
        address: that.sendAssetData.srcAddr
      }
      that.tokenList = []
      accountService.getAccountInfo(that.sendAssetData.srcAddr).then(resData => {
        if (errorUtil.ERRORS.SUCCESS.CODE === resData.errCode) {
          try {
            this.signersCount = resData.data.priv.signers.length
            switch (this.signersCount) {
              case 1: this.sendAssetData.fee = '0.01'; break
              case 2: this.sendAssetData.fee = '0.02'; break
              case 3: this.sendAssetData.fee = '0.03'; break
              case 4: this.sendAssetData.fee = '0.05'; break
              case 5: this.sendAssetData.fee = '0.05'; break
              case 6: this.sendAssetData.fee = '0.06'; break
              case 7: this.sendAssetData.fee = '0.07'; break
              case 8: this.sendAssetData.fee = '0.08'; break
              case 9: this.sendAssetData.fee = '0.09'; break
              case 10: this.sendAssetData.fee = '0.09'; break
              case 11: this.sendAssetData.fee = '0.09'; break
              case 12: this.sendAssetData.fee = '0.09'; break
              case 13: this.sendAssetData.fee = '0.09'; break
              case 14: this.sendAssetData.fee = '0.09'; break
              case 15: this.sendAssetData.fee = '0.09'; break
              case 16: this.sendAssetData.fee = '0.1'; break
            }
          } catch (e) {
            console.log(e)
            that.tokenList = []
            return
          }
          // If the account is correct, check the balance.
          accountService.getAvailableBalanceAndTokenList(reqData).then((respData) => {
            if (errorUtil.ERRORS.SUCCESS.CODE === respData.errCode) {
              respData.data.tokens.unshift({
                code: 'BU',
                issuer: '',
                amount: respData.data.balance,
                decimals: 8
              })
              respData.data.tokens.forEach(function (item) {})
              that.tokenList = respData.data.tokens
            } else {
              that.tokenList = []
              this.$Message.error(this.$t('errorUtil.ERRORS.NETWORK_ERROR'))
            }
          }).catch(e => {
            that.tokenList = []
            this.$Message.error(this.$t('errorUtil.ERRORS.NETWORK_ERROR'))
          })
        } else {
          that.tokenList = []
          return
        }
      }).catch(e => {
        that.tokenList = []
        return
      })
      
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
    },
    handleBuildTxClick () {
      if (!this.accountType) {
        this.$Message.error(this.$t('errorUtil.ERRORS.NOT_UNIT_ACCOUNT'))
        return
      }
      if (this.blobBuildIng) {
        return
      }
      var that = this
      this.$refs.sendAssetData.validate((valid) => {
        if (valid) {
          that.showBuildTxDialog = true
          that.blobBuildIng = true
          baseService.testNetworkOnline().then(res => {
            console.log('----------------------- Network OK! --------------------')
            that.blobBuildIng = false
            var reqData = {
              srcAddr: that.sendAssetData.srcAddr,
              destAddr: that.sendAssetData.destAddr,
              sentAssetAmount: that.sendAssetData.sentAssetAmount,
              note: that.sendAssetData.note,
              fee: that.sendAssetData.fee,
              seqOffset: 0,
              signersCount: this.signersCount,
              currentTokenType: that.sendAssetData.currentTokenType,
              currentTokenIssuer: that.currentTokenIssuer,
              currentTokenDecimals: that.currentTokenDecimals
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
                that.$emit('buildTxSucc', that.sendAssetData)
              }
            }).catch(data => {
              console.log('err data:', data)
            })
          }).catch(error => {
            console.log('----------------------- Network ERROR! --------------------')
            that.blobBuildIng = false
            that.$Message.error(this.$t('errorUtil.ERRORS.NET_OFFLINE'))
          })
        }
      })
    },
    handleClearTxStrClick () {
      this.$emit('clearTxStr')
      this.tokenList = []
      this.sendAssetData = {
        currentTokenType: '',
        srcAddr: '',
        destAddr: '',
        sentAssetAmount: '',
        fee: config.baseTxFee,
        note: ''
      }
    }
  },
  mounted (){}
}
</script>
<style scoped lang="less">
@import '../../assets/css/cardTitle.css';
@import '../../assets/less/base.less';
.build-tx-wrapper {
  position: relative;
  width: 100%;
  padding: 20px 0px 0px 0;
}
.build-tx-wrapper .tx-blob-form {
  width: 700px;
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
  right: 20px;
  top: 3px;
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
  margin: 20px 200px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  color: #fff;
  background: #0BDD80;
}
.sync-process-wrapper {
  width: 100%;
  height: 420px;
  position: relative;
  & .sync-process {
    width: 100px;
    height: 100px;
    line-height: 100px;
    margin: 0 auto;
    text-align: center;
    background: url(../../assets/img/loading.gif) no-repeat center;
  }
  & .sync-process-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    text-align: center;
    height: 150px;
  }
  & .sync-process-text {
    font-size: 12px;
    color: #333;
  }
}
.unsigned-tx-str-wrapper .ost-card-title::before {
  display: none;
}
</style>

