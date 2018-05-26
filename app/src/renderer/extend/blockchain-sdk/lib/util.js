import errorUtil from './constants';
import http from 'http';
import conf from '../config';
import CryptoJS from 'crypto-js';
import fs from 'fs';
import {spawnSync, spawn} from 'child_process';
// import ffi from 'ffi';
// import ref from 'ref';

let nodeLib = null;
let nodeConsole = null;

initNodeConsole();

export default {
  httpGetPromise: function(url) {
    return new Promise((rs, rj) => {
      trigger(errorUtil.EVENTS.HTTP_REQUEST, {
        'host': conf.connections.http_host,
        'port': conf.connections.http_port,
        'method': 'get',
        'url': url,
      });
      http.get({
        'host': conf.connections.http_host,
        'port': conf.connections.http_port,
        'path': url,
        'method': 'GET',
        'headers': {
          'Content-Type': 'application/json',
        },
      }, function(res) {
        let resData = '';
        res.on('data', function(data) {
          resData += data;
        });
        res.on('end', function() {
          trigger(errorUtil.EVENTS.HTTP_RESPONSE, {
            'host': conf.connections.http_host,
            'port': conf.connections.http_port,
            'method': 'get',
            'url': url,
            'result': JSON.parse(resData),
          });
          return rs(resData);
        });
      }).on('error', function(e) {
        return rj(e);
      });
    });
  },
  httpPostPromise: function(url, data) {
    return new Promise((rs, rj) => {
      if (!data) {
        rs();
      }
      trigger(errorUtil.EVENTS.HTTP_REQUEST, {
        'host': conf.connections.http_host,
        'port': conf.connections.http_port,
        'method': 'post',
        'url': url,
        'data': data,
      });
      let req = http.request({
        'host': conf.connections.http_host,
        'port': conf.connections.http_port,
        'path': url,
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': data.length,
        },
      }, function(res) {
        let ret = '';
        res.on('data', function(d) {
          ret += d;
        });
        res.on('error', function(err) {
          return rj(err);
        });
        res.on('end', function() {
          trigger(errorUtil.EVENTS.HTTP_RESPONSE, {
            'host': conf.connections.http_host,
            'port': conf.connections.http_port,
            'method': 'post',
            'url': url,
            'data': data,
            'result': JSON.parse(ret),
          });
          return rs(ret);
        });
      });
      req.write(data);
      req.end();
    });
  },
  // return the converted string
  // null will be returned when giving an illegal string
  unitConvert: function(numberStr, convertRules, isFinalInt) {
    // check str
    if (typeof numberStr != 'string') {
      return null;
    }
    if (numberStr.match(/^\d*[.]?\d*$/) === null) {
      return null;
    }
    // check rule
    if (typeof convertRules != 'number') {
      return null;
    }
    // init dot position and remove char dot
    let dot = numberStr.indexOf('.');
    if (dot === -1) {
      dot = numberStr.length;
    } else {
      numberStr = numberStr.split('.').join('');
    }
    // calculate the converted dot position
    dot += convertRules;
    // apply the dot with different position range
    if (dot > numberStr.length) {
      while (dot > numberStr.length) {
        numberStr += '0';
      }
    } else if (dot === numberStr.length) {

    } else if (dot < 0) {
      if (isFinalInt) {
        numberStr = '0';
      } else {
        while (dot < 0) {
          numberStr = '0' + numberStr;
          dot += 1;
        }
        numberStr = '.' + numberStr;
      }
    } else if (dot < numberStr.length) {
      if (isFinalInt) {
        numberStr = numberStr.substr(0, dot);
      } else {
        numberStr = numberStr.substr(0, dot) + '.' + numberStr.substr(dot);
      }
    }
    // do some format
    let tmp = numberStr.split('.');
    if (tmp.length === 2) {
      tmp[0] = tmp[0].replace(/^0{1,}/, '');
      tmp[1] = tmp[1].replace(/0{1,}$/, '');
      if (tmp[1].length > 0) {
        numberStr = tmp.join('.');
      } else {
        numberStr = tmp[0];
      }
    } else if (tmp.length === 1) {
      numberStr = tmp[0].replace(/^0{1,}/, '');
    }
    if (numberStr.length > 1 && numberStr[0] === '.') {
      numberStr = '0' + numberStr;
    }
    if (numberStr === '') {
      numberStr = '0';
    }
    return numberStr;
  },
  convertString2HexString: function(originStr) {
    return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(originStr));
  },
  convertHexString2String: function(hexStr) {
    return CryptoJS.enc.Hex.parse(hexStr).toString(CryptoJS.enc.Utf8);
  },
  convertU8A2HexStr: function(u8Array) {
    return Buffer.from(u8Array).toString('hex');
  },
  convertU8A2Utf8Str: function(u8Array) {
    return Buffer.from(u8Array).toString('utf8');
  },
  // can not check the name while the storing directory includes any directory
  // find the name with case insensitive while giving nameForFind a valid string
  /**
   * 获取昵称列表
   * @param {string} nameForFind
   * @return {array}
   */
  getWalletAccount: function(nameForFind) {
  let result = [];
    let stat = fs.statSync(conf.store.account_store);
    if (stat && stat.isDirectory()) {
      let files = fs.readdirSync(conf.store.account_store);
      files.forEach((ele) => {
        stat = fs.statSync(conf.store.account_store + '/' + ele);
        if (!stat.isDirectory()) {
          let filename = ele;
          if (ele.length <= conf.store.account_store_suffix.length) {
            return;
          }
          if (ele.substr(
            ele.length - conf.store.account_store_suffix.length).toUpperCase()
            !== conf.store.account_store_suffix.toUpperCase()) {
            return;
          }
          filename = ele.substr(
            0, ele.length - conf.store.account_store_suffix.length);
          if (typeof nameForFind === 'string' && nameForFind.length > 0) {
            if (nameForFind.toUpperCase() === filename.toUpperCase()) {
              result.push(filename);
            }
          } else {
            result.push(filename);
          }
        }
      });
    }
  return result;
},
  /**
   * 根据昵称获取账号文件路径
   * @param {string} nick
   * @return {string}
   */
  getWalletAccountFilePath: function(nick) {
    return conf.store.account_store + '/' + nick
        + conf.store.account_store_suffix;
  },
  // add event handler within sdk
  eventInnerAdd: evtAddInner,
  eventAdd: function(eventName, funcCallback) {
    if (typeof eventName === 'string') {
      if (!global.hasOwnProperty('BlockchainCallbackList')) {
        global.BlockchainCallbackList = {};
      }
      if (!global.BlockchainCallbackList.hasOwnProperty(eventName)) {
        global.BlockchainCallbackList[eventName] = [];
      }
      global.BlockchainCallbackList[eventName].push(funcCallback);
    }
  },
  eventClear: function(eventName) {
    if (eventName === null || eventName === undefined || eventName === '') {
      if (global.hasOwnProperty('BlockchainCallbackList')) {
        global.BlockchainCallbackList = {};
      }
    } else {
      if (typeof eventName === 'string'
        && global.hasOwnProperty('BlockchainCallbackList')
        && global.BlockchainCallbackList.hasOwnProperty(eventName)) {
        global.BlockchainCallbackList[eventName] = [];
      }
    }
  },
  eventTrigger: function(eventName, args) {
    trigger(eventName, args);
  },
  objectCheck: function(obj, must, options) {
    if (typeof obj != 'object') {
      return false;
    }
    if (Array.isArray(obj)) {
      return false;
    }
    if (typeof must != 'object') {
      return false;
    }
    if (Array.isArray(must)) {
      return false;
    }
    let result = true;
    let objKeys = obj ? Object.keys(obj) : [];
    let mustKeys = must ? Object.keys(must) : [];
    mustKeys.every(function(element, index) {
      if (objKeys.includes(element)) {
        switch (must[element]) {
          case 'number':
            if (typeof obj[element] === 'number') {
              return true;
            } else {
              result = false;
              return false;
            }
          case 'string':
            if (typeof obj[element] === 'string') {
              return true;
            } else {
              result = false;
              return false;
            }
          case 'array':
            if (typeof obj[element] === 'object'
                && Array.isArray(obj[element])) {
                  return true;
                } else {
                  result = false;
                  return false;
                }
          case 'object':
            if (typeof obj[element] === 'object'
                && !Array.isArray(obj[element])) {
                  return true;
                } else {
                  result = false;
                  return false;
                }
          default: result = false; return false;
        }
      } else {
        result = false;
        return false;
      }
    });
    if (!result) {
      return false;
    }
    if (typeof options === 'object' && !Array.isArray(options)) {
      let optionsKeys = options ? Object.keys(options) : [];
      optionsKeys.every(function(element, index) {
        if (objKeys.includes(element)) {
          switch (options[element]) {
            case 'number':
              if (typeof obj[element] === 'number') {
                return true;
              } else {
                result = false;
                return false;
              }
            case 'string':
              if (typeof obj[element] === 'string') {
                return true;
              } else {
                result = false;
                return false;
              }
            case 'array':
              if (typeof obj[element] === 'object'
                  && Array.isArray(obj[element])) {
                    return true;
                  } else {
                    result = false;
                    return false;
                  }
            case 'object':
              if (typeof obj[element] === 'object'
                  && !Array.isArray(obj[element])) {
                    return true;
                  } else {
                    result = false;
                    return false;
                  }
            default: result = false; return false;
          }
        } else {
          return true;
        }
      });
    }
    if (!result) {
      return false;
    }
    return true;
  },
  isObject: function(p) {
    if (typeof p === 'object' && !Array.isArray(p)) {
      return true;
    }
    return false;
  },
  isArray: function(p) {
    if (typeof p === 'object' && Array.isArray(p)) {
      return true;
    }
    return false;
  },
  isSuccess: function(ret) {
    if (ret
        && ret.hasOwnProperty('errCode')
        && ret.errCode === errorUtil.ERRORS.SUCCESS.CODE) {
      return true;
    }
    return false;
  },
  isValid: function(p) {
    if (typeof p !== 'undefined' && p) {
      return true;
    } else {
      return false;
    }
  },
  getErrorCode: function(err) {
    if (err && err.hasOwnProperty('errCode')) {
      return err.errCode;
    }
    return null;
  },
  isAddressLegal: async function(address) {
    let info = await getInfo('check-address', [address]);
    if (info === undefined) {
      return null;
    }
    if (info === 'ok') {
      return true;
    }
    return false;
  },
  queryInfo: getInfo,
  packageHttpErr: function(errorCode, errorDesc) {
    if (errorCode !== errorUtil.ERRORS.SUCCESS.CODE) {
      trigger(errorUtil.EVENTS.ERROR, {
          'position': getCallstackLine(3),
          'message': errorDesc});
    }
    switch (errorCode) {
      case 0: return {
        'errCode': errorUtil.ERRORS.SUCCESS.CODE,
        'msg': errorUtil.ERRORS.SUCCESS.MSG};
      case 100: return {
        'errCode': errorUtil.ERRORS.ERR_LOW_BALANCE.CODE,
        'msg': errorUtil.ERRORS.ERR_LOW_BALANCE.MSG};
      case 111: return {
        'errCode': errorUtil.ERRORS.ERR_TX_LOW_FEE.CODE,
        'msg': errorUtil.ERRORS.ERR_TX_LOW_FEE.MSG};
      case 2: return {
        'errCode': errorUtil.ERRORS.ERR_TX_STR_TIMEOUT.CODE,
        'msg': errorUtil.ERRORS.ERR_TX_STR_TIMEOUT.MSG};
      case 93: return {
        'errCode': errorUtil.ERRORS.ERR_TX_NO_ENOUGH_WEIGHT.CODE,
        'msg': errorUtil.ERRORS.ERR_TX_NO_ENOUGH_WEIGHT.MSG};
      case 99: return {
        'errCode': errorUtil.ERRORS.ERR_TX_NONCE_INVALID.CODE,
        'msg': errorUtil.ERRORS.ERR_TX_NONCE_INVALID.MSG};
      default: return {
        'errCode': errorUtil.ERRORS.ERR_HTTP_UNEXPECTED.CODE,
        'msg': errorUtil.ERRORS.ERR_HTTP_UNEXPECTED.MSG +
          '(' + errorCode + ':' + errorDesc + ')'};
    }
  },
  packageError: function(ErrObj, note) {
    if (ErrObj.CODE !== errorUtil.ERRORS.SUCCESS.CODE) {
      trigger(errorUtil.EVENTS.ERROR,
        {
          'position': getCallstackLine(3),
          'message': JSON.stringify(
            ErrObj, Object.getOwnPropertyNames(ErrObj))});
    }
    return {
      'errCode': ErrObj.CODE,
      'msg': ErrObj.MSG + (note ? note : '')};
  },
  handleError: dealError};

/**
  * 处理错误信息，包括node内置错误
  * @param {object} err
  * @return {object}
  */
function dealError(err) {
  if (!err) {
    return {
      'errCode': errorUtil.ERRORS.ERR_UNKNOWN.CODE,
      'msg': errorUtil.ERRORS.ERR_UNKNOWN.MSG};
  }
  trigger(errorUtil.EVENTS.ERROR, {
    'position': getCallstackLine(3),
    'message': JSON.stringify(err, Object.getOwnPropertyNames(err))});
  if (err.hasOwnProperty('errCode')) {
    return err;
  }
  if (!err.hasOwnProperty('code')) {
    return {
      'errCode': errorUtil.ERRORS.ERR_UNKNOWN.CODE,
      'msg': errorUtil.ERRORS.ERR_UNKNOWN.MSG};
  }
  switch (err.code) {
    case 'EACCES': return {
      'errCode': errorUtil.ERRORS.ERR_EACCES.CODE,
      'msg': errorUtil.ERRORS.ERR_EACCES.MSG};
    case 'EADDRINUSE': return {
      'errCode': errorUtil.ERRORS.ERR_EADDRINUSE.CODE,
      'msg': errorUtil.ERRORS.ERR_EADDRINUSE.MSG};
    case 'ECONNREFUSED': return {
      'errCode': errorUtil.ERRORS.ERR_ECONNREFUSED.CODE,
      'msg': errorUtil.ERRORS.ERR_ECONNREFUSED.MSG};
    case 'ECONNRESET': return {
      'errCode': errorUtil.ERRORS.ERR_ECONNRESET.CODE,
      'msg': errorUtil.ERRORS.ERR_ECONNRESET.MSG};
    case 'EEXIST': return {
      'errCode': errorUtil.ERRORS.ERR_EEXIST.CODE,
      'msg': errorUtil.ERRORS.ERR_EEXIST.MSG};
    case 'EISDIR': return {
      'errCode': errorUtil.ERRORS.ERR_EISDIR.CODE,
      'msg': errorUtil.ERRORS.ERR_EISDIR.MSG};
    case 'EMFILE': return {
      'errCode': errorUtil.ERRORS.ERR_EMFILE.CODE,
      'msg': errorUtil.ERRORS.ERR_EMFILE.MSG};
    case 'ENOENT': return {
      'errCode': errorUtil.ERRORS.ERR_ENOENT.CODE,
      'msg': errorUtil.ERRORS.ERR_ENOENT.MSG};
    case 'ENOTDIR': return {
      'errCode': errorUtil.ERRORS.ERR_ENOTDIR.CODE,
      'msg': errorUtil.ERRORS.ERR_ENOTDIR.MSG};
    case 'ENOTEMPTY': return {
      'errCode': errorUtil.ERRORS.ERR_ENOTEMPTY.CODE,
      'msg': errorUtil.ERRORS.ERR_ENOTEMPTY.MSG};
    case 'EPERM': return {
      'errCode': errorUtil.ERRORS.ERR_EPERM.CODE,
      'msg': errorUtil.ERRORS.ERR_EPERM.MSG};
    case 'EPIPE': return {
      'errCode': errorUtil.ERRORS.ERR_EPIPE.CODE,
      'msg': errorUtil.ERRORS.ERR_EPIPE.MSG};
    case 'ETIMEDOUT': return {
      'errCode': errorUtil.ERRORS.ERR_ETIMEDOUT.CODE,
      'msg': errorUtil.ERRORS.ERR_ETIMEDOUT.MSG};
    default: return {
      'errCode': errorUtil.ERRORS.ERR_UNKNOWN.CODE,
      'msg': errorUtil.ERRORS.ERR_UNKNOWN.MSG + '(' + err.code + ')'};
  }
}

/**
 * 获取调用堆栈特定行数
 * @param {number}  line  - 行数
 * @return {string}
 */
function getCallstackLine(line) {
  let s = new Error().stack.split('\n');
  if (s.length >= line) {
    return s[line].trim();
  }
}

/**
 * 触发相关事件
 * @param {string}  eventName - 事件名称
 * @param {any}     args      - 事件参数
 * @return {undefined}
*/
function trigger(eventName, args) {
  if (typeof eventName === 'string') {
    if (global.hasOwnProperty('BlockchainCallbackListInner')
      && global.BlockchainCallbackListInner.hasOwnProperty(eventName)
      && global.BlockchainCallbackListInner[eventName].length > 0) {
      global.BlockchainCallbackListInner[eventName].forEach((element) => {
        element(args);
      });
    }
    if (global.hasOwnProperty('BlockchainCallbackListInnerOnce')) {
      if (global.BlockchainCallbackListInnerOnce.pool.hasOwnProperty(eventName)
          && global.BlockchainCallbackListInnerOnce.pool[eventName].length > 0) {
            global.BlockchainCallbackListInnerOnce.pool[eventName].forEach((ele)=>{
              ele(args);
            });
            delete global.BlockchainCallbackListInnerOnce.pool[eventName];
          }
      if (global.BlockchainCallbackListInnerOnce.queue.hasOwnProperty(eventName)
          && global.BlockchainCallbackListInnerOnce.queue[eventName].length > 0) {
            let ele = global.BlockchainCallbackListInnerOnce.queue[eventName].shift();
            ele(args);
          }
    }
    if (global.hasOwnProperty('BlockchainCallbackList')
      && global.BlockchainCallbackList.hasOwnProperty(eventName)
      && global.BlockchainCallbackList[eventName].length > 0) {
      global.BlockchainCallbackList[eventName].forEach((element) => {
        element(args);
      });
    }
  }
}

/**
 * 注册事件的内置响应回调
 * @param {string} eventName
 * @param {function} funcCallback
 */
function evtAddInner(eventName, funcCallback) {
  if (typeof eventName === 'string') {
    if (!global.hasOwnProperty('BlockchainCallbackListInner')) {
      global.BlockchainCallbackListInner = {};
    }
    if (!global.BlockchainCallbackListInner.hasOwnProperty(eventName)) {
      global.BlockchainCallbackListInner[eventName] = [];
    }
    global.BlockchainCallbackListInner[eventName].push(funcCallback);
  }
}

/**
 * 注册事件的内置一次性响应回调
 * @param {bool} isInQueue 回调类型，true: 一次事件触发一个回调, false: 一次事件触发所有回调
 * @param {string} eventName
 * @param {function} funcCallback
 */
function evtAddInnerOnce(isInQueue, eventName, funcCallback) {
  if (typeof eventName === 'string') {
    if (funcCallback === undefined
      && global.hasOwnProperty('BlockchainCallbackListInnerOnce')) {
        if (global.BlockchainCallbackListInnerOnce.pool
            .hasOwnProperty(eventName)) {
          global.BlockchainCallbackListInnerOnce.pool[eventName] = [];
        }
        if (global.BlockchainCallbackListInnerOnce.queue
            .hasOwnProperty(eventName)) {
          global.BlockchainCallbackListInnerOnce.queue[eventName] = [];
        }
    }
    if (!global.hasOwnProperty('BlockchainCallbackListInnerOnce')) {
      global.BlockchainCallbackListInnerOnce = {'queue': {}, 'pool': {}};
    }
    if (isInQueue) {
      if (!global.BlockchainCallbackListInnerOnce.queue
          .hasOwnProperty(eventName)) {
        global.BlockchainCallbackListInnerOnce.queue[eventName] = [];
      }
      global.BlockchainCallbackListInnerOnce.queue[eventName]
        .push(funcCallback);
    } else {
      if (!global.BlockchainCallbackListInnerOnce.pool
          .hasOwnProperty(eventName)) {
        global.BlockchainCallbackListInnerOnce.pool[eventName] = [];
      }
      global.BlockchainCallbackListInnerOnce.pool[eventName].push(funcCallback);
    }
  }
}

/**
 * 初始化底层动态库
 */
function initNodeLib() {
  if (nodeLib === null) {
    nodeLib = ffi.Library(conf.account.node_lib_path, {
      'InitBumoTools': ['int', []],
      'UnInitBumoTools': ['void', []],
      'CreateAccountAddress': ['int', ['string', 'pointer', 'int*']],
      'CheckAccountAddressValid': ['int', ['string']],
      'CreateKeystore': ['int', ['string', 'pointer', 'int*']],
      'CheckKeystoreValid': ['int', ['string', 'string']],
      'SignData': ['int', ['string', 'string', 'pointer', 'int*']],
      'SignDataWithKeystore': ['int', ['string', 'string', 'string', 'pointer', 'int*']],
      'CheckSignedData': ['int', ['string', 'string', 'string']],
      'CreateKeystoreFromPrivkey': ['int', ['string', 'string', 'pointer', 'int*']],
      'GetAddressFromPubkey': ['int', ['string', 'pointer', 'int*']],
      'GetPrivatekeyFromKeystore': ['int', ['string', 'string', 'pointer', 'int*']],
    });
    nodeLib.InitBumoTools();
  }
}

/**
 * 初始化底层程序的console命令模式，用于公私钥地址之间的转换和交易签名等操作
 */
function initNodeConsole() {
  if (conf.account.account_method !== 'console') {
    return;
  }
  if (nodeConsole === null) {
    let cb = undefined;
    let reqQueue = [];
    evtAddInner(errorUtil.EVENTS.NODE_CONSOLE_REQUEST, (args)=>{
      reqQueue.push(args);
      if (cb === null && reqQueue.length > 0) {
        let tmp = reqQueue.shift();
        nodeConsole.stdin.write(tmp.request + '\n');
        cb = tmp.callback;
      }
    });
    nodeConsole = spawn(conf.account.sync_node_path, ['--console-with-cmd']);
    nodeConsole.on('error', (err)=>{
      dealError(err);
    });
    nodeConsole.stdout.on('data', (data)=>{
      if (cb === undefined) {
        cb = null;
      } else {
        if (cb !== null) {
          cb(data.toString());
          cb = null;
        }
      }

      if (reqQueue.length > 0) {
        let tmp = reqQueue.shift();
        nodeConsole.stdin.write(tmp.request + '\n');
        cb = tmp.callback;
      }
      trigger(errorUtil.EVENTS.NODE_CONSOLE_RESPOSE, data.toString());
    });
    process.on('exit', (code) => {
      if (nodeConsole !== null) {
        nodeConsole.kill();
      }
    });
  }
}

/**
 * 从console-cmd的节点模式请求数据
 * @param {array} arrayParams
 * @return {object}
 */
function queryNodeConsole(arrayParams) {
  return new Promise((rs, rj)=>{
    trigger(errorUtil.EVENTS.NODE_CONSOLE_REQUEST, {
      'request': arrayParams.map((ele)=>{
        if (typeof ele === 'string') {
          return Buffer.from(ele).toString('hex');
        } else {
          return '';
        }
      }).join(' '),
      'callback': (data)=>{
        return rs(data);
      },
      'error': (err)=>{
        return rj();
      },
    });
  });
}

/**
 * 根据类型请求相应数据
 * @param {string} type
 * @param {array} data
 * @return {string|undefined}
 */
async function getInfo(type, data) {
  const charBuffSize = 2048;
  switch (type) {
    case 'sign-data':
      if (conf.account.account_method === 'exec') {
        let t = spawnSync(conf.account.sync_node_path,
          ['--sign-data'].concat(data)); // privateKey, blob
        if (t.status === null) {
          (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
          return undefined;
        }
        return t.stdout.toString().trim();
      } else if (conf.account.account_method === 'console') {
        let result = await queryNodeConsole(['--sign-data'].concat(data));
        return result.trim();
      } else if (conf.account.account_method === 'lib') {
        initNodeLib();
        let length = new Buffer(4);
        let charBuff = new Buffer(charBuffSize).fill('\0');
        length.writeInt32LE(charBuffSize, 0);
        length.type = ref.types.int;
        let result = nodeLib.SignData(data[0], data[1], charBuff, length);
        if (result === 0) {
          return charBuff.toString('utf8', 0, length.deref()).trim();
        }
        return undefined;
      }
      break;
    case 'check-address':
      if (conf.account.account_method === 'exec') {
        let t = spawnSync(conf.account.sync_node_path,
          ['--check-address'].concat(data)); // address
        if (t.status === null) {
          (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
          return undefined;
        }
        return t.stdout.toString().trim();
      } else if (conf.account.account_method === 'console') {
        let result = await queryNodeConsole(['--check-address'].concat(data));
        return result.trim();
      } else if (conf.account.account_method === 'lib') {
        initNodeLib();
        let result = nodeLib.CheckAccountAddressValid(data[0]);
        if (result === 0) {
          return 'ok';
        } else {
          return 'error';
        }
      }
      break;
    case 'create-account':
      if (conf.account.account_method === 'exec') {
        let t = spawnSync(conf.account.sync_node_path,
          ['--create-account', 'ed25519']);
        if (t.status === null) {
          (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
          return undefined;
        }
        return t.stdout.toString().trim();
      } else if (conf.account.account_method === 'console') {
        let result = await queryNodeConsole(['--create-account', 'ed25519'].concat(data));
        return result.trim();
      } else if (conf.account.account_method === 'lib') {
        initNodeLib();
        let length = new Buffer(4);
        let charBuff = new Buffer(charBuffSize).fill('\0');
        length.writeInt32LE(charBuffSize, 0);
        length.type = ref.types.int;
        let result = nodeLib.CreateAccountAddress('ed25519', charBuff, length);
        if (result === 0) {
          return charBuff.toString('utf8', 0, length.deref()).trim();
        }
        return undefined;
      }
      break;
    case 'check-signed-data':
      if (conf.account.account_method === 'exec') {
        let t = spawnSync(conf.account.sync_node_path,
          ['--check-signed-data'].concat(data)); // blob, sign_data, public_key
        if (t.status === null) {
          (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
          return undefined;
        }
        return t.stdout.toString().trim();
      } else if (conf.account.account_method === 'console') {
        let result = await queryNodeConsole(['--check-signed-data'].concat(data));
        return result.trim();
      } else if (conf.account.account_method === 'lib') {
        initNodeLib();
        let result = nodeLib.CheckSignedData(data[0], data[1], data[2]);
        if (result === 0) {
          return 'true';
        }
        return 'false';
      }
      break;
    case 'get-address-from-pubkey':
      if (conf.account.account_method === 'exec') {
        let t = spawnSync(conf.account.sync_node_path,
          ['--get-address-from-pubkey'].concat(data)); // public_key
        if (t.status === null) {
          (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
          return undefined;
        }
        return t.stdout.toString().trim();
      } else if (conf.account.account_method === 'console') {
        let result = await queryNodeConsole(['--get-address-from-pubkey'].concat(data));
        return result.trim();
      } else if (conf.account.account_method === 'lib') {
        initNodeLib();
        let length = new Buffer(4);
        let charBuff = new Buffer(charBuffSize).fill('\0');
        length.writeInt32LE(charBuffSize, 0);
        length.type = ref.types.int;
        let result = nodeLib.GetAddressFromPubkey(data[0], charBuff, length);
        if (result === 0) {
          return charBuff.toString('utf8', 0, length.deref()).trim();
        }
        return undefined;
      }
      break;
    case 'get-privatekey-from-keystore':
      if (conf.account.account_method === 'exec') {
        let t = spawnSync(conf.account.sync_node_path,
          ['--get-privatekey-from-keystore'].concat(data)); // keystore, pwd
        if (t.status === null) {
          (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
          return undefined;
        }
        return t.stdout.toString().trim();
      } else if (conf.account.account_method === 'console') {
        let result = await queryNodeConsole(['--get-privatekey-from-keystore'].concat(data));
        return result.trim();
      } else if (conf.account.account_method === 'lib') {
        initNodeLib();
        let length = new Buffer(4);
        let charBuff = new Buffer(charBuffSize).fill('\0');
        length.writeInt32LE(charBuffSize, 0);
        length.type = ref.types.int;
        let result = nodeLib.GetPrivatekeyFromKeystore(data[0], data[1], charBuff, length);
        if (result === 0) {
          return charBuff.toString('utf8', 0, length.deref()).trim();
        }
        return undefined;
      }
      break;
    case 'create-keystore-from-privatekey':
      if (conf.account.account_method === 'exec') {
        let t = spawnSync(conf.account.sync_node_path,
          ['--create-keystore-from-privatekey'].concat(data)); // privKey, pwd
        if (t.status === null) {
          (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
          return undefined;
        }
        return t.stdout.toString().trim();
      } else if (conf.account.account_method === 'console') {
        let result = await queryNodeConsole(['--create-keystore-from-privatekey'].concat(data));
        return result.trim();
      } else if (conf.account.account_method === 'lib') {
        initNodeLib();
        let length = new Buffer(4);
        let charBuff = new Buffer(charBuffSize).fill('\0');
        length.writeInt32LE(charBuffSize, 0);
        length.type = ref.types.int;
        let result = nodeLib.CreateKeystoreFromPrivkey(data[0], data[1], charBuff, length);
        if (result === 0) {
          return charBuff.toString('utf8', 0, length.deref()).trim();
        }
        return undefined;
      }
      break;
    case 'sign-data-with-keystore':
      if (conf.account.account_method === 'exec') {
        let t = spawnSync(conf.account.sync_node_path,
          ['--sign-data-with-keystore'].concat(data));
        if (t.status === null) {
          (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
          return undefined;
        }
        return t.stdout.toString().trim();
      } else if (conf.account.account_method === 'console') {
        let result = await queryNodeConsole(['--sign-data-with-keystore'].concat(data));
        return result.trim();
      } else if (conf.account.account_method === 'lib') {
        initNodeLib();
        let length = new Buffer(4);
        let charBuff = new Buffer(charBuffSize).fill('\0');
        length.writeInt32LE(charBuffSize, 0);
        length.type = ref.types.int;
        let result = nodeLib.SignDataWithKeystore(data[0], data[1], data[2], charBuff, length);
        if (result === 0) {
          return charBuff.toString('utf8', 0, length.deref()).trim();
        }
        return undefined;
      }
      break;
    case 'create-keystore':
      if (conf.account.account_method === 'exec') {
        let t = spawnSync(conf.account.sync_node_path,
          ['--create-keystore', data[0]]);
        if (t.status === null) {
          (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
          return undefined;
        }
        return t.stdout.toString().trim();
      } else if (conf.account.account_method === 'console') {
        let result = await queryNodeConsole(['--create-keystore'].concat(data));
        return result.trim();
      } else if (conf.account.account_method === 'lib') {
        initNodeLib();
        let length = new Buffer(4);
        let charBuff = new Buffer(charBuffSize).fill('\0');
        length.writeInt32LE(charBuffSize, 0);
        length.type = ref.types.int;
        let result = nodeLib.CreateKeystore(data[0], charBuff, length);
        if (result === 0) {
          return charBuff.toString('utf8', 0, length.deref()).trim();
        }
        return undefined;
      }
      break;
    case 'check-keystore-valid':
      if (conf.account.account_method === 'exec') {
        let t = spawnSync(conf.account.sync_node_path,
          ['--check-keystore'].concat(data));
        if (t.status === null) {
          (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
          return undefined;
        }
        return t.stdout.toString().trim();
      } else if (conf.account.account_method === 'console') {
        let result = await queryNodeConsole(['--check-keystore-valid'].concat(data));
        return result.trim();
      } else if (conf.account.account_method === 'lib') {
        initNodeLib();
        let result = nodeLib.CheckKeystoreValid(data[0], data[1]);
        if (result === 0) {
          return 'ok';
        }
        return 'error';
      }
      break;
  }
  return undefined;
}
