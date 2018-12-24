<template>
  <div class="unite-outline-sign-wrapper">
    <div class="unsigned-tx-str ost-card-box ost-card-box-background">
      <div class="ost-card-title ost-card-title-background">{{$t('unite.outlineSign.unsignedBlob.title')}}</div>
      <textarea @blur="handleBlobIptBlur" 
                class="unsigned-tx-str-ipt" 
                v-model="txBlob"
                :placeholder="$t('unite.outlineSign.unsignedBlob.placeholder')"
                name="" id="" cols="100" rows="5">
      </textarea>
    </div>
    <div class="unsigned-tx-str-parser ost-card-box">
      <div class="ost-card-title">{{$t('unite.outlineSign.parserDetail.title')}}</div>
      <div class="parser-wrapper">
        <div v-if="!showParser" class="default-no-data">
          <svg class="icon no-data-icon" aria-hidden="true">
            <use xlink:href="#icon-zanwushuju"></use>
          </svg>
          <div class="default-no-data-text">{{$t('unite.outlineSign.parserDetail.noData')}}</div>
        </div>
        <div v-else class="analysis-content">
          <div class="ost-card-item ost-card-item-special">
            <div class="ost-card-item-name ost-card-item-name-special">{{$t('unite.outlineSign.parserDetail.srcAddr')}}</div>
            <div class="ost-card-item-content ost-card-item-content-special">{{txInfo.params.srcAddress}}</div>
          </div>
          <div class="ost-card-item ost-card-item-special">
            <div class="ost-card-item-name ost-card-item-name-special">{{$t('unite.outlineSign.parserDetail.destAddr')}}</div>
            <div class="ost-card-item-content ost-card-item-content-special">{{txInfo.params.destAddress}}</div>
          </div>
          <div class="ost-card-item ost-card-item-special">
            <div class="ost-card-item-name ost-card-item-name-special">{{$t('unite.outlineSign.parserDetail.txAmount')}} ({{txInfo.params.code || 'BU'}})</div>
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
            <div class="ost-card-item-name ost-card-item-name-special">{{$t('unite.outlineSign.parserDetail.note')}}</div>
            <!--  ? txInfo.params.note : $t('unite.outlineSign.parserDetail.noNote') -->
            <div class="ost-card-item-content ost-card-item-content-remarks">{{txInfo.params.note}}</div>
          </div>
          <div class="ost-card-item ost-card-item-special ost-card-item-many-members">
            <div class="ost-card-item-name ost-card-item-name-special">{{$t('unite.outlineSign.parserDetail.signedUniteMember')}}</div>
            <div class="ost-card-item-content-special">
              <div class="ost-card-item-content" v-if="txInfo.signers.length === 0">{{$t('unite.outlineSign.parserDetail.noSignedUniteMember')}}</div>
              <div v-else class="ost-card-item-content" 
                   v-for="(item, index) in txInfo.signers" :key="index"
                   :class="(index % 2) ? '' : 'common-manager-member'">{{item.address}}</div>
            </div>
          </div>
        </div>
      </div>      
    </div>
    <div v-if="showBlob" class="unsubmitted-tx-str ost-card-box">
      <div class="ost-card-title">{{$t('unite.outlineSign.unSubmittedBlob.title')}}</div>
      <div class="unsubmitted-tx-str-notice">{{$t('unite.outlineSign.unSubmittedBlob.notice')}}</div>
      <div class="unsubmitted-tx-str-content">{{buildTxBlobStr}}</div>
    </div>
    <div class="ost-btn outline-sign-btn" 
        :class="{'outline-sign-btn-active': showParser}"
        @click="handleOutlineSignClick">{{showBlob ? $t('unite.outlineSign.clearBtn') : $t('unite.outlineSign.signBtn')}}</div>
    <Modal
      :title="$t('unite.outlineSign.dialog.title')"
      v-model="playPwdDialog"
      :closable="true"
      :mask-closable="false"
      :loading="playPwdLoading"
      @on-ok="signTx"
      @on-cancel="cancelPlayPwdDialog">
      <p style="color: #999;padding-bottom:5px;text-align:center;">{{$t('common.pwdInputNotice')}}</p>
      <div class="play-pwd-wraper">
        <Form ref="playPwdData" :model="signTxData" :rules="playPwdRuleValidate">
          <FormItem prop="accountPwd">
            <Input v-model="signTxData.accountPwd" :placeholder="$t('unite.outlineSign.dialog.placeholder')" type="password"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button class="btn-cattle"  @click="cancelPlayPwdDialog">{{$t('common.dialogButton.cancel')}}</Button>
        <Button v-show="signTxData.accountPwd !== ''" class="pwd-btn-main"  @click="signTx">{{$t('common.dialogButton.confirm')}}</Button>
        <Button v-show="signTxData.accountPwd === ''" class="pwd-btn-main-inactive"  >{{$t('common.dialogButton.confirm')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import txService from '../../controllers/txService'
  import errorUtil from '../../constants'
  export default {
    name: 'outlineSign',
    props: {
      txBlobRemb: String,
      signedTxStr: String
    },
    data () {
      return {
        noData: true,
        txBlob: '',
        buildTxBlobStr: '',
        outlineSignBtnText: true,
        status: 2,
        showParser: false,
        showTxStr: false,
        playPwdDialog: false,
        playPwdLoading: true,
        showBlob: false,
        signTxData: {
          accountPwd: ''
        },
        txInfo: null,
        playPwdRuleValidate: {
          accountPwd: [
              { required: true, message: this.$t('error.walletPwdEmpty'), trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.txBlobRemb && (this.txBlob = this.txBlobRemb)
      if (this.signedTxStr) {
        this.buildTxBlobStr = this.signedTxStr
        this.showBlob = true
      }
      this.txParserFun()
    },
    methods: {
      handleBlobIptBlur () {
        if (this.txBlob) {
          this.txParserFun()
        } else {
          this.noData = true
          this.outlineSignBtnText = true
          this.showParser = false
          this.showTxStr = false
          this.showBlob = false
          this.txBlob = ''
          this.$emit('clearOutlineSign')
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
            that.showParser = false
            return
          } else {
            that.status = 0
            that.txInfo = respData.data
            that.showParser = true
            that.$emit('parseSucc', that.txBlob)
          }
        }).catch(data => {
          console.log('err data:', data)
        })
      },
      handleOutlineSignClick () {
        if (this.showParser && !this.showBlob) {
          this.showPlayPwdDialog()
        } else {
          this.outlineSignBtnText = true
          this.showParser = false
          this.showTxStr = false
          this.showBlob = false
          this.txBlob = ''
          this.$emit('clearOutlineSign')
        }
      },
      signTx () {
        var that = this
        that.$refs['playPwdData'].validate((valid) => {
          if (valid) {
            var reqData = {
              txBlob: that.txBlob,
              accountNick: that.$store.state.recentLoginWalletAccount.nick.trim(),
              walletAccountPwd: that.signTxData.accountPwd
            }
            txService.signTx(reqData).then(respData => {
              if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
                that.$Message.error(that.$t(respData.msg))
                setTimeout(function () {
                  that.playPwdLoading = false
                  that.$nextTick(() => {
                    that.playPwdLoading = true
                  })
                }, 10)
                return
              }
              that.resetPlayPwdFrm()
              that.playPwdDialog = false
              that.showBuildTxDialog = true
              that.signTxData.accountPwd = ''
              that.buildTxBlobStr = respData.data.transactionString
              that.showBlob = true
              that.$emit('signSucc', that.buildTxBlobStr)
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
      showPlayPwdDialog () {
        this.showParser && (this.playPwdDialog = true)
      },
      cancelPlayPwdDialog () {
        this.resetPlayPwdFrm()
        this.$refs.playPwdData.resetFields()
        this.playPwdDialog = false
      },
      resetPlayPwdFrm () {
        this.$refs.playPwdData.resetFields()
      }
    }
  }
</script>

<style scoped>
  @import '../../assets/css/cardTitle.css';
  .unite-outline-sign-wrapper {
    padding: 20px 20px 0 20px;
  }
  .unite-outline-sign-wrapper .unsigned-tx-str {
    height: 126px;
  }
  .unite-outline-sign-wrapper .unsigned-tx-str-parser {
    padding-bottom:20px;
    overflow: hidden;
  }
  .common-manager-member {
    margin-right: 52px;
  }
  .outline-sign-btn {
    clear: both;
    margin: 0 auto 22px;
  }
  .outline-sign-btn-active {
    background: #0BDD80;
  }

  /* 待签名的交易串的解析 */
  .parser-wrapper {
    position: relative;
    width: 764px;
    min-height: 115px;
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
    margin-left: 75px;
  }
  .default-no-data .default-no-data-text {
    font-size: 12px;
    color: #C9C9C9;
    text-align: center;
  }
  /* 未签名的交易串的输入框 */
  .unsigned-tx-str-ipt {
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
  .unsigned-tx-str-ipt::-webkit-scrollbar {
    width: 4px;     
    height: 4px;
  }
  .unsigned-tx-str-ipt::-webkit-scrollbar-thumb {
    border-radius: 2px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .unsigned-tx-str-ipt::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
  .unsigned-tx-str-ipt::-webkit-input-placeholder {
    font-size: 12px;
    color: #C9C9C9;
  }
  /* 未签名交易串的解析 */
  .parser-content {
    width: 100%;
    height: 100%;
  }
  /* 待提交的交易串 */
  .unsubmitted-tx-str {
    width: 810px;
    height: auto;
    padding-bottom: 10px;
  }
  .unsubmitted-tx-str-notice {
    width: 770px;
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    border-radius: 2px;
    margin-bottom: 13px;
    color: #FF3030;
    background: #F8F8F8;
  }
  .unsubmitted-tx-str-content {
    width: 770px;
    min-height: 60px;
    font-size: 12px;
    line-height: 12px;
    word-wrap: break-word;
    color: #333;
  }
  .ivu-modal-footer{display: block;text-align: center;}
  .btn-cattle,.btn-cattle:hover{color: #fff;background-color: #FFF;border-color: #00D080;color: #00D080;}
  .unsigned-tx-str-parser .ost-card-title::before {
    display: none;
  }
  .unsubmitted-tx-str .ost-card-title::before {
    display: none;
  }
</style>
