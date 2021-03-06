import tools from './renderer/utils/tools'
import path from 'path'
import pkg from '../../package.json'

const fullConnections = {
  'http_host': '127.0.0.1',
  'http_port': '16002',
  'ws_host': '127.0.0.1',
  'ws_port': '16003'
}
const liteConnections = {
  'http_host': 'wallet-node.bumo.io',
  'http_port': '80',
  'ws_host': 'wallet-node-ws.bumocdn.com',
  'ws_port': '80'
}
const testConnections = {
  'http_host': '127.0.0.1',
  'http_port': '26002',
  'ws_host': '127.0.0.1',
  'ws_port': '26003'
}

export default {
  name: process.env.NETWORK_TYPE === 'Lite' ? pkg.productName + '-Lite' : (process.env.NETWORK_TYPE === 'test' ? pkg.productName + 'Test-Full' : pkg.productName + '-Full'),
  version: pkg.version,
  defaultMaxTxFee: 10,
  reserveAccountBalance: 0.01,
  baseTxFee: '0.01',
  minGasPrice: '1000',
  walletCatalog: pkg.productName,
  api: {
    port: 80,
    browser: {
      // domain: 'https://explorer.bumotest.io/',
      domain: process.env.NETWORK_TYPE === 'test' ? 'https://explorer.bumotest.io/' : 'https://explorer.bumot.io/',
      port: 80
    },
    wallet: {
      // serverHost: 'wallet-s.bumodev.io',
      serverHost: process.env.NETWORK_TYPE === 'test' ? 'wallet-s.bumodev.io' : 'wallet-s.bumo.io',
      port: 80
    }
  },
  connections: process.env.NETWORK_TYPE === 'Lite' ? liteConnections : (process.env.NETWORK_TYPE === 'test' ? testConnections : fullConnections),
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
