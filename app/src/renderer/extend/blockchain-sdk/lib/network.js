import WebSocket from 'ws';
import protoOverlay from './proto-interface/overlay_pb';
import protoCommon from './proto-interface/common_pb';
import protoChain from './proto-interface/chain_pb';
import JSONBig from 'json-bigint';
import proc from 'child_process';
import conf from '../config';
import constUtil from './constants';
import commonUtil from './util';
import crypto from 'crypto';
import {setTimeout, clearInterval} from 'timers';

let wsClient = null;

let wsHost = '';
let wsPort = '';
let retryTimes = 0;
let retryWaitTime = 5000;
let syncNodeStart = false;

// for seq events
let seqCur = 1;
let seqMax = 1;

let syncNode = null;
let peerClosed = false;
let retryTimer = null;
// for event, send the latest connectionSize
let TriggerConnections = null;
let TriggerConnectionsInterval = 3000; // set number 0 is off
let TriggerSeqEnabled = false;
let TriggerSeq = null;
let TriggerSeqInterval = 2000; // set number 0 is off

let thisConfig = {
    'is_cache_nonce': false,
    'ways_create_account': 'exe',
    'ways_resolve_privatekey': 'exe',
    'ways_sign_tx': 'exe'};

let wsSendQueue = [];

commonUtil.eventInnerAdd(constUtil.EVENTS.WS_SEND, (content)=>{
    if (wsClient !== null && wsClient.readyState === WebSocket.OPEN) {
        wsClient.send(content.serializeBinary(), {'binary': true});
    } else {
        if (wsSendQueue.length >= 10) {
            wsSendQueue.shift();
        }
        wsSendQueue.push(content.serializeBinary());
    }
});

/**
 * 获取配置
 * @param {string} name
 * @return {any}
 */
function getConf(name) {
    if (thisConfig.hasOwnProperty(name)) {
        return thisConfig[name];
    } else {
        return null;
    }
}

// refresh configurations with config
if (typeof conf === 'object' && !Array.isArray(conf)) {
    wsHost = conf.connections.ws_host;
    wsPort = conf.connections.ws_port;
    retryTimes = conf.connections.retry_times;
    retryWaitTime = conf.connections.retry_wait_time;
    syncNodeStart = conf.connections.sync_node_start;
}

commonUtil.eventInnerAdd(constUtil.EVENTS.WS_OPEN, function() {
    // cached init sequence info, avoid pushing the old sequence info
    // 预先缓存初始状态的区块数，避免区块信息在没有更新的时候推送出去
    commonUtil.httpGetPromise('/getModulesStatus').then((result) => {
        let t = JSON.parse(result);
        if (t.hasOwnProperty('ledger_manager')) {
            if (t.ledger_manager
                .hasOwnProperty('chain_max_ledger_seq')) {
                seqMax = t.ledger_manager.chain_max_ledger_seq;
            }
            if (t.ledger_manager.hasOwnProperty('ledger_sequence')) {
                seqCur = t.ledger_manager.ledger_sequence;
            }
            if (seqMax < seqCur) {
                seqMax = seqCur;
            }
        }
    });
});

commonUtil.eventInnerAdd(constUtil.EVENTS.WS_CLOSE, function() {
    if (TriggerSeqEnabled === true) {
        TriggerSeqEnabled = false;
    }
    seqCur = 1;
    seqMax = 1;

    if (TriggerConnections !== null) {
        clearInterval(TriggerConnections);
        TriggerConnections = null;
    }
    if (TriggerSeq !== null) {
        clearInterval(TriggerSeq);
        TriggerSeq = null;
    }
});

// init this module event handler
commonUtil.eventInnerAdd(constUtil.EVENTS.WS_RECV, function(msg) {
    if (TriggerConnections === null) {
        TriggerConnections = setInterval(()=>{
            commonUtil.httpGetPromise('/getModulesStatus').then((result) => {
                let t = JSON.parse(result);
                let connections = 0;
                if (t.hasOwnProperty('peer_manager')
                    && t.peer_manager.hasOwnProperty('consensus_network')
                    && t.peer_manager.consensus_network.
                        hasOwnProperty('peer_active_size')) {
                        connections =
                            t.peer_manager.consensus_network.peer_active_size;
                }
                commonUtil.eventTrigger(
                    constUtil.EVENTS.PEER_CONNECTIONS,
                    {'connectionSize': connections});
            }).catch((err) => {
                commonUtil.handleError(err);
            });
        }, TriggerConnectionsInterval);
    }
    if (TriggerSeq === null && TriggerSeqEnabled === true) {
        TriggerSeq = setInterval(()=>{
            commonUtil.httpGetPromise('/getModulesStatus').then((result) => {
                let t = JSON.parse(result);
                let seq = 0;
                let maxSeq = 0;
                if (t.hasOwnProperty('ledger_manager')) {
                    if (t.ledger_manager
                        .hasOwnProperty('chain_max_ledger_seq')) {
                        maxSeq = t.ledger_manager.chain_max_ledger_seq;
                    }
                    if (t.ledger_manager.hasOwnProperty('ledger_sequence')) {
                        seq = t.ledger_manager.ledger_sequence;
                    }
                    if (maxSeq < seq) {
                        maxSeq = seq;
                    }
                }
                if (seq > 1 && maxSeq > 1 && (seq > seqCur)) {
                    seqCur = seq;
                    seqMax = maxSeq;
                    commonUtil.eventTrigger(
                        constUtil.EVENTS.LEDGER_HEADER,
                        {'seq': seq, 'seqMax': maxSeq});
                }
            }).catch((err) => {
                commonUtil.handleError(err);
            });
        }, TriggerSeqInterval);
    }
    switch (msg.type) {
        case protoOverlay.OVERLAY_MESSAGE_TYPE.OVERLAY_MSGTYPE_PING:
            handlePing(msg.content); break;
        // case protoOverlay.ChainMessageType.CHAIN_LEDGER_HEADER:
        //     handleLedgerHeader(msg.content); break;
        case protoOverlay.ChainMessageType.CHAIN_TX_STATUS:
            handleTxStatus(msg.content); break;
        case protoOverlay.ChainMessageType.CHAIN_TX_ENV_STORE:
            handleTxEnvStore(msg.content); break;
    }
});

if (syncNodeStart === true) {
    syncNode = proc.spawn(conf.account.sync_node_path);
    syncNode.on('error', function(err) {
        showText('faild to start bubichain');
        syncNode = null;
    });
    syncNode.stdout.on('data', function(data) {
        // console.log(data.toString())
    });
}

process.on('exit', function(code) {
    stopWS();
});

connect();

export default {
    getAccountFromPrivate: async function(privKey, pwd) {
        switch (getConf('ways_resolve_privatekey')) {
            case 'exe':
                let info = '';
                info = await commonUtil.queryInfo(
                    'create-keystore-from-privatekey', [privKey, pwd]);
                if (info === undefined) {
                    throw (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
                }
                info = JSON.parse(info);
                if (info.hasOwnProperty('address')) {
                    return {
                        'address': info.address,
                        'private_key': privKey,
                    };
                } else {
                    throw (commonUtil.packageError(
                        constUtil.ERRORS.ERR_KEY_INVALID));
                }
                break;
            default:
                let data = await commonUtil.httpGetPromise(
                    '/getAddress?private_key=' + privKey);
                let result = JSON.parse(data);
                if (result.hasOwnProperty('error_code')) {
                    if (result.error_code == 0
                        && result.hasOwnProperty('result')) {
                        return (result.result);
                    } else {
                        throw (commonUtil.packageHttpErr(
                            result.error_code,
                            result.error_desc));
                    }
                } else {
                    throw (commonUtil.packageError(
                        constUtil.ERRORS.ERR_HTTP_UNEXPECTED));
                }
        }
    },
    getNewAccount: async function() {
        switch (getConf('ways_create_account')) {
            case 'exe':
                let info = '';
                info = await commonUtil.queryInfo('create-account');
                if (info === undefined) {
                    throw (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
                }
                info = JSON.parse(info);
                return (info);
                break;
            default:
                let data = await commonUtil.httpGetPromise('/createAccount');
                let result = JSON.parse(data);
                if (result.hasOwnProperty('error_code')) {
                    if (result.error_code == 0
                        || result.hasOwnProperty('result')) {
                        return (result.result);
                    } else {
                        throw (commonUtil.packageHttpErr(
                            result.error_code, result.error_desc));
                    }
                } else {
                    throw (commonUtil.packageError(
                        constUtil.ERRORS.ERR_HTTP_UNEXPECTED));
                }
        }
    },
    getBalance: function(addr) {
        return getAccountBalance(addr);
    },
    stopWebsocket: function() {
        peerClosed = true;
        stopWS();
    },
    startWebsocketClient: function() {
        peerClosed = false;
        connect();
    },
    txCalcTxFee: async function(addressSrc, addressDst, amount, note, seqOffset) {
        return await makeADeal('fee', addressSrc, '0', '0', [''], note, seqOffset, [
            [constUtil.TX_TYPE.PAYCOIN.TYPE, {
                'dest': addressDst,
                'amount': amount}]]);
    },
    txPayCoin: async function(
        addressSrc, addressDst, amount, feeLimit, gasPrice, priv, note, seqOffset) {
            return await makeADeal(
                'deal', addressSrc, feeLimit, gasPrice, [priv], note, seqOffset, [
                    [
                        constUtil.TX_TYPE.PAYCOIN.TYPE, {
                            'dest': addressDst,
                            'amount': amount}]]);
    },
    txCreateAccount: async function(
        addressSrc, addressDst, feeLimit, gasPrice, balanceInit, priv, privDest,
        metadatas, weight, threshold, signers, contract, note, seqOffset) {
            if (commonUtil.isObject(signers)) {
                let keys = Object.keys(signers);
                let arr = [];
                for(let i = 0; i < keys.length; i++) {
                    arr.push({
                        'address': keys[i],
                        'weight': signers[keys[i]],
                    });
                }
                signers = arr;
            }

            let thresholdTx = 1;
            let thresholdTypes = [];
            {
                let types = Object.keys(threshold);
                let buildinTypes = Object.keys(transactionType);
                for (let i = 0; i < types.length; i++) {
                    if (buildinTypes.includes(types[i])) {
                        thresholdTypes.push({
                            'type': transactionType[types[i]],
                            'threshold': threshold[types[i]],
                        });
                    } else if (types[i] === 'tx') {
                        thresholdTx = threshold[types[i]]
                    }
                }
            }
            if (typeof privDest === 'string' && privDest.length > 0) {
                priv = [priv, privDest];
            } else {
                priv = [priv];
            }
            return await makeADeal(
                'deal', addressSrc, feeLimit, gasPrice, priv, note, seqOffset, [
                    [constUtil.TX_TYPE.CREATE.TYPE, {
                        'dest': addressDst,
                        'balanceInit': balanceInit,
                        'metadatas': metadatas,
                        'contract': contract}],
                    [constUtil.TX_TYPE.PRIVILEGE.TYPE, {
                        'srcAddress': addressDst,
                        'masterWeight': weight.toString(),
                        'signers': signers,
                        'txThreshold': thresholdTx.toString(),
                        'typeThresholds': thresholdTypes}]]);
    },
    dealTransaction: async function(
        type, addressSrc, feeLimit, gasPrice, priv, note, seqOffset, ops) {
        return await makeADeal(
            type, addressSrc, feeLimit, gasPrice, [priv], note, seqOffset, ops);
    },

/**
 * 交易签名
 * @param {string} transactionString    [必须]交易字符串
 * @param {string} accountNick          [可选]签名账户昵称(私钥 与 昵称+密码 二选一)
 * @param {string} pwd                  [可选]签名账户密码(私钥 与 昵称+密码 二选一)
 * @param {string} privateKey           [可选]签名私钥(私钥 与 昵称+密码 二选一)
 * @return {string}
 */
    signTransaction: async function(
        transactionString, accountNick, pwd, privateKey) {
        let data;
        try {
            data = getObjectFromTxStr(transactionString);
            if (!data.hasOwnProperty('items'
                || !commonUtil.isArray(data.items)
                || data.items.length === 0
                || !data.items[0].hasOwnProperty('transaction_blob'))) {
                throw (commonUtil.packageError(
                    constUtil.ERRORS.ERR_TX_STR_INVALID));
            }
        } catch (err) {
            commonUtil.handleError(err);
            return null;
        }
        let ret = null;
        if (privateKey !== undefined
            && typeof privateKey === 'string'
            && privateKey.length > 0) {
                ret = await commonUtil.queryInfo('sign-data', [
                    privateKey,
                    data.items[0].transaction_blob]);
        } else {
            let keystore = fs.readFileSync(
                commonUtil.getWalletAccountFilePath(
                    params.accountNick)).toString();
            ret = await commonUtil.queryInfo('sign-data-with-keystore', [
                keystore,
                pwd,
                data.items[0].transaction_blob]);
        }
        if (ret === undefined) {
            return;
        }
        ret = JSON.parse(ret);
        if (data.items[0].hasOwnProperty('signatures')) {
            for (let i = 0; i < data.items[0].signatures.length; i++) {
                if (data.items[0].signatures[i].hasOwnProperty('public_key')
                    && data.items[0].signatures[i].public_key
                        === ret.public_key) {
                    data.items[0].signatures[i].sign_data = ret.sign_data;
                    return getTxStrFromObject(data);
                }
            }
        } else {
            data.items[0].signatures = [];
        }
        data.items[0].signatures.push({
            'sign_data': ret.sign_data,
            'public_key': ret.public_key});

        return getTxStrFromObject(data);
    },
/**
 * 获取交易字符串
 * @param {string} blob                     [必须]交易blob
 * @param {array}  signers                  [可选]签名列表
 * @param {string} signers[].sign_data      [必须]签名数据
 * @param {string} signers[].public_key     [必须]签名公钥
 * @return {string}
*/
    getTransactionString: function(blob, signers) {
        let data = {
            'items': [{
                'transaction_blob': blob,
                'signatures': []}]};
        if (signers && commonUtil.isArray(signers)) {
            signers.forEach((ele) => {
                if (ele.hasOwnProperty('sign_data')
                    && ele.hasOwnProperty('public_key')) {
                        data.items[0].signatures.push({
                            'sign_data': ele.sign_data,
                            'public_key': ele.public_key});
                }
            });
        }
        return getTxStrFromObject(data);
    },
    /**
 * 解析交易字符串
 * @param {string} transactionString        [必须]交易blob
 * @return {object}
**/
    getTransactionData: async function(transactionString) {
        let data;
        let tx;
        let signList = [];
        try {
            data = getObjectFromTxStr(transactionString);

            if (!data.hasOwnProperty('items')
                || !commonUtil.isArray(data.items)
                || data.items.length === 0
                || !data.items[0].hasOwnProperty('transaction_blob')) {
                throw (commonUtil.packageError(
                    constUtil.ERRORS.ERR_TX_STR_INVALID));
            }
            tx = protoChain.Transaction.deserializeBinary(
                Uint8Array.from(
                    new Buffer(data.items[0].transaction_blob, 'hex')));

            if (data.items[0].hasOwnProperty('signatures')
                && data.items[0].signatures.length > 0) {
                    for (let i = 0; i < data.items[0].signatures.length; i++) {
                        if (!data.items[0].signatures[i]
                            .hasOwnProperty('sign_data')
                            || !data.items[0].signatures[i]
                                .hasOwnProperty('public_key')) {
                                return;
                        }
                        let ret = await commonUtil.queryInfo(
                            'check-signed-data', [
                            data.items[0].transaction_blob,
                            data.items[0].signatures[i].sign_data,
                            data.items[0].signatures[i].public_key]);
                        let bValid = false;
                        if (ret === 'true') {
                            bValid = true;
                        }

                        ret = await commonUtil.queryInfo(
                            'get-address-from-pubkey', [
                                data.items[0].signatures[i].public_key]);
                        if (ret === undefined) {
                            return null;
                        }
                        let address = '';
                        ret = JSON.parse(ret);
                        if (ret.hasOwnProperty('address')) {
                            address = ret.address;
                        }
                        signList.push({
                            'publicKey': data.items[0].signatures[i].public_key,
                            'address': address,
                            'isValid': bValid});
                    }
            }
        } catch (err) {
            commonUtil.handleError(err);
            return null;
        }

        let txDetail = {
            'srcAddress': tx.getSourceAddress(),
            'feeLimit': tx.getFeeLimit().toString(),
            'gasPrice': tx.getGasPrice().toString(),
            'nonce': tx.getNonce(),
            'hash': crypto.createHash('sha256')
                        .update(
                            new Buffer(data.items[0].transaction_blob, 'hex'))
                        .digest('hex'),
            'ops': []};
        if (tx.getMetadata_asB64().length > 0) {
            txDetail.note = new Buffer(tx.getMetadata_asB64(), 'base64')
                                .toString('utf8');
        }
        let operations = tx.getOperationsList();
        if (commonUtil.isArray(operations)) {
            operations.forEach((ele) => {
                let tmp = {};
                Object.keys(transactionType).every((k) => {
                    if (transactionType[k] === ele.getType()) {
                        tmp.type = k;
                        return false;
                    }
                    return true;
                });
                if (!tmp.hasOwnProperty('type')) {
                    return;
                }
                tmp.params = {};
                switch (tmp.type) {
                    case 'create':
                        let createAccount = ele.getCreateAccount();
                        tmp.params.destAddress = createAccount.getDestAddress();
                        let metas = createAccount.getMetadatasList();
                        if (metas.length > 0) {
                            tmp.params.metadatas = {};
                            metas.forEach((ele) => {
                                tmp.params.metadatas[ele.getKey()] =
                                    ele.getValue();
                            });
                        }
                        let priv = createAccount.getPriv();
                        tmp.params.weight = priv.getMasterWeight();
                        let signers = priv.getSignersList();
                        if (signers.length > 0) {
                            tmp.params.signers = {};
                            signers.forEach((ele) => {
                                tmp.params.signers[ele.getAddress()] =
                                    ele.getWeight();
                            });
                        }
                        let thres = priv.getThresholds();
                        tmp.params.threshold = {};
                        tmp.params.threshold.tx = thres.getTxThreshold();
                        let thresList = thres.getTypeThresholdsList();
                        if (thresList.length > 0) {
                            thresList.forEach((ele) => {
                                Object.keys(transactionType).every((k) => {
                                    if (transactionType[k] === ele.getType()) {
                                        tmp.params.threshold[k] =
                                            ele.getThreshold();
                                    }
                                    return true;
                                });
                            });
                        }
                        break;
                    case 'metadata':
                        let metadata = ele.getSetMetadata();
                        tmp.params.key = metadata.getKey();
                        tmp.params.value = metadata.getValue();
                        tmp.params.version = metadata.getVersion();
                        break;
                    case 'paycoin':
                        let payCoin = ele.getPayCoin();
                        tmp.params.destAddress = payCoin.getDestAddress();
                        tmp.params.amount = payCoin.getAmount().toString();
                        break;
                    default: return;
                }
                txDetail.ops.push(tmp);
            });
        }
        return {
            'tx': txDetail,
            'sign': signList};
    },
    /**
 * 提交交易字符串
 * @param {string} transactionString        [必须]交易字符串
 * @return {string}
**/
    submitTransactionString: async function(transactionString) {
        let data = getObjectFromTxStr(transactionString);
        let result = await commonUtil.httpPostPromise(
            '/submitTransaction', JSON.stringify(data));
        result = JSON.parse(result);
        if (!commonUtil.objectCheck(result, {'results': 'array'})
            || result.results.length === 0) {
                throw (commonUtil.packageError(
                    constUtil.ERRORS.ERR_HTTP_RESULT_ERR));
        }
        if (result.results[0].error_code !== 0) {
            throw (commonUtil.packageHttpErr(
                result.results[0].error_code,
                result.results[0].error_desc));
        }
        return result.results[0].hash;
    },
};

/**
 * 把对象转换成交易字符串
 * @param {object} obj
 * @return {string}
 */
function getTxStrFromObject(obj) {
    return Buffer.from(JSON.stringify(obj)).toString('hex');
}

/**
 * 把交易字符串转换成对象
 * @param {string} txStr
 * @return {object}
 */
function getObjectFromTxStr(txStr) {
    return JSON.parse(Buffer.from(txStr, 'hex').toString());
}

const transactionType = {
    'create': constUtil.TX_TYPE.CREATE.TYPE,
    'issue': constUtil.TX_TYPE.ISSUE.TYPE,
    'payment': constUtil.TX_TYPE.PAYMENT.TYPE,
    'metadata': constUtil.TX_TYPE.METADATA.TYPE,
    'paycoin': constUtil.TX_TYPE.PAYCOIN.TYPE,
    'privilege': constUtil.TX_TYPE.PRIVILEGE.TYPE};

let defaultTxThreshold = 1;
let defaultMasterWeight = 1;

/**
 * 组合PayCoin的protobuf对象
 * @param {string} dest
 * @param {number} amount
 * @return {object}
 */
function asmExeOpPaycoin(dest, amount) {
    let opPC = new protoChain.OperationPayCoin();
    opPC.setDestAddress(dest);
    opPC.setAmount(amount);
    let op = new protoChain.Operation();
    op.setType(protoChain.Operation.Type.PAY_COIN);
    op.setPayCoin(opPC);
    return op;
}

/**
 * 组合SetMetadata的protobuf对象
 * @param {string} key
 * @param {string} value
 * @param {number} version
 * @return {object}
 */
function asmExeOpMetadata(key, value, version) {
        let opSM = new protoChain.OperationSetMetadata();
        opSM.setKey(key);
        if (typeof value === 'string') {
            opSM.setValue(value);
        }
        if (typeof version === 'number') {
            opSM.setVersion(version);
        }
        let op = new protoChain.Operation();
        op.setType(protoChain.Operation.Type.SET_METADATA);
        op.setSetMetadata(opSM);
        return op;
}

/**
 * 组合Payment的protobuf对象
 * @param {string} dest
 * @param {number} amount
 * @param {string} issuer
 * @param {string} code
 * @return {object}
 */
function asmExeOpPayment(dest, amount, issuer, code) {
    let opP = new protoChain.OperationPayment();
    opP.setDestAddress(dest);
    let asset = new protoChain.Asset();
    asset.setAmount(amount);
    let prop = new protoChain.AssetProperty();
    prop.setIssuer(issuer);
    prop.setCode(code);
    asset.setProperty(prop);
    opP.setAsset(asset);
    let op = new protoChain.Operation();
    op.setType(protoChain.Operation.Type.PAYMENT);
    op.setPayment(opP);
    return op;
}

/**
 * 组合Privilege的protobuf对象
 * @param {number} weight
 * @param {array} signers
 * @param {string} tx
 * @param {array} thresholds
 * @param {string} src
 * @return {object}
 */
function asmExeOpPrivilege(weight, signers, tx, thresholds, src) {
    let opSP = new protoChain.OperationSetPrivilege();
    opSP.setMasterWeight(weight);
    opSP.setTxThreshold(tx);
    for (let i = 0; signers && i < signers.length; i++) {
        if (commonUtil.objectCheck(signers[i], {
            'address': 'string',
            'weight': 'number'})) {
                let s = new protoChain.Signer();
                s.setAddress(signers[i].address);
                s.setWeight(signers[i].weight);
                opSP.addSigners(s);
            }
    }
    for (let i = 0; thresholds && i < thresholds.length; i++) {
        if (commonUtil.objectCheck(thresholds[i], {
            'type': 'number',
            'threshold': 'number'})) {
                let t = new protoChain.OperationTypeThreshold();
                t.setType(thresholds[i].type);
                t.setThreshold(thresholds[i].threshold);
                opSP.addTypeThresholds(t);
            }
    }
    let op = new protoChain.Operation();
    op.setType(protoChain.Operation.Type.SET_PRIVILEGE);
    op.setSetPrivilege(opSP);
    if (typeof src === 'string' && src.length > 0) {
        op.setSourceAddress(src);
    }
    console.log(JSON.stringify(op.toObject()));
    return op;
}

/**
 * 组合Issue的protobuf对象
 * @param {number} amount
 * @param {string} code
 * @return {object}
 */
function asmExeOpIssue(amount, code) {
    let opIA = new protoChain.OperationIssueAsset();
    opIA.setCode(code);
    opIA.setAmount(amount);
    let op = new protoChain.Operation();
    op.setType(protoChain.Operation.Type.ISSUE_ASSET);
    op.setIssueAsset(opIA);
    return op;
}

/**
 * 组合Create的protobuf对象
 * @param {string} dest
 * @param {string} balanceInit
 * @param {object} metadatas
 * @param {string} contract
 * @return {object}
 */
function asmExeOpCreate(
    dest, balanceInit, metadatas, contract) {
        let opCA = new protoChain.OperationCreateAccount();
        opCA.setDestAddress(dest);
        opCA.setInitBalance(parseInt(balanceInit));
        if (commonUtil.isObject(metadatas)) {
            Object.keys(metadatas).forEach((ele) => {
                if (typeof ele === 'string'
                    && typeof metadatas[ele] === 'string'
                    && metadatas[ele].length > 0) {
                        let meta = new protoChain.OperationSetMetadata();
                        meta.setKey(ele);
                        meta.setValue(metadatas[ele]);
                        opCA.addMetadatas(meta);
                }
            });
        }
        let privilege = new protoChain.AccountPrivilege();
        let thres = new protoChain.AccountThreshold();
        thres.setTxThreshold(defaultTxThreshold);
        privilege.setThresholds(thres);
        if (typeof contract === 'string' && contract.length > 0) {
            privilege.setMasterWeight(0);
        } else {
            privilege.setMasterWeight(defaultMasterWeight);
        }
        opCA.setPriv(privilege);
        if (typeof contract === 'string' && contract.length > 0) {
            let cont = new protoChain.Contract();
            cont.setType(protoChain.Contract.ContractType.JAVASCRIPT);
            cont.setPayload(contract);
            opCA.setContract(cont);
        }
        let op = new protoChain.Operation();
        op.setType(protoChain.Operation.Type.CREATE_ACCOUNT);
        op.setCreateAccount(opCA);
        return op;
}

/**
 * 组合PayCoin的json对象
 * @param {string} dest
 * @param {string} amount
 * @return {object}
 */
function asmHttpOpPaycoin(dest, amount) {
    return {
        'type': 'PAY_COIN',
        'pay_coin': {
            'dest_address': dest,
            'amount': amount}};
}

/**
 * 组合Create的json对象
 * @param {string} dest
 * @param {string} balanceInit
 * @param {object} metadatas
 * @param {string} contract
 * @param {number} weight
 * @param {object} signers
 * @param {object} threshold
 * @return {object}
 */
function asmHttpOpCreate(
    dest, balanceInit, metadatas, contract, weight, signers, threshold) {
    let params = {
        'type': 'CREATE_ACCOUNT',
        'create_account': {
            'dest_address': dest,
            'init_balance': balanceInit,
            'priv': {
                'master_weight': defaultMasterWeight,
                'thresholds': {
                    'tx_threshold': defaultTxThreshold}},
            'metadatas': []}};
    if (typeof weight === 'number') {
        params.create_account.priv.master_weight = weight;
    }
    if (commonUtil.isObject(threshold) && Object.keys(threshold).length > 0) {
        Object.keys(threshold).forEach((ele) => {
            if (ele === 'tx') {
                params.create_account.priv.thresholds.tx_threshold =
                    threshold[ele];
                return;
            }
            if (Object.keys(transactionType).includes(ele)) {
                if (!params.create_account.priv.thresholds
                        .hasOwnProperty('type_thresholds')) {
                    params.create_account.priv.thresholds.type_thresholds = [];
                }
                params.create_account.priv.thresholds.type_thresholds.push({
                    'type': transactionType[ele],
                    'threshold': threshold[ele]});
            }
        });
    }
    return params;
}

/*
ops:
[
    [TX_TYPE,params]
    ...
    ...
]
*/
/**
 * 执行交易，根据type决定是获取交易费用、获取交易blob还是直接进行交易
 * @param {string}          type
 * @param {string}          addrSrc
 * @param {string}          feeLimit
 * @param {string}          gasPrice
 * @param {array(string)}   privateKeys
 * @param {string}          note
 * @param {number}          seqOffset
 * @param {array}           ops
 * @return {string}
 */
async function makeADeal(
    type, addrSrc, feeLimit, gasPrice, privateKeys, note, seqOffset, ops) {
    let postData = '';
    let nonce = 0;
    let opsRecord = '';
    let data;
    data = await commonUtil.httpGetPromise('/getAccount?address=' + addrSrc);
    let result = JSON.parse(data);
    if (result.error_code !== 0) {
        if (result.error_code === 4) {
            throw (commonUtil.packageError(
                constUtil.ERRORS.ERR_ADDR_NOT_EXISTS));
        } else {
            throw (commonUtil.packageHttpErr(
                result.error_code,
                result.error_desc));
        }
    }
    if (result.result.hasOwnProperty('nonce')) {
        nonce = result.result.nonce;
    }

    let validSeq = await commonUtil.httpGetPromise('/getModulesStatus');
    validSeq = JSON.parse(validSeq);
    if (validSeq
        && validSeq.hasOwnProperty('ledger_manager')
        && validSeq.ledger_manager.hasOwnProperty('chain_max_ledger_seq')) {
            if (typeof seqOffset === 'number' && seqOffset >= 0) {
                if (seqOffset === 0) {
                    validSeq = 0;
                } else {
                    validSeq = validSeq.ledger_manager.chain_max_ledger_seq
                                + seqOffset;
                }
            } else {
                validSeq = validSeq.ledger_manager.chain_max_ledger_seq
                            + conf.store.tx_ceil_ledger_seq;
            }
        } else {
            validSeq = conf.store.tx_ceil_ledger_seq;
        }

    switch (getConf('ways_sign_tx')) {
        case 'exe':
            let tx = new protoChain.Transaction();
            tx.setSourceAddress(addrSrc);
            tx.setFeeLimit(feeLimit);
            tx.setGasPrice(gasPrice);
            tx.setNonce(nonce + 1);
            tx.setCeilLedgerSeq(validSeq);
            if (!(
                note === null
                || note === undefined
                || typeof note != 'string'
                || note.length === 0)) {
                    tx.setMetadata(Uint8Array.from(new Buffer(note, 'utf8')));
            }
            for (let i = 0; i < ops.length; i++) {
                if (ops[i].length == 2) {
                    switch (ops[i][0]) {
                        case constUtil.TX_TYPE.PAYCOIN.TYPE:
                            if (ops[i][1] && ops[i][1].hasOwnProperty('dest')
                                && ops[i][1].hasOwnProperty('amount')) {
                                    tx.addOperations(
                                        asmExeOpPaycoin(
                                            ops[i][1].dest, ops[i][1].amount));
                            }
                            break;
                        case constUtil.TX_TYPE.CREATE.TYPE:
                            tx.addOperations(
                                asmExeOpCreate(
                                    ops[i][1].dest,
                                    ops[i][1].balanceInit,
                                    ops[i][1].metadatas,
                                    ops[i][1].contract));
                            break;
                        case constUtil.TX_TYPE.METADATA.TYPE:
                            tx.addOperations(
                                asmExeOpMetadata(
                                    ops[i][1].key,
                                    ops[i][1].value,
                                    ops[i][1].version));
                            break;
                        case constUtil.TX_TYPE.PAYMENT.TYPE:
                            tx.addOperations(
                                asmExeOpPayment(
                                    ops[i][1].dest,
                                    ops[i][1].amount,
                                    ops[i][1].issuer,
                                    ops[i][1].code));
                            break;
                        case constUtil.TX_TYPE.ISSUE.TYPE:
                            tx.addOperations(
                                asmExeOpIssue(
                                    ops[i][1].amount,
                                    ops[i][1].code));
                            break;
                        case constUtil.TX_TYPE.PRIVILEGE.TYPE:
                            tx.addOperations(
                                asmExeOpPrivilege(
                                    ops[i][1].masterWeight,
                                    ops[i][1].signers,
                                    ops[i][1].txThreshold,
                                    ops[i][1].typeThresholds,
                                    ops[i][1].srcAddress));
                            break;
                    }
                }
            }
            let blob = Buffer.from(tx.serializeBinary()).toString('hex');
            if (type === 'blob') {
                return blob;
            }
            let post = {
                'items': [
                    {
                        'transaction_blob': blob,
                        'signatures': [],
                    },
                ],
            };
            for(let j = 0; j < privateKeys.length; j++) {
                let ret = await commonUtil.queryInfo(
                    'sign-data', [privateKeys[j], blob]);
                if (ret === undefined) {
                    throw (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
                }
                ret = JSON.parse(ret);
                post.items[0].signatures.push({
                    'sign_data': ret.sign_data,
                    'public_key': ret.public_key
                })
            }
            opsRecord = tx.toObject();
            postData = JSON.stringify(post); break;

        // default through http
        default:
            if (!ops) {
                throw (commonUtil.packageError(
                    constUtil.ERRORS.ERR_TX_OP_EMPTY));
            }
            if (type === 'blob') {
                throw (commonUtil.packageError(
                    constUtil.ERRORS.ERR_BLOB_INVALID));
            }
            let deal = {
                'callback': [],
                'content': {
                    'items': [{
                        'transaction_json': {
                            'source_address': addrSrc,
                            'nonce': 0,
                            'feeLimit': feeLimit,
                            'gasPrice': gasPrice,
                            'metadata': '',
                            'operations': [],
                        },
                        'private_keys': privateKeys,
                    }],
                },
            };
            if (note === null
                || note === undefined
                || typeof note != 'string'
                || note.length === 0) {
                    delete deal.content.items[0].transaction_json.metadata;
            } else {
                try {
                    deal.content.items[0].transaction_json.metadata =
                        commonUtil.convertString2HexString(note);
                } catch (err) {
                    throw (commonUtil.packageError(
                        constUtil.ERRORS.ERR_CONVERT_HEX));
                }
            }
            if (type === 'fee') {
                delete deal.content.items[0].private_keys;
            }
            for (let i = 0; i < ops.length; i++) {
                if (ops[i].length == 2) {
                    switch (ops[i][0]) {
                        case constUtil.TX_TYPE.PAYCOIN.TYPE:
                            if (ops[i][1] && ops[i][1].hasOwnProperty('dest')
                                && ops[i][1].hasOwnProperty('amount')) {
                                    deal.content.items[0].transaction_json
                                        .operations.push(asmHttpOpPaycoin(
                                            ops[i][1].dest, ops[i][1].amount));
                            }
                            break;
                        case constUtil.TX_TYPE.CREATE.TYPE:
                            deal.content.items[0].transaction_json
                                .operations.push(asmHttpOpCreate(
                                    ops[i][1].dest,
                                    ops[i][1].balanceInit,
                                    ops[i][1].metadatas,
                                    ops[i][1].contract,
                                    ops[i][1].weight,
                                    ops[i][1].signers,
                                    ops[i][1].threshold
                                ));
                            break;
                    }
                }
            }
            deal.content.items[0].transaction_json.nonce = nonce + 1;
            opsRecord = deal.content.items[0].transaction_json.operations;
            postData = JSON.stringify(deal.content); break;
    }

    result = await commonUtil.httpPostPromise(
        (type === 'fee' ? '/testTransaction' : '/submitTransaction'),
        postData);
    if (type === 'fee') {
        let t = JSONBig.parse(result);
        if (t.error_code == 0
            && t.hasOwnProperty('result')
            && t.result.hasOwnProperty('real_fee')) {
                return t.result.real_fee.toString();
        } else {
            throw (commonUtil.packageHttpErr(
                t.error_code,
                t.error_code));
        }
    } else {
        let t = JSON.parse(result);
        if (t.hasOwnProperty('results')
            && t.results[0].error_code == 0
            && t.results[0].hasOwnProperty('hash')) {
                let params = {
                    'error_code': -1,
                    'error_desc': 'transaction submit success',
                    'hash': t.results[0].hash,
                    'ledger_seq': opsRecord.ceilLedgerSeq,
                    'actual_fee': '0',
                    'close_time': Date.now().toString() + '000',
                    'transaction': {
                        'feeLimit': feeLimit,
                        'gasPrice': gasPrice,
                        'nonce': nonce + 1,
                        'operations': opsRecord.operationsList,
                        'source_address': addrSrc,
                    },
                };
                if (!(
                    note === null
                    || note === undefined
                    || typeof note != 'string'
                    || note.length === 0)) {
                        params.transaction.metadata =
                            commonUtil.convertString2HexString(note);
                };
                commonUtil.eventTrigger(constUtil.EVENTS.TX_SUBMIT, params);
                return t.results[0].hash;
        } else {
            throw (commonUtil.packageHttpErr(
                t.results[0].error_code, t.results[0].error_desc));
        }
    }
}

/**
 * 关闭websocket连接
*/
function stopWS() {
    if (syncNode && !syncNode.killed) {
        syncNode.kill();
    }
    if (wsClient) {
        wsClient.close();
        wsClient = null;
    }
}

/**
 * websocket连接重试
*/
function TryConnect() {
    if (!wsClient && retryTimes != 0) {
        console.log('retry websocket connect');
        if (retryTimes > 0) {
            retryTimes--;
        }
        connect();
    }
}

/**
 * 输出info信息
 * @param {string} text
 */
function showText(text) {
    commonUtil.eventTrigger(constUtil.EVENTS.INFO, text);
}

/**
 * websocket连接
*/
function connect() {
    showText('Websocket client connect to ' + wsHost + ':' + wsPort);
    wsClient = new WebSocket('ws://' + wsHost + ':' + wsPort);
    wsClient.on('open', function() {
        if (retryTimer) {
            clearTimeout(retryTimer);
            retryTimer = null;
        }
        commonUtil.eventTrigger(constUtil.EVENTS.WS_OPEN);
        if (wsSendQueue.length !== 0) {
            while (wsSendQueue.length > 0) {
                wsClient.send(wsSendQueue.shift(), {'binary': true});
            }
        }
    });
    wsClient.on('close', function(code, reason) {
        showText('Websocket closed(' + code + '): ' + reason);
        commonUtil.eventTrigger(constUtil.EVENTS.WS_CLOSE);
    });
    wsClient.on('error', function(error) {
        showText('Websocket ' + error);
        commonUtil.eventTrigger(constUtil.EVENTS.WS_ERROR);
        if (wsClient) {
            wsClient.close();
            wsClient = null;
        }
        if (retryTimer) {
            clearTimeout(retryTimer);
        }
        if (!peerClosed) {
            retryTimer = setTimeout(TryConnect, retryWaitTime);
        }
    });
    wsClient.on('message', function incoming(data) {
        let msg = protoCommon.WsMessage.deserializeBinary(new Uint8Array(data));
        let name = '';
        let content = {};
        // const protoOMTKeys = Object.keys(protoOverlay.OVERLAY_MESSAGE_TYPE);
        // const protoCMTKeys = Object.keys(protoOverlay.ChainMessageType);
        // if (Object.values(protoOverlay.OVERLAY_MESSAGE_TYPE)
        //     .includes(msg.getType())) {
        //         protoOMTKeys.every((ele)=>{
        //             if (protoOverlay.OVERLAY_MESSAGE_TYPE[ele] === msg.getType()) {
        //                 name = ele.toLowerCase();
        //                 return false;
        //             }
        //             return true;
        //         });
        // } else if (Object.values(protoOverlay.ChainMessageType)
        //     .includes(msg.getType())) {
        //     reader
        // }
        switch (msg.getType()) {
            case protoOverlay.OVERLAY_MESSAGE_TYPE.OVERLAY_MSGTYPE_NONE:
                name = 'overlay_msgtype_none'; break;
            case protoOverlay.OVERLAY_MESSAGE_TYPE.OVERLAY_MSGTYPE_TRANSACTION:
                name = 'overlay_msgtype_transaction'; break;
            case protoOverlay.OVERLAY_MESSAGE_TYPE.OVERLAY_MSGTYPE_PBFT:
                name = 'overlay_msgtype_pbft'; break;
            case protoOverlay.OVERLAY_MESSAGE_TYPE.OVERLAY_MSGTYPE_HELLO:
                name = 'overlay_msgtype_hello';
                content = (protoOverlay.Hello.deserializeBinary(msg.getData()))
                    .toObject(); break;
            case protoOverlay.OVERLAY_MESSAGE_TYPE.OVERLAY_MSGTYPE_LEDGERS:
                name = 'overlay_msgtype_ledgers';
                content =
                    (protoOverlay.Ledgers.deserializeBinary(msg.getData()))
                    .toObject(); break;
            case protoOverlay.OVERLAY_MESSAGE_TYPE.OVERLAY_MSGTYPE_PEERS:
                name = 'overlay_msgtype_peers';
                content = (protoOverlay.Peers.deserializeBinary(msg.getData()))
                    .toObject(); break;
            case protoOverlay.OVERLAY_MESSAGE_TYPE
                    .OVERLAY_MSGTYPE_LEDGER_UPGRADE_NOTIFY:
                name = 'overlay_msgtype_ledger_upgrade_notify';
                content =
                    (protoOverlay.LedgerUpgradeNotify
                        .deserializeBinary(msg.getData()))
                            .toObject(); break;
            case protoOverlay.OVERLAY_MESSAGE_TYPE.OVERLAY_MSGTYPE_PING:
                name = 'overlay_msgtype_ping';
                content =
                    (protoCommon.Ping.deserializeBinary(msg.getData()))
                        .toObject(); break;
            case protoOverlay.ChainMessageType.CHAIN_SUBMITTRANSACTION:
                name = 'chain_submittransaction'; break;
            case protoOverlay.ChainMessageType.CHAIN_PEER_ONLINE:
                name = 'chain_peer_online'; break;
            case protoOverlay.ChainMessageType.CHAIN_PEER_OFFLINE:
                name = 'chain_peer_offline'; break;
            case protoOverlay.ChainMessageType.CHAIN_PEER_MESSAGE:
                name = 'chain_peer_message';
                content =
                    (protoOverlay.ChainPeerMessage
                        .deserializeBinary(msg.getData()))
                            .toObject(); break;
            case protoOverlay.ChainMessageType.CHAIN_HELLO:
                name = 'chain_hello';
                content =
                    (protoOverlay.ChainHello.deserializeBinary(msg.getData()))
                        .toObject(); break;
            case protoOverlay.ChainMessageType.CHAIN_TX_STATUS:
                name = 'chain_tx_status';
                // content =
                //     (protoOverlay.ChainTxStatus
                //         .deserializeBinary(msg.getData()))
                //         .toObject();
                break;
            case protoOverlay.ChainMessageType.CHAIN_LEDGER_HEADER:
                name = 'chain_ledger_header';
                if (TriggerSeqEnabled === false) {
                    TriggerSeqEnabled = true;
                }
                content =
                    (protoChain.LedgerHeader.deserializeBinary(msg.getData()))
                        .toObject();
                break;
            case protoOverlay.ChainMessageType.CHAIN_TX_ENV_STORE:
                name = 'chain_tx_env_store';
                let data = (protoChain.TransactionEnvStore
                    .deserializeBinary(msg.getData()));
                content = data.toObject();
                content.transactionEnv.transaction.metadata =
                    commonUtil.convertU8A2Utf8Str(
                        data.getTransactionEnv()
                            .getTransaction().getMetadata_asU8());
                content.hash =
                    commonUtil.convertU8A2HexStr(data.getHash_asU8());
                break;
        }
        commonUtil.eventTrigger(constUtil.EVENTS.WS_RECV, {
            'name': name,
            'type': msg.getType(),
            'content': content});
    });
}

/**
 * 处理websocket的ping消息，需要pong回复来避免被节点关闭连接
 * @param {object} msg
 */
function handlePing(msg) {
    let resp = new protoCommon.WsMessage();
    let pong = new protoCommon.Ping();
    pong.setNonce(msg.nonce + 1);
    resp.setType(protoOverlay.OVERLAY_MESSAGE_TYPE.OVERLAY_MSGTYPE_PING);
    resp.setRequest(false);
    resp.setData(pong.serializeBinary());
    resp = resp.serializeBinary();
    wsClient.send(resp, {'binary': true});
}

/**
 * 处理交易状态消息
 * @param {object} msg
 */
function handleTxStatus(msg) {
    if (commonUtil.objectCheck(msg, {
        'status': 'number',
        'txHash': 'string',
        'errorCode': 'number',
    })) {
        switch (msg.status) {
            case protoOverlay.ChainTxStatus.TxStatus.UNDEFINED: break;
            case protoOverlay.ChainTxStatus.TxStatus.CONFIRMED: break;
            case protoOverlay.ChainTxStatus.TxStatus.PENDING:
                commonUtil.eventTrigger(
                    constUtil.EVENTS.TX_STATUS_PEND,
                    {'hash': msg.txHash}); break;
            case protoOverlay.ChainTxStatus.TxStatus.COMPLETE:
                commonUtil.eventTrigger(
                    constUtil.EVENTS.TX_STATUS_COMP,
                    {'hash': msg.txHash});
            case protoOverlay.ChainTxStatus.TxStatus.FAILURE:
                // 状态码3的失败忽略 ignore the error code 3
                if (msg.errorCode === 3) {
                    break;
                }
                if (msg.status === protoOverlay.ChainTxStatus
                    .TxStatus.FAILURE) {
                    commonUtil.eventTrigger(
                        constUtil.EVENTS.TX_STATUS_FAIL,
                        {'hash': msg.txHash});
                }
                break;
            // default: break
        }
    }
}

/**
 * 处理交易
 * @param {object} msg
 */
function handleTxEnvStore(msg) {
    if (msg.errorCode === 0) {
        commonUtil.eventTrigger(constUtil.EVENTS.TX_STATUS_COMP, msg);
    } else {
        commonUtil.eventTrigger(constUtil.EVENTS.TX_STATUS_FAIL, msg);
    }
}

/**
 * 获取地址的余额与保留费用
 * @param {string} addr
 * @return {object}
 */
async function getAccountBalance(addr) {
    let retData = {};
    let data = await commonUtil.httpGetPromise('/getAccount?address=' + addr);
    retData['balance'] = '0';
    let result = JSONBig.parse(data);
    if (result.result) {
        if (result.result.balance) {
            retData['balance'] = result.result.balance.toString();
        }
        if (result.result.priv) {
            retData['priv'] = result.result.priv;
        }
    }

    let reserve = await commonUtil.httpGetPromise('/getLedger?with_fee=true');
    let getData = JSONBig.parse(reserve);
    retData['fee'] = '0';
    retData['gasPrice'] = '0';
    if (getData.error_code == 0
        && getData.result
        && getData.result.fees) {
        if (getData.result.fees.base_reserve) {
            retData['fee'] = getData.result.fees.base_reserve.toString();
        }
        if (getData.result.fees.gas_price) {
            retData['gasPrice'] = getData.result.fees.gas_price.toString();
        }
    }
    return retData;
}
