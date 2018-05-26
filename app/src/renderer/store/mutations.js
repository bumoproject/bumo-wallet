import * as types from './mutation-types'

const mutations = {
  [types.SHOW_ADVANCED] (state, showAdvanced) {
    state.showAdvanced = showAdvanced
  },
  [types.RECENT_LOGIN_WALLET_ACCOUNT] (state, recentLoginWalletAccount) {
    state.recentLoginWalletAccount = recentLoginWalletAccount
  },
  [types.BLOCK_STATUS] (state, blockStatus) {
    state.blockStatus = blockStatus
  },
  [types.LOADING_STATUS] (state, loadingStatus) {
    state.loadingStatus = loadingStatus
  },
  [types.BLOCK_CONNETCTION_SIZE] (state, blockConnectionSize) {
    state.blockConnectionSize = blockConnectionSize
  },
  [types.WALLET_VERSION] (state, walletVersion) {
    state.walletVersion = walletVersion
  },
  [types.ACTIVE_HEADER_NAV] (state, activeHeaderNav) {
    state.activeHeaderNav = activeHeaderNav
  }// activeHeaderNav
}

export default mutations
