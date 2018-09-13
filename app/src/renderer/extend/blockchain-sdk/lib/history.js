import dbLib from 'sql.js';
import conf from '../config';
import commonUtil from './util';
import constUtil from './constants';
import JSONBig from 'json-bigint';
import fs from 'fs';
import path from 'path';
import protoOverlay from './proto-interface/overlay_pb';
import protoCommon from './proto-interface/common_pb';
const rp = require('request-promise');
const tableAccount = 'blockchain_account';
const tableTrans = 'blockchain_transaction';
const tableLink = 'blockchain_link';
const tableAccountLink = 'blockchain_account_link';
const tableTokenList = 'blockchain_token_list';

let dbFile = null;
if (fs.existsSync(conf.store.db_file)) {
  dbFile = fs.readFileSync(conf.store.db_file);
}

let db = new dbLib.Database(dbFile);

db.run(
  'Create table if not exists ' + tableAccount + ' (' +
  'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
  'addr TEXT NOT NULL);' +
  'Create table if not exists ' + tableTrans + ' (' +
  'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
  'hash TEXT NOT NULL, ' +
  'addr TEXT NOT NULL, ' +
  'nonce INTEGER NOT NULL, ' +
  'fee_limit INTEGER NOT NULL, ' +
  'gas_price INTEGER NOT NULL, ' +
  'note TEXT NOT NULL, ' +
  'error_code INTEGER NOT NULL, ' +
  'error_desc TEXT NOT NULL, ' +
  'time INTEGER NOT NULL, ' +
  'seq INTEGER, ' +
  'ops TEXT NOT NULL, ' +
  'actual_fee INTEGER NOT NULL);' +
  'Create table if not exists ' + tableLink + ' (' +
  'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
  'aid INTEGER NOT NULL, ' +
  'tid INTEGER NOT NULL, ' +
  'time INTEGER NOT NULL, ' +
  'nonce INTEGER NOT NULL);' +
  'Create table if not exists ' + tableAccountLink + ' (' +
  'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
  'aid_master INTEGER NOT NULL, ' +
  'aid_slave INTEGER NOT NULL,' +
  'tid INTEGER NOT NULL,' +
  'status INTEGER NOT NULL)'
);

db.run(
    'Create table if not exists ' + tableTokenList + ' (' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    'asset_code TEXT NOT NULL, ' +
    'issuer_address TEXT NOT NULL, ' +
    'icon TEXT, ' +
    'type INTEGER NOT NULL, ' +
    'status INTEGER NOT NULL)'
);

db.run(`CREATE UNIQUE INDEX if not exists index_name on ${tableTokenList} (asset_code, issuer_address)`);

let tokenListRows = db.exec(`select id, asset_code, issuer_address from ${tableTokenList}`);

if (tokenListRows.length === 0) {
  // 初始化token list
  let options = {
    method: 'POST',
    uri: `http://${conf.connections.wallet_host}:${conf.connections.wallet_port}/token/list`,
    body: {
      pageStart: 1,
      pageSize: 1,
    },
    json: true,
  };

  rp(options)
  .then(function (parsedBody) {
    if (parsedBody.data.page.pageTotal) {
      options.body.pageSize = parsedBody.data.page.pageTotal;
      rp(options).then(body => {
        body.data.tokenList.forEach(data => {
          const stmt = db.prepare(`insert into ${tableTokenList} values ( null, :assetCode, :issuerAddress, :icon, :type, 1 )`);
          stmt.getAsObject({
            ':assetCode' : data.assetCode,
            ':issuerAddress' : data.issuerAddress,
            ':icon' : data.icon || '',
            ':type' : data.type,
          });
        });
        updateDB();
      }).catch(err => {
        throw err;
      });
    }
  })
  .catch(function (err) {
    throw err;
  });
} else {
  // 追加新的内容
  let options = {
    method: 'POST',
    uri: `http://${conf.connections.wallet_host}:${conf.connections.wallet_port}/token/list`,
    body: {
      pageStart: 1,
      pageSize: 1,
    },
    json: true,
  };

  rp(options)
  .then(function (parsedBody) {
    if (parsedBody.data.page.pageTotal) {
      options.body.pageSize = parsedBody.data.page.pageTotal;
      rp(options).then(body => {
        body.data.tokenList.forEach(data => {
          const stmt = db.prepare(`REPLACE INTO ${tableTokenList} (id, asset_code, issuer_address, icon, type, status) VALUES ( null, :assetCode, :issuerAddress, :icon, :type, 1 )`);
          stmt.getAsObject({
            ':assetCode' : data.assetCode,
            ':issuerAddress' : data.issuerAddress,
            ':icon' : data.icon,
            ':type' : data.type,
          });
        });
        updateDB();
      }).catch(err => {
        throw err;
      });
    }
  })
  .catch(function (err) {
    throw err;
  });
}



// ==================================================


let pageItemsMaxSize = conf.store.query_tx_return_max_size;

let addr;pageItemsMaxSize
let addrId;

let timerSyncTxStatus;

let timerSaveDb = null;

let seqNow = null;

// init this module inner event handler
commonUtil.eventInnerAdd(constUtil.EVENTS.LEDGER_HEADER, function(msg) {
  // commonUtil.eventTrigger(
  //     constUtil.EVENTS.INFO, 'start sync seq ' + msg.seq);
  // getTxs(msg.seq);
  seqNow = msg.seq;
});
commonUtil.eventInnerAdd(constUtil.EVENTS.WS_OPEN, function(msg) {
  if (timerSyncTxStatus) {
    clearInterval(timerSyncTxStatus);
  }
  timerSyncTxStatus = setInterval(() => {
    if (seqNow === null) {
      return;
    }
    let trans = db.exec(
      'select id,hash,seq from ' + tableTrans +
      ' where error_code=-1' +
      ' and seq < ' + seqNow +
      ' limit 0,' + conf.store.tx_status_detect_limit
    );
    commonUtil.eventTrigger(constUtil.EVENTS.INFO, {
      'syncTxOnSeq': seqNow,
      'txsResult': JSON.stringify(trans)
    });
    if (trans.length > 0) {
      trans[0].values.forEach((ele) => {
        commonUtil.httpGetPromise(
            '/getTransactionHistory?hash=' + ele[1])
          .then((tx) => {
            tx = JSON.parse(tx);
            if (tx.hasOwnProperty('error_code')) {
              if (tx.error_code === 4) {
                handleTransWithTimeout({
                  'id': ele[0]
                });
              } else if (tx.hasOwnProperty('result') &&
                tx.result
                .hasOwnProperty('transactions') &&
                tx.result
                .transactions.length === 1) {
                saveTrans(tx.result.transactions[0]);
              }
            }
          })
          .catch((err) => {
            commonUtil.handleError(err);
          });
      });
    }
  }, conf.store.tx_status_detect_interval);
});
commonUtil.eventInnerAdd(constUtil.EVENTS.WS_CLOSE, function(msg) {
    clearInterval(timerSyncTxStatus);
    timerSyncTxStatus = null;
  }),
  commonUtil.eventInnerAdd(constUtil.EVENTS.TX_STATUS_COMP, function(msg) {
    commonUtil.eventTrigger(constUtil.EVENTS.INFO, 'start sync tx ' + msg.hash);
    if (msg.hasOwnProperty('transactionEnv')) {
      // TransactionEnv解析
      handleTrans(msg);
    } else {
      getTxs(null, msg.hash);
    }
  });
commonUtil.eventInnerAdd(constUtil.EVENTS.TX_STATUS_FAIL, function(msg) {
  commonUtil.eventTrigger(constUtil.EVENTS.INFO, 'start sync tx ' + msg.hash);
  if (msg.hasOwnProperty('transactionEnv')) {
    // TransactionEnv解析
    handleTrans(msg);
  } else {
    getTxs(null, msg.hash);
  }
});
commonUtil.eventInnerAdd(constUtil.EVENTS.TX_SUBMIT, function(msg) {
  let result = saveTrans(msg);

  // update account link table
  if (commonUtil.isValid(msg) && msg.hasOwnProperty('transaction') &&
    msg.transaction.hasOwnProperty('operations')) {
    if (commonUtil.isArray(msg.transaction.operations)) {
      msg.transaction.operations.forEach((ele) => {
        if (ele.hasOwnProperty('type') &&
          ele.type === 1 &&
          ele.hasOwnProperty('createAccount') &&
          ele.createAccount.hasOwnProperty('destAddress')) {
          updateAccountLink(
            msg.transaction.source_address,
            ele.createAccount.destAddress,
            result, 0);
        }
      });
    } else if (msg.transaction.operations
      .hasOwnProperty('operationsList') &&
      commonUtil.isArray(msg.transaction.operations.operationsList) &&
      msg.transaction.operations.operationsList.length > 0) {
      msg.transaction.operations.operationsList.forEach((ele) => {
        if (commonUtil.isValid(ele) &&
          ele.hasOwnProperty('createAccount') &&
          commonUtil.isValid(ele.createAccount) &&
          ele.createAccount
          .hasOwnProperty('destAddress')) {
          updateAccountLink(
            msg.transaction.source_address,
            ele.createAccount.destAddress,
            result, 0);
        }
      });
    }
  }
});

export default {
  settings: function(address) {
    addr = address;
    addrId = null;
    wsEventSub(address);
    initAccountData();
  },
  getRelatedAccount: async function(start, size) {
    let count = db.exec(
      'select count(id) as count from ' + tableAccountLink +
      ' where aid_master=' + addrId + ' '
    );
    let ret = [];
    if (count[0].values[0][0] > 0) {
      let addrs = db.exec(
        'select t2.addr as address from ' +
        '(select aid_slave, tid, status from ' + tableAccountLink +
        ' where aid_master=' + addrId + ') as t1,' +
        'blockchain_account as t2,' +
        'blockchain_transaction as t3' +
        ' where t2.id=t1.aid_slave and t3.id=t1.tid' +
        ' order by t3.time desc limit ' + start + ', ' + size
      );
      if (addrs.length > 0) {
        let address;
        for (let i = 0; i < addrs[0].values.length; i++) {
          address = addrs[0].values[i][0];
          let result = await commonUtil.httpGetPromise(
            '/getAccount?address=' + address);
          result = JSONBig.parse(result);
          let signersSize = -1;
          let thresholds = -1;
          let balance = '';
          let status = 0;
          if (result &&
            result.hasOwnProperty('error_code') &&
            result.hasOwnProperty('result') &&
            result.error_code === 0) {
            if (result.result.hasOwnProperty('priv')) {
              status = 1;
              if (result.result.priv.hasOwnProperty('signers')) {
                signersSize = result.result.priv.signers.length;
              }
              if (result.result.hasOwnProperty('balance')) {
                balance = result.result.balance.toString();
              }
              if (result.result.priv.hasOwnProperty('thresholds') &&
                result.result.priv.thresholds
                .hasOwnProperty('tx_threshold')) {
                thresholds =
                  result.result.priv
                  .thresholds.tx_threshold;
              }
            }
          }
          ret.push({
            'address': address,
            'balance': commonUtil.unitConvert(
              balance,
              constUtil.BUILDIN_UNIT_OUT),
            'signersSize': signersSize,
            'threshold': thresholds,
            'status': status,
          });
        }
      }
    }
    return {
      'errCode': constUtil.ERRORS.SUCCESS.CODE,
      'msg': constUtil.ERRORS.SUCCESS.MSG,
      'data': {
        'address': {
          'total': count[0].values[0][0],
        },
        'addressList': ret,
      },
    };
  },
  getTransaction: function(startIndex, pageLength) {
    return new Promise((rs, rj) => {
      if (!addr) {
        return rj(commonUtil.packageError(
          constUtil.ERRORS.ERR_NO_LOGIN));
      }
      let sql = 'select count(id) from ' + tableTrans +
      ' where id in (select tid from ' + tableLink +
      ' where aid=' + addrId + ')' +
      ' and ( ops like \'%pay_coin%\' or ops like \'%payCoin%\' )';

      let count = db.exec(sql);

      if (count[0].values[0][0] === 0) {
        return rs({
          'errCode': constUtil.ERRORS.SUCCESS.CODE,
          'msg': constUtil.ERRORS.SUCCESS.MSG,
          'data': {
            'tx': {
              'total': 0,
            },
            'txs': [],
          },
        });
      } else {
        let sql = 'select * from ' + tableTrans +
        ' where id in (select tid from ' + tableLink +
        ' where aid=' + addrId + ')' +
        ' and ( ops like \'%pay_coin%\' ' +
        'or ops like \'%payCoin%\' )' +
        ' order by time desc,id desc limit ' +
        (startIndex ? startIndex : '0') + ',' +
        (pageLength > pageItemsMaxSize ?
          pageItemsMaxSize : pageLength);

        let tx = db.exec(sql);

        return rs({
          'errCode': constUtil.ERRORS.SUCCESS.CODE,
          'msg': constUtil.ERRORS.SUCCESS.MSG,
          'data': {
            'tx': {
              'total': count[0].values[0][0],
            },
            'txs': transformTx(tx[0].values),
          },
        });
      }
    });
  },
  getTransactionForToken: function(startIndex, pageLength, assetCode, issuerAddress) {
    return new Promise((rs, rj) => {
      if (!addr) {
        return rj(commonUtil.packageError(
            constUtil.ERRORS.ERR_NO_LOGIN));
      }

      let sql = `
        select count(id) from ${tableTrans}
        where id in (select tid from ${tableLink} where aid= ${addrId})
        and
        (
          ops like '%asset%' and
          ops like '%"code":"${assetCode}"%' and
          ops like '%"issuer":"${issuerAddress}%' and
          (ops like '%pay_asset%' or ops like '%payAsset%')
        )
        or
        (
          ops LIKE '%"issueAsset":%' AND
          ops LIKE '%"code":"${assetCode}"%' AND
          addr = '${issuerAddress}'
        )
        `
      let count = db.exec(sql);

      if (count[0].values[0][0] === 0) {
        return rs({
          'errCode': constUtil.ERRORS.SUCCESS.CODE,
          'msg': constUtil.ERRORS.SUCCESS.MSG,
          'data': {
            'tx': {
              'total': 0,
            },
            'txs': [],
          },
        });
      } else {
        let sql = `
          SELECT * FROM ${tableTrans}
          WHERE
          id IN ( SELECT tid FROM ${tableLink} WHERE aid = ${addrId}) AND
          (
            ops LIKE '%"type":3%' AND
            (ops LIKE '%payAsset%' OR ops LIKE '%pay_asset%') AND
            ops LIKE '%asset%' AND
            ops like '%"code":"${assetCode}"%' and
            ops like '%"issuer":"${issuerAddress}%'
          )
          or
          (
            ops LIKE '%"issueAsset":%' AND
            ops LIKE '%"code":"${assetCode}"%' AND
            addr = '${issuerAddress}'
          )
          ORDER BY time DESC, id DESC
          LIMIT ${startIndex ? startIndex : '0'},
          ${pageLength > pageItemsMaxSize ? pageItemsMaxSize : pageLength}
        `;

        let tx = db.exec(sql);

        return rs({
          'errCode': constUtil.ERRORS.SUCCESS.CODE,
          'msg': constUtil.ERRORS.SUCCESS.MSG,
          'data': {
            'tx': {
              'total': count[0].values[0][0],
            },
            'txs': formatTx(tx[0].values),
          },
        });
      }
    });
  },
  /**
   * 获取token 类型
   * @returns {Promise}
   */
  getTokenType: function() {
    return new Promise((rs, rj) => {
      if (!addr) {
        return rj(commonUtil.packageError(
            constUtil.ERRORS.ERR_NO_LOGIN));
      }

      let count = db.exec(`select count(id) from ${tableTokenList}`);
      if (count[0].values[0][0] === 0) {
        return rs({
          'errCode': constUtil.ERRORS.SUCCESS.CODE,
          'msg': constUtil.ERRORS.SUCCESS.MSG,
          'data': {
            'page': {
              'total': 0,
            },
            'tokens': [],
          },
        });
      } else {
        let tx = db.exec(`select asset_code, icon, issuer_address from ${tableTokenList} limit 0, 100`);
        return rs({
          'errCode': constUtil.ERRORS.SUCCESS.CODE,
          'msg': constUtil.ERRORS.SUCCESS.MSG,
          'data': {
            'page': {
              'total': count[0].values[0][0],
            },
            'tokens': formatTokenType(tx[0].values),
          },
        });
      }
    });
  },

};


/**
 * 更新地址关联表
 * @param {string} addrMaster
 * @param {string} addrSlave
 * @param {string} tid
 * @param {number} status
 */
function updateAccountLink(addrMaster, addrSlave, tid, status) {
  let aidMaster = getAccountId(addrMaster);
  let aidSlave = getAccountId(addrSlave);

  let dbAccountLink = db.exec(
    'select id from ' + tableAccountLink +
    ' where aid_master="' + aidMaster +
    '" and aid_slave="' + aidSlave + '"');
  if (dbAccountLink.length === 0) {
    db.run('insert into ' + tableAccountLink + ' values(NULL,?,?,?,?)', [
      aidMaster, aidSlave, tid, status
    ]);
    dbAccountLink = db.exec(
      'select id from ' + tableAccountLink +
      ' where aid_master="' + aidMaster +
      '" and aid_slave="' + aidSlave + '"');
    if (dbAccountLink.length > 0) {
      updateDB();
    } else {
      commonUtil.eventTrigger(constUtil.EVENTS.INFO,
        'account link table insert faild (addrMaster: ' + addrMaster +
        ', addrSlave: ' + addrSlave +
        ', tid: ' + tid +
        ', status: ' + status + ')');
    }
  }
}

/**
 * 更新地址关联表的状态
 * @param {string} hash
 * @param {number} status
 */
function updateAccountLinkWithHash(hash, status) {
  let txId = db.exec(
    'select id from ' + tableTrans +
    ' where hash="' + hash + '"');
  if (txId.length > 0) {
    if (status === -1) {
      db.exec(
        'delete from ' + tableAccountLink +
        ' where tid=' + txId[0].values[0][0]
      );
    } else {
      db.exec(
        'update ' + tableAccountLink +
        ' set status=' + status +
        ' where tid=' + txId[0].values[0][0]
      );
    }
    updateDB();
  }
}

/**
 * 递归创建目录
 * @param {string} dirname - 目录路径
 * @return {undefined}
 */
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

/**
 * 保存数据库到文件
 * @return {undefined}
 */
function updateDB() {
  if (conf.store.db_save_to_file === true) {
    if (timerSaveDb !== null) {
      clearTimeout(timerSaveDb);
    }
    timerSaveDb = setTimeout(() => {
      try {
        fs.writeFileSync(conf.store.db_file, new Buffer(db.export()));
      } catch (error) {
        if (error.code === 'ENOENT') {
          mkdirsSync(path.dirname(conf.store.db_file));
          try {
            fs.writeFileSync(conf.store.db_file, new Buffer(db.export()));
          } catch (err) {
            commonUtil.handleError(err);
          }
        }
      }
    }, conf.store.db_save_buff_time);
  }
}

/**
 * 把交易列表转换为输出的数组
 * @param {array} listTx - 交易列表
 * @return {array}
 */
function transformTx(listTx) {
  let txs = [];
  if (!commonUtil.isArray(listTx)) {
    return [];
  }
  listTx.forEach(function(element) {
    let ops = JSONBig.parse(element[11]);
    if (commonUtil.isArray(ops)) {
      let op = undefined;
      ops.forEach(opItem => {
        if (opItem &&
          opItem.type &&
          (opItem.type === 'PAY_COIN' || opItem.type === 7)) {
          // 如果一个交易存在多条操作，则只取第一个匹配的操作
          return op = opItem;
        }
      });

      if (op) {
        let addrDst = '';
        let amount = '';
        if (op.hasOwnProperty('pay_coin')) {
          addrDst = op.pay_coin.dest_address;
          amount = op.pay_coin.amount.toString();
        }

        if (op.hasOwnProperty('payCoin')) {
          addrDst = op.payCoin.destAddress;
          amount = op.payCoin.amount.toString();
        }

        if (element[2] === addr || addrDst === addr) {
          txs.push({
            'status': {
              'code': element[7],
              'msg': element[6],
            },
            'destAddress': addrDst,
            'srcAddress': element[2],
            'nonce': element[3].toString(),
            'feeLimit': commonUtil.unitConvert(
              element[4].toString(),
              constUtil.BUILDIN_UNIT_OUT),
            'gasPrice': commonUtil.unitConvert(
              element[5].toString(),
              0),
            'actualFee': commonUtil.unitConvert(
              element[12].toString(),
              constUtil.BUILDIN_UNIT_OUT),
            'amount': commonUtil.unitConvert(
              amount, constUtil.BUILDIN_UNIT_OUT),
            'note': element[6],
            // 0 转入 1 转出
            'isIn': (element[2] === addr ? 1 : 0),
            'time': element[9],
            'hash': element[1],
          });
        }

      }
    }
  });
  return txs;
}


function formatTx(listTx) {
  let txs = [];
  if (!commonUtil.isArray(listTx)) {
    return [];
  }

  listTx.forEach(function(element) {
    let ops = JSONBig.parse(element[11]);
    let op;

    // 激活账户总费用
    let totalPrice = 0;

    ops.forEach(item => {
      if (1 === item.type &&
        (element[2] === item.sourceAddress || '' === item.sourceAddress)) {
        totalPrice = totalPrice + item.createAccount.initBalance;
      }
    });

    ops.some(opItem => {
      if (opItem &&
        opItem.type &&
        (opItem.type === 2 || opItem.type === 3)) {
        // 如果一个交易存在多条操作，则只取第一个匹配的操作
        // 优先显示发行的资产
        op = opItem;
        return true;
      }
    });

    if (op) {
      let srcAddress = '';
      let addrDst = '';
      let amount = '';
      let isIn = undefined;

      if (op.hasOwnProperty('issueAsset')) {
        srcAddress = '';
        addrDst = element[2];
        amount = op.issueAsset.amount.toString();
        isIn = 0;
      }

      if (op.hasOwnProperty('payAsset')) {
        srcAddress = element[2];
        addrDst = op.payAsset.destAddress;
        amount = op.payAsset.asset.amount.toString();
        isIn = (element[2] === addr ? 1 : 0);
      }

      if (op.hasOwnProperty('pay_asset')) {
        srcAddress = element[2];
        addrDst = op.pay_asset.dest_address;
        amount = op.pay_asset.asset.amount.toString();
        isIn = (element[2] === addr ? 1 : 0);
      }

      if (element[2] === addr || addrDst === addr) {
        txs.push({
          'status': {
            'code': element[7],
            'msg': element[6],
          },
          'destAddress': addrDst,
          'srcAddress': srcAddress,
          'nonce': element[3].toString(),
          'feeLimit': commonUtil.unitConvert(
              element[4].toString(),
              constUtil.BUILDIN_UNIT_OUT),
          'gasPrice': commonUtil.unitConvert(
              element[5].toString(),
              0),
          'actualFee': commonUtil.unitConvert(
              element[12].toString(),
              constUtil.BUILDIN_UNIT_OUT),
          'amount': amount,
          'note': element[6],
          // 0 转入 1 转出
          'isIn': isIn,
          'time': element[9],
          'hash': element[1],
          activationFee: commonUtil.unitConvert(
            totalPrice.toString(),
            constUtil.BUILDIN_UNIT_OUT), // 账户激活费用
        });
      }
    }

  })

  return txs;
}


function formatTokenType(listTx) {
  // let txs = [];
  if (!commonUtil.isArray(listTx)) {
    return [];
  }

  const arr = [];
  listTx.forEach(function(item) {
    const obj = {};
    obj.assetCode = item[0];
    obj.icon = item[1];
    obj.issuerAddress = item[2];
    arr.push(obj);
  });

  return arr;
}


/**
 * 根据地址初始化数据库的账户表
 * @return {undefined}
 */
function initAccountData() {
  addrId = null;
  let dbAccount = db.exec(
    'select id from ' + tableAccount + ' where addr="' + addr + '"');
  if (dbAccount.length > 0) {
    addrId = dbAccount[0].values[0][0];
  } else {
    db.run('insert into ' + tableAccount + ' values(NULL,?)', [addr]);
    dbAccount = db.exec(
      'select id from ' + tableAccount + ' where addr="' + addr + '"');
    if (dbAccount.length > 0) {
      addrId = dbAccount[0].values[0][0];
      updateDB();
    } else {
      commonUtil.eventTrigger(constUtil.EVENTS.INFO,
        'account table insert faild, addr is ' + addr);
    }
  }
}

/**
 * 获取地址id，没有则插入地址表
 * @param {string} address  - 账户地址
 * @return {undefined}
 */
function getAccountId(address) {
  let dbAccount = db.exec(
    'select id from ' + tableAccount + ' where addr="' + address + '"');
  if (dbAccount.length > 0) {
    return dbAccount[0].values[0][0];
  } else {
    db.run('insert into ' + tableAccount + ' values(NULL,?)', [address]);
    dbAccount = db.exec(
      'select id from ' + tableAccount + ' where addr="' + address + '"');
    if (dbAccount.length > 0) {
      updateDB();
      return dbAccount[0].values[0][0];
    } else {
      commonUtil.eventTrigger(constUtil.EVENTS.INFO,
        'account table insert faild, addr is ' + address);
    }
    return '';
  }
}

/**
 * 保存交易至数据库的交易表
 * @param {array} trans - 交易列表
 * @return {undefined}
 */
function saveTrans(trans) {
  if (!trans) {
    return;
  }
  if (!commonUtil.objectCheck(trans, {
      'hash': 'string'
    })) {
    return;
  }
  if (trans.hasOwnProperty('transaction')) {
    if (!trans.transaction.hasOwnProperty('source_address')) {
      return;
    }
  } else if (trans.hasOwnProperty('transactionEnv')) {
    if (!trans.transactionEnv.hasOwnProperty('transaction') ||
      !trans.transactionEnv.transaction
      .hasOwnProperty('sourceAddress')) {
      return;
    }
  } else {
    return;
  }

  let txHash = trans.hash;
  let txSrcAddr = '';
  let txNonce = '';
  let txFeeLimit = '';
  let txGasPrice = '';
  let txErrCode = '';
  let txErrDesc = '';
  let txTime = '';
  let txSeq = '';
  let txOps = '';
  let txNote = '';
  let txActualFee = '';

  if (trans.hasOwnProperty('transaction')) {
    txSrcAddr = trans.transaction.source_address;
    txNonce = trans.transaction.nonce;
    txFeeLimit = trans.transaction.feeLimit;
    txGasPrice = trans.transaction.gasPrice;
    txErrCode = trans.error_code;
    txErrDesc = trans.error_desc;
    txTime = trans.close_time;
    txSeq = trans.ledger_seq;
    txActualFee = trans.actual_fee;
    txOps = JSON.stringify(trans.transaction.operations);
    if (trans.transaction.hasOwnProperty('metadata') &&
      trans.transaction.metadata.length > 0) {
      try {
        txNote = commonUtil.convertHexString2String(
          trans.transaction.metadata);
      } catch (err) {
        commonUtil.handleError(err);
        return;
      }
    }
  }
  if (trans.hasOwnProperty('transactionEnv')) {
    txSrcAddr = trans.transactionEnv.transaction.sourceAddress;
    txNonce = trans.transactionEnv.transaction.nonce;
    txFeeLimit = trans.transactionEnv.transaction.feeLimit;
    txGasPrice = trans.transactionEnv.transaction.gasPrice;
    txErrCode = trans.errorCode;
    txErrDesc = trans.errorDesc;
    txTime = trans.closeTime;
    txSeq = trans.ledgerSeq;
    txActualFee = trans.actualFee;
    txOps = JSON.stringify(trans.transactionEnv.transaction.operationsList);
    if (trans.transactionEnv.transaction.hasOwnProperty('metadata') &&
      trans.transactionEnv.transaction.metadata.length > 0) {
      try {
        txNote = trans.transactionEnv.transaction.metadata;
      } catch (err) {
        commonUtil.handleError(err);
        return;
      }
    }
  }

  updateAccountLinkWithHash(txHash, txErrCode === 0 ? 1 : -1);

  let dbId = db.exec(
    'select id from ' + tableTrans + ' where hash="' + txHash + '"');
  if (dbId.length === 0) {
    db.run('insert into ' + tableTrans +
      ' values(NULL,?,?,?,?,?,?,?,?,?,?,?,?)', [
        txHash,
        txSrcAddr,
        txNonce,
        txFeeLimit,
        txGasPrice,
        txNote,
        txErrCode,
        txErrDesc,
        txTime,
        txSeq,
        txOps,
        txActualFee
      ]);
    let transId = db.exec(
      'select id,time,nonce from ' + tableTrans +
      ' where hash="' + txHash + '"');
    if (transId.length > 0) {
      if (addrId === undefined) {
        commonUtil.packageError(constUtil.ERRORS.ERR_NO_LOGIN);
      } else {
        if (db.exec('select id from ' + tableLink +
            ' where aid=' + addrId +
            ' AND tid = ' + transId[0].values[0][0]).length === 0) {
          db.run('insert into ' + tableLink + ' values(NULL,?,?,?,?)', [
            addrId,
            transId[0].values[0][0],
            transId[0].values[0][1],
            transId[0].values[0][2],
          ]);
        }
      }
    }
    updateDB();
    if (transId.length > 0) {
      return transId[0].values[0][0];
    }
  } else {
    db.run('update ' + tableTrans +
      ' set time=?, seq=?, nonce=?, error_code=?, ' +
      'error_desc=?, ops=?, actual_fee=? where id=?', [
        txTime,
        txSeq,
        txNonce,
        txErrCode,
        txErrDesc,
        txOps,
        txActualFee,
        dbId[0].values[0][0]
      ]);
    db.run('update ' + tableLink +
      ' set time=?, nonce=? where tid=?', [txTime, txNonce, dbId[0].values[0][0]]);
    updateDB();
    return dbId[0].values[0][0];
  }
}

/**
 * 处理区块或交易
 * @param {string|number}   seq   - 区块号
 * @param {string}          hash  - 交易哈希
 * @return {undefined}
 */
function getTxs(seq, hash) {
  let req = '';
  if (seq !== null && seq !== undefined) {
    req = 'ledger_seq=' + seq;
  } else if (hash !== null && hash !== undefined) {
    req = 'hash=' + hash;
  }
  if (req.length > 0) {
    commonUtil.httpGetPromise('/getTransactionHistory?' + req)
      .then((data) => {
        let result = JSON.parse(data);
        if (result.error_code == 0) {
          if (result.result && result.result.transactions) {
            for (let j = 0; j < result.result.transactions.length; j++) {
              handleTrans(result.result.transactions[j]);
            }
          }
        }
      }).catch((err) => {
        commonUtil.handleError(err);
      });
  }
}

/**
 * 处理超时交易
 * @param {object} params       - 参数对象
 * @param {number} params.id    - (id or hash)交易ID
 * @param {string} params.hash  - (id or hash)交易Hash
 * @return {undefined}
 */
function handleTransWithTimeout(params) {
  let id = null;
  if (commonUtil.objectCheck(params, {
      'hash': 'string'
    }) &&
    params.hash.length > 0) {
    let tx = db.exec(
      'select id from ' + tableTrans +
      ' where hash="' + params.hash + '"'
    );
    if (tx.length > 0) {
      id = tx[0].values[0][0];
    }
  }
  if (commonUtil.objectCheck(params, {
      'id': 'number'
    })) {
    id = params.id;
  }
  if (id) {
    db.exec(
      'update ' + tableTrans +
      ' set error_code=5 where id=' + id
    );
    updateDB();
  }
}

/**
 * 处理交易，如果交易包含特定地址，将保存交易至数据库，兼容json和protobuf的处理
 * @param {array} trans - 交易列表
 * @return {undefined}
 */
function handleTrans(trans) {
  if (!trans.hasOwnProperty('transaction')) {
    if (!trans.hasOwnProperty('transactionEnv')) {
      return;
    }
    // 处理protobuf
    if (!trans.transactionEnv.hasOwnProperty('transaction') ||
      !trans.transactionEnv.transaction
      .hasOwnProperty('sourceAddress')) {
      return;
    }
    if (trans.transactionEnv.transaction.sourceAddress === addr) {
      saveTrans(trans);
      return;
    }
    if (trans.transactionEnv.transaction.hasOwnProperty('operationsList') &&
      commonUtil.isArray(
        trans.transactionEnv.transaction.operationsList)) {
      trans.transactionEnv
        .transaction.operationsList.every((ele) => {
          switch (ele.type) {
            case 1:
              if (ele.hasOwnProperty('createAccount') &&
                ele.createAccount
                .hasOwnProperty('destAddress')) {
                if (ele.createAccount
                  .destAddress == addr) {
                  saveTrans(trans);
                }
              }
              break;
              case 3:
                  if (ele.hasOwnProperty('payAsset')
                      && ele.payAsset
                          .hasOwnProperty('destAddress')) {
                      if (ele.payAsset.destAddress == addr) {
                          saveTrans(trans);
                      }
                  }
                  break;
            case 7:
              if (ele.hasOwnProperty('payCoin') &&
                ele.payCoin
                .hasOwnProperty('destAddress')) {
                if (ele.payCoin.destAddress == addr) {
                  saveTrans(trans);
                }
              }
              break;
          }
        });
    }
    return;
  }
  if (!trans.transaction.hasOwnProperty('source_address')) {
    return;
  }
  if (trans.transaction.source_address === addr) {
    saveTrans(trans);
    return;
  }
  if (trans.transaction.operations) {
    for (let i = 0; i < trans.transaction.operations.length; i++) {
      if (trans.transaction.operations[i].type) {
        switch (trans.transaction.operations[i].type) {
          case 1:
            if (trans.transaction.operations[i]
              .hasOwnProperty('create_account') &&
              trans.transaction.operations[i].create_account
              .hasOwnProperty('dest_address')) {
              if (trans.transaction.operations[i]
                .create_account.dest_address == addr) {
                saveTrans(trans);
              }
            }
            break;
            case 3:
                if (trans.transaction.operations[i]
                    .hasOwnProperty('pay_asset')
                    && trans.transaction.operations[i].pay_asset
                    .hasOwnProperty('dest_address')) {
                    if (trans.transaction.operations[i]
                        .pay_asset.dest_address == addr) {
                        saveTrans(trans);
                    }
                }
                break;
          case 7:
            if (trans.transaction.operations[i]
              .hasOwnProperty('pay_coin') &&
              trans.transaction.operations[i].pay_coin
              .hasOwnProperty('dest_address')) {
              if (trans.transaction.operations[i]
                .pay_coin.dest_address == addr) {
                saveTrans(trans);
              }
            }
            break;
        }
      }
    }
  }
}

/**
 * 发送订阅消息
 * @param {string} address
 */
function wsEventSub(address) {
  let send = new protoCommon.WsMessage();
  send.setType(protoOverlay.ChainMessageType.CHAIN_SUBSCRIBE_TX);
  send.setRequest(true);
  let sub = new protoOverlay.ChainSubscribeTx();
  sub.addAddress(address);
  send.setData(sub.serializeBinary());
  commonUtil.eventTrigger(constUtil.EVENTS.INFO,
    'set address ' + JSON.stringify(sub.toObject()));
  commonUtil.eventTrigger(constUtil.EVENTS.WS_SEND, send);
}
