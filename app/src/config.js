import tools from './renderer/utils/tools'
import path from 'path'
import pkg from '../../package.json'
export default {
  name: pkg.productName,
  version: pkg.version,
  defaultMaxTxFee: 10,
  reserveAccountBalance: 0.1,
  baseTxFee: '0.01',
  minGasPrice: '1000',
  walletCatalog: pkg.productName,
  api: {
    port: 80,
    browser: {
      domain: 'https://explorer.bumo.io/',
      port: 80
    },
    wallet: {
      serverHost: 'wallet-s.bumo.io',
      port: 80
    }
  },
  sdk: {
    syncNodeExePath: function () {
      let nodeExePath = null
      console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV)
      if (process.env.NODE_ENV !== 'development') {
        nodeExePath = path.join(tools.getAppPath(), 'buchain/bin/bumo')
      } else {
        nodeExePath = path.join(tools.getAppPath(), '/buchain/' + ((process.platform === 'darwin') ? 'mac' : 'win') + '/bin/bumo')
      }
      console.log('config nodeExePath: ' + nodeExePath)
      return nodeExePath
    },
    accountStorePath: function () {
      let accountStorePath = path.join(tools.getAppPath(), 'wallets')
      return accountStorePath
    },
    walletDBPath: function () {
      let walletDBPath = path.join(tools.getAppPath(), 'bumo.db')
      return walletDBPath
    }
  }
}
