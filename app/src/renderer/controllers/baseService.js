var http = require('http')
import cfg from '../../config'
import tools from '../utils/tools'
import bSdk from '../extend/blockchain-sdk'
export default {
  getRecentVersion (store) {
    var options = {
      hostname: cfg.api.wallet.serverHost,
      port: cfg.api.wallet.port,
      path: '/sys/version',
      method: 'GET'
    }
    var req = http.request(options, function (res) {
      res.setEncoding('utf8')
      res.on('data', function (chunk) {
        var walletVersionJSON = JSON.parse(chunk)
        var walletVerData = walletVersionJSON.data
        var status = 0
        var msg = '当前版本：' + cfg.version + ', 服务最新版本: ' + walletVerData.ver_number + ', verType: ' + walletVerData.ver_type
        if (tools.versionCompare(cfg.version, walletVerData.ver_number)) {
          if (walletVerData.ver_type === 1) { // 强制升级
            status = 1
          } else {
            status = 1
            var storage = window.localStorage
            var walletVersionStorageItem = JSON.parse(storage.getItem('walletVersion'))
            if (walletVersionStorageItem && walletVersionStorageItem.status === 1 && walletVerData.ver_number === walletVersionStorageItem.walletVer) {
              status = 0
            } else {
              var walletVersionStorage = {
                ver: cfg.version,
                walletVer: walletVerData.ver_number,
                status: 0
              }
              storage.setItem('walletVersion', JSON.stringify(walletVersionStorage))
            }
          }
        }
        console.log(msg)
        var walletVersionStore = {
          ver: walletVerData.ver_number ? walletVerData.ver_number : cfg.version,
          content: walletVersionJSON.data.ver_contents,
          englishContent: walletVersionJSON.data.english_ver_contents,
          downloadURl: walletVersionJSON.data.download_link,
          verType: walletVersionJSON.data.ver_type,
          createTime: walletVersionJSON.data.create_time,
          status
        }
        store.commit('WALLET_VERSION', walletVersionStore)
      })
    })
    req.on('error', function (e) {
      console.log('problem with request: ' + e.message)
    })
    req.end()
  },
  setSkipUpdate () {
    var storage = window.localStorage
    var walletVersionStorageItem = JSON.parse(storage.getItem('walletVersion'))
    var walletVersionStorage = {
      ver: walletVersionStorageItem.ver,
      walletVer: walletVersionStorageItem.walletVer,
      status: 1
    }
    storage.setItem('walletVersion', JSON.stringify(walletVersionStorage))
  },
  setLang (lang) {
    var storage = window.localStorage
    storage.setItem('bumo-wallet-lang', lang)
  },
  getLang () {
    var storage = window.localStorage
    var lang = storage.getItem('bumo-wallet-lang')
    if (lang === null || lang === '') {
      this.setLang('cn')
      return 'cn'
    } else if (lang === '"ct"' || lang === 'ct') {
      this.setLang('cn')
      return 'cn'
    } else {
      if (lang === '"cn"' || lang === '"en"') {
        return JSON.parse(lang)
      } else {
        return lang
      }
    }
  },
  async getSendTokenGasPrice (srcAddr, destAddr, sentAssetAmount, note, fee, signers) {
    var gasPrice = null
    var signerCount = 1
    signers ? signerCount = signers : signerCount = 1
    // 获取账户信息
    var reqWalletAccountTokenBalanceOpts = {
      address: srcAddr
    }
    await bSdk.account.getAccountTokenBalance(reqWalletAccountTokenBalanceOpts).then(respGetAccountTokenBalanceData => {
      console.log('respGetAccountTokenBalanceData: ' + JSON.stringify(respGetAccountTokenBalanceData))
    })
    var reqOpts = {
      type: 'blob',
      srcAddress: srcAddr,
      gasPrice: cfg.minGasPrice,
      feeLimit: cfg.baseTxFee,
      ops: [{
        type: 'paycoin',
        params: {
          destAddress: destAddr,
          amount: sentAssetAmount
        }
      }],
      note: note
    }
    console.log('bumo wallet getSendTokenGasPrice:' + JSON.stringify(reqOpts))
    await bSdk.tx.transaction(reqOpts).then(respGetSendTokenGasPriceBlob => {
      var respGetSendTokenGasPriceBlobStr = respGetSendTokenGasPriceBlob.data.blob
      console.log('respGetSendTokenGasPriceBlobStr: ' + respGetSendTokenGasPriceBlobStr)
      console.log('respGetSendTokenGasPriceBlobStr.length: ' + respGetSendTokenGasPriceBlobStr.length)
      console.log('signerCount: ' + signerCount)
      var byteLength = 1.5 * (respGetSendTokenGasPriceBlobStr.length / 2 + signerCount * 176)
      gasPrice = fee / byteLength
    })
    return tools.fmtGasPrice(gasPrice).toString()
  },
  async getCreateAccountGasPrice (srcAddr, destAddr, fee, signers) {
    var gasPrice = null
    var accountReserve = null
    var signerCount = 2
    signers ? signerCount = signers : signerCount = 2
    // 获取账户信息
    var reqWalletAccountTokenBalanceOpts = {
      address: srcAddr
    }
    await bSdk.account.getAccountTokenBalance(reqWalletAccountTokenBalanceOpts).then(respGetAccountTokenBalanceData => {
      accountReserve = respGetAccountTokenBalanceData.data.reserve
    })
    var reqOpts = {
      type: 'blob',
      srcAddress: srcAddr,
      gasPrice: cfg.minGasPrice,
      feeLimit: cfg.baseTxFee,
      ops: [{
        type: 'create',
        params: {
          destAddress: destAddr,
          balanceInit: accountReserve
        }
      }]
    }
    console.log('bumo wallet getCreateAccountGasPrice:' + JSON.stringify(reqOpts))
    await bSdk.tx.transaction(reqOpts).then(respGetCreateAccountGasPriceBlob => {
      var respGetCreateAccountGasPriceBlobStr = respGetCreateAccountGasPriceBlob.data.blob
      console.log('respGetCreateAccountGasPriceBlobStr: ' + respGetCreateAccountGasPriceBlobStr)
      console.log('respGetCreateAccountGasPriceBlobStr.length: ' + respGetCreateAccountGasPriceBlobStr.length)
      console.log('signerCount: ' + signerCount)
      var byteLength = 1.5 * (respGetCreateAccountGasPriceBlobStr.length / 2 + signerCount * 176)
      gasPrice = fee / byteLength
    })
    return tools.fmtGasPrice(gasPrice).toString()
  },
  // Judge network connectivity through ajax
  testNetworkOnline () {
    return new Promise((resolve, reject) => {
      var options = {
        hostname: cfg.api.wallet.serverHost,
        port: cfg.api.wallet.port,
        path: '/sys/version',
        method: 'GET'
      }
      var req = http.request(options, function (res) {
        res.setEncoding('utf8')
        res.on('data', function (chunk) {
          resolve()
        })
      })
      req.on('error', function (e) {
        reject()
        console.log('problem with request: ' + e.message)
      })
      req.end()
    })
  }
}
