/* eslint max-len: ["error", { "ignoreComments": true }] */
/* eslint no-unused-vars: ["error", { "args": "none" }] */

import account from './lib/account/index';
import tx from './lib/tx/index';
import {setTimeout} from 'timers';
import commonUtil from './lib/util';
import constUtil from './lib/constants';
import fs, {mkdirSync} from 'fs';
import conf from './config';
import path from 'path';

import CryptoJS from 'crypto-js';
import {Buffer} from 'buffer';


tx.setCallback({
    'eventName': 'error', 'callback': function(data) {
        console.log('event error');
        let t = JSON.parse(data.message);
        if (t.hasOwnProperty('stack')) {
            console.log(t.stack);
        } else {
            console.log(data);
        }
    },
});
tx.setCallback({
    'eventName': 'info', 'callback': function(data) {
        console.log('event info');
        console.log(data);
    },
});
// tx.setCallback({
//     'eventName': 'tx_status_comp', 'callback': function(data) {
//         console.log('event tx_status_comp');
//         console.log(JSON.stringify(data));
//     },
// });
// tx.setCallback({
//     'eventName': 'tx_status_fail', 'callback': function(data) {
//         console.log('event tx_status_fail');
//         console.log(JSON.stringify(data));
//     },
// });
// tx.setCallback({'eventName': 'ws_recv', 'callback': function(data) {
//     console.log('event ws_recv');
//     console.log(data);
// }});
// tx.setCallback({'eventName': 'ws_send', 'callback': function(data) {
//     console.log('event ws_send');
//     console.log(data);
// }});
// tx.setCallback({'eventName': 'http_response', 'callback': function(data) {
//     if (data.url !== '/getModulesStatus') {
//         console.log('event http_response');
//         console.log(JSON.stringify(data));
//     }
// }});
// tx.setCallback({
//     'eventName': 'http_request', 'callback': function(data) {
//         if (data.url !== '/getModulesStatus') {
//             console.log('event http_request');
//             console.log(data);
//         }
//     }
// });
// tx.setCallback({
//     'eventName': 'ledger_header', 'callback': function(data) {
//         console.log('event ledger_header');
//         console.log(data);
//     },
// });
// tx.setCallback({
//     'eventName': 'peer_connections', 'callback': function(data) {
//         console.log('event peer_connections');
//         console.log(data);
//     },
// });

let data;
/**
 *
*/
async function RunAccountTest() {
    // data = await account.create({ accountNick: 'Allen666666', pwd: '123456' })
    // console.log('create'); console.log(data)
    // data = await account.login({ accountNick: 'Allen', pwd: '123456' })
    // console.log('login'); console.log(data)
    // data = await account.importAccountPrivStr({ accountNick: 'ImportStr', pwd: '123456', privKeyStr: 'privbvYfqQyG3kZyHE4RX4TYVa32htw8xG4WdpCTrymPUJQ923XkKVbM' })
    // console.log('importAccountPrivStr'); console.log(data)
    // data = await account.getAccountPrivKeyStr({ accountNick: 'ImportStr', pwd: '123456' })
    // console.log('getAccountPrivKeyStr'); console.log(data)
    // data = await account.loadWalletName()
    // console.log('loadWalletName'); console.log(data)
    // data = await account.saveAccountPrivKeyFile({ accountNick: 'Allen', savePrivPath: 'D:/AllenSave' })
    // console.log('saveAccountPrivKeyFile'); console.log(data)
    // data = await account.importAccountPrivFile({ accountNick: 'ImportTest', pwd: '123456', privKeyFile: 'D:/AllenSave' })
    // console.log('importAccountPrivFile'); console.log(data)
    // data = await account.getAccountTokenBalance({ address: 'buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3' })
    // console.log('getAccountTokenBalance'); console.log(data)
}

/**
 *
*/
async function RunHistoryTest() {
    data = await account.login({'accountNick': 'ImportStr', 'pwd': '123456'});
    try {
        data = await tx.getTxsList({
            'pageStartIndex': 0,
            'pageSize': 5});
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}

/**
 *
*/
async function RunOperationTest() {
    // data = await account.login({'accountNick': 'noteTest', 'pwd': '123456'});
    data = await account.login({'accountNick': 'tAccount', 'pwd': '123456'});
    console.log(data);
    try {
        // data = await tx.getSendTokenFee({
        //     'srcAddress': 'buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3',
        //     'destAddress': 'buQqv99Gqx3hfTWNbLxkrmXSZY9WhyQyUaTq',
        //     'amount': '3',
        //     'fee': '0'
        // });
        // console.log(data);

        // data = await tx.getSendTokenFee({
        //     srcAddress: 'buQqkrGLgjMHAE6vTXVyXugehjK8bX5wNtaC',
        //     destAddress: 'buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3',
        //     amount: '0.01',
        //     note: '转账',
        // });
        // console.log(data);

        // data = await tx.sendToken({
        //     accountNick: 'tAccount',
        //     pwd: '123456',
        //     srcAddress: 'buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3',
        //     destAddress: 'buQobZLmF73YH5tzkiTyL57XMguvPJUCQd6G',
        //     amount: '18',
        //     fee: '0.1',
        //     note: '测试b备注',
        // });
        // console.log(data);
        return;
        
        setInterval(async ()=>{
            data = await tx.getTxsList({
                'pageStartIndex': 0,
                'pageSize': 2});
            if (data.data.txs.length > 0) {
                console.log(data.data.tx);
                console.log(data.data.txs);
            } else {
                console.log(data);
            }
        }, 1000);
        return;

        setTimeout(async ()=>{
            data = await tx.getTxsList({
                "pageStartIndex": 0,
                "pageSize": 5
            });
            if (data.data.txs.length > 0) {
                console.log(data.data.tx);
                console.log(data.data.txs);
            } else {
                console.log(data);
            }
        }, 10000);

        // data = await tx.getTxsList({
        //     'pageStartIndex': 0,
        //     'pageSize': 10});
        // console.log(data.data.txs);
    } catch (err) {
        console.log('catch error');
        console.log(err);
    }
}

/**
 *
*/
async function RunUniteTransaction() {
    data = await account.login({'accountNick': 'tAccount', 'pwd': '123456'});
    console.log(data);
    try {
        // data = await tx.transaction({
        //     "type": "blob",
        //     "srcAddress": "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3",
        //     //"privateKey": "privbvYfqQyG3kZyHE4RX4TYVa32htw8xG4WdpCTrymPUJQ923XkKVbM",
        //     "accountNick": "ImportStr",
        //     "pwd": "123456",
        //     "fee": "0.5",
        //     "note": "测试",
        //     "ops": [
        //         {
        //             "type": "paycoin",
        //             "params": {
        //                 "destAddress": "buQnXQ3m2AFVTsMYwakyWZnS4Mivkpqc2VAj",
        //                 "amount": "0.5"
        //             }
        //         }
        //     ]
        // })

        data = await tx.transaction({
            'type': 'fee',
            'fee': '0',
            'srcAddress': 'buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3',
            'ops': [{
                'type': 'metadata',
                'params': {
                    'key': 'TestMD',
                    'value': '20',
                    'version': 3},
                },
            ]});
        console.log(data);

        data = await tx.transaction({
            'type': 'blob',
            'srcAddress': 'buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3',
            'fee': '0.1',
            'ops': [{
                'type': 'metadata',
                'params': {
                    'key': 'TestMD',
                    'value': '20',
                    'version': 3},
                },
            ]});
        console.log(data);

        data = await tx.transactionSign({
            'transactionString': data.data.transactionString,
            'accountNick': 'tAccount',
            'pwd': '123456',
        });
        console.log(data);

        data = await tx.transactionResolve({
            'transactionString': data.data.transactionString,
        });
        console.log(data.data);

        // data = await tx.transactionResolve({
        //     'transactionString': 'asoiduflkasjdfiowuerlkjwalkejsadf',
        // });
        // console.log(JSON.stringify(data));

        // let txStr = data.data.transactionString;

            // data = await tx.transactionSubmit({
            //     'transactionString': data.data.transactionString,
            // });
            // console.log(data);

            // data = await tx.transactionSubmit({
            //     'transactionString': txStr,
            // });
            // console.log(data);

            // data = await tx.transactionSubmit({
            //     'transactionString': txStr,
            // });
            // console.log(data);

            // console.log(txStr);

        // data = await tx.getTxsList({'pageStartIndex': 0, 'pageSize': 5});
        // console.log(data);
        // console.log(data.data.txs);


        // data = await tx.transactionSign({
        //     "transactionString": data.data.tx,
        //     "privateKey": "privbvYfqQyG3kZyHE4RX4TYVa32htw8xG4WdpCTrymPUJQ923XkKVbM"
        // });
        // console.log(data);

        // data = await tx.transactionResolve({
        //     "transactionString": data.data.transactionString
        // });
        // console.log(data.data);

        // data = await tx.transactionSubmit({
        //     "transactionString": data.data.transactionString
        // });
        // console.log(data);

        // data = await tx.transaction({
        //     "type": "blob",
        //     "srcAddress":'buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3',
        //     "fee":'1',
        //     //"privateKey":'privbvYfqQyG3kZyHE4RX4TYVa32htw8xG4WdpCTrymPUJQ923XkKVbM',
        //     "accountNick": "ImportStr",
        //     "pwd": "123456",
        //     "ops": [
        //         {
        //             "type": "create",
        //             "params": {
        //                 "destAddress": "buQsbaX6z1fXp3NEbmAsFBNushWFwc8NvJaX"
        //             }
        //         }
        //     ]
        // })
        // console.log(data)
    } catch (err) {
        console.log(err);
    }
}

/**
 *
*/
function unitConvertTest() {
    let strTesting = '12345678';
    for (let i = -strTesting.length*2; i < strTesting.length*2; i++) {
        console.log(commonUtil.unitConvert(strTesting, i, true));
    }
}

/**
 *
*/
async function TestAddressCheck() {
    data = await tx.checkAddress({'address': 'iouo213j4lk123'});
    console.log(data);
    data = await tx.checkAddress({'address': 'buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3'});
    console.log(data);
    data = await tx.checkAddress({'address': 'buQpdU5Xz1TyrhW8M1nYCjUbREh3kaTKtrdE'});
    console.log(data);
}

/** */
async function CreateAccount() {
    data = await account.importAccountPrivStr({
        'accountNick': 'tAccount',
        'pwd': '123456',
        'privKeyStr': 'privbvYfqQyG3kZyHE4RX4TYVa32htw8xG4WdpCTrymPUJQ923XkKVbM'});
    console.log('importAccountPrivStr'); console.log(data);
}

/**
 *
*/
async function TestCreatePublicAccount() {
    try {
        data = await account.login({'accountNick': 'tAccount', 'pwd': '123456'});
        console.log(data);
        // data = await tx.transaction({
        //     'type': 'fee',
        //     'srcAddress': 'buQqv99Gqx3hfTWNbLxkrmXSZY9WhyQyUaTq',
        //     'fee': '0.01',
        //     'accountNick': '区块小荷包',
        //     'pwd': '123456',
        //     'ops': [
        //         {
        //             'type': 'create',
        //             'params': {
        //                 'destAddress': 'buQehq1QfkHGAgE6EmjMtp9TrEwQMT7xWzjo',
        //                 'balanceInit': '0.1',
        //                 'threshold': {
        //                     'tx': '10',
        //                 },
        //                 'signers': [
        //                     {'address': 'buQezjPR7qPhimtPDQyqnhy59n7FJGJQKYXw', 'weight': 2},
        //                     {'address': 'buQczDezPeDwFjrV1A8rkMAUqku369SqdnRZ', 'weight': 8}],
        //                 'weight': 0,
        //             },
        //         },
        //     ],
        // });

        // data = await tx.createAccount(
        //     {
        //         'srcAddress': 'buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3',
        //         'fee': '0.01',
        //         'accountNick': 'tAccount',
        //         'pwd': '123456',
        //         'balanceInit': '0.1',
        //         'destAddress': 'buQdeXasjjSU8hjpErH4DfGctvhA8Jq9L7Ca',
        //         'threshold': {
        //             'tx': 10,
        //         },
        //         'signers': [
        //             {'address': 'buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3', 'weight': 10},
        //             {'address': 'buQezjPR7qPhimtPDQyqnhy59n7FJGJQKYXw', 'weight': 2},
        //             {'address': 'buQczDezPeDwFjrV1A8rkMAUqku369SqdnRZ', 'weight': 8}],
        //         'weight': 0,
        //     });
        // console.log(data);

        data = await tx.getAccountList({'pageStartIndex': 5, 'pageSize': 5});
        console.log((data.data));
    } catch (err) {
        console.log(err);
    }
}

/** */
async function TestSubscription() {
    // data = await account.importAccountPrivStr({'accountNick': 'subTest1', 'pwd': '123456', 'privKeyStr': 'privbt1JfDazRvL1LFYQxoPu2Pu9QrTPsfiWsdMhAvjqp6D1qT6MmUre'});
    
    data = await account.login({'accountNick': 'tAccount', 'pwd': '123456'});
    // data = await account.login({'accountNick': 'subTest1', 'pwd': '123456'});
    // data = await tx.sendToken({
    //     'accountNick': 'subTest1',
    //     'pwd': '123456',
    //     'srcAddress': 'buQhYJ6QBGJoMJm6AThuuCAGAyrf6pw7bXXB',
    //     'destAddress': 'buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3',
    //     'amount': '1',
    //     'fee': '0.1',
    // });
    // console.log(data);

    // data = await tx.createAccount(
    //     {
    //         'srcAddress': 'buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3',
    //         'fee': '0.1',
    //         'accountNick': 'tAccount',
    //         'pwd': '123456',
    //         'balanceInit': '100',
    //         'destAddress': 'buQhYJ6QBGJoMJm6AThuuCAGAyrf6pw7bXXB',
    //         'threshold': {
    //             'tx': '10',
    //         },
    //         'signers': [],
    //         'weight': 10,
    //     });
    // console.log(data);

    // data = await tx.sendToken({
    //     'accountNick': 'tAccount',
    //     'pwd': '123456',
    //     'srcAddress': 'buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3',
    //     'destAddress': 'buQhYJ6QBGJoMJm6AThuuCAGAyrf6pw7bXXB',
    //     'amount': '10',
    //     'fee': '0.1',
    // });
    // console.log(data);

    // data = await tx.getTxsList({
    //     'pageStartIndex': 0,
    //     'pageSize': 10,
    // });
    // console.log(data.data.txs);

    // setTimeout(async ()=>{
    //     data = await tx.getTxsList({
    //         'pageStartIndex': 0,
    //         'pageSize': 10,
    //     });
    //     console.log(data.data.txs);
    // }, 8000);

    // data = await tx.createAccount(
    //     {
    //         'srcAddress': 'buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3',
    //         'fee': '0.1',
    //         'accountNick': 'tAccount',
    //         'pwd': '123456',
    //         'balanceInit': '100',
    //         'destAddress': 'buQoXZyhKYowjGNNczgD82joJkNyQgedDwDN',
    //         'threshold': {
    //             'tx': '10',
    //         },
    //         'signers': [],
    //         'weight': 10,
    //     });

    // data = await tx.sendToken({
    //     'accountNick': 'subTest1',
    //     'pwd': '123456',
    //     'srcAddress': 'buQXYcpe1wKeMdZ8uSLW1QPkUXXsYKE3NFNS',
    //     'destAddress': 'buQoXZyhKYowjGNNczgD82joJkNyQgedDwDN',
    //     'fee': '0.1',
    //     'amount': '1',
    // });
    // console.log(data);
}

/** */
async function TestTxList() {
    data = await account.login({'accountNick': 'tAccount', 'pwd': '123456'});
    console.log(data);
    setInterval(async ()=>{
        data = await tx.getTxsList({
            'pageStartIndex': 0,
            'pageSize': 2,
        });
        console.log(data.data.txs);
    }, 1000);
}

// RunAccountTest()
// RunOperationTest()
// RunHistoryTest()
// TestEvent()
// unitConvertTest()
// RunUniteTransaction()

// TestAddressCheck()

// CreateAccount();
// TestCreatePublicAccount();

// TestSubscription();
// TestTxList()

// account.create({
//     'accountNick': 'bbb',
//     'pwd': '123456',
// }).then((data)=>{
//     console.log(data);
// });
