import bSdk from '../extend/blockchain-sdk'
import errorUtil from '../constants'
import baseService from '../controllers/baseService'
import tool from '../utils/tools'
export default {
  getNonce (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        nonce: ''
      }
    }
    return new Promise((resolve, reject) => {
      var getNonceReqOpts = {
        address: opts.address
      }
      console.info('bumo wallet getNonce.req: ' + JSON.stringify(getNonceReqOpts))
      bSdk.tx.getNonce(getNonceReqOpts).then(getNonceData => {
        console.error('bumo wallet getNonce.resp: ' + JSON.stringify(getNonceData))
        if (errorUtil.ERRORS.SUCCESS.CODE === getNonceData.errCode) {
          respData.data.nonce = getNonceData.data.nonce
        } else {
          respData.errCode = errorUtil.ERRORS.NETWORK_ERROR.CODE
          respData.msg = 'errorUtil.ERRORS.NETWORK_ERROR'
        }
        resolve(respData)
      })
    })
  },
  sendToken (opts) {
    opts.fee = opts.fee + ''
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        hash: ''
      }
    }
    return new Promise((resolve, reject) => {
      var gasPrice = null
      baseService.getSendTokenGasPrice(opts.walletAddress, opts.destAddr, opts.sentAssetAmount, opts.note, opts.fee).then(respSendTokenGasPriceData => {
        gasPrice = respSendTokenGasPriceData
        console.log('gasPrice1: ' + gasPrice)
        var sendTokenReqOpts = {
          accountNick: opts.walletNick,
          srcAddress: opts.walletAddress,
          destAddress: opts.destAddr,
          amount: opts.sentAssetAmount,
          note: opts.note,
          feeLimit: opts.fee,
          gasPrice: gasPrice,
          pwd: opts.accountPwd,
          nonce: opts.nonce
        }
        var printSendTokenReqOpts = {
          accountNick: opts.walletNick,
          srcAddress: opts.walletAddress,
          destAddress: opts.destAddr,
          amount: opts.sentAssetAmount,
          note: opts.note,
          feeLimit: opts.fee,
          gasPrice: gasPrice,
          nonce: opts.nonce
        }
        console.info('bumo wallet sendToken.req: ' + JSON.stringify(printSendTokenReqOpts))
        bSdk.tx.sendToken(sendTokenReqOpts).then(sendTokenRespData => {
          console.error('bumo wallet sendToken.resp: ' + JSON.stringify(sendTokenRespData))
          if (errorUtil.ERRORS.SUCCESS.CODE === sendTokenRespData.errCode) {
            respData.data.hash = sendTokenRespData.data.hash
          } else if (errorUtil.ACCOUNT_STATE.INVALID_ACCOUNT_PWD === sendTokenRespData.errCode) {
            respData.errCode = errorUtil.ERRORS.INVALID_ACCOUNT_PWD.CODE
            respData.msg = 'errorUtil.ERRORS.INVALID_ACCOUNT_PWD'
            console.error('sent token fail ' + sendTokenRespData.msg)
          } else if (errorUtil.BUMO_ERROR.NOT_ENOUGH_TX_FEE === sendTokenRespData.errCode) {
            respData.errCode = errorUtil.ERRORS.NOT_ENOUGH_TX_FEE_ERROR.CODE
            respData.msg = 'errorUtil.ERRORS.NOT_ENOUGH_TX_FEE_ERROR'
          } else if (errorUtil.BUMO_ERROR.ACCOUNT_LOW_RESERVE === sendTokenRespData.errCode) {
            respData.errCode = errorUtil.ERRORS.ACCOUNT_LOW_RESERVE_ERROR.CODE
            respData.msg = 'errorUtil.ERRORS.ACCOUNT_LOW_RESERVE_ERROR'
          } else if (errorUtil.INSERT_TX_TO_BUFFER_FAIL === sendTokenRespData.errCode) {
            respData.errCode = errorUtil.ERRORS.INSERT_TX_TO_BUFFER_FAIL.CODE
            respData.msg = 'errorUtil.ERRORS.INSERT_TX_TO_BUFFER_FAIL'
          } else {
            respData.errCode = errorUtil.ERRORS.SUBMIT_TX_ERROR.CODE
            respData.msg = 'errorUtil.ERRORS.SUBMIT_TX_ERROR'
          }
          resolve(respData)
        })
      })
    })
  },
  sendAsset (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        hash: ''
      }
    }
    return new Promise((resolve, reject) => {
      var gasPrice = null
      var fee = null
      var balanceI = null
      baseService.getSendTokenGasPrice(opts.walletAddress, opts.destAddr, opts.sentAssetAmount, opts.note, opts.fee).then(respSendTokenGasPriceData => {
        gasPrice = respSendTokenGasPriceData
        console.log('gasPrice1: ' + gasPrice)
        var operation = []
        if (opts.accountUnactive) {
          if (tool.bigNumMinus(opts.fee, 0.11) <= 0) {
            balanceI = 0
          } else {
            balanceI = 0.11
          }
          operation.push({
            type: 'create',
            params: {
              destAddress: opts.destAddr, balanceInit: balanceI + ''
            }
          })
          fee = tool.bigNumMinus(opts.fee, balanceI) + ''
        } else {
          fee = opts.fee + ''
        }
        operation.push({
          type: 'payasset',
          params: {
            destAddress: opts.destAddr,
            amount: opts.sentAssetAmount,
            issuer: opts.issuer,
            code: opts.code,
            decimals: opts.decimals || 0
          }
        })
        var sendTokenReqOpts = {
          type: 'deal',
          accountNick: opts.walletNick,
          srcAddress: opts.walletAddress,
          note: opts.note,
          feeLimit: fee,
          gasPrice: gasPrice,
          pwd: opts.accountPwd,
          ops: operation,
          nonce: opts.nonce
        }
        var printSendTokenReqOpts = {
          type: 'deal',
          accountNick: opts.walletNick,
          srcAddress: opts.walletAddress,
          note: opts.note,
          feeLimit: fee,
          gasPrice: gasPrice,
          ops: operation,
          nonce: opts.nonce
        }
        console.info('bumo wallet sendToken.req: ' + JSON.stringify(printSendTokenReqOpts))
        bSdk.tx.transactionII(sendTokenReqOpts).then(sendTokenRespData => {
          console.log('bumo wallet sendToken.resp: ' + JSON.stringify(sendTokenRespData))
          if (errorUtil.ERRORS.SUCCESS.CODE === sendTokenRespData.errCode) {
            respData.data.hash = sendTokenRespData.data.hash
          } else if (errorUtil.ACCOUNT_STATE.INVALID_ACCOUNT_PWD === sendTokenRespData.errCode) {
            respData.errCode = errorUtil.ERRORS.INVALID_ACCOUNT_PWD.CODE
            respData.msg = 'errorUtil.ERRORS.INVALID_ACCOUNT_PWD'
            console.error('sent token fail ' + sendTokenRespData.msg)
          } else if (errorUtil.BUMO_ERROR.NOT_ENOUGH_TX_FEE === sendTokenRespData.errCode) {
            respData.errCode = errorUtil.ERRORS.NOT_ENOUGH_TX_FEE_ERROR.CODE
            respData.msg = 'errorUtil.ERRORS.NOT_ENOUGH_TX_FEE_ERROR'
          } else if (errorUtil.BUMO_ERROR.ACCOUNT_LOW_RESERVE === sendTokenRespData.errCode) {
            respData.errCode = errorUtil.ERRORS.ACCOUNT_LOW_RESERVE_ERROR.CODE
            respData.msg = 'errorUtil.ERRORS.ACCOUNT_LOW_RESERVE_ERROR'
          } else if (errorUtil.INSERT_TX_TO_BUFFER_FAIL === sendTokenRespData.errCode) {
            respData.errCode = errorUtil.ERRORS.INSERT_TX_TO_BUFFER_FAIL.CODE
            respData.msg = 'errorUtil.ERRORS.INSERT_TX_TO_BUFFER_FAIL'
          } else {
            respData.errCode = errorUtil.ERRORS.SUBMIT_TX_ERROR.CODE
            respData.msg = 'errorUtil.ERRORS.SUBMIT_TX_ERROR'
          }
          resolve(respData)
        })
      })
    })
  },
  getTxList (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        tx: {total: 0},
        txs: []
      }
    }
    return new Promise((resolve, reject) => {
      var getAccountTxListReqOpts = {
        pageStartIndex: opts.pageStartIndex,
        pageSize: opts.pageSize
      }
      bSdk.tx.getTxsList(getAccountTxListReqOpts).then(respGetAccountTxlistData => {
        // console.log('bumo wallet respGetAccountTxlistData' + JSON.stringify(respGetAccountTxlistData))
        if (errorUtil.ERRORS.SUCCESS.CODE === respGetAccountTxlistData.errCode) {
          respData.data = respGetAccountTxlistData.data
        }
        resolve(respData)
      })
    })
  },
  getActiveTokenBalance (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        tokenBalance: 0,
        assetCode: opts.assetCode
      }
    }
    return new Promise((resolve, reject) => {
      var reqWalletAccountTokenBalanceOpts = {
        address: opts.walletAddress,
        assetCode: opts.assetCode,
        issuerAddress: opts.issuerAddress,
        decimals: opts.decimals || 0
      }
      // console.log('reqWalletAccountTokenBalanceOpts:' + JSON.stringify(reqWalletAccountTokenBalanceOpts))
      bSdk.tx.getTokenBalance(reqWalletAccountTokenBalanceOpts).then(respGetAccountTokenBalanceData => {
        if (errorUtil.ERRORS.SUCCESS.CODE === respGetAccountTokenBalanceData.errCode) {
          respData.data.tokenBalance = respGetAccountTokenBalanceData.data.amount
        }
        resolve(respData)
      })
    })
  },
  getTokenTxList (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        tx: {total: 0},
        txs: []
      }
    }
    return new Promise((resolve, reject) => {
      var getAccountTxListReqOpts = {
        pageStartIndex: opts.pageStartIndex,
        pageSize: opts.pageSize,
        assetCode: opts.assetCode,
        issuerAddress: opts.issuerAddress,
        decimals: opts.decimals || 0
      }
      bSdk.tx.getTokenList(getAccountTxListReqOpts).then(respGetTokenlistData => {
        console.log(respGetTokenlistData)
        // console.log('bumo wallet respGetTokenlistData' + JSON.stringify(respGetTokenlistData))
        if (errorUtil.ERRORS.SUCCESS.CODE === respGetTokenlistData.errCode) {
          respData.data = respGetTokenlistData.data
        }
        resolve(respData)
      })
    })
  },
  getBlockInfo (store) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        blockStatus: {
          seq: 0,
          seqMax: 0,
          connectionSize: 0
        }
      }
    }
    return new Promise((resolve, reject) => {
      var getBlockStatusReqOpts = {
        eventName: 'ledger_header',
        callback: function (respGetBlockStatusReqOptsData) {
          console.log('bumo wallet respGetBlockStatusReqOptsData: ' + JSON.stringify(respGetBlockStatusReqOptsData))
          respData.data.blockStatus = respGetBlockStatusReqOptsData
          store.commit('BLOCK_STATUS', respData.data.blockStatus)
          resolve(respData)
        }
      }
      bSdk.tx.setCallback({eventName: 'ledger_header'})
      bSdk.tx.setCallback(getBlockStatusReqOpts)
      var getBLockChainConnectCountReqOpts = {
        eventName: 'peer_connections',
        callback: function (respGetBLockChainConnectCountData) {
          console.log('bumo wallet respGetBLockChainConnectCountData: ' + JSON.stringify(respGetBLockChainConnectCountData))
          respData.data.blockConnectionSize = respGetBLockChainConnectCountData.connectionSize
          store.commit('BLOCK_CONNETCTION_SIZE', respData.data.blockConnectionSize)
          resolve(respData)
        }
      }
      bSdk.tx.setCallback({eventName: 'peer_connections'})
      bSdk.tx.setCallback(getBLockChainConnectCountReqOpts)
      var r = {
        eventName: 'error',
        callback: function (respd) {
          console.error('bumo log ' + JSON.stringify(respd))
        }
      }
      bSdk.tx.setCallback({eventName: 'error'})
      bSdk.tx.setCallback(r)

      var logInfo = {
        eventName: 'info',
        callback: function (respd) {
          console.error('bumo log-info ' + JSON.stringify(respd))
        }
      }
      bSdk.tx.setCallback({eventName: 'info'})
      bSdk.tx.setCallback(logInfo)
      // var bcHttp = {
      //   eventName: 'http_response',
      //   callback: function (respd) {
      //     if (respd.url !== '/getModulesStatus') {
      //       console.error('bumo http_response log ' + JSON.stringify(respd))
      //     }
      //   }
      // }
      // bSdk.tx.setCallback(bcHttp)
    })
  },
  getBuildUnitAccountTxFee (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        fee: 0
      }
    }
    return new Promise((resolve, reject) => {
      var reqOpts = {
        type: 'fee',
        fee: '0',
        srcAddress: opts.srcAddress,
        ops: [
          {
            type: 'create',
            params: {
              destAddress: opts.destAddress,
              balanceInit: '0.1',
              threshold: {
                tx: opts.masterWeight
              }
            }
          }
        ]
      }
      console.log('bumo wallet bSdk.tx.transaction.req' + JSON.stringify(reqOpts))
      bSdk.tx.transaction(reqOpts).then(sdkRespData => {
        console.log('bumo wallet bSdk.tx.transaction' + JSON.stringify(sdkRespData))
        if (errorUtil.ERRORS.SUCCESS.CODE === sdkRespData.errCode) {
          respData.data.fee = sdkRespData.data.fee
        }
        resolve(respData)
      })
    })
  },
  getUniteTxFee (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        fee: 0
      }
    }
    return new Promise((resolve, reject) => {
      var reqOpts = {
        type: 'fee',
        fee: '0',
        srcAddress: opts.srcAddress,
        ops: [
          {
            type: 'paycoin',
            params: {
              destAddress: opts.destAddress,
              amount: opts.sentAssetAmount
            }
          }
        ]
      }
      console.log('bumo wallet getUniteTxFee.req' + JSON.stringify(reqOpts))
      bSdk.tx.transaction(reqOpts).then(sdkRespData => {
        console.log('bumo wallet getUniteTxFee.resp' + JSON.stringify(sdkRespData))
        if (errorUtil.ERRORS.SUCCESS.CODE === sdkRespData.errCode) {
          respData.data.fee = sdkRespData.data.fee
        } else {
          respData.errCode = errorUtil.ERRORS.FAIL.CODE
          respData.msg = 'errorUtil.ERRORS.FAIL'
        }
        resolve(respData)
      })
    })
  },
  txParser (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {}
    }
    return new Promise((resolve, reject) => {
      var reqData = {
        transactionString: opts.txBlob
      }
      console.log('bumo wallet txParser.req' + JSON.stringify(reqData))
      bSdk.tx.transactionResolve(reqData).then(sdkRespData => {
        console.log('bumo wallet txParser.resp' + JSON.stringify(sdkRespData))
        if (errorUtil.ERRORS.SUCCESS.CODE === sdkRespData.errCode) {
          respData.data = sdkRespData.data
        } else if (errorUtil.BUMO_ERROR.INVALID_TX_BLOB_STR === sdkRespData.errCode) {
          respData.errCode = errorUtil.ERRORS.INVALID_TX_BLOB_STR_ERROR.CODE
          respData.msg = 'errorUtil.ERRORS.INVALID_TX_BLOB_STR_ERROR'
        } else {
          respData.errCode = errorUtil.ERRORS.FAIL.CODE
          respData.msg = 'errorUtil.ERRORS.FAIL'
          console.error('send token fail ' + sdkRespData.msg)
        }
        resolve(respData)
      })
    })
  },
  buildTxBlob (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        hash: ''
      }
    }
    return new Promise((resolve, reject) => {
      var gasPrice = null
      baseService.getSendTokenGasPrice(opts.srcAddr, opts.destAddr, opts.sentAssetAmount, opts.note, opts.fee, opts.signersCount).then(respSendTokenGasPriceData => {
        gasPrice = respSendTokenGasPriceData
        var reqData = {}
        if (opts.currentTokenType === 'BU') {
          reqData = {
            type: 'blob',
            srcAddress: opts.srcAddr,
            ops: [{
              type: 'paycoin',
              params: {
                destAddress: opts.destAddr,
                amount: opts.sentAssetAmount
              }
            }],
            note: opts.note,
            feeLimit: opts.fee,
            gasPrice: gasPrice,
            seqOffset: opts.seqOffset
          }
        } else {
          reqData = {
            type: 'blob',
            srcAddress: opts.srcAddr,
            ops: [{
              type: 'payasset',
              params: {
                destAddress: opts.destAddr,
                amount: opts.sentAssetAmount,
                issuer: opts.currentTokenIssuer,
                code: opts.currentTokenType,
                decimals: opts.currentTokenDecimals
              }
            }],
            note: opts.note,
            feeLimit: opts.fee,
            gasPrice: gasPrice,
            seqOffset: opts.seqOffset
          }
        }
        console.log('bumo wallet buildTxBlob.req: ' + JSON.stringify(reqData))
        bSdk.tx.transaction(reqData).then(sdkRespData => {
          console.log('bumo wallet buildTxBlob.resp' + JSON.stringify(sdkRespData))
          if (errorUtil.ERRORS.SUCCESS.CODE === sdkRespData.errCode) {
            respData.data.blob = sdkRespData.data.transactionString
          } else {
            respData.errCode = errorUtil.ERRORS.FAIL.CODE
            respData.msg = 'errorUtil.ERRORS.FAIL'
            console.error('send token fail ' + sdkRespData.msg)
          }
          resolve(respData)
        }).catch(e => {
          reject()
        })
      })
    })
  },
  signTx (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        hash: ''
      }
    }
    return new Promise((resolve, reject) => {
      var reqData = {
        transactionString: opts.txBlob,
        accountNick: opts.accountNick,
        pwd: opts.walletAccountPwd
      }
      var printReqData = {
        transactionString: opts.txBlob,
        accountNick: opts.accountNick
      }
      console.log('bumo wallet signTx.req' + JSON.stringify(printReqData))
      bSdk.tx.transactionSign(reqData).then(sdkRespData => {
        console.log('bumo wallet signTx.resp' + JSON.stringify(sdkRespData))
        if (errorUtil.ERRORS.SUCCESS.CODE === sdkRespData.errCode) {
          respData.data = sdkRespData.data
        } else if (errorUtil.ACCOUNT_STATE.INVALID_ACCOUNT_PWD === sdkRespData.errCode) {
          respData.errCode = errorUtil.ERRORS.INVALID_ACCOUNT_PWD.CODE
          respData.msg = 'errorUtil.ERRORS.INVALID_ACCOUNT_PWD'
        } else {
          respData.errCode = errorUtil.ERRORS.FAIL.CODE
          respData.msg = 'errorUtil.ERRORS.FAIL'
          console.error('send token fail ' + sdkRespData.msg)
        }
        resolve(respData)
      })
    })
  },
  submitTx (opts) {
    var respData = {
      errCode: 0,
      msg: 'success',
      data: {
        hash: ''
      }
    }
    return new Promise((resolve, reject) => {
      var reqData = {
        transactionString: opts.txBlob
      }
      console.log('bumo wallet submitTx.req' + JSON.stringify(reqData))
      bSdk.tx.transactionSubmit(reqData).then(sdkRespData => {
        console.log('bumo wallet submitTx.resp' + JSON.stringify(sdkRespData))
        if (errorUtil.ERRORS.SUCCESS.CODE === sdkRespData.errCode) {
          respData.data = sdkRespData.data
        } else if (errorUtil.BUMO_ERROR.NOT_ENOUGH_WEIGHT === sdkRespData.errCode) {
          respData.errCode = errorUtil.ERRORS.NOT_ENOUGH_WEIGHT_ERROR.CODE
          respData.msg = 'errorUtil.ERRORS.NOT_ENOUGH_WEIGHT_ERROR'
        } else if (errorUtil.BUMO_ERROR.INVALID_TX_NONCE === sdkRespData.errCode) {
          respData.errCode = errorUtil.ERRORS.INVALID_TX_NONCE_ERROR.CODE
          respData.msg = 'errorUtil.ERRORS.INVALID_TX_NONCE_ERROR'
        } else if (errorUtil.BUMO_ERROR.TX_TIMEOUT === sdkRespData.errCode) {
          respData.errCode = errorUtil.ERRORS.INVALID_TX_NONCE_ERROR.CODE
          respData.msg = 'errorUtil.ERRORS.TX_TIMEOUT_ERROR'
        } else if (errorUtil.BUMO_ERROR.NOT_ENOUGH_TX_FEE === sdkRespData.errCode) {
          respData.errCode = errorUtil.ERRORS.NOT_ENOUGH_TX_FEE_ERROR.CODE
          respData.msg = 'errorUtil.ERRORS.NOT_ENOUGH_TX_FEE_ERROR'
        } else if (errorUtil.INSERT_TX_TO_BUFFER_FAIL === sdkRespData.errCode) {
          respData.errCode = errorUtil.ERRORS.INSERT_TX_TO_BUFFER_FAIL.CODE
          respData.msg = 'errorUtil.ERRORS.INSERT_TX_TO_BUFFER_FAIL'
        } else {
          respData.errCode = errorUtil.ERRORS.FAIL.CODE
          respData.msg = 'errorUtil.ERRORS.FAIL'
          console.error('submitTx fail ' + sdkRespData.msg)
        }
        resolve(respData)
      })
    })
  }
}
