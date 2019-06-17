<template>
  <section>
    <div v-if="!blockStatus"> 
      <div class="unite-acount-cont">
        <Button type="primary" 
          class="btn-main check-acc-btn" 
          size="small" 
          @click="openCheckModal()">{{$t('unite.listUniteAccount.checkAccountModal.checkBtnText')}}</Button>
        <Form 
          v-show="!creatSuccess.show"
          ref="createUniteAccountData" 
          :model="createUniteAccountData" 
          :rules="createUniteAccountRuleValidate" 
          label-position="right" 
          :label-width="210">
          <FormItem prop="manageType" :label="$t('unite.listUniteAccount.buildAccountForm.manageType.label')" class="manage-type-cont">
            <RadioGroup @on-change="switchManageType" v-model="createUniteAccountData.manageType">
              <Radio label="2/3">2/3</Radio>
              <Radio label="3/4">3/4</Radio>
              <Radio label="3/5">3/5</Radio>
              <Radio label="4/5">4/5</Radio>
              <Radio label="0">{{$t('unite.listUniteAccount.buildAccountForm.manageType.selfDisgin')}}
                <Tooltip placement="right-start" class="self-design-tip">
                  <i class="iconfont icon-wenhao"></i>
                  <div slot="content"><p v-html="$t('unite.listUniteAccount.buildAccountForm.manageType.toolTip')"></p></div>
                </Tooltip>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem :label="$t('unite.listUniteAccount.buildAccountForm.uniteAccountAddress.label')" prop="uniteAccountAddress">
              <Input disabled v-model="createUniteAccountData.uniteAccountAddress"></Input>
          </FormItem>
          <FormItem prop="memberNum" :label="$t('unite.listUniteAccount.buildAccountForm.memberNum.label')" v-show="createUniteAccountData.manageType == '0'">
            <Select @on-change="selectMemberNum" style="width:450px;" v-model="createUniteAccountData.memberNum" :placeholder="$t('unite.listUniteAccount.buildAccountForm.memberNum.placeholder')">
              <Option value="2" >2</Option>
              <Option value="3" >3</Option>
              <Option value="4" >4</Option>
              <Option value="5" >5</Option>
              <Option value="6" >6</Option>
              <Option value="7" >7</Option>
              <Option value="8" >8</Option>
              <Option value="9" >9</Option>
              <Option value="10" >10</Option>
              <Option value="11" >11</Option>
              <Option value="12" >12</Option>
              <Option value="13" >13</Option>
              <Option value="14" >14</Option>
              <Option value="15" >15</Option>
              <Option value="16" >16</Option>
            </Select>
          </FormItem>
          <FormItem :required="true" v-show="showMemberTable" :label="$t('unite.listUniteAccount.buildAccountForm.items.label')">
            <div class="member-table-cont">
              <div class="table-hd">
                <div class="hd-title-left">{{$t('unite.listUniteAccount.buildAccountForm.items.itemAddr')}}</div>
                <div class="hd-title-right">{{$t('unite.listUniteAccount.buildAccountForm.items.itemWeight')}}</div>
              </div>
              <div class="table-bd">
                <div v-for="(item, index) in createUniteAccountData.items" :key="index" class="table-tr">
                  <div class="tr-left">
                    <FormItem 
                      :show-message="false"
                      :prop="'items[' + index + '].address'"
                      :rules="signerAddressRuleValidate">
                      <Input 
                        v-model="item.address" 
                        icon="none" 
                        @on-blur="checkItemsAddr()"
                        :placeholder="$t('unite.listUniteAccount.buildAccountForm.items.placeholder')"></Input>
                    </FormItem>
                  </div>
                  <div class="tr-right">
                    <FormItem
                      :show-message="false"
                      :prop="'items[' + index + '].threshold'"
                      :rules="signertHresholdsRuleValidate">
                      <Input :disabled="createUniteAccountData.manageType !== '0'" v-model="item.threshold" :placeholder="$t('unite.listUniteAccount.buildAccountForm.items.placeholder')"></Input>
                    </FormItem>
                  </div>
                </div>
              </div>
            </div>
          </FormItem>
          <FormItem :label="$t('unite.listUniteAccount.buildAccountForm.masterWeight.label')" prop="masterWeight" class="masterWeight-cont">
              <Input 
                :disabled="createUniteAccountData.manageType !== '0'" 
                v-model="createUniteAccountData.masterWeight" 
                :placeholder="$t('unite.listUniteAccount.buildAccountForm.masterWeight.placeholder')"></Input>
              <div class="input-tips">{{$t('unite.listUniteAccount.buildAccountForm.masterWeight.tips')}}</div>
          </FormItem>
          <FormItem :label="$t('unite.listUniteAccount.buildAccountForm.fee.label') + ' (BU)'" prop="fee">
              <Input v-model="createUniteAccountData.fee"></Input>
              <!-- <div class="input-tips">{{$t('unite.listUniteAccount.buildAccountForm.fee.tips')}}</div> -->
          </FormItem>
          <FormItem class="form-sub-btn-cont">
            <Button v-show="isSubBtnUseful" type="primary" long class="build-unit-btn" @click="showPlayPwdDialog">{{$t('unite.listUniteAccount.buildAccountForm.subBtnText')}}</Button>
            <Button v-show="!isSubBtnUseful" type="primary" long class="build-unit-btn  btn-disabled">{{$t('unite.listUniteAccount.buildAccountForm.subBtnText')}}</Button>
          </FormItem>
        </Form>
      
        <!--联名账户创建完成显示-->
        <div v-show="creatSuccess.show" class="creat-suc-con">
          <div class="suc-img-cont">
            <svg class="icon success-icon" aria-hidden="true">
              <use xlink:href="#icon-chuangjianchenggong"></use>
            </svg>
          </div>
          <div class="suc-title">{{$t('unite.listUniteAccount.creatSuccessPage.pageTile')}}</div>
          <div class="suc-detail">{{$t('unite.listUniteAccount.creatSuccessPage.addr')}}：{{creatSuccess.addr}}</div>
          <div class="suc-btn-cont">
            <Button type="primary" long class="suc-clear-btn" @click="clearAddr()">{{$t('unite.listUniteAccount.creatSuccessPage.clearBtnText')}}</Button>
          </div>
          <div class="suc-tips-cont">
            <div class="tips-title">{{$t('unite.listUniteAccount.creatSuccessPage.pageTips.title')}}：</div>
            <div class="tips-item">1、{{$t('unite.listUniteAccount.creatSuccessPage.pageTips.no1')}}</div>
            <div class="tips-item">2、{{$t('unite.listUniteAccount.creatSuccessPage.pageTips.no2')}}</div>
          </div>
        </div>
        
      </div>
      
      <!--查询联名账户弹窗-->
      <Modal 
        v-model="checkAccountModal.show" width="480"
        :closable="true"
        @on-cancel="closeCheckModal"
        class-name="check-account-modal"
        :title="$t('unite.listUniteAccount.checkAccountModal.checkModal.title')"
        :loading="checkAccountModal.checkLoading"
        :mask-closable="false">
        <div class="check-account-input">
          <Form ref="checkAccountModal" :model="checkAccountModal" :rules="checkAccount">
            <FormItem prop="checkAddr">
              <Input v-model="checkAccountModal.checkAddr" :placeholder="$t('unite.listUniteAccount.checkAccountModal.checkModal.placeholder')"></Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <button @click="closeCheckModal()" type="button" class="ivu-btn ivu-btn-text ivu-btn-large"><span>{{$t('common.dialogButton.cancel')}}</span></button>
          <button v-if="checkAccountModal.checkAddr.length != 0" @click="subCheckAccount()" type="button" class="ivu-btn ivu-btn-primary ivu-btn-large"><span>{{$t('common.dialogButton.submit')}}</span></button>
          <button v-else type="button" class="ivu-btn ivu-btn-primary ivu-btn-large btn-disabled"><span>{{$t('common.dialogButton.submit')}}</span></button>
        </div>
      </Modal>
      
      <!--联名账户查询结果弹窗-->
      <Modal
        width="630"
        v-model="checkAccountModal.result.show"
        :closable="false"
        :mask-closable="false"
        class-name="check-result-modal"
        :title="$t('unite.listUniteAccount.checkAccountModal.resultModal.title')">
        <div class="result-cont">
          <div class="result-hd-info">
            <div class="info-item">
              <div class="item-name">{{$t('unite.listUniteAccount.checkAccountModal.resultModal.resultAddr')}}</div>
              <div class="item-detail">{{checkAccountModal.result.addr}}</div>
            </div>
            <div class="info-item">
              <div class="item-name">{{$t('unite.listUniteAccount.checkAccountModal.resultModal.resultBalance')}} (BU)</div>
              <div class="item-detail">{{checkAccountModal.result.details.tokenBalance}}</div>
            </div>
            <div class="info-item">
              <div class="item-name">{{$t('unite.listUniteAccount.checkAccountModal.resultModal.masterWeight')}}</div>
              <div class="item-detail">{{checkAccountModal.result.details.priv.thresholds.tx_threshold}}</div>
            </div>
          </div>
          <div class="result-member-table">
            <div class="table-hd">
              <div class="hd-title-left">{{$t('unite.listUniteAccount.checkAccountModal.resultModal.signerAddr')}}</div>
              <div class="hd-title-right">{{$t('unite.listUniteAccount.checkAccountModal.resultModal.signerWeight')}}</div>
            </div>
            <div class="table-bd">
              <div v-for="(item, index) in checkAccountModal.result.details.priv.signers" :key="index" class="table-tr">
                <div class="tr-left">
                  {{item.address}}
                </div>
                <div class="tr-right">
                  {{item.weight}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <button @click="closeResultModal()" type="button" class="ivu-btn ivu-btn-primary ivu-btn-large"><span>{{$t('unite.listUniteAccount.checkAccountModal.resultModal.closeBtnText')}}</span></button>
        </div>
      </Modal>
      
      <!--输入账户密码弹窗-->
      <Modal
        :title="$t('unite.listUniteAccount.pwdModal.title')"
        v-model="playPwdDialog"
        :mask-closable="false"
        :loading="playPwdLoading"
        class-name="check-pwd-modal"
        @on-cancel="cancelFrm">
        <div class="pwd-modal-tisp">{{$t('common.pwdInputNotice')}}</div>
        <div class="play-pwd-wraper">
          <Form ref="playPwdData" :model="playPwdData" :rules="playPwdRuleValidate">
            <FormItem prop="accountPwd" :error="playPwdData.accountPwdMsg">
              <Input v-model="playPwdData.accountPwd" :placeholder="$t('unite.listUniteAccount.pwdModal.placeholder')" type="password"></Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <button @click="cancelFrm()" type="button" class="ivu-btn ivu-btn-text ivu-btn-large"><span>{{$t('common.dialogButton.cancel')}}</span></button>
          <button v-if="playPwdData.accountPwd !== ''" @click="submitFrm()" type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" :loading="submitLoading"><span>{{$t('common.dialogButton.confirm')}}</span></button>
          <button v-else type="button" class="ivu-btn ivu-btn-primary ivu-btn-large btn-disabled"><span>{{$t('common.dialogButton.confirm')}}</span></button>
        </div>
      </Modal>
      
      <!--创建联名账户成功后-离开之前弹窗提示-->
      <modal
        v-model="sucConfirmModal"
        :mask-closable="false"
        :ok-text="$t('unite.listUniteAccount.creatSuccessPage.clearModal.backBtn')"
        :cancel-text="$t('unite.listUniteAccount.creatSuccessPage.clearModal.goBtn')"
        @on-cancel="hadRemember"
        :closable="false"
        width="380"
        class-name="confirm-remenber-modal">
        <div class="confirm-img">
          <svg class="icon success-icon" aria-hidden="true">
            <use xlink:href="#icon-querentishi"></use>
          </svg>
        </div>
        <div class="confirm-words">{{$t('unite.listUniteAccount.creatSuccessPage.clearModal.clearTips')}}</div>
      </modal>
    </div> 
    <div v-else class="sync-process-wrapper">
      <div class="sync-process-box">  
        <div class="sync-process">
          <span class="sync-process-percent">{{syncProgress}}</span>
        </div>
        <div class="sync-process-text">{{$t('unite.listUniteAccount.noSyncBlock')}}</div>
      </div>  
    </div>
  </section>
</template>
<script>
import accountService from '../../controllers/accountService'
import baseService from '../../controllers/baseService'
import errorUtil from '../../constants'
import config from '../../../config'
import tools from '../../utils/tools'
export default {
  props: {
    creatSuccess: Object // 联名账号创建成功显示页面所需
  },
  data () {
    return {
      submitLoading: false,
      checkAccountModal: {// 查询联名账户弹窗相关
        show: false,
        checkAddr: '',
        checkLoading: false,
        result: {
          addr: '',
          show: false,
          details: {
            tokenBalance: '',
            priv: {
              master_weight: '',
              thresholds: {
                tx_threshold: ''
              },
              signers: []
            }
          }
        }
      },
      uniteMember: this.$t('unite.listUniteAccount.buildAccountForm.items.label'),
      index: 1,
      createUniteAccountMax: 10,
      uniteAccountData: [],
      currentPage: 1,
      pageSize: 5,
      dataTotal: 0,
      createdUniteAccountDialog: false,
      sucConfirmModal: false, // 标识联名账号创建成功后--离开时的确认弹窗
      playPwdDialog: false,
      playPwdLoading: true,
      loading: false,
      showCreatedUniteAccountDialogFlag: false,
      playPwdData: {
        accountPwd: '',
        accountPwdMsg: ''
      },
      showMemberTable: false, // 标识是否显示共管成员table
      tempUniteAccountAddr: '', // 暂存联名账户地址
      tempUniteAccountPrivKey: '',
      createUniteAccountData: {// 创建联名账户提交表单
        manageType: '',
        uniteAccountAddress: '',
        uniteAccountPrivKey: '',
        memberNum: '',
        items: [
          {
            threshold: '',
            address: '',
            index: 1
          }
        ],
        fee: config.baseTxFee,
        masterWeight: '',
        signerAddress: [],
        signerThreshold: [],
        walletAccount: this.$store.state.recentLoginWalletAccount,
        walletAccountPwd: ''
      },
      createUniteAccountRuleValidate: {
        manageType: [
          { required: true, message: this.$t('error.manageType.empty'), trigger: 'change' }
        ],
        memberNum: [
          { required: true, message: this.$t('error.memberNum.empty'), trigger: 'change' }
        ],
        uniteAccountAddress: [
            { required: true, message: this.$t('error.uniteAccountAddress.empty'), trigger: 'blur' }
        ],
        masterWeight: [
          { required: true, message: this.$t('error.masterWeight.empty'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === null) {
                callback()
              }
              const reg = /^([1-9]{1})([0-9]*)$/
              if (!reg.test(value)) {
                callback(new Error(this.$t('error.masterWeight.limit')))
              }
              if (value < 0) {
                callback(new Error(this.$t('error.masterWeight.limit')))
              }
              if (parseInt(value) === 0) {
                callback(new Error(this.$t('error.masterWeight.limit')))
              }
              if (parseInt(value) > 10000) {
                callback(new Error(this.$t('error.masterWeight.limit')))
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
              const reg = /^\d+(\.\d{1,8})?$/
              if (!reg.test(value)) {
                callback(new Error(this.$t('error.fee.numLimit')))
              }
              if ((value - 0) === 0) {
                callback(new Error(this.$t('error.fee.numLimit')))
              }
              if (value > config.defaultMaxTxFee) {
                callback(new Error(this.$t('error.fee.numBig')))
              }
              callback()
            },
            trigger: 'change, blur'
          }
        ]
      },
      signerAddressRuleValidate: [
        {required: true, message: this.$t('error.signerAddr.empty'), trigger: 'change, blur'},
        {
          validator: (rule, value, callback) => {
            if (value === null) {
              callback()
            }
            var checkAccountAddressReqOpts = {
              address: value.trim()
            }
            if (this.createUniteAccountData.uniteAccountAddress === value) {
              callback(this.$t('errorUtil.ERRORS.INVALID_ACCOUNT_ADDRESS'))
            }
            var index = rule.field.match(/\d+/).toString() - 0
            for (var i = 0; i < this.createUniteAccountData.items.length; i++) {
              if (this.createUniteAccountData.items[i].address !== '' && index === i) {
                for (var j = 0; j < this.createUniteAccountData.items.length; j++) {
                  if (this.createUniteAccountData.items[i].address === this.createUniteAccountData.items[j].address && i !== j) {
                    callback(this.$t('error.signerAddr.sameMember'))
                  }
                }
              }
            }
            accountService.checkAddress(checkAccountAddressReqOpts).then(respData => {
              if (errorUtil.ERRORS.INVALID_ACCOUNT_ADDRESS.CODE === respData.errCode) {
                callback(this.$t('errorUtil.ERRORS.INVALID_ACCOUNT_ADDRESS'))
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
      signertHresholdsRuleValidate: [
        {required: true, message: this.$t('error.signertHresholds.empty'), trigger: 'change, blur'},
        {
          validator: (rule, value, callback) => {
            if (value === null) {
              callback()
            }
            const reg = /^([1-9]{1})([0-9]*)$/
            if (!reg.test(value)) {
              callback(this.$t('error.signertHresholds.limit'))
            }
            if (value < 0) {
              callback(this.$t('error.signertHresholds.limit'))
            }
            if (parseInt(value) === 0) {
              callback(this.$t('error.signertHresholds.limit'))
            }
            if (parseInt(value) > 10000) {
              callback(this.$t('error.signertHresholds.limit'))
            }
            callback()
          },
          trigger: 'change, blur'
        }
      ],
      playPwdRuleValidate: {
        accountPwd: [
            { required: true, message: this.$t('error.walletPwdEmpty'), trigger: 'blur' }
        ]
      },
      checkAccount: {
        checkAddr: [
          { required: true, message: this.$t('error.addrEmpty'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === null) {
                callback()
              }
              var checkAccountAddressReq = {
                address: value.trim()
              }
              accountService.checkAddress(checkAccountAddressReq).then(respData => {
                if (errorUtil.ERRORS.INVALID_ACCOUNT_ADDRESS.CODE === respData.errCode) {
                  callback(this.$t('errorUtil.ERRORS.INVALID_ACCOUNT_ADDRESS'))
                } else {
                  callback()
                }
              }).catch(data => {
                console.log('err data:', data)
              })
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    canInputMasterWeight () { // 门限权重是否可输入
      if (this.createUniteAccountData.manageType === '0') {
        return true
      } else {
        return false
      }
    },
    isSubBtnUseful () { // 标识创建按钮是否可用
      var result = true
      var form = this.createUniteAccountData
      if (form.manageType === '' || form.masterWeight === '' || form.fee === '' || form.memberNum === '' || form.items.length === 0) {
        result = false
      }
      for (var i = 0; i < form.items.length; i++) {
        if (form.items[i].address === '' || form.items[i].threshold === '') {
          result = false
        }
      }
      return result
    },
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
    checkItemsAddr () {
      for (var i = 0; i < this.createUniteAccountData.items.length; i++) {
        if (this.createUniteAccountData.items[i].address !== '') {
          this.$refs['createUniteAccountData'].validateField('items[' + i + '].address')
        }
      }
    },
    hadRemember () {
      var that = this
      that.sucConfirmModal = false
      that.$refs.createUniteAccountData.resetFields()
      that.$emit('setSucPage', {show: false, addr: ''})
      that.tempUniteAccountAddr = ''
      that.showMemberTable = false
    },
    clearAddr () { // 创建成功结果页清空按钮事件
      var that = this
      that.sucConfirmModal = true
    },
    selectMemberNum (val) { // 自定义时，选择共管成员数量
      var that = this
      if (val !== '' && that.createUniteAccountData.manageType === '0') {
        var arr = []
        for (var i = 0; i < parseInt(val); i++) {
          var obj = {
            threshold: '',
            address: '',
            index: i + 1
          }
          arr.push(obj)
        }
        var num = parseInt(val)
        that.createUniteAccountData.items = arr
        that.showMemberTable = true
        switch (num) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5: this.createUniteAccountData.fee = '0.01'; break
          case 6: this.createUniteAccountData.fee = '0.06'; break
          case 7:
          case 8:
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
          case 14:
          case 15:
          case 16: this.createUniteAccountData.fee = '0.1'; break
        }
      }
    },
    switchManageType (type) { // 切换共管模式
      var that = this
      that.$refs.createUniteAccountData.resetFields()
      that.buildAccount()
      that.createUniteAccountData.manageType = type
      if (type === '0') {
        that.createUniteAccountData.items = []
        that.showMemberTable = false
        that.createUniteAccountData.masterWeight = ''
        that.createUniteAccountData.memberNum = ''
      } else {
        var denominator = parseInt(type.split('/')[1])
        var molecular = parseInt(type.split('/')[0])
        var arr = []
        for (var i = 0; i < denominator; i++) {
          var obj = {
            threshold: '10',
            address: '',
            index: i + 1
          }
          arr.push(obj)
        }
        that.createUniteAccountData.memberNum = denominator + ''
        that.createUniteAccountData.items = arr
        that.createUniteAccountData.masterWeight = (molecular * 10) + ''
        that.showMemberTable = true
      }
    },
    openCheckModal () { // 打开查询联名账户modal
      this.checkAccountModal.show = true
    },
    closeCheckModal () { // 关闭查询联名账户modal
      this.checkAccountModal.show = false
      this.checkAccountModal.checkAddr = ''
      this.$refs.checkAccountModal.resetFields()
    },
    subCheckAccount () { // 提交查询
      var that = this
      that.$refs['checkAccountModal'].validate((valid) => {
        if (valid) {
          var address = that.checkAccountModal.checkAddr.trim()
          accountService.getAccountInfo(address).then(respData => {
            if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
              that.$Message.error({
                content: that.$t(respData.msg),
                duration: 3
              })
              setTimeout(function () {
                that.checkAccountModal.checkLoading = false
                that.$nextTick(() => {
                  that.checkAccountModal.checkLoading = true
                })
              }, 10)
            } else {
              if (respData.data.priv !== undefined && respData.data.priv.hasOwnProperty('signers')) { // 判断是否为联名账户
                that.checkAccountModal.show = false
                that.checkAccountModal.result.details = respData.data
                that.checkAccountModal.result.addr = that.checkAccountModal.checkAddr.toString()
                that.checkAccountModal.result.show = true
                that.$refs.checkAccountModal.resetFields()
                setTimeout(function () {
                  that.checkAccountModal.checkLoading = false
                  that.$nextTick(() => {
                    that.checkAccountModal.checkLoading = true
                  })
                }, 10)
              } else {
                that.$Message.error({
                  content: this.$t('error.notUniteAccount'),
                  duration: 3
                })
                setTimeout(function () {
                  that.checkAccountModal.checkLoading = false
                  that.$nextTick(() => {
                    that.checkAccountModal.checkLoading = true
                  })
                }, 10)
              }
            }
          }).catch(data => {
            console.log('err data:', data)
          })
        }
      })
    },
    closeResultModal () { // 关闭查询结果弹窗
      this.checkAccountModal.result.show = false
    },
    showCreatedUniteAccountDialog () {
      var that = this
      that.checkAccountStatus()
      if (that.showCreatedUniteAccountDialogFlag) {
        that.buildAccount()
      }
    },
    showPlayPwdDialog () { // 创建--验证表单
      var that = this
      // if (!navigator.onLine) {
      //   this.$Message.error(this.$t('errorUtil.ERRORS.NET_OFFLINE'))
      //   return
      // }
      that.$refs['createUniteAccountData'].validate((valid) => {
        var memberListDom
        for (var n = 0; n < that.$refs['createUniteAccountData'].$children.length; n++) { // 找出共管成员子组件
          if (that.$refs['createUniteAccountData'].$children[n].label === this.uniteMember) {
            memberListDom = that.$refs['createUniteAccountData'].$children[n].$children
            break
          }
        }
        for (var m = 0; m < memberListDom.length; m++) { // 循环并读取报错信息
          if (memberListDom[m].validateMessage !== '') {
            that.$Message.error({
              content: memberListDom[m].validateMessage,
              duration: 3
            })
            return
          }
        }
        if (valid) {
          var setAccountWeight = 0
          var reqParams = that.createUniteAccountData
          var signers = []
          var signer = {
            address: '',
            weight: 0
          }
          for (var j = 0, len = reqParams.items.length; j < len; j++) {
            signer.address = reqParams.items[j].address
            signer.weight = parseInt(reqParams.items[j].threshold)
            setAccountWeight += signer.weight
            signers.push(signer)
            signer = {}
          }
          if (setAccountWeight === 0) {
            that.$Message.error({
              content: that.$t('errorUtil.ERRORS.NOT_ADD_SIGNER_ACCOUNT_ERROR'),
              duration: 3
            })
            return
          }
          if (setAccountWeight < parseInt(reqParams.masterWeight)) {
            that.$Message.error({
              content: that.$t('error.masterWeight.weightLessThanMasterWeight'),
              duration: 3
            })
            return
          }
          var checkAccountAddressReqOpts = {
            address: that.$store.state.recentLoginWalletAccount.address
          }
          accountService.checkAddress(checkAccountAddressReqOpts).then(respData => { // Verify that the account is active
            if (errorUtil.ERRORS.NOT_ACTIVE_ACCOUNT_ERROR.CODE === respData.errCode) {
              that.$Message.error({
                content: that.$t('error.unactivedCantCreate'),
                duration: 3
              })
              return
            } else {
              var reqData = {
                walletAddress: that.createUniteAccountData.walletAccount.address
              }
              // Verify that the available balance is greater than 0.21.
              accountService.getAccountTokenBalance(reqData).then(respData => {
                if (errorUtil.ERRORS.SUCCESS.CODE === respData.errCode) {
                  var minBalance = (that.createUniteAccountData.fee - 0) + 0.2
                  if ((respData.data.tokenBalance - 0) <= minBalance) {
                    that.$Message.error(that.$t('errorUtil.ERRORS.ACCOUNT_LOW_RESERVE_ERROR'))
                    return
                  } else {
                    that.playPwdDialog = true
                  }
                }
              }).catch(data => {
                console.log('err data:', data)
              })
            }
          }).catch(data => {
            console.log('err data:', data)
          })
        }
      })
    },
    buildAccount () {
      var that = this
      if (that.tempUniteAccountAddr === '') {
        accountService.buildAccount().then(respData => {
          if (errorUtil.ERRORS.SUCCESS.CODE === respData.errCode) {
            that.createUniteAccountData.uniteAccountAddress = respData.data.address
            that.createUniteAccountData.uniteAccountPrivKey = respData.data.privKey
            that.tempUniteAccountAddr = respData.data.address
            that.tempUniteAccountPrivKey = respData.data.privKey
          }
        }).catch(data => {
          console.log('err data:', data)
        })
      } else {
        that.createUniteAccountData.uniteAccountAddress = that.tempUniteAccountAddr
      }
    },
    submitFrm () {
      var that = this
      that.$refs['playPwdData'].validate((valid) => {
        that.createUniteAccountData.walletAccountPwd = that.playPwdData.accountPwd
        var reqParams = that.createUniteAccountData
        // console.log(JSON.stringify(reqParams)) Prohibit printing passwords
        if (valid) {
          if (that.submitLoading) return
          that.submitLoading = true
          baseService.testNetworkOnline().then(res => {
            console.log('----------------------- Network OK! --------------------')
            that.submitLoading = false
            accountService.createUnitAccount(reqParams).then(respData => {
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
                that.createdUniteAccountDialog = false
                that.$emit('setSucPage', {show: true, addr: respData.data.address})
                that.playPwdDialog = false
                that.$refs.playPwdData.resetFields()
                setTimeout(function () {
                  that.playPwdLoading = false
                  that.$nextTick(() => {
                    that.playPwdLoading = true
                  })
                }, 10)
              }
            }).catch(data => {
              console.log('err data:', data)
            })
          }).catch(error => {
            console.log('----------------------- Network ERROR! --------------------')
            that.submitLoading = false
            that.$Message.error(this.$t('errorUtil.ERRORS.NET_OFFLINE'))
          })
          
        } else {
          setTimeout(function () {
            that.playPwdLoading = false
            that.$nextTick(() => {
              that.playPwdLoading = true
            })
          }, 10)
        }
      })
    },
    cancelFrm () {
      this.playPwdDialog = false
      this.$refs.playPwdData.resetFields()
    },
    cancelCreatedUniteAccountDialog () {
      this.$refs.createUniteAccountData.resetFields()
      this.createUniteAccountData.items = [{
        threshold: '',
        address: '',
        index: 1,
        status: 1
      }]
    },
    changePage (e) {
      this.currentPage = e
      this.listMyUniteAccount()
    },
    changePageSize () {
      console.log('changePageSize')
    },
    listMyUniteAccount () { // 获取联名账户列表----暂未使用
      var that = this
      var reqParams = {
        pageStartIndex: (that.currentPage - 1) * that.pageSize,
        pageSize: that.pageSize
      }
      accountService.listMyUniteAccount(reqParams).then(respData => {
        if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
          that.$Message.error({
            content: that.$t(respData.msg),
            duration: 3
          })
        } else {
          that.uniteAccountData = respData.data.addressList
          that.dataTotal = respData.data.address.total
        }
      }).catch(data => {
        console.log('err data:', data)
      })
    },
    checkAccountStatus () { // 检查钱包状态
      var that = this
      var checkAccountAddressReqOpts = {
        address: that.$store.state.recentLoginWalletAccount.address
      }
      accountService.checkAddress(checkAccountAddressReqOpts).then(respData => {
        if (errorUtil.ERRORS.NOT_ACTIVE_ACCOUNT_ERROR.CODE === respData.errCode) {
          that.$Message.error({
            content: that.$t('error.unactivedCantCreate'),
            duration: 3
          })
          return false
        } else {
          return true
        }
      }).catch(data => {
        console.log('err data:', data)
      })
    }
  },
  created () {
    // var that = this
    // console.log(that.createUniteAccountData)
  }
}
</script>
<style lang="less">
@import "../../assets/less/base.less";
.unite-acount-cont{
  position: relative;
  padding-top:20px;
  & .check-acc-btn{
    position: absolute;
    top: 20px;
    right: 20px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 999;
    &>span{
      font-size: 14px;
    }
  }
  & .ivu-form .ivu-form-item-label{
    font-size: 14px;
  }
  label{
    font-size: 14px;
  }
  & .ivu-input{
    font-size: 14px;
    color: #333;
    width: 450px;
  }
  & .manage-type-cont{
    & .ivu-radio-wrapper{
      margin-right: 28px;
    }
    & .ivu-radio-checked .ivu-radio-inner{
      box-sizing: border-box;
      border: 4px solid #00D080;
    }
    & .ivu-radio-checked .ivu-radio-inner:after{
      opacity: 0;
    }
    & .self-design-tip {
      & i {
        color: #999;
      }
    }
  }
  & .ivu-select-visible .ivu-select-selection{
    box-shadow: none;
  }
  & .ivu-select-single .ivu-select-selection{
    border: 1px solid #dddee1;
    height: 36px;
  }
  & .ivu-form-item-error .ivu-select-selection{
    border-color: #ed3f14;
    &:hover{
      border-color: #ed3f14;
    }
  }
  & .ivu-select-single .ivu-select-selection .ivu-select-placeholder{
    height: 34px;
    line-height: 34px;
  }
  & .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
    height: 34px;
    line-height: 34px;
  }
  & .ivu-select-selection:hover{
    border-color: #00D080;
  }
  & .member-table-cont{
    width: 450px;
    border-top: 1px solid #DEDEDE;
    border-left: 1px solid #DEDEDE;
    border-radius:4px ;
    font-size: 14px;
    & div{
      box-sizing: border-box;
    }
    & .table-hd{
      display: flex;
      background: #F8F8F8;
      height: 36px;
      line-height: 34px;
      color: #666;
      border-bottom: 1px solid #DEDEDE;
      & .hd-title-left{
        width: 350px;
        text-align: center;
        border-right: 1px solid #DEDEDE;
      }
      & .hd-title-right{
        text-align: center;
        width: 100px;
        border-right: 1px solid #DEDEDE;
      }
    }
    & .table-bd{
      & .table-tr{
        border-bottom: 1px solid #DEDEDE;
        display: flex;
        & .tr-left{
          width: 350px;
          border-right: 1px solid #DEDEDE;
          & .ivu-input{
            text-align: center;
            border: 1px solid #fff;
            width: 100%;
            border-radius: 0;
            padding-right: 7px;
            &:focus{
              box-shadow: none;
            }
          }
          & .ivu-input-icon{
            display: none;
          }
          & .ivu-form-item-error .ivu-input{
            border-color: #ed3f14;
          }
        }
        & .tr-right{
          width: 100px;
          border-right: 1px solid #DEDEDE;
          & .ivu-input{
            text-align: center;
            border: 1px solid #fff;
            width: 100%;
            border-radius: 0;
            &:focus{
              box-shadow: none;
            }
          }
          & .ivu-form-item-error .ivu-input{
            border-color: #ed3f14;
          }
        }
      }
    }
  }
  .build-unit-btn{
    width: 450px;
    &.btn-disabled{
      opacity: 0.5;
    }
  }
  & .input-tips{
    height: 18px;
    line-height:25px ;
  }
}

/*查询联名账户弹窗*/
.check-account-modal{
  display: flex;
  align-items: center;
  justify-content: center;
  & .ivu-modal{
    top: 0;
  }
  & .ivu-modal-header-inner{
    font-size: 16px;
    color: #333;
  }
  & .ivu-modal-body{
    padding: 30px 30px 0px;
  }
  & .ivu-modal-footer{
    border-top: none;
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
    padding-top: 5px;
    & .ivu-btn-text{
      color: #00D080;
      border: 1px solid #00D080;
      font-size: 16px;
      height: 36px;
      line-height: 21px;
    }
    & .ivu-btn-primary{
      font-size: 16px;
      height: 36px;
      line-height: 21px;
      &.btn-disabled{
        opacity: 0.6;
      }
    }
    & button+button{
      margin-left: 20px;
    }
  }
}
/*查询结果弹窗*/
.check-result-modal{
  display: flex;
  align-items: center;
  justify-content: center;
  & .ivu-modal{
    top: 0;
  }
  & .ivu-modal-header-inner{
    font-size: 16px;
    color: #333;
  }
  & .ivu-modal-body{
    padding: 0px;
    height: 253px;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 4px;     
      height: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 2px;
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: rgba(0,0,0,0.2);
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 0px rgba(0,0,0,0.2);
      border-radius: 0;
      background: rgba(0,0,0,0);
    }
    & .result-cont{
      padding: 30px 30px 0;
      & .result-hd-info{
        & .info-item{
          height: 30px;
          line-height: 30px;
          margin-bottom: 2px;
          .clearfix;
          & .item-name{
            float: left;
            width: 150px;
            height: 30px;
            background:#F8F8F8 ;
            text-align: center;
            color: #666;
          }
          & .item-detail{
            float: left;
            height: 30px;
            padding-left: 8px;
            color: #333;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      & .result-member-table{
        margin-top: 15px;
        width: 570px;
        border-top: 1px solid #DEDEDE;
        border-left: 1px solid #DEDEDE;
        border-radius:4px ;
        font-size: 14px;
        & div{
          box-sizing: border-box;
        }
        & .table-hd{
          display: flex;
          background: #F8F8F8;
          height: 36px;
          line-height: 34px;
          color: #666;
          border-bottom: 1px solid #DEDEDE;
          & .hd-title-left{
            width: 450px;
            text-align: center;
            border-right: 1px solid #DEDEDE;
          }
          & .hd-title-right{
            text-align: center;
            width: 120px;
            border-right: 1px solid #DEDEDE;
          }
        }
        & .table-bd{
          line-height: 34px;
          & .table-tr{
            border-bottom: 1px solid #DEDEDE;
            display: flex;
            & .tr-left{
              width: 450px;
              border-right: 1px solid #DEDEDE;
              text-align: center;
            }
            & .tr-right{
              width: 120px;
              border-right: 1px solid #DEDEDE;
              text-align: center;
            }
          }
        }
      }
    }
    
  }
  & .ivu-modal-footer{
    border-top: none;
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
    padding-top: 18px;
  }
}

/*输入密码弹窗*/
.check-pwd-modal{
  display: flex;
  align-items: center;
  justify-content: center;
  & .ivu-modal{
    top: 0;
  }
  & .ivu-modal-header-inner{
    font-size: 16px;
    color: #333;
  }
  & .ivu-modal-body{
    padding:25px 30px 0px;
    & .pwd-modal-tisp{
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-bottom: 12px;
    }
  }
  & .ivu-modal-footer{
    border-top: none;
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
    padding-top: 5px;
    & .ivu-btn-text{
      color: #00D080;
      border: 1px solid #00D080;
      font-size: 16px;
      height: 36px;
      line-height: 21px;
    }
    & .ivu-btn-primary{
      font-size: 16px;
      height: 36px;
      line-height: 21px;
      &.btn-disabled{
        opacity: 0.6;
      }
    }
    & button+button{
      margin-left: 20px;
    }
  }
}
/*账号创建成功页*/
.creat-suc-con{
  width: 500px;
  margin: 0px auto;
  padding-top: 85px;
  text-align: center;
  & .success-icon{
    width: 70px;
    height: 70px;
  }
  & .suc-title{
    font-size: 16px;
    color: #333;
    padding: 6px 0;
    font-weight: bold;
  }
  & .suc-detail{
    margin-top: 8px;
    line-height: 24px;
    color:#666 ;
  }
  & .suc-tips-cont{
    text-align: left;
    margin-top: 15px;
    line-height: 18px;
    font-size: 12px;
    color:#FF3030 ;
  }
  & .suc-btn-cont{
    margin-top: 10px;
  }
}
/*账户创建成功---离开页面时弹窗提示*/
.confirm-remenber-modal{
  display: flex;
  justify-content: center;
  align-items: center;
  & .ivu-modal{
    top: 0;
  }
  & .ivu-modal-body{
    text-align: center;
    padding:25px 30px 0px;
    & .confirm-img{
      & .success-icon{
        width: 70px;
        height: 70px;
      }
    }
    & .confirm-words{
      font-size: 14px;
      color: #333;
      font-weight: normal;
      
    }
  }
  & .ivu-modal-footer{
    border-top: none;
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
    padding-top: 15px;
    & .ivu-btn-text{
      color: #00D080;
      border: 1px solid #00D080;
      font-size: 16px;
      height: 36px;
      line-height: 21px;
    }
    & .ivu-btn-primary{
      font-size: 16px;
      height: 36px;
      line-height: 21px;
      &.btn-disabled{
        opacity: 0.6;
      }
    }
    & button+button{
      margin-left: 20px;
    }
  }
}
.sync-process-wrapper {
  width: 100%;
  height: 420px;
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
</style>
