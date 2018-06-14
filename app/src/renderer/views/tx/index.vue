<template>
  <section>
    <div class="page-content tx-index">
      <div class="container">
        <div class="asset-send-frm" v-if="!blockStatus">
          <Form ref="sendAssetData" 
                :model="sendAssetData" 
                :rules="ruleValidate" 
                :label-width="210">
            <FormItem :label="$t('send.form.destAddr.label')" prop="destAddr">
              <Input v-model.trim="sendAssetData.destAddr" :placeholder="$t('send.form.destAddr.placeholder')"></Input>
            </FormItem>
            <FormItem :label="$t('send.form.sentAssetAmount.label') + '(BU)'" prop="sentAssetAmount" class="asset-send-amount">
              <Input v-model.trim="sendAssetData.sentAssetAmount" :placeholder="$t('send.form.sentAssetAmount.placeholder')"></Input>
              <label class="available-asset-amount">{{$t('send.form.sentAssetAmount.balance')}}<span>{{availableAssetAmount}}BU</span></label>
            </FormItem>
            <FormItem :label="$t('send.form.fee.label') + '(BU)'" prop="fee">
              <Input v-model.trim="sendAssetData.fee" :placeholder="$t('send.form.fee.placeholder')"></Input>
            </FormItem>
            <FormItem :label="$t('send.form.note.label')" prop="note" class="tx-index-note">
              <Input v-model.trim="sendAssetData.note" :placeholder="$t('send.form.note.placeholder')" type="textarea" ></Input>
            </FormItem>
            <FormItem class="btn-main-inactive btn-main-active"  v-show="isSubmitBtnActive">
              <Button @click="handleSubmit('sendAssetData')" 
                      type="primary" class="btn-main" long>
                      {{$t('send.form.nextBtn')}}
              </Button>
            </FormItem>
            <FormItem class="btn-main-inactive" v-show="!isSubmitBtnActive">
              <Button type="primary" class="btn-main disabled-btn" long>
                      {{$t('send.form.nextBtn')}}
              </Button>
            </FormItem>
          </Form>
        </div>
        <div v-else class="sync-process-wrapper txSpecal">
          <div class="sync-process-box">  
            <div class="sync-process">
              <span class="sync-process-percent">{{syncProgress}}</span>
            </div>
            <div class="sync-process-text">{{$t('send.noSyncBlock')}}</div>
          </div>  
        </div>
        <Modal
            :title="$t('send.dialog.title')"
            v-model="sendAssetConfirm"
            :mask-closable="false"
            :loading="playPwdLoading"
            @on-cancel="cancelFrm"
            @on-ok="showPalyPwdDialog"
            width="520">
            <p class="txt-info">{{$t('send.dialog.notice')}}</p>
            <div class="send-asset-confirm-wraper">
              <p><label>{{$t('send.dialog.srcAddr')}}</label><span>{{loginAccount.address}}</span></p>
              <p><label>{{$t('send.dialog.destAddr')}}</label><b>{{sendAssetData.destAddr}}</b></p>
              <p><label>{{$t('send.dialog.sentAssetAmount')}}(BU)</label><b>{{sendAssetData.sentAssetAmount}}</b></p>
              <p><label>{{$t('send.dialog.fee')}}(BU)</label><span>{{sendAssetData.fee}}</span></p>
              <p><label>{{$t('send.dialog.note')}}</label><span class="tx-note">{{sendAssetData.note}}</span></p>
            </div>
            <div class="play-pwd-wraper">
              <Form ref="playPwdData" :model="sendAssetData" :rules="palyPwdRuleValidate">
                <FormItem prop="accountPwd">
                  <Input v-model.trim="sendAssetData.accountPwd" :placeholder="$t('send.dialog.pwdPlaceholder')" type="password"></Input>
                </FormItem>
              </Form>
            </div>
            <div slot="footer">
              <Button class="btn-cattle"  @click="cancelFrm">{{$t('common.dialogButton.cancelSend')}}</Button>
              <Button v-show="sendAssetData.accountPwd !== ''" class="pwd-btn-main"  @click="sendAssetSubmit('playPwdData')">{{$t('common.dialogButton.confirmSend')}}</Button>
              <Button v-show="sendAssetData.accountPwd === ''" class="pwd-btn-main-inactive"  >{{$t('common.dialogButton.confirmSend')}}</Button>
            </div>
        </Modal>
      </div>
    </div>
  </section>
</template>
<script>
// import txListComponet from './txList.vue'
import accountService from '../../controllers/accountService'
import txService from '../../controllers/txService'
import errorUtil from '../../constants'
import config from '../../../config'
import tools from '../../utils/tools'
export default {
  // components: {
  //   txListComponet
  // },
  computed: {
    loginAccount () {
      return this.$store.state.recentLoginWalletAccount
    },
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
      if ((this.sendAssetData.srcAddr === '') || (this.sendAssetData.destAddr === '') || (this.sendAssetData.sentAssetAmount === '') || (this.sendAssetData.fee === '')) {
        return false
      } else {
        return true
      }
    }
  },
  data () {
    return {
      flag: false,
      destAddrValidate: '',
      sendAssetData: {
        destAddr: '',
        sentAssetAmount: '',
        fee: config.baseTxFee,
        note: '',
        accountPwd: ''
      },
      sentAssetFrm: false,
      serverTxFee: '',
      txPanel: 'loadTxHistory',
      sendAssetConfirm: false,
      availableAssetAmount: 0,
      playPwdLoading: true,
      palyPwdRuleValidate: {
        accountPwd: [
            { required: true, message: this.$t('error.walletPwdEmpty'), trigger: 'blur' }
        ]
      },
      ruleValidate: {
        accountPwd: [
            { required: true, message: this.$t('error.walletPwdEmpty'), trigger: 'blur' }
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
              accountService.checkAddress(checkAccountAddressReqOpts).then(respData => {
                if (errorUtil.ERRORS.NOT_ACTIVE_ACCOUNT_ERROR.CODE === respData.errCode) {
                  if (this.destAddrValidate !== value) {
                    callback(this.$t('errorUtil.ERRORS.NOT_ACTIVE_ACCOUNT_ERROR'))
                    setTimeout(() => {
                      this.$refs.sendAssetData.validateField('destAddr')
                      this.destAddrValidate = value
                    }, 2000)
                  } else {
                    callback()
                  }
                } else if (errorUtil.ERRORS.INVALID_ACCOUNT_ADDRESS.CODE === respData.errCode) {
                  callback(this.$t('errorUtil.ERRORS.INVALID_ACCOUNT_ADDRESS'))
                } else {
                  callback()
                }
              }).catch(data => {
                console.log('err data:', data)
              })
              var srcAccountAddress = this.$store.state.recentLoginWalletAccount.address
              if (srcAccountAddress === value) {
                callback(new Error(this.$t('error.sendSelf')))
              }
            },
            trigger: 'blur'
          }
        ],
        sentAssetAmount: [
            { required: true, message: this.$t('error.txAmount.empty'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === null) {
                callback()
              }
              var availableAssetAmount = tools.delcommafy(this.availableAssetAmount)
              if (parseFloat(value) > availableAssetAmount) {
                callback(new Error(this.$t('error.txAmount.moreThanAvailable')))
              }
              if (value < 0) {
                callback(new Error(this.$t('error.txAmount.notNum')))
              }
              if (parseFloat(value) === 0) {
                callback(new Error(this.$t('error.txAmount.notNum')))
              }
              if (parseFloat(value) > 999999999.99) {
                callback(new Error(this.$t('error.txAmount.numTooBig')))
              }
              const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,8}|[1-9][0-9]*\.\d{1,8})))$/
              if (!reg.test(value)) {
                callback(new Error(this.$t('error.txAmount.numLimit')))
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
              if (parseFloat(value) === 0) {
                callback(new Error(this.$t('error.fee.lessThanZero')))
              }
              // const reg = /^\d+(\.\d{1,8})?$/
              const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,8}|[1-9][0-9]*\.\d{1,8})))$/
              if (!reg.test(value)) {
                callback(new Error(this.$t('error.fee.numLimit')))
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
              var nodeLength = value.length
              if (nodeLength > 200) {
                callback(new Error(this.$t('error.note.limit200')))
              }
              callback()
            },
            trigger: 'change, blur' }
        ]
      }
    }
  },
  methods: {
    txPanelClick (e) {
      this.txPanel = e
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.sendAssetConfirm = true
        }
      })
    },
    showPalyPwdDialog () {
      this.sendAssetConfirm = false
    },
    sendAssetSubmit (name) {
      var that = this
      this.$refs[name].validate((valid) => {
        if (valid) {
          var sendTokenReqOpts = {
            walletNick: that.$store.state.recentLoginWalletAccount.nick,
            walletAddress: that.$store.state.recentLoginWalletAccount.address,
            destAddr: that.sendAssetData.destAddr,
            sentAssetAmount: that.sendAssetData.sentAssetAmount,
            note: that.sendAssetData.note,
            fee: that.sendAssetData.fee,
            accountPwd: that.sendAssetData.accountPwd
          }
          txService.sendToken(sendTokenReqOpts).then(respData => {
            if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
              that.$Message.error({
                content: that.$t(respData.msg),
                duration: 3
              })
              setTimeout(function () {
                that.playPwdLoading = false
                that.$nextTick(() => {
                  that.playPwdLoading = true
                })
              }, 10)
            } else {
              that.sendAssetConfirm = false
              that.$Message.success(this.$t('msg.succ.acceptTx'))
              that.restFrm()
              that.$router.push({
                name: 'walletContent'
              })
              that.$store.commit('ACTIVE_HEADER_NAV', 'index')
            }
          }).catch(data => {
            console.log('err data:', data)
          })
        } else {
          setTimeout(function () {
            that.playPwdLoading = false
            that.$nextTick(() => {
              that.playPwdLoading = true
            })
          }, 30)
        }
      })
    },
    getAvailableAssetAmount () {
      var that = this
      var reqData = {
        walletAddress: this.$store.state.recentLoginWalletAccount.address
      }
      accountService.getAccountTokenBalance(reqData).then(respData => {
        if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
          that.$Message.error(that.$t(respData.msg))
          return
        }
        if ((respData.data.tokenBalance - 0) > (config.reserveAccountBalance - 0)) {
          that.availableAssetAmount = tools.commafy(tools.bigNumMinus(respData.data.tokenBalance, config.reserveAccountBalance))
        } else {
          that.availableAssetAmount = 0
        }
      }).catch(data => {
        console.log('err data:', data)
      })
    },
    getSendTokenFee () {
      var that = this
      var reqData = {
        walletAddress: this.$store.state.recentLoginWalletAccount.address,
        destAddr: that.sendAssetData.destAddr.trim(),
        sentAssetAmount: that.sendAssetData.sentAssetAmount.trim(),
        note: that.sendAssetData.note.trim()
      }
      txService.getSendTokenFee(reqData).then(respData => {
        if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
          that.$Message.error(that.$t(respData.msg))
          return
        }
        that.serverTxFee = respData.data.fee
        that.sendAssetData.fee = that.serverTxFee
      }).catch(data => {
        console.log('err data:', data)
      })
    },
    restFrm () {
      this.$refs.sendAssetData.resetFields()
    },
    cancelFrm () {
      this.$refs.playPwdData.resetFields()
      this.sendAssetConfirm = false
    }
  },
  mounted () {
    var that = this
    that.getAvailableAssetAmount()
  }
}
</script>
<style lang="less">
frmitemh{height: 20px;}
.container {
  width: 100%;
  height: 100%;
}
.tx-index-tabs-header {
  margin: 0;
  margin-bottom: 21px;
}
.tx-wrapper{background-color: #fff;height: 418px;padding: 15px 0;}
.asset-send-frm{width: 695px;margin-left: 80px;}
.ivu-input{height: 35px;}
.ivu-input:hover{border-color:#22B398;}
.ivu-input:focus{border-color:#22B398; }
.available-asset-amount{position: absolute;right: 0;bottom: -29px;}
.available-asset-amount span{color: #22B398;padding-left: 5px;}
.txt-info{text-align: center;color: #999;padding-bottom: 5px;}
.ivu-modal-footer{display: block;text-align: center;}
.send-asset-confirm-wraper {background-color: #F8F8F8;margin-bottom: 12px;padding: 5px 0;}
.send-asset-confirm-wraper p{padding: 3px 0;display: flex;}
.send-asset-confirm-wraper p label{text-align: right;width: 150px;display: block;}
.send-asset-confirm-wraper span{padding-left: 15px;display: block;}
.send-asset-confirm-wraper b{padding-left: 15px;}
.send-asset-confirm-wraper span.tx-note{margin-top: -18px;display: block;padding-left: 166px;padding-right: 5px; min-height: 18px; word-break: break-all;}
.asset-send-amount .ivu-form-item-content{position: relative; padding-right:35px;}
.asset-send-amount .ivu-form-item-content .available-asset-amount{position: absolute;right: 45px;top: 2px;bottom: 0;}
.tx-index {
  & .txSpecal.sync-process-wrapper {
      width: 100%;
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
}
.btn-main-inactive .ivu-btn.disabled-btn{
  border-color: #7fe8c0 !important;
}
</style>
