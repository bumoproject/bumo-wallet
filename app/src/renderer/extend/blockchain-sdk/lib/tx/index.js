import net from '../network';
import historyRecord from '../history';
import constUtil from '../constants';
import commonUtil from '../util';
import account from '../account/index';

export default {

    /**
     * 启动后端同步节点
    **/
    async startPeer() {
        try {
            net.startWebsocketClient();
        } catch (err) {
            commonUtil.handleError(err);
        }
    },

    /**
     * 关闭后端同步节点
    **/
    async stopPeer() {
        try {
            net.stopWebsocket();
        } catch (err) {
            commonUtil.handleError(err);
        }
    },
    /**
     * 转移token
     * @param {object} params               [必须]参数对象
     * @param {string} params.accountNick   [必须]账户昵称
     * @param {string} params.srcAddress    [必须]源账户地址
     * @param {string} params.destAddress   [必须]目标账户地址
     * @param {string} params.amount        [必须]转移数量，字符串类型
     * @param {string} params.feeLimit           [必须]扣除费用，字符串类型
     * @param {string} params.gasPrice           [必须]扣除费用，字符串类型
     * @param {string} params.pwd           [必须]账户密码
     * @param {string} params.note          [可选]交易备注
     * @param {string} params.seqOffset     [可选]区块偏移量，当前区块高度+偏移量=交易最大打包高度
     * @return {object}
    **/
    async sendToken(params) {
        try {
            if (!commonUtil.objectCheck(params, {
                'accountNick': 'string',
                'srcAddress': 'string',
                'destAddress': 'string',
                'amount': 'string',
                'feeLimit': 'string',
                'gasPrice': 'string',
                'pwd': 'string',
            }, {
                'note': 'string',
                'seqOffset': 'number'})) {
                return (commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS));
            }

            let amountX = commonUtil.unitConvert(
                params.amount, constUtil.BUILDIN_UNIT_IN, true);
            let feeLimitX = commonUtil.unitConvert(
                params.feeLimit, constUtil.BUILDIN_UNIT_IN, true);
            let gasPriceX = commonUtil.unitConvert(
                params.gasPrice, 0, true);
            if (amountX === null || feeLimitX === null) {
                return (commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS));
            }
            let data = await account.getAccountPrivKeyStr({
                'accountNick': params.accountNick,
                'pwd': params.pwd,
            });
            if (data.errCode == constUtil.ERRORS.SUCCESS.CODE) {
                data = await net.txPayCoin(
                    params.srcAddress,
                    params.destAddress,
                    amountX,
                    feeLimitX,
                    gasPriceX,
                    data.data.privKeyStr,
                    params.note,
                    params.seqOffset);
                return ({
                    'errCode': constUtil.ERRORS.SUCCESS.CODE,
                    'msg': constUtil.ERRORS.SUCCESS.MSG,
                    'data': {
                        'hash': data,
                    },
                });
            }
            return data;
        } catch (err) {
            return commonUtil.handleError(err);
        }
    },
    /**
     * 获取转移token
     * @param {object} params               [必须]参数对象
     * @param {string} params.srcAddress    [必须]源账户地址
     * @param {string} params.destAddress   [必须]目标账户地址
     * @param {string} params.amount        [必须]转移数量
     * @param {string} params.note          [可选]交易备注
     * @param {string} params.seqOffset     [可选]区块偏移量，当前区块高度+偏移量=交易最大打包高度
     * @return {object}
    **/
    async getSendTokenFee(params) {
        try {
            if (!commonUtil.objectCheck(params, {
                'srcAddress': 'string',
                'destAddress': 'string',
                'amount': 'string',
            }, {
                'note': 'string',
                'seqOffset': 'number'})) {
                return commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS);
            }
            let amo = commonUtil.unitConvert(
                params.amount, constUtil.BUILDIN_UNIT_IN, true);
            if (amo === null) {
                return (commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS));
            }
            let data = await net.txCalcTxFee(
                params.srcAddress, params.destAddress, amo, params.note, params.seqOffset);
            let tmp = commonUtil.unitConvert(data, constUtil.BUILDIN_UNIT_OUT);
            if (tmp === null) {
                return (commonUtil.packageError(
                    constUtil.ERRORS.ERR_HTTP_RESULT_ERR,
                    '(' + JSON.stringify(data) + ')'));
            } else {
                return ({
                    'errCode': constUtil.ERRORS.SUCCESS.CODE,
                    'msg': constUtil.ERRORS.SUCCESS.MSG,
                    'data': {
                        'fee': tmp,
                    },
                });
            }
        } catch (err) {
            return (commonUtil.handleError(err));
        }
    },
    /**
     * 获取联名账户列表
     * @param {object} params                       [必须]参数对象
     * @param {number} params.pageStartIndex        [必须]数据开始索引值
     * @param {number} params.pageSize              [必须]数据每页条数
     * @return {object}
    **/
    async getAccountList(params) {
        try {
            if (!commonUtil.objectCheck(params, {
                'pageStartIndex': 'number',
                'pageSize': 'number',
            })) {
                return (commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS));
            }
            let data = await historyRecord.getRelatedAccount(
                params.pageStartIndex, params.pageSize);
            return data;
        } catch (err) {
            return (commonUtil.handleError(err));
        }
    },
    /**
     * 获取交易列表
     * @param {object} params                       [必须]参数对象
     * @param {number} params.pageStartIndex        [必须]数据开始索引值
     * @param {number} params.pageSize              [必须]数据每页条数
     * @return {object}
    **/
    async getTxsList(params) {
        try {
            if (!commonUtil.objectCheck(params, {
                'pageStartIndex': 'number',
                'pageSize': 'number',
            })) {
                return (commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS));
            }
            let data = await historyRecord.getTransaction(
                params.pageStartIndex, params.pageSize);
            return (data);
        } catch (err) {
            return (commonUtil.handleError(err));
        }
    },
    /**
     * 注册事件回调函数
     * @param {object}   params                        [必须]参数对象
     * @param {string}   params.eventName              [必须]事件名称
     * @param {function} params.callback               [可选]回调函数(为空表示清除事件回调)
     * @return {object}
    **/
    async setCallback(params) {
        try {
            if (typeof params != 'object'
                || Array.isArray(params)
                || !Object.keys(params).includes('eventName')) {
                return (commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS));
            }
            if (Object.values(constUtil.EVENTS).includes(params.eventName)) {
                if (!Object.keys(params).includes('callback')
                    || params.callback === null) {
                        commonUtil.eventClear(params.eventName);
                } else {
                    commonUtil.eventAdd(params.eventName, params.callback);
                }
            }
            return (commonUtil.packageError(constUtil.ERRORS.SUCCESS));
        } catch (err) {
            return commonUtil.handleError(err);
        }
    },
    /**
     * 创建账户
     * @param {obejct} params                         [必须]参数对象
     * @param {string} params.srcAddress              [必须]源账户地址
     * @param {string} params.destAddress             [必须]目标账户地址
     * @param {string} params.feeLimit                [必须]扣除费用
     * @param {string} params.gasPrice                [必须]扣除费用
     * @param {string} params.balanceInit             [必须]转移给账户的初始费用
     *
     * @param {string} params.accountNick             [可选]账户昵称(昵称+密码 or 私钥二选一)
     * @param {string} params.pwd                     [可选]账户密码(昵称+密码 or 私钥二选一)
     * @param {string} params.privateKey              [可选]源账户私钥(昵称+密码 or 私钥二选一)
     *
     * @param {string} params.accountNickDest         [可选]账户昵称(昵称+密码 or 私钥二选一)
     * @param {string} params.pwdDest                 [可选]账户密码(昵称+密码 or 私钥二选一)
     * @param {string} params.privateKeyDest          [可选]源账户私钥(昵称+密码 or 私钥二选一)
     * 
     * @param {string} params.contract                [可选]合约内容
     * @param {string} params.note                    [可选]备注
     * @param {string} params.seqOffset               [可选]区块偏移量，当前区块高度+偏移量=交易最大打包高度
     * @param {array}  params.metadatas               [可选]元数据
     * @param {object|array} params.signers           [可选]签名地址列表
     * @param {number} params.weight                  [可选]账号权重
     * @param {array} params.threshold                [可选]账号门限
     * @return {object}
    **/
    async createAccount(params) {
        try {
            if (!commonUtil.objectCheck(params, {
                'srcAddress': 'string',
                'destAddress': 'string',
                'feeLimit': 'string',
                'gasPrice': 'string',
                'balanceInit': 'string',
            }, {
                    'contract': 'string',
                    'accountNick': 'string',
                    'pwd': 'string',
                    'privateKey': 'string',
                    'accountNickDest': 'string',
                    'pwdDest': 'string',
                    'privateKeyDest': 'string',
                    'note': 'string',
                    'seqOffset': 'number',
                    'metadatas': 'array',
                    'weight': 'number',
                    'threshold': 'object',
                })
                || typeof params.signers !== 'object') {
                throw commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS);
            }

            let signers = params.signers;
            if (Array.isArray(signers)) {
                let t = {};
                signers.forEach((ele) => {
                    t[ele['address']] = ele['weight'];
                });
                signers = t;
            }

            if (!params.hasOwnProperty('privateKey')
                || params.privateKey.length === 0) {
                if (params.hasOwnProperty('accountNick')
                    && params.hasOwnProperty('pwd')
                    && params.accountNick.length > 0 && params.pwd.length > 0) {
                    let result = await account.getAccountPrivKeyStr({
                        'accountNick': params.accountNick,
                        'pwd': params.pwd,
                    });
                    if (commonUtil.isSuccess(result)) {
                        if (result.hasOwnProperty('data')
                            && result.data.hasOwnProperty('privKeyStr')) {
                            params.privateKey = result.data.privKeyStr;
                        } else {
                            return commonUtil.packageError(
                                constUtil.ERRORS.ERR_UNKNOWN);
                        }
                    } else {
                        return result;
                    }
                } else {
                    return commonUtil.packageError(
                        constUtil.ERRORS.ERR_PARAMS);
                }
            }
            if (!params.hasOwnProperty('privateKeyDest')
                || params.privateKeyDest.length === 0) {
                if (params.hasOwnProperty('accountNickDest')
                    && params.hasOwnProperty('pwdDest')
                    && params.accountNickDest.length > 0 && params.pwdDest.length > 0) {
                    let result = await account.getAccountPrivKeyStr({
                        'accountNick': params.accountNickDest,
                        'pwd': params.pwdDest,
                    });
                    if (commonUtil.isSuccess(result)) {
                        if (result.hasOwnProperty('data')
                            && result.data.hasOwnProperty('privKeyStr')) {
                            params.privateKeyDest = result.data.privKeyStr;
                        } else {
                            return commonUtil.packageError(
                                constUtil.ERRORS.ERR_UNKNOWN);
                        }
                    } else {
                        return result;
                    }
                } else {
                    return commonUtil.packageError(
                        constUtil.ERRORS.ERR_PARAMS);
                }
            }
            let result = await net.txCreateAccount(
                params.srcAddress,
                params.destAddress,
                commonUtil.unitConvert(
                    params.feeLimit, constUtil.BUILDIN_UNIT_IN, true),
                commonUtil.unitConvert(
                    params.gasPrice, 0, true),
                commonUtil.unitConvert(
                    params.balanceInit, constUtil.BUILDIN_UNIT_IN, true),
                params.privateKey,
                params.privateKeyDest,
                params.metadatas,
                params.weight,
                params.threshold,
                signers,
                params.contract,
                params.note,
                params.seqOffset);
            return ({
                'errCode': constUtil.ERRORS.SUCCESS.CODE,
                'msg': constUtil.ERRORS.SUCCESS.MSG,
                'data': {
                    'hash': result,
                },
            });
        } catch (err) {
            return commonUtil.handleError(err);
        }
    },
    /**
      * 检查地址有效性
      * @param {object} params                     [必须]参数对象
      * @param {string} params.address             [必须]地址
      * @return {object}
     **/
    async checkAddress(params) {
        try {
            if (!commonUtil.objectCheck(params, {'address': 'string'})) {
                throw commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS);
            }
            let result = await commonUtil.isAddressLegal(params.address);
            if (result === null) {
                return (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
            } else if (result === false) {
                result = -1;
            } else if (result === true) {
                let data = await commonUtil.httpGetPromise(
                    '/getAccount?address='+params.address);
                data = JSON.parse(data);
                if (data.hasOwnProperty('error_code')) {
                    if (data.error_code === 0) {
                        result = 1;
                    } else {
                        result = 0;
                    }
                }
            }
            return ({
                'errCode': constUtil.ERRORS.SUCCESS.CODE,
                'msg': constUtil.ERRORS.SUCCESS.MSG,
                'data': {
                    'valid': result}});
        } catch (err) {
            return commonUtil.handleError(err);
        }
    },
    /**
     * 获取新地址，生成一个地址，不上链
     * @return {object}
    */
    async getNewAddress() {
        try {
            let data = await net.getNewAccount();
            if (commonUtil.objectCheck(data, {
                'address': 'string',
                'private_key': 'string'})) {
                    return ({
                        'errCode': constUtil.ERRORS.SUCCESS.CODE,
                        'msg': constUtil.ERRORS.SUCCESS.MSG,
                        'data': {
                            'address': data.address,
                            'privKey': data.private_key}});
            } else {
                return (commonUtil.packageError(constUtil.ERRORS.ERR_EXE));
            }
        } catch (err) {
            return commonUtil.handleError(err);
        }
    },
    /**
    * 交易签名
    * @param {object} params                    [必须]参数对象
    * @param {string} params.transactionString  [必须]交易字符串
    * @param {string} params.privateKey         [可选]账户私钥(私钥 or 昵称+密码)
    * @param {string} params.accountNick        [可选]账户昵称(私钥 or 昵称+密码)
    * @param {string} params.pwd                [可选]账户密码(私钥 or 昵称+密码)
    * @return {object}
   **/
    async transactionSign(params) {
        try {
            if (!commonUtil.objectCheck(params, {
                'transactionString': 'string'}, {
                'accountNick': 'string',
                'pwd': 'string',
                'privateKey': 'string'})) {
                throw commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS);
            }
            if (!params.hasOwnProperty('privateKey')
                || params.privateKey.length === 0) {
                    if (params.hasOwnProperty('accountNick')
                        && params.hasOwnProperty('pwd')
                        && params.accountNick.length > 0
                        && params.pwd.length > 0) {
                            let result = await account.getAccountPrivKeyStr({
                                'accountNick': params.accountNick,
                                'pwd': params.pwd});
                            if (commonUtil.isSuccess(result)) {
                                if (result.hasOwnProperty('data')
                                    && result.data
                                        .hasOwnProperty('privKeyStr')) {
                                        params.privateKey =
                                            result.data.privKeyStr;
                                } else {
                                    return commonUtil.packageError(
                                        constUtil.ERRORS.ERR_UNKNOWN);
                                }
                            } else {
                                return result;
                            }
                        } else {
                            return commonUtil.packageError(
                                constUtil.ERRORS.ERR_PARAMS);
                        }
            }
            let result = await net.signTransaction(
                params.transactionString, undefined, undefined, params.privateKey);
            return ({
                'errCode': constUtil.ERRORS.SUCCESS.CODE,
                'msg': constUtil.ERRORS.SUCCESS.MSG,
                'data': {
                    'transactionString': result}});
        } catch (err) {
            return commonUtil.handleError(err);
        }
    },
    /**
      * 提交交易字符串
      * @param {object} params                      [必须]参数对象
      * @param {string} params.transactionString    [必须]交易字符串
      * @return {object}
     **/
    async transactionSubmit(params) {
        try {
            if (!commonUtil.objectCheck(params, {
                'transactionString': 'string'})) {
                throw commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS);
            }
            let result = await net.submitTransactionString(
                params.transactionString);
            return ({
                'errCode': constUtil.ERRORS.SUCCESS.CODE,
                'msg': constUtil.ERRORS.SUCCESS.MSG,
                'data': {
                    'hash': result}});
        } catch (err) {
            return commonUtil.handleError(err);
        }
    },
    /**
      * 解析交易
      * @param {obejct} params                      [必须]参数对象
      * @param {string} params.transactionString    [必须]交易字符串
      * @return {object}
     **/
    async transactionResolve(params) {
        try {
            if (!commonUtil.objectCheck(params, {
                'transactionString': 'string'})) {
                throw commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS);
            }
            let trans = await net.getTransactionData(params.transactionString);
            if (trans === null) {
                return commonUtil.packageError(
                    constUtil.ERRORS.ERR_TX_STR_INVALID);
            }
            if (trans.hasOwnProperty('fee')) {
                trans.fee = commonUtil.unitConvert(
                    trans.fee, constUtil.BUILDIN_UNIT_OUT);
            }

            switch (trans.tx.ops[0].type) {
                case 'paycoin':
                    return ({
                        'errCode': constUtil.ERRORS.SUCCESS.CODE,
                        'msg': constUtil.ERRORS.SUCCESS.MSG,
                        'data': {
                            'type': 'paycoin',
                            'params': {
                                'srcAddress': trans.tx.srcAddress,
                                'nonce': trans.tx.nonce,
                                'hash': trans.tx.hash,
                                'feeLimit': commonUtil.unitConvert(
                                    trans.tx.feeLimit, constUtil.BUILDIN_UNIT_OUT),
                                'gasPrice': trans.tx.gasPrice,
                                'note': trans.tx.note,
                                'destAddress': trans.tx.ops[0]['params']['destAddress'],
                                'amount': commonUtil.unitConvert(
                                    trans.tx.ops[0]['params']['amount'],
                                    constUtil.BUILDIN_UNIT_OUT),
                                'isIn': 1,
                            },
                            'signers': trans.sign}});
                case 'metadata':
                    return ({
                        'errCode': constUtil.ERRORS.SUCCESS.CODE,
                        'msg': constUtil.ERRORS.SUCCESS.MSG,
                        'data': {
                            'type': 'setMetadata',
                            'params': {
                                'srcAddress': trans.tx.srcAddress,
                                'nonce': trans.tx.nonce,
                                'hash': trans.tx.hash,
                                'feeLimit': commonUtil.unitConvert(
                                    trans.tx.feeLimit, constUtil.BUILDIN_UNIT_OUT),
                                'gasPrice': trans.tx.gasPrice,
                                'note': trans.tx.note,
                                'key': trans.tx.ops[0]['params']['key'],
                                'value': trans.tx.ops[0]['params']['value'],
                                'version': trans.tx.ops[0]['params']['version'],
                            },
                            'signers': trans.sign}});
            }
        } catch (err) {
            return commonUtil.handleError(err);
        }
    },
    /**
     * 交易统一处理接口，获取交易费、获取交易blob、提交交易
     * @param {object}    params                   [必须]参数对象
     *
     * @param {string}    params.type              [必须]处理类型
     *                                  (fee:获取交易费用, blob:获取交易blob, deal:提交交易)
     * @param {string}    params.srcAddress        [必须]源账户地址
     * @param {string}    params.feeLimit          [必须]交易手续费
     * @param {string}    params.gasPrice          [必须]交易手续费
     * @param {string}    params.accountNick       [可选]源账户昵称(昵称+密码 or 私钥)
     * @param {string}    params.pwd               [可选]源账户密码(昵称+密码 or 私钥)
     * @param {string}    params.privateKey        [可选]源账户私钥(昵称+密码 or 私钥)
     * @param {string}    params.note              [可选]交易备注
     * @param {number}    params.seqOffset         [可选]区块偏移量，当前区块高度+偏移量=交易最大打包高度
     * @param {array}     params.ops               [必须]交易数组
     * @param {string}    params.ops[].type        [必须]交易类型
     *                                              (create:创建账号
     *                                              metadata:设置元数据
     *                                              paycoin:转移token
     *                                              privilege:设置账户权限)
     * @param {object}    params.ops[].params      [必须]交易参数(和交易有关)
     *
     * 创建账号的交易参数
     * @param {string}       params.ops[].params.destAddress   [必须]目标账户地址
     * @param {string}       params.ops[].params.balanceInit   [必须]转移给新账户的初始费用
     * @param {string}       params.ops[].params.contract      [可选]合约内容
     * @param {object}       params.ops[].params.metadatas     [可选]元数据
     * @param {object|array} params.ops[].params.signers       [可选]签名地址列表
     * @param {number}       params.ops[].params.weight        [可选]账号权重
     * @param {object}       params.ops[].params.threshold     [可选]账号门限
     *
     * 转移token的交易参数
     * @param {string}       params.ops[].params.destAddress    [必须]目标账户地址
     * @param {string}       params.ops[].params.amount         [必须]转移数量
     *
     * 发行资产的交易参数
     * @param {string}       params.ops[].params.amount         [必须]发行数量
     * @param {string}       params.ops[].params.code           [必须]发行代码
     *
     * 转移资产的交易参数
     * @param {string}       params.ops[].params.destAddress    [必须]目标账户地址
     * @param {string}       params.ops[].params.amount         [必须]转移数量
     * @param {string}       params.ops[].params.issuer         [必须]资产发行地址
     * @param {string}       params.ops[].params.code           [必须]资产代码
     *
     * 设置元数据的交易参数
     * @param {string}       params.ops[].params.key            [必须]元数据键
     * @param {string}       params.ops[].params.value          [可选]元数据值
     * @param {string}       params.ops[].params.version        [可选]元数据版本
     *
     * 设置账户权限
     * @param {string}       params.ops[].params.masterWeight               [可选]账户自身权重
     * @param {string}       params.ops[].params.txThreshold                [可选]账户发起交易的门限
     * @param {array}        params.ops[].params.signers                    [可选]权重列表
     * @param {string}       params.ops[].params.signers[].address          [必须]账户地址
     * @param {number}       params.ops[].params.signers[].weight           [必须]地址对应的权重
     * @param {array}        params.ops[].params.typeThresholds             [可选]门限列表
     * @param {number}       params.ops[].params.typeThresholds[].type      [必须]交易类型
     * @param {number}       params.ops[].params.typeThresholds[].threshold [必须]交易对应的门限
     *
     * @return {object}
     *
    **/
    async transaction(params) {
        try {
            if (!commonUtil.objectCheck(params, {
                'type': 'string',
                'srcAddress': 'string',
                'feeLimit': 'string',
                'gasPrice': 'string',
                'ops': 'array'}, {
                'note': 'string',
                'seqOffset': 'number',
                'accountNick': 'string',
                'pwd': 'string',
                'privateKey': 'string'})) {
                    throw commonUtil.packageError(constUtil.ERRORS.ERR_PARAMS);
            }
            // prepare private key
            let privateKey = '';
            if (params.hasOwnProperty('privateKey')
                && params.privateKey.length > 0) {
                    privateKey = params.privateKey;
            } else if (
                params.hasOwnProperty('accountNick')
                && params.accountNick.length > 0
                && params.hasOwnProperty('pwd')
                && params.pwd.length > 0) {
                    let result = await account.getAccountPrivKeyStr({
                        'accountNick': params.accountNick,
                        'pwd': params.pwd});
                    if (commonUtil.isSuccess(result)) {
                        privateKey = result.data.privKeyStr;
                    } else {
                        throw (commonUtil.packageError(
                            constUtil.ERRORS.ERR_FILE_DECODE));
                    }
            }
            let p = [];
            params.ops.forEach((element) => {
                if (!commonUtil.objectCheck(element, {
                    'type': 'string',
                    'params': 'object'})) {
                        return;
                }
                switch (element.type) {
                    case 'create':
                        if (commonUtil.objectCheck(element.params, {
                            'destAddress': 'string',
                            'balanceInit': 'string'}, {
                            'contract': 'string',
                            'metadatas': 'object',
                            'weight': 'number',
                        })) {
                            let signers = element.params.signers;
                            if (element.params.hasOwnProperty('signers')
                                && (typeof signers === 'object')) {
                                    if (Array.isArray(signers)) {
                                        let t = {};
                                        signers.forEach((ele)=>{
                                            t[ele['address']] = ele['weight'];
                                        });
                                        signers = t;
                                    }
                            }
                            p.push([constUtil.TX_TYPE.CREATE.TYPE, {
                                'dest': element.params.destAddress,
                                'balanceInit': commonUtil.unitConvert(
                                    element.params.balanceInit,
                                    constUtil.BUILDIN_UNIT_IN, true),
                                'metadatas': element.params.metadatas,
                                'contract': element.params.contract,
                                'weight': element.params.weight}]);
                        }
                        break;
                    case 'paycoin':
                        if (commonUtil.objectCheck(element.params, {
                            'destAddress': 'string',
                            'amount': 'string'})) {
                                p.push([constUtil.TX_TYPE.PAYCOIN.TYPE, {
                                    'dest': element.params.destAddress,
                                    'amount': commonUtil.unitConvert(
                                        element.params.amount,
                                        constUtil.BUILDIN_UNIT_IN, true),
                                }]);
                        }
                        break;
                    case 'payment':
                        if (commonUtil.objectCheck(element.params, {
                            'destAddress': 'string',
                            'amount': 'string',
                            'issuer': 'string',
                            'code': 'string'})) {
                                p.push([constUtil.TX_TYPE.PAYMENT.TYPE, {
                                    'dest': element.params.destAddress,
                                    'amount': commonUtil.unitConvert(
                                        element.params.amount,
                                        0, true),
                                    'issuer': element.params.issuer,
                                    'code': element.params.code,
                                }]);
                        }
                        break;
                    case 'issue':
                        if (commonUtil.objectCheck(element.params, {
                            'code': 'string',
                            'amount': 'string'})) {
                                p.push([constUtil.TX_TYPE.ISSUE.TYPE, {
                                    'code': element.params.code,
                                    'amount': commonUtil.unitConvert(
                                        element.params.amount,
                                        0, true),
                                }]);
                        }
                        break;
                    case 'metadata':
                        if (commonUtil.objectCheck(element.params, {
                            'key': 'string'}, {
                            'value': 'string',
                            'version': 'number'})) {
                                let t = {'key': element.params.key}
                                if (element.params.hasOwnProperty('value')) {
                                    t['value'] = element.params.value;
                                }
                                if (element.params.hasOwnProperty('version')) {
                                    t['version'] = element.params.version;
                                }
                                p.push([constUtil.TX_TYPE.METADATA.TYPE, t]);
                            }
                        break;
                    case 'privilege':
                        if (commonUtil.objectCheck(element.params, {}, {
                            'masterWeight': 'string',
                            'signers': 'array',
                            'txThreshold': 'string',
                            'typeThresholds': 'array',
                            'srcAddress': 'string'})) {
                                let t = {};
                                if (element.params.hasOwnProperty('masterWeight')) {
                                    t.masterWeight = element.params.masterWeight;
                                }
                                if (element.params.hasOwnProperty('txThreshold')) {
                                    t.txThreshold = element.params.txThreshold;
                                }
                                if (element.params.hasOwnProperty('srcAddress')) {
                                    t.srcAddress = element.params.srcAddress;
                                }
                                if (element.params.hasOwnProperty('signers')
                                    && element.params.signers.length > 0) {
                                    t.signers = [];
                                    for (let i = 0; i < element.params.signers.length; i++) {
                                        if (commonUtil.objectCheck(element.params.signers[i], {
                                            'address': 'string',
                                            'weight': 'number'})) {
                                                t.signers.push({
                                                    'address': element.params.signers[i].address,
                                                    'weight': element.params.signers[i].weight});
                                            }
                                    }
                                }
                                if (element.params.hasOwnProperty('typeThresholds')
                                    && element.params.typeThresholds.length > 0) {
                                    t.typeThresholds = [];
                                    for (let i = 0; i < element.params.typeThresholds.length; i++) {
                                        if (commonUtil.objectCheck(element.params.typeThresholds[i], {
                                            'type': 'number',
                                            'threshold': 'number'})) {
                                                t.typeThresholds.push({
                                                    'type': element.params.typeThresholds[i].type,
                                                    'threshold': element.params.typeThresholds[i].threshold});
                                            }
                                    }
                                }
                                if (t !== null) {
                                    p.push([constUtil.TX_TYPE.PRIVILEGE.TYPE, t]);
                                }
                            }
                        break;
                    default: return;
                }
            });
            if (p.length === 0) {
                throw (commonUtil.packageError(constUtil.ERRORS.ERR_TX_NO_OPS));
            }
            let result = await net.dealTransaction(
                params.type,
                params.srcAddress,
                commonUtil.unitConvert(
                    params.feeLimit, constUtil.BUILDIN_UNIT_IN, true),
                commonUtil.unitConvert(
                    params.gasPrice, 0, true),
                privateKey,
                params.note,
                params.seqOffset,
                p);
            switch (params.type) {
                case 'fee': return ({
                    'errCode': constUtil.ERRORS.SUCCESS.CODE,
                    'msg': constUtil.ERRORS.SUCCESS.MSG,
                    'data': {
                        'fee': commonUtil.unitConvert(
                            result, constUtil.BUILDIN_UNIT_OUT)}}); break;
                case 'blob': return ({
                    'errCode': constUtil.ERRORS.SUCCESS.CODE,
                    'msg': constUtil.ERRORS.SUCCESS.MSG,
                    'data': {
                        'blob': result,
                        'transactionString':
                            net.getTransactionString(result)}}); break;
                case 'deal': return ({
                    'errCode': constUtil.ERRORS.SUCCESS.CODE,
                    'msg': constUtil.ERRORS.SUCCESS.MSG,
                    'data': {
                        'hash': result}}); break;
                default: return result;
            }
        } catch (err) {
            return commonUtil.handleError(err);
        }
    },
};
