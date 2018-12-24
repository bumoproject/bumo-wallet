import bSdk from '../extend/blockchain-sdk'
import errorUtil from '../constants'
import tools from '../utils/tools'
import baseService from '../controllers/baseService'
export default {
  create (opts) {
    return new Promise((resolve, reject) => {
      var reqOpts = {
        accountNick: opts.name,
        pwd: opts.password
      }
      var respData = {
        errCode: 0,
        msg: 'success'
      }
      bSdk.account.create(reqOpts).then(createAccountRespData => {
        console.log('create wallet account ' + JSON.stringify(createAccountRespData))
        if (errorUtil.ERRORS.SUCCESS.CODE === createAccountRespData.errCode) {
        } else if (errorUtil.INPORT_ACCOUNT_PARIVATE_KEY.NICKNAME_EXISTS_CODE === createAccountRespData.errCode) {
          respData.errCode = errorUtil.ERRORS.NICKNAME_EXISTS_ERROR.CODE
          respData.msg = 'errorUtil.ERRORS.NICKNAME_EXISTS_ERROR'
        } else {
          respData.errCode = errorUtil.ERRORS.CREATE_ACCOUNT_ERROR.CODE
          respData.msg = 'errorUtil.ERRORS.CREATE_ACCOUNT_ERROR'
        }
        resolve(respData)
      })
    })
  },
  login (opts) {
    // 账号登录
    return new Promise((resolve, reject) => {
      var reqOpts = {
        accountNick: opts.name,
        pwd: opts.password
      }
      var respData = bSdk.account.login(reqOpts)
      resolve(respData)
    })
  },
  loadWalletName () {
    return new Promise((resolve, reject) => {
      var respData = bSdk.account.loadWalletName()
      resolve(respData)
    })
  },
  getTokenList (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        page: {
          total: 3
        },
        tokens: [
          {
            assetCode: 'LTC',
            icon: '...',
            type: '1',
            issuerAddress: ''
          }
        ]
      }
    }
    return new Promise((resolve, reject) => {
      bSdk.tx.getTokenType().then(respTokenListData => {
        if (errorUtil.ERRORS.SUCCESS.CODE === respTokenListData.errCode) {
          respData.data = respTokenListData.data
//        console.log(respTokenListData)
        }
        resolve(respData)
      })
    })
  },
  getAvailableBalanceAndTokenList (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        balance: '',
        tokens: [
          {
            code: '',
            issuer: '',
            amount: '',
            decimals: ''
          }
        ]
      }
    }
    return new Promise((resolve, reject) => {
      bSdk.tx.getBalanceAndTokens(opts.address).then(respTokenListData => {
        if (errorUtil.ERRORS.SUCCESS.CODE === respTokenListData.errCode) {
          respData.data = respTokenListData.data
        } else {
          respData.errCode = respTokenListData.errCode
        }
        resolve(respData)
      }).catch((e) => {
        reject()
      })
    })
  },
  loadWalletTokenAndRecentTxs (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        tokenBalance: 0,
        tokenReserve: 0,
        txs: []
      }
    }
    return new Promise((resolve, reject) => {
      var reqWalletAccountTokenBalanceOpts = {
        address: opts.walletAddress
      }
      var reqGetAccountLastTxData = {
        pageStartIndex: 0,
        pageSize: 5
      }
      bSdk.tx.getTxsList(reqGetAccountLastTxData).then(respGetAccountLastTxData => {
        if (errorUtil.ERRORS.SUCCESS.CODE === respGetAccountLastTxData.errCode) {
          respData.data.txs = respGetAccountLastTxData.data.txs
        }
      })
      bSdk.account.getAccountTokenBalance(reqWalletAccountTokenBalanceOpts).then(respGetAccountTokenBalanceData => {
        // console.log('getAccountTokenBalance: ' + JSON.stringify(respGetAccountTokenBalanceData))
        if (errorUtil.ERRORS.SUCCESS.CODE === respGetAccountTokenBalanceData.errCode) {
          respData.data.tokenBalance = tools.commafy(respGetAccountTokenBalanceData.data.amount)
          respData.data.tokenReserve = tools.commafy(respGetAccountTokenBalanceData.data.reserve)
        }
        resolve(respData)
      })
    })
  },
  getAccountTokenBalance (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        tokenBalance: 0,
        tokenReserve: 0
      }
    }
    return new Promise((resolve, reject) => {
      var reqWalletAccountTokenBalanceOpts = {
        address: opts.walletAddress
      }
      bSdk.account.getAccountTokenBalance(reqWalletAccountTokenBalanceOpts).then(respGetAccountTokenBalanceData => {
        if (errorUtil.ERRORS.SUCCESS.CODE === respGetAccountTokenBalanceData.errCode) {
          respData.data.tokenBalance = respGetAccountTokenBalanceData.data.amount
          respData.data.tokenReserve = respGetAccountTokenBalanceData.data.reserve
          resolve(respData)
        } else {
          respData.errCode = respGetAccountTokenBalanceData.errCode
          resolve(respData)
        }
      }).catch((e) => {
        reject(e)
      })
    })
  },
  getAccountPrivKeyStr (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        privKeyStr: ''
      }
    }
    return new Promise((resolve, reject) => {
      var reqData = {
        accountNick: opts.accountNick,
        pwd: opts.accountPwd
      }
      bSdk.account.getAccountPrivKeyStr(reqData).then(sdkRespData => {
        if (errorUtil.ERRORS.SUCCESS.CODE === sdkRespData.errCode) {
          respData.data.privKeyStr = sdkRespData.data.privKeyStr
        } else {
          respData.errCode = errorUtil.ERRORS.INVALID_ACCOUNT_PWD.CODE
          respData.msg = 'errorUtil.ERRORS.INVALID_ACCOUNT_PWD'
        }
        resolve(respData)
      })
    })
  },
  saveAccountPrivKeyFile (opts) {
    var respData = {
      errCode: 0,
      msg: 'success'
    }
    return new Promise((resolve, reject) => {
      var reqData = {
        accountNick: opts.accountNick,
        savePrivPath: opts.savePrivPath
      }
      bSdk.account.saveAccountPrivKeyFile(reqData).then(sdkRespData => {
        if (errorUtil.ERRORS.SUCCESS.CODE !== sdkRespData.errCode) {
          respData.errCode = errorUtil.ERRORS.SAVE_ACCOUNT_PRIVATE_KEY_FIEL_ERROR.CODE
          respData.msg = 'errorUtil.ERRORS.SAVE_ACCOUNT_PRIVATE_KEY_FIEL_ERROR'
        }
        resolve(respData)
      })
    })
  },
  recoverAccountByPrviateKeyStr (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        privKeyStr: ''
      }
    }
    return new Promise((resolve, reject) => {
      var reqData = {
        accountNick: opts.accountNick,
        pwd: opts.accountPwd,
        privKeyStr: opts.accountPrivKeyStr

      }
      bSdk.account.importAccountPrivStr(reqData).then(sdkRespData => {
        console.log(JSON.stringify(sdkRespData))
        if (errorUtil.ERRORS.SUCCESS.CODE === sdkRespData.errCode) {
          console.log(JSON.stringify(sdkRespData.data))
        } else if (errorUtil.INPORT_ACCOUNT_PARIVATE_KEY.NICKNAME_EXISTS_CODE === sdkRespData.errCode) {
          respData.errCode = errorUtil.ERRORS.NICKNAME_EXISTS_ERROR.CODE
          respData.msg = 'errorUtil.ERRORS.NICKNAME_EXISTS_ERROR'
        } else {
          respData.errCode = errorUtil.ERRORS.RECOVER_ACCOUNT_ERROR.CODE
          respData.msg = 'errorUtil.ERRORS.RECOVER_ACCOUNT_ERROR'
        }
        resolve(respData)
      })
    })
  },
  recoverAccountByPrviateKeyFile (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {}
    }
    return new Promise((resolve, reject) => {
      var reqData = {
        accountNick: opts.accountNick,
        pwd: opts.accountPwd,
        privKeyFile: opts.accountPrivatekeyFilePath
      }
      bSdk.account.importAccountPrivFile(reqData).then(sdkRespData => {
        console.log(JSON.stringify(sdkRespData))
        if (errorUtil.ERRORS.SUCCESS.CODE === sdkRespData.errCode) {
          console.log(JSON.stringify(sdkRespData.data))
        } else if (errorUtil.ACCOUNT_STATE.INVALID_ACCOUNT_PWD === sdkRespData.errCode) {
          respData.errCode = errorUtil.ERRORS.INVALID_ACCOUNT_PWD.CODE
          respData.msg = 'errorUtil.ERRORS.INVALID_ACCOUNT_PWD'
        } else if (errorUtil.INPORT_ACCOUNT_PARIVATE_KEY.NICKNAME_EXISTS_CODE === sdkRespData.errCode) {
          respData.errCode = errorUtil.ERRORS.NICKNAME_EXISTS_ERROR.CODE
          respData.msg = 'errorUtil.ERRORS.NICKNAME_EXISTS_ERROR'
        } else {
          respData.errCode = errorUtil.ERRORS.RECOVER_ACCOUNT_ERROR.CODE
          respData.msg = 'errorUtil.ERRORS.RECOVER_ACCOUNT_ERROR'
        }
        resolve(respData)
      })
    })
  },
  checkAddress (opts) {
    var respData = {
      errCode: 0,
      msg: 'success'
    }
    return new Promise((resolve, reject) => {
      var reqData = {
        address: opts.address
      }
      bSdk.tx.checkAddress(reqData).then(sdkRespData => {
        console.log('bumo wallet checkAddress: ' + JSON.stringify(sdkRespData))
        if (errorUtil.ERRORS.SUCCESS.CODE === sdkRespData.errCode) {
          var validData = sdkRespData.data.valid
          if (validData === errorUtil.ACCOUNT_ADDRESS_STATUS.S1) {
            respData.errCode = errorUtil.ERRORS.NOT_ACTIVE_ACCOUNT_ERROR.CODE
            respData.msg = 'errorUtil.ERRORS.NOT_ACTIVE_ACCOUNT_ERROR'
          } else if (validData === errorUtil.ACCOUNT_ADDRESS_STATUS.S2) {
          } else if (validData === errorUtil.ACCOUNT_ADDRESS_STATUS.S3) {
            respData.errCode = errorUtil.ERRORS.INVALID_ACCOUNT_ADDRESS.CODE
            respData.msg = 'errorUtil.ERRORS.INVALID_ACCOUNT_ADDRESS'
          }
        } else {
          respData.errCode = errorUtil.ERRORS.RECOVER_ACCOUNT_ERROR.CODE
          respData.msg = 'errorUtil.ERRORS.RECOVER_ACCOUNT_ERROR'
        }
        resolve(respData)
      })
    })
  },
  // 构建钱包账户
  buildAccount (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        address: ''
      }
    }
    return new Promise((resolve, reject) => {
      bSdk.tx.getNewAddress().then(sdkRespData => {
        console.log('bumo wallet getNewAddress: ' + JSON.stringify(sdkRespData))
        if (errorUtil.ERRORS.SUCCESS.CODE === sdkRespData.errCode) {
          respData.data.address = sdkRespData.data.address
          respData.data.privKey = sdkRespData.data.privKey
        }
        resolve(respData)
      })
    })
  },
  // 创建联名账户
  createUnitAccount (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        address: ''
      }
    }
    return new Promise((resolve, reject) => {
      var srcAddress = opts.walletAccount.address
      var destAddress = opts.uniteAccountAddress
      var signers = []

      var signer = {
        address: '',
        weight: 0
      }
      var setAccountWeight = 0
      for (var j = 0, len = opts.items.length; j < len; j++) {
        signer.address = opts.items[j].address
        signer.weight = parseInt(opts.items[j].threshold)
        setAccountWeight += signer.weight
        signers.push(signer)
        signer = {}
      }

      if (setAccountWeight < parseInt(opts.masterWeight)) {
        respData.errCode = errorUtil.ERRORS.SET_UNIT_WEIGHT_ERROR.CODE
        respData.msg = 'errorUtil.ERRORS.SET_UNIT_WEIGHT_ERROR'
        resolve(respData)
        return
      }
      // 获取balanceInit
      var balanceInit = 0
      bSdk.account.getAccountTokenBalance({address: srcAddress}).then(respGetAccountTokenBalanceData => {
        if (errorUtil.ERRORS.SUCCESS.CODE === respGetAccountTokenBalanceData.errCode) {
          balanceInit = respGetAccountTokenBalanceData.data.reserve
        }
        var signerCounts = 2
        baseService.getCreateAccountGasPrice(srcAddress, destAddress, opts.fee, signerCounts).then(respSendTokenGasPriceData => {
          var gasPrice = respSendTokenGasPriceData
          var printData = {
            srcAddress,
            destAddress,
            feeLimit: opts.fee,
            gasPrice: gasPrice,
            accountNick: opts.walletAccount.nick,
            balanceInit,
            threshold: {
              tx: opts.masterWeight
            },
            signers,
            weight: 0
          }
          var reqData = {
            srcAddress,
            destAddress,
            feeLimit: opts.fee,
            gasPrice: gasPrice,
            privateKeyDest: opts.uniteAccountPrivKey,
            accountNick: opts.walletAccount.nick,
            balanceInit,
            pwd: opts.walletAccountPwd,
            threshold: {
              tx: opts.masterWeight
            },
            signers,
            weight: 0
          }
          console.log('bumo wallet createUnitAccount.req: ' + JSON.stringify(printData))
          bSdk.tx.createAccount(reqData).then(sdkRespData => {
            console.log('bumo wallet createUnitAccount.resp: ' + JSON.stringify(sdkRespData))
            if (errorUtil.ERRORS.SUCCESS.CODE === sdkRespData.errCode) {
              respData.data.address = destAddress
            } else if (errorUtil.ACCOUNT_STATE.INVALID_ACCOUNT_PWD === sdkRespData.errCode) {
              respData.errCode = errorUtil.ERRORS.INVALID_ACCOUNT_PWD.CODE
              respData.msg = 'errorUtil.ERRORS.INVALID_ACCOUNT_PWD'
            } else if (errorUtil.BUMO_ERROR.ACCOUNT_LOW_RESERVE === sdkRespData.errCode) {
              respData.errCode = errorUtil.ERRORS.ACCOUNT_BU_TOKEN_NOT_ENOUGH_ERROR.CODE
              respData.msg = 'errorUtil.ERRORS.ACCOUNT_BU_TOKEN_NOT_ENOUGH_ERROR'
            } else if (errorUtil.BUMO_ERROR.NOT_ENOUGH_TX_FEE === sdkRespData.errCode) {
              respData.errCode = errorUtil.ERRORS.NOT_ENOUGH_TX_FEE_ERROR.CODE
              respData.msg = 'errorUtil.ERRORS.NOT_ENOUGH_TX_FEE_ERROR'
            } else {
              respData.errCode = errorUtil.ERRORS.FAIL.CODE
              respData.msg = 'errorUtil.ERRORS.FAIL'
            }
            resolve(respData)
          })
        })
      })
    })
  },
  listMyUniteAccount (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {}
    }
    return new Promise((resolve, reject) => {
      var reqData = {
        pageStartIndex: opts.pageStartIndex,
        pageSize: opts.pageSize
      }
      bSdk.tx.getAccountList(reqData).then(sdkRespData => {
        console.log('bumo wallet listMyUnitAccount' + JSON.stringify(sdkRespData))
        if (errorUtil.ERRORS.SUCCESS.CODE === sdkRespData.errCode) {
          respData.data = sdkRespData.data
        }
        resolve(respData)
      })
    })
  },
  async getBaseData (address) {
    var reqWalletAccountTokenBalanceOpts = {
      address: address
    }
    await bSdk.account.getAccountTokenBalance(reqWalletAccountTokenBalanceOpts).then(respGetAccountTokenBalanceData => {
      var respData = {
        reserve: respGetAccountTokenBalanceData.data.reserve,
        gasPrice: respGetAccountTokenBalanceData.data.gasPrice
      }

      return respData
    })
  },
  getAccountInfo (address) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        tokenBalance: 0,
        priv: {
          master_weight: 1,
          thresholds: {
            tx_threshold: 1
          },
          signers: []
        }
      }
    }
    return new Promise((resolve, reject) => {
      var reqWalletAccountTokenBalanceOpts = {
        address: address
      }
      bSdk.account.getAccountTokenBalance(reqWalletAccountTokenBalanceOpts).then(respGetAccountTokenBalanceData => {
        if (errorUtil.ERRORS.SUCCESS.CODE === respGetAccountTokenBalanceData.errCode) {
          respData.data.tokenBalance = tools.commafy(respGetAccountTokenBalanceData.data.amount)
          respData.data.priv = respGetAccountTokenBalanceData.data.priv
        } else {
          respData.errCode = respGetAccountTokenBalanceData.errCode
        }
        resolve(respData)
      }).catch(e => {
        reject()
      })
    })
  }
}
