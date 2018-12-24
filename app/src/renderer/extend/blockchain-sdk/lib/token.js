'use strict';

const rp = require('request-promise')
const JSONbig = require('json-bigint')
const BigNumber = require('bignumber.js')
import conf from '../config';

/**
 * Get account info
 * @param {String} address
 * @return {Promise<*>}
 * @private
 */
async function _getAccountInfo (address) {
  if (!address || typeof address !== 'string') {
    throw new Error('require address on _getAccountInfo')
  }
  const options = {
    uri: `http://${conf.connections.http_host}:${conf.connections.http_port}/getAccount`,
    qs: {
      address
    }
  }
  const info = await rp(options)
  return info
}

/**
 * Get decimal of the token
 * @param {Object} args
 * @param {String} args.code - code of the token
 * @param {String} args.issuer - issuer address of the token
 * @return {Promise<boolean>}
 * @private
 */
async function _getTokenDecimals (args) {
  const { code, issuer } = args

  if (!code || typeof code !== 'string') {
    throw new Error('code is requred on _getTokenDecimals')
  }

  if (!issuer || typeof issuer !== 'string') {
    throw new Error('issuer is requred on _getTokenDecimals')
  }

  let result = false
  let accountInfo = await _getAccountInfo(issuer)
  accountInfo = JSONbig.parse(accountInfo)
  if (accountInfo.error_code === 0) {
    const metadatas = accountInfo.result.metadatas || []
    if (metadatas.length > 0) {
      const metadata = metadatas.find((item) => {
        return item.key === `asset_property_${code}`
      })

      if (metadata && metadata.value) {
        const metadataInfo = JSONbig.parse(metadata.value)
        result = {
          decimals: metadataInfo.decimals
        }
      }
    }
  }

  return result
}

async function getBalanceAndTokens (address) {
  let balance = '0'
  let tokens = []
  // Get assets of account
  let accountInfo = await _getAccountInfo(address)
  accountInfo = JSONbig.parse(accountInfo)
  if (accountInfo.error_code === 0) {
    // convert mo to bu
    balance = new BigNumber(accountInfo.result.balance).dividedBy(Math.pow(10, 8)).toString()
    const assets = accountInfo.result.assets || []
    if (assets.length) {
      await Promise.all(assets.map(async item => {
        let token = {}
        token.code = item.key.code
        token.issuer = item.key.issuer
        // get decimal of the token
        const decimalsInfo = await _getTokenDecimals(item.key)
        if (decimalsInfo) {
          token.amount = new BigNumber(item.amount).dividedBy(Math.pow(10, decimalsInfo.decimals)).toString()
          token.decimals = decimalsInfo.decimals
        } else {
          token.amount = new BigNumber(item.amount).toString()
          token.decimals = 0
        }
        tokens.push(token)
      }))
    }
  }
  return {
    balance,
    tokens
  }
}

module.exports = {
  getBalanceAndTokens: getBalanceAndTokens,
  getTokenDecimals: _getTokenDecimals
}
