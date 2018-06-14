import electron from 'electron'
import cfg from '../../config'
import path from 'path'
import NP from 'number-precision'
export default {
  bigNumMinus (n1, n2) {
    var re = NP.minus((n1 - 0), (n2 - 0))
    re = re.toFixed(8).toString()
    var reg = /(?:\.0*|(\.\d+?)0+)$/
    return re.replace(reg, '$1')
  },
  commafy (num) {
    num = this.fourDigit(num, 8) + ''
    if (num === '') {
      return
    }
    if (isNaN(num)) {
      return
    }
    var index = num.indexOf('.')
    if (index === -1) {
      var reg = /(-?\d+)(\d{3})/
      while (reg.test(num)) {
        num = num.replace(reg, '$1,$2')
      }
    } else {
      var intPart = num.substring(0, index)
      var pointPart = num.substring(index + 1, num.length)
      reg = /(-?\d+)(\d{3})/
      while (reg.test(intPart)) {
        intPart = intPart.replace(reg, '$1,$2')
      }
      num = intPart + '.' + pointPart
    }
    return num
  },
  percentage (n1, n2) {
    return (Math.round(n1 / n2 * 10000) / 100.00)
  },
  delcommafy (num) {
    if ((num + '').trim() === '') {
      return ''
    }
    num = num + ''
    num = num.replace(/,/gi, '')
    return num
  },
  toFixed (f, digit) {
    var m = Math.pow(10, digit)
    return parseInt(f * m, 10) / m
  },
  fourDigit (value, s) {
    if (isNaN(value) || value === '' || value === null) {
      return ''
    }
    const num = value.toString().split('.')
    if (num.length === 1) {
      return value.toString()
    } else if (num[1].length >= s) {
      return num[0] + '.' + num[1].substring(0, s)
    } else {
      return value.toString()
    }
  },
  getAppPath () {
    var appPath = null
    if (process.env.NODE_ENV !== 'development' && process.platform === 'darwin') {
      appPath = electron.remote.app.getPath('appData') + '/' + cfg.walletCatalog
    } else {
      console.log('process.execPath: ' + process.execPath)
      if (process.platform === 'win32') {
        if (process.execPath.endsWith('electron.exe')) {
          appPath = path.resolve(path.dirname(process.execPath), '../../..', '')
        } else {
          appPath = path.resolve(path.dirname(process.execPath), '', '')
        }
      } else if (process.platform === 'darwin') {
        appPath = path.resolve(path.dirname(process.execPath), '../../../../../../../../..', '')
      }
    }
    console.log('renderer appPath: ' + appPath)
    return appPath
  },
  versionStr2Num (a) {
    var c = a.split('.')
    var numPlace = ['', '0', '00', '000', '0000']
    var r = numPlace.reverse()
    for (var i = 0; i < c.length; i++) {
      var len = c[i].length
      c[i] = r[len] + c[i]
    }
    var res = c.join('')
    return res
  },
  cprVersion (v1, v2) {
    var n1 = this.versionStr2Num(v1)
    var n2 = this.versionStr2Num(v2)
    console.log('n1: ' + n1)
    console.log('n2: ' + n2)
    return n1 - n2 < 0
  },
  versionCompare (currVer, promoteVer) {
    currVer = currVer || '0.0.0'
    promoteVer = promoteVer || '0.0.0'
    if (currVer === promoteVer) return false
    var currVerArr = currVer.split('.')
    var promoteVerArr = promoteVer.split('.')
    var len = Math.max(currVerArr.length, promoteVerArr.length)
    for (var i = 0; i < len; i++) {
      var proVal = ~~promoteVerArr[i]
      var curVal = ~~currVerArr[i]
      if (proVal < curVal) {
        return false
      } else if (proVal > curVal) {
        return true
      }
    }
    return false
  },
  fmtGasPrice (gasPrice) {
    global.nodeSerGasPrice = '1000'
    var nodeSerGasPrice = parseInt(global.nodeSerGasPrice)
    var maxSerGasPrice = 8000
    var str = parseInt(gasPrice * 100000000).toString()
    var fmtGasPrice = parseInt(str.substring(0, str.length - 2) + '00')
    if (fmtGasPrice < nodeSerGasPrice) {
      return nodeSerGasPrice
    } else if (fmtGasPrice > maxSerGasPrice) {
      return maxSerGasPrice
    } else {
      return fmtGasPrice
    }
  }
}
