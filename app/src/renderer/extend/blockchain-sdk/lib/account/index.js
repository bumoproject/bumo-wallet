import constUtil from '../constants';
import commonUtil from '../util';

import fs from 'fs';
import conf from '../../config';
import net from '../network';
import history from '../history';
import path from 'path';

export default {
  /**
   * 账户创建
   * @param {object} params             [必须]参数对象
   * @param {string} params.accountNick [必须]账户昵称
   * @param {string} params.pwd         [必须]账户密码
   * @return {object}
  **/
  async create(params) {
    try {
      if (!commonUtil.objectCheck(params, {
        'accountNick': 'string',
        'pwd': 'string',
      })
        || params.accountNick.length === 0 || params.pwd.length === 0) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS));
      }

      if (savePath === null) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_SAVE_PATH));
      }
      if (!checkWalletAccountNewName(params.accountNick)) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_NICKNAME_EXISTS));
      }

      let data = await net.getNewAccount();
      if (commonUtil.objectCheck(data, {
        'address': 'string',
        'private_key': 'string',
      })) {
        await saveWalletAccount(
          params.accountNick, params.pwd, data.private_key);
        setNewAddress(data.address);
        return ({
          'errCode': constUtil.ERRORS.SUCCESS.CODE,
          'msg': constUtil.ERRORS.SUCCESS.MSG,
          'data': {
            'nick': params.accountNick,
            'address': data.address,
            'privKey': data.private_key,
          },
        });
      } else {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
      }
    } catch (err) {
      return commonUtil.handleError(err);
    }
  },
  /**
   * 账户登录
   * @param {object} params             [必须]参数对象
   * @param {string} params.accountNick [必须]账户昵称
   * @param {string} params.pwd         [必须]账户密码
   * @return {object}
  **/
  async login(params) {
    try {
      if (!commonUtil.objectCheck(params, {
            'accountNick': 'string',
            'pwd': 'string'})
          || params.accountNick.length === 0
          || params.pwd.length === 0) {
        throw (commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS));
      }
      if (savePath === null) {
        throw (commonUtil.packageError(constUtil.ERRORS.ERR_SAVE_PATH));
      }
      if (commonUtil.getWalletAccount(params.accountNick).length === 0) {
        throw (commonUtil.packageError(
          constUtil.ERRORS.ERR_NICKNAME_NOT_EXISTS));
      }
      let result = await decodeFile(
        commonUtil.getWalletAccountFilePath(params.accountNick),
        params.pwd);
      if (result) {
        setNewAddress(result.address);
        return ({
          'errCode': constUtil.ERRORS.SUCCESS.CODE,
          'msg': constUtil.ERRORS.SUCCESS.MSG,
          'data': {
            'nick': params.accountNick,
            'address': result.address}});
      } else {
        throw (commonUtil.packageError(constUtil.ERRORS.ERR_FILE_DECODE));
      }
    } catch (err) {
      return commonUtil.handleError(err);
    }
  },
  // 加载钱包昵称
  async loadWalletName() {
    try {
      if (savePath === null) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_SAVE_PATH));
      }
      return ({
        'errCode': constUtil.ERRORS.SUCCESS.CODE,
        'msg': constUtil.ERRORS.SUCCESS.MSG,
        'data': commonUtil.getWalletAccount(),
      });
    } catch (err) {
      return (commonUtil.handleError(err));
    }
  },
  /**
   * 账户私钥导入
   * @param {object} params             [必须]参数对象
   * @param {string} params.accountNick [必须]账户昵称
   * @param {string} params.pwd         [必须]账户密码
   * @param {string} params.privKeyFile [必须]账户私钥文件
   * @return {object}
   **/
  async importAccountPrivFile(params) {
    try {
      if (!commonUtil.objectCheck(params, {
        'accountNick': 'string',
        'pwd': 'string',
        'privKeyFile': 'string',
      })
        || params.accountNick.length === 0
        || params.pwd.length === 0
        || params.privKeyFile.length === 0) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS));
      }
      if (savePath === null) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_SAVE_PATH));
      }
      if (!checkWalletAccountNewName(params.accountNick)) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_NICKNAME_EXISTS));
      }
      let result = await decodeFile(params.privKeyFile, params.pwd);
      if (result) {
        await saveWalletAccount(
          params.accountNick, params.pwd, result.private);
        setNewAddress(result.address);
        return ({
          'errCode': constUtil.ERRORS.SUCCESS.CODE,
          'msg': constUtil.ERRORS.SUCCESS.MSG,
          'data': {
            'nick': params.accountNick,
            'address': result.address,
          },
        });
      } else {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_FILE_DECODE));
      }
    } catch (err) {
      return commonUtil.handleError(err);
    }
  },
  /**
   * 账户明文字符串导入
   * @param {object} params             [必须]参数对象
   * @param {string} params.accountNick [必须]账户昵称
   * @param {string} params.pwd         [必须]账户密码
   * @param {string} params.privKeyStr  [必须]账户私钥明文串
   * @return {object}
   **/
  async importAccountPrivStr(params) {
    try {
      if (!commonUtil.objectCheck(params, {
          'accountNick': 'string',
          'pwd': 'string',
          'privKeyStr': 'string'})
        || params.accountNick.length === 0
        || params.pwd.length === 0
        || params.privKeyStr.length === 0) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS));
      }
      if (savePath === null) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_SAVE_PATH));
      }
      if (!checkWalletAccountNewName(params.accountNick)) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_NICKNAME_EXISTS));
      }
      try {
        let info = await net.getAccountFromPrivate(
          params.privKeyStr, params.pwd);
        await saveWalletAccount(
          params.accountNick, params.pwd, info.private_key);
        setNewAddress(info.address);
        return ({
          'errCode': constUtil.ERRORS.SUCCESS.CODE,
          'msg': constUtil.ERRORS.SUCCESS.MSG,
          'data': {
            'nick': params.accountNick,
            'private': info.private_key,
            'address': info.address}});
      } catch (e) {
        if (commonUtil.getErrorCode(e) ===
              constUtil.ERRORS.ERR_HTTP_RESULT_ERR.CODE) {
          return (commonUtil.packageError(constUtil.ERRORS.ERR_KEY_INVALID));
        } else {
          return (commonUtil.handleError(e));
        }
      }
    } catch (err) {
      return commonUtil.handleError(err);
    }
  },
  /**
   * 获取账户token余额
   * @param {object}  params          [必须]参数对象
   * @param {string}  params.address  [必须]账户地址
   * @return {object}
   **/
  async getAccountTokenBalance(params) {
    try {
      if (!commonUtil.objectCheck(params, {'address': 'string'})
        || params.address.length === 0) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS));
      }
      let data = await net.getBalance(params.address);
      let balanceX = commonUtil.unitConvert(
        data.balance, constUtil.BUILDIN_UNIT_OUT);
      let reserveX = commonUtil.unitConvert(
        data.fee, constUtil.BUILDIN_UNIT_OUT);
      if (balanceX === null || reserveX === null) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_HTTP_RESULT_ERR));
      } else {
        return ({
          'errCode': constUtil.ERRORS.SUCCESS.CODE,
          'msg': constUtil.ERRORS.SUCCESS.MSG,
          'data': {
            'amount': balanceX,
            'reserve': reserveX,
            'gasPrice': data.gasPrice,
            'assetCodeAlias': 'BU',
            'priv': data.priv,
          },
        });
      }
    } catch (err) {
      return commonUtil.handleError(err);
    }
  },
  /**
   * 获取账户私钥明文
   * @param {object} params             [必须]参数对象
   * @param {string} params.accountNick [必须]账户昵称
   * @param {string} params.pwd         [必须]账户密码
   * @return {object}
   **/
  async getAccountPrivKeyStr(params) {
    try {
      if (!commonUtil.objectCheck(params, {
            'accountNick': 'string',
            'pwd': 'string'})
          || params.accountNick.length === 0 || params.pwd.length === 0) {
            return (commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS));
      }
      if (savePath === null) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_SAVE_PATH));
      }
      let result = await decodeFile(
        commonUtil.getWalletAccountFilePath(params.accountNick), params.pwd);
      if (result !== null) {
        return ({
          'errCode': constUtil.ERRORS.SUCCESS.CODE,
          'msg': constUtil.ERRORS.SUCCESS.MSG,
          'data': {
            'privKeyStr': result.private}});
      } else {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_FILE_DECODE));
      }
    } catch (err) {
      return commonUtil.handleError(err);
    }
  },
  /**
   * 备份账户私钥文件
   * @param {object} params               [必须]参数对象
   * @param {string} params.accountNick   [必须]账户昵称
   * @param {string} params.savePrivPath  [必须]账户私钥文件备份路径
   * @return {object}
   **/
  async saveAccountPrivKeyFile(params) {
    try {
      if (!commonUtil.objectCheck(params, {
        'accountNick': 'string',
        'savePrivPath': 'string',
      })
        || params.accountNick.length === 0
        || params.savePrivPath.length === 0) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS));
      }
      if (!fs.existsSync(path.dirname(params.savePrivPath))) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_PATH_NOT_EXISTS));
      }
      if (commonUtil.getWalletAccount(params.accountNick).length === 0) {
        return (commonUtil.packageError(
          constUtil.ERRORS.ERR_NICKNAME_NOT_EXISTS));
      }
      if (savePath === null) {
        return (commonUtil.packageError(constUtil.ERRORS.ERR_SAVE_PATH));
      }
      fs.writeFileSync(
        params.savePrivPath,
        fs.readFileSync(
          commonUtil.getWalletAccountFilePath(params.accountNick)));
      return (commonUtil.packageError(constUtil.ERRORS.SUCCESS));
    } catch (err) {
      return commonUtil.handleError(err);
    }
  },
};

let savePath = conf.store.account_store;
try {
  fs.readdirSync(savePath);
} catch (err) {
  if (err.code === 'ENOENT') {
    try {
      fs.mkdirSync(savePath);
    } catch (mkErr) {
      commonUtil.handleError(mkErr);
      savePath = null;
    }
  } else {
    commonUtil.handleError(err);
    savePath = null;
  }
}

/**
 * 设置当前地址，用于区块或交易的同步
 * @param {string} address  地址
 */
function setNewAddress(address) {
  history.settings(address);
}

/**
 * 解密文件
 * @param {string} file 文件
 * @param {string} pswd 密码
 * @return {object}
 */
async function decodeFile(file, pswd) {
  try {
    let data = fs.readFileSync(file).toString();
    let info = await commonUtil.queryInfo(
      'get-privatekey-from-keystore', [data, pswd]);
    if (info === undefined) {
      return null;
    }
    if (info === 'error') {
      return null;
    }
    data = JSON.parse(data);
    return {
      'private': info,
      'address': data.address};
  } catch (error) {
    commonUtil.handleError(error);
    return null;
  }
  return null;
}

/**
 * 保存账号
 * @param {string} nick 昵称
 * @param {string} pswd 密码
 * @param {string} priv 私钥
 * @return {boolean}
 */
async function saveWalletAccount(nick, pswd, priv) {
  if (!priv) {
    return false;
  }
  let stat = fs.statSync(conf.store.account_store);
  if (stat && stat.isDirectory()) {
    let info = await commonUtil.queryInfo(
      'create-keystore-from-privatekey', [priv, pswd]);
    if (info === undefined) {
      return false;
    }
    fs.writeFileSync(
      conf.store.account_store + '/' + nick + conf.store.account_store_suffix,
      info);
    return true;
  }
  return false;
}

// check the name whether usable for create with case insensitive
/**
 * 检查新名称
 * @param {string} name   新名称
 * @return {boolean}
 */
function checkWalletAccountNewName(name) {
  let result = true;
  let stat = fs.statSync(conf.store.account_store);
  if (stat && stat.isDirectory()) {
    if (typeof name === 'string' && name.length > 0) {
      name = name.toUpperCase();
      let files = fs.readdirSync(conf.store.account_store);
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (file.length <= conf.store.account_store_suffix.length) {
          continue;
        }
        if (file.substr(
          file.length - conf.store.account_store_suffix.length).toUpperCase()
          !== conf.store.account_store_suffix.toUpperCase()) {
          continue;
        }
        file = file.substr(
          0, file.length - conf.store.account_store_suffix.length);
        if (file.toUpperCase() === name) {
          return false;
        }
      }
    }
  }
  return result;
}
