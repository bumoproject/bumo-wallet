
function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}
export function timeAgo (time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function fmtTime (date) {
  var dateTimeStamp = parseInt(new Date(date).getTime().toString().substring(0, 13))
  console.log('dateTimeStamp: ' + dateTimeStamp)
  var result = ''
  var minute = 1000 * 60
  var hour = minute * 60
  var now = new Date().getTime()
  console.log(now)
  var diffValue = now - dateTimeStamp
  if (diffValue < 0) {
    return
  }
  var minC = diffValue / minute
  var hourC = diffValue / hour
  if (hourC >= 1 && hourC <= 23) {
    result = ' ' + parseInt(hourC) + '小时前'
  } else if (minC >= 1 && minC <= 59) {
    result = ' ' + parseInt(minC) + '分钟前'
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = '刚刚'
  } else {
    var datetime = new Date()
    datetime.setTime(dateTimeStamp)
    var Nyear = datetime.getFullYear()
    var Nmonth = datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1
    var Ndate = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate()
    var Nhour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours()
    var Nminute = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes()
    var Nsecond = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds()
    result = Nyear + '.' + Nmonth + '.' + Ndate + ' ' + Nhour + ':' + Nminute + ':' + Nsecond
  }
  return result
}
export function showTime (time) {
  time = parseInt(time.toString().substring(0, 13))
  const d = new Date(time)
  const now = Date.now()
  const diff = (now - time) / 1000
  if (diff < 59) {
    return Math.ceil(diff) + '秒前'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else {
    var mounth = (d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1)
    var date = (d.getDate()) >= 10 ? (d.getDate()) : '0' + (d.getDate())
    var hour = d.getHours() >= 10 ? d.getHours() : '0' + d.getHours()
    var minut = d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes()
    var sec = d.getSeconds() >= 10 ? d.getSeconds() : '0' + d.getSeconds()
    // return d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + (d.getDate()) + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    return d.getFullYear() + '.' + mounth + '.' + date + ' ' + hour + ':' + minut + ':' + sec
  }
}
export function fmtDate (date) {
  var dateTimeStamp = parseInt(date.toString().substring(0, 13))
  var datetime = new Date()
  datetime.setTime(dateTimeStamp)
  var Nyear = datetime.getFullYear()
  var Nmonth = datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1
  var Ndate = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate()
  var Nhour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours()
  var Nminute = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes()
  var Nsecond = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds()
  var result = Nyear + '.' + Nmonth + '.' + Ndate + ' ' + Nhour + ':' + Nminute + ':' + Nsecond
  return result
}
/* 数字 格式化 */
export function nFormatter (num, digits) {
  const si = [{ value: 1e18, symbol: 'E' }, { value: 1e15, symbol: 'P' }, { value: 1e12, symbol: 'T' }, { value: 1e9, symbol: 'G' }, { value: 1e6, symbol: 'M' }, { value: 1e3, symbol: 'k' }]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function html2Text (val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function toThousandslsFilter (num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

// 时间戳转时间，具体到天
export function timestampToDay (value) {
  var time = new Date(parseInt(value))
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  y = isNaN(y) ? '0000' : y
  m = isNaN(m) ? '00' : m
  d = isNaN(d) ? '00' : d
  return y + '年' + m + '月' + d + '日'
}

export function commafy (num) {
  num = fourDigit(num, 8) + ''
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
}

export function handleBlockError (blockErrorCode) {
  var respStatus = {
    errorCode: 0,
    msg: '交易成功'
  }
  if (blockErrorCode === 0) {
    return respStatus.msg
  } else if (blockErrorCode === -1) {
    respStatus.errorCode = 1
    respStatus.msg = '交易正在处理中'
  } else if (blockErrorCode === 100) {
    respStatus.errorCode = 2
    respStatus.msg = '余额不足'
  } else if (blockErrorCode === 106) {
    respStatus.errorCode = 2
    respStatus.msg = '激活目标账户费用不足'
  } else if (blockErrorCode === 5) {
    respStatus.errorCode = 2
    respStatus.msg = '交易超时'
  } else {
    respStatus.errorCode = 2
    respStatus.msg = '失败'
  }
  return respStatus.msg
}

export function fourDigit (value, s) {
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
}

export function fmtWalletAccountAddress (value) {
  if (value === '' || value === null) {
    return ''
  }
  return value.substring(0, 10) + '***' + value.substring((value.length - 10), value.length)
}

