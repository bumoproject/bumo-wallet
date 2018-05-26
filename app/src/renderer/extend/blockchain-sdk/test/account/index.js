/* eslint no-invalid-this: "error" */
const expect = require('chai').expect;
import constUtil from '../../lib/constants';
import commonUtil from '../../lib/util';
import account from '../../lib/account/index';
import tx from '../../lib/tx/index';
import JSONBig from 'json-bigint';
import proc from 'child_process';
import conf from '../../config';
import fs from 'fs';

let innerConf = {
    'displayReturn': true,
    'displayErrors': true};

tx.setCallback({
    'eventName': 'error', 'callback': function(data) {
        if (innerConf.displayErrors) {
            let msg = JSON.parse(data.message);
            if (msg.hasOwnProperty('stack')) {
                console.log(data.position);
                console.log(msg.stack);
            } else {
                console.log(msg);
            }
        }
    }});

let testNick = ['accountTest1'];
let testNickImport = ['accountTestImport1'];
let nick = {};
let password = '123456';
let balanceCheck = ['buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3'];
let dirNameForSave = conf.account_store + '/saveForTest';

before(function() {
    testNick.forEach((element) => {
        if (fs.existsSync(commonUtil.getWalletAccountFilePath(element))) {
            fs.unlinkSync(commonUtil.getWalletAccountFilePath(element));
        }
    });
    testNickImport.forEach((element) => {
        if (fs.existsSync(commonUtil.getWalletAccountFilePath(element))) {
            fs.unlinkSync(commonUtil.getWalletAccountFilePath(element));
        }
    });
    if (fs.existsSync(dirNameForSave)) {
        fs.readdirSync(dirNameForSave).forEach((file) => {
            fs.unlinkSync(dirNameForSave + '/' + file);
        });
        fs.rmdirSync(dirNameForSave);
    }
    for (let i = 0; i < testNickImport.length; i++) {
        let info = proc.spawnSync(
            conf.sync_node_path, ['--create-account', 'ed25519']);
        info = JSON.parse(info.stdout.toString());
        nick[testNickImport[i]] = {
            'address': info.address,
            'public': info.public_key,
            'private': info.private_key};
    }
});

after(function() {
    if (fs.existsSync(dirNameForSave)) {
        fs.readdirSync(dirNameForSave).forEach((file) => {
            fs.unlinkSync(dirNameForSave + '/' + file);
        });
        fs.rmdirSync(dirNameForSave);
    }
    testNick.forEach((element) => {
        if (fs.existsSync(commonUtil.getWalletAccountFilePath(element))) {
            fs.unlinkSync(commonUtil.getWalletAccountFilePath(element));
        }
    });
    testNickImport.forEach((element) => {
        if (fs.existsSync(commonUtil.getWalletAccountFilePath(element))) {
            fs.unlinkSync(commonUtil.getWalletAccountFilePath(element));
        }
    });
    tx.stopPeer();
});

describe('account', function() {
    describe('create', function() {
        this.timeout(3000);
        it('create', async function() {
            for (let i = 0; i < testNick.length; i++) {
                let ret = await account.create({
                    'accountNick': testNick[i],
                    'pwd': password});
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                }
                expect(ret).to.have.all.keys('errCode', 'msg', 'data');
                expect(ret.errCode).to.equal(constUtil.ERRORS.SUCCESS.CODE);
                expect(ret.data).to.have.all.keys('nick', 'address', 'privKey');
                expect(ret.data.nick).to.equal(testNick[i]);
                expect(ret.data.address).to.have.length(36);
            }
        });
        it('create with the same nick', async function() {
            for (let i = 0; i < testNick.length; i++) {
                let ret = await account.create({
                    'accountNick': testNick[i],
                    'pwd': password});
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                }
                expect(ret).to.have.all.keys('errCode', 'msg');
                expect(ret.errCode).to.equal(
                    constUtil.ERRORS.ERR_NICKNAME_EXISTS.CODE);
            }
        });
        it('create with empty nick', async function() {
            for (let i = 0; i < testNick.length; i++) {
                let ret = await account.create({
                    'accountNick': '',
                    'pwd': password});
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                }
                expect(ret).to.have.all.keys('errCode', 'msg');
                expect(ret.errCode).to.equal(constUtil.ERRORS.ERR_PARAMS.CODE);
            }
        });
        it('create with empty password', async function() {
            for (let i = 0; i < testNick.length; i++) {
                let ret = await account.create({
                    'accountNick': '',
                    'pwd': password});
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                };
                expect(ret).to.have.all.keys('errCode', 'msg');
                expect(ret.errCode).to.equal(constUtil.ERRORS.ERR_PARAMS.CODE);
            }
        });
        it('create with empty nick and password', async function() {
            for (let i = 0; i < testNick.length; i++) {
                let ret = await account.create({
                    'accountNick': '',
                    'pwd': ''});
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                }
                expect(ret).to.have.all.keys('errCode', 'msg');
                expect(ret.errCode).to.equal(constUtil.ERRORS.ERR_PARAMS.CODE);
            }
        });
        it('create without nick', async function() {
            for (let i = 0; i < testNick.length; i++) {
                let ret = await account.create({
                    'pwd': password});
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                }
                expect(ret).to.have.all.keys('errCode', 'msg');
                expect(ret.errCode).to.equal(constUtil.ERRORS.ERR_PARAMS.CODE);
            }
        });
        it('create without password', async function() {
            for (let i = 0; i < testNick.length; i++) {
                let ret = await account.create({
                    'accountNick': testNick[i]});
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                }
                expect(ret).to.have.all.keys('errCode', 'msg');
                expect(ret.errCode).to.equal(constUtil.ERRORS.ERR_PARAMS.CODE);
            }
        });
        it('create with an empty object', async function() {
            for (let i = 0; i < testNick.length; i++) {
                let ret = await account.create({});
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                }
                expect(ret).to.have.all.keys('errCode', 'msg');
                expect(ret.errCode).to.equal(constUtil.ERRORS.ERR_PARAMS.CODE);
            }
        });
        it('create with an empty array', async function() {
            for (let i = 0; i < testNick.length; i++) {
                let ret = await account.create([]);
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                }
                expect(ret).to.have.all.keys('errCode', 'msg');
                expect(ret.errCode).to.equal(constUtil.ERRORS.ERR_PARAMS.CODE);
            }
        });
    });

    describe('login', function() {
        it('login', async function() {
            for (let i = 0; i < testNick.length; i++) {
                let ret = await account.login({
                    'accountNick': testNick[i],
                    'pwd': password});
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                }
                expect(ret).to.have.all.keys('errCode', 'msg', 'data');
                expect(ret.errCode).to.equal(constUtil.ERRORS.SUCCESS.CODE);
                expect(ret.data).to.have.all.keys('nick', 'address');
                expect(ret.data.nick).to.equal(testNick[i]);
                expect(ret.data.address).to.have.length(36);
            }
        });
        it('login with incorrect password', async function() {
            for (let i = 0; i < testNick.length; i++) {
                let ret = await account.login({
                    'accountNick': testNick[i],
                    'pwd': password + '0'});
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                }
                expect(ret).to.have.all.keys('errCode', 'msg');
                expect(ret.errCode).to.equal(
                    constUtil.ERRORS.ERR_FILE_DECODE.CODE);
            }
        });
    });

    describe('loadWalletName', function() {
        it('loadWalletName', async function() {
            let ret = await account.loadWalletName();
            if (innerConf.displayReturn) {
                console.log(JSON.stringify(ret));
            }
            expect(ret).to.all.keys('errCode', 'msg', 'data');
            expect(ret.errCode).to.equal(constUtil.ERRORS.SUCCESS.CODE);
            let files = commonUtil.getWalletAccount();
            expect(JSON.stringify(ret.data)).to.equal(JSON.stringify(files));
        });
    });

    describe('importAccountPrivStr', function() {
        it('importAccountPrivStr', async function() {
            for (let i = 0; i < testNickImport.length; i++) {
                let ret = await account.importAccountPrivStr({
                    'accountNick': testNickImport[i],
                    'pwd': password,
                    'privKeyStr': nick[testNickImport[i]].private});
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                }
                expect(ret).to.have.all.keys('errCode', 'msg', 'data');
                expect(ret.errCode).to.equal(constUtil.ERRORS.SUCCESS.CODE);
                expect(ret.data).to.have.all.keys('nick', 'address', 'private');
                expect(ret.data.nick).to.equal(testNickImport[i]);
                expect(ret.data.address).to.have.length(36);
            }
        });
    });

    describe('saveAccountPrivKeyFile', function() {
        it('saveAccountPrivKeyFile', async function() {
            if (!fs.existsSync(dirNameForSave)) {
                fs.mkdirSync(dirNameForSave);
            }
            for (let i = 0; i < testNickImport.length; i++) {
                let ret = await account.saveAccountPrivKeyFile({
                    'accountNick': testNickImport[i],
                    'savePrivPath': dirNameForSave + '/' + testNickImport[i]});
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                }
                expect(ret).to.have.all.keys('errCode', 'msg');
                expect(ret.errCode).to.equal(constUtil.ERRORS.SUCCESS.CODE);
                let dataOrigin = fs.readFileSync(
                    commonUtil.getWalletAccountFilePath(testNickImport[i]))
                        .toString();
                let dataCopy = fs.readFileSync(
                    dirNameForSave + '/' + testNickImport[i]).toString();
                expect(dataOrigin).to.equal(dataCopy);
            }
        });
    });

    describe('importAccountPrivFile', function() {
        this.timeout(3000);
        it('importAccountPrivFile', async function() {
            testNickImport.forEach((element) => {
                if (fs.existsSync(
                    commonUtil.getWalletAccountFilePath(element))) {
                        fs.unlinkSync(
                            commonUtil.getWalletAccountFilePath(element));
                }
            });
            for (let i = 0; i < testNickImport.length; i++) {
                let ret = await account.importAccountPrivFile({
                    'accountNick': testNickImport[i],
                    'pwd': password,
                    'privKeyFile': dirNameForSave + '/' + testNickImport[i]});
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                }
                expect(ret).to.have.all.keys('errCode', 'msg', 'data');
                expect(ret.errCode).to.equal(constUtil.ERRORS.SUCCESS.CODE);
                expect(ret.data).to.have.all.keys('nick', 'address');
                expect(ret.data.nick).to.equal(testNickImport[i]);
                expect(ret.data.address).to.have.length(36);
            }
        });
    });

    describe('getAccountPrivKeyStr', function() {
        it('getAccountPrivKeyStr', async function() {
            for (let i = 0; i < testNickImport.length; i++) {
                let ret = await account.getAccountPrivKeyStr({
                    'accountNick': testNickImport[i],
                    'pwd': password});
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                }
                expect(ret).to.have.all.keys('errCode', 'msg', 'data');
                expect(ret.errCode).to.equal(constUtil.ERRORS.SUCCESS.CODE);
                expect(ret.data).to.have.all.keys('privKeyStr');
                expect(ret.data.privKeyStr).to.equal(
                    nick[testNickImport[i]].private);
            }
        });
    });

    describe('getAccountTokenBalance', function() {
        it('getAccountTokenBalance', async function() {
            for (let i = 0; i < balanceCheck.length; i++) {
                let balance = await commonUtil.httpGetPromise(
                    '/getAccountBase?address=' + balanceCheck[i]);
                balance = JSONBig.parse(balance);
                if (!balance.hasOwnProperty('result')) {
                    continue;
                }
                balance = commonUtil.unitConvert(
                    balance.result.balance.toString(),
                    constUtil.BUILDIN_UNIT_OUT);
                let reserve = await commonUtil.httpGetPromise(
                    '/getLedger?with_fee=true');
                reserve = JSONBig.parse(reserve);
                if (reserve.hasOwnProperty('fees')
                    && reserve.fees.hasOwnProperty('base_reserve')) {
                        reserve = commonUtil.unitConvert(
                            reserve.fees.base_reserve.toString(),
                            constUtil.BUILDIN_UNIT_OUT);
                } else {
                    continue;
                }
                let ret = await account.getAccountTokenBalance({
                    'address': balanceCheck[i]});
                if (innerConf.displayReturn) {
                    console.log(JSON.stringify(ret));
                }
                expect(ret).to.have.all.keys('errCode', 'msg', 'data');
                expect(ret.errCode).to.equal(constUtil.ERRORS.SUCCESS.CODE);
                expect(ret.data).to.have.all.keys(
                    'amount', 'reserve', 'assetCodeAlias');
                expect(ret.data.assetCodeAlias).to.equal('BU');
                expect(ret.data.amount).to.equal(balance);
                expect(ret.data.reserve).to.equal(reserve);
            }
        });
    });
});
