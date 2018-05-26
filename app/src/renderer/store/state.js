const state = {
  showAdvanced: false,
  recentLoginWalletAccount: {
    address: null,
    nick: null
  },
  blockStatus: {
    seq: 0,
    seqMax: 0
  },
  blockConnectionSize: 0,
  loadingStatus: 10,
  walletVersion: {
    ver: '',
    content: '',
    englishContent: '',
    downloadURl: '',
    verType: '',
    createTime: '',
    status: ''
  },
  activeHeaderNav: 'index'
}
export default state
