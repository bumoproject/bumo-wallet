export default {
  'ERRORS': {
    'SUCCESS': {
      'CODE': 0,
      'MSG': 'success'
    },
    'ERR_PARAMS': {
      'CODE': 1,
      'MSG': 'invalid parameters'
    },
    'ERR_NICKNAME_EXISTS': {
      'CODE': 2,
      'MSG': 'nickname exists'
    },
    'ERR_FILE_DECODE': {
      'CODE': 3,
      'MSG': 'private key file decode failed'
    },
    'ERR_FILE_SAVE': {
      'CODE': 4,
      'MSG': 'private key file save failed'
    },
    'ERR_HTTP_INVALID': {
      'CODE': 5,
      'MSG': 'http server invalid'
    },
    'ERR_HTTP_UNEXPECTED': {
      'CODE': 6,
      'MSG': 'http request unexpected data'
    },
    'ERR_HTTP_RESULT_ERR': {
      'CODE': 7,
      'MSG': 'http request returned error'
    },
    'ERR_KEY_INVALID': {
      'CODE': 8,
      'MSG': 'private key is invalid'
    },
    'ERR_HISTORY_FAILD': {
      'CODE': 9,
      'MSG': 'get history transaction failed'
    },
    'ERR_TX_OP_EMPTY': {
      'CODE': 10,
      'MSG': 'the operations is empty'
    },
    'ERR_NO_LOGIN': {
      'CODE': 11,
      'MSG': 'operate need login'
    },
    'ERR_CONVERT_HEX': {
      'CODE': 12,
      'MSG': 'error occured when convert hex string'
    },
    'ERR_EXE': {
      'CODE': 13,
      'MSG': 'get data from program faild'
    },
    'ERR_SAVE_PATH': {
      'CODE': 14,
      'MSG': 'the path for saving account file is invalid'
    },
    'ERR_NICKNAME_NOT_EXISTS': {
      'CODE': 15,
      'MSG': 'nickname not exists'
    },
    'ERR_PATH_NOT_EXISTS': {
      'CODE': 16,
      'MSG': 'path not exists'
    },
    'ERR_BLOB_INVALID': {
      'CODE': 17,
      'MSG': 'invalid blob data'
    },
    'ERR_TX_NO_KEY': {
      'CODE': 18,
      'MSG': 'no valid private key to start transaction'
    },
    'ERR_TX_NO_OPS': {
      'CODE': 19,
      'MSG': 'no valid operations to start transaction'
    },
    'ERR_TX_STR_INVALID': {
      'CODE': 20,
      'MSG': 'transaction string resolve faild'
    },
    'ERR_LOW_BALANCE': {
      'CODE': 21,
      'MSG': 'Source account not enough balance for transaction'
    },
    'ERR_ADDR_NOT_EXISTS': {
      'CODE': 22,
      'MSG': 'the address should be create before making a transaction'
    },
    'ERR_TX_STR_TIMEOUT': {
      'CODE': 23,
      'MSG': 'tx timeout, limit ledger seq less than current ledger seq'
    },
    'ERR_TX_NO_ENOUGH_WEIGHT': {
      'CODE': 24,
      'MSG': 'tx signatures not enough weight'
    },
    'ERR_TX_NONCE_INVALID': {
      'CODE': 25,
      'MSG': 'transaction submit duplicate'
    },
    'ERR_TX_LOW_FEE': {
      'CODE': 26,
      'MSG': 'transaction has not enough fee'
    },

    // js common system errors
    'ERR_EACCES': {
      'CODE': 100,
      'MSG': 'Permission denied'
    },
    'ERR_EADDRINUSE': {
      'CODE': 101,
      'MSG': 'Address already in use'
    },
    'ERR_ECONNREFUSED': {
      'CODE': 102,
      'MSG': 'Connection refused'
    },
    'ERR_ECONNRESET': {
      'CODE': 103,
      'MSG': 'Connection reset by peer'
    },
    'ERR_EEXIST': {
      'CODE': 104,
      'MSG': 'File exists'
    },
    'ERR_EISDIR': {
      'CODE': 105,
      'MSG': 'Is a directory'
    },
    'ERR_EMFILE': {
      'CODE': 106,
      'MSG': 'Too many open files in system'
    },
    'ERR_ENOENT': {
      'CODE': 107,
      'MSG': 'No such file or directory'
    },
    'ERR_ENOTDIR': {
      'CODE': 108,
      'MSG': 'Not a directory'
    },
    'ERR_ENOTEMPTY': {
      'CODE': 109,
      'MSG': 'Directory not empty'
    },
    'ERR_EPERM': {
      'CODE': 110,
      'MSG': 'Operation not permitted'
    },
    'ERR_EPIPE': {
      'CODE': 111,
      'MSG': 'Broken pipe'
    },
    'ERR_ETIMEDOUT': {
      'CODE': 112,
      'MSG': 'Operation timed out'
    },
    'ERR_TX_INSERT_QUEUE_FAIL': {
      'CODE': 113,
      'MSG': 'Fail to insert the TX into buffer'
    },
    'ERR_UNKNOWN': {
      'CODE': 404,
      'MSG': 'unknown error occured'
    },
  },
  'EVENTS': {
    'TX_SUBMIT': 'tx_submit',
    'TX_STATUS_PEND': 'tx_status_pend',
    'TX_STATUS_COMP': 'tx_status_comp',
    'TX_STATUS_FAIL': 'tx_status_fail',
    'LEDGER_HEADER': 'ledger_header',
    'PEER_CONNECTIONS': 'peer_connections',
    'ERROR': 'error',
    'INFO': 'info',
    'HTTP_REQUEST': 'http_request',
    'HTTP_RESPONSE': 'http_response',
    'WS_OPEN': 'ws_open',
    'WS_CLOSE': 'ws_close',
    'WS_ERROR': 'ws_error',
    'WS_RECV': 'ws_recv',
    'WS_SEND': 'ws_send',
    'NODE_CONSOLE_RESPOSE': 'node_console_respose',
    'NODE_CONSOLE_REQUEST': 'node_console_request',
  },
  'TX_TYPE': {
    'CREATE': {
      'TYPE': 1,
      'NAME': 'CREATE_ACCOUNT'
    },
    'ISSUE': {
      'TYPE': 2,
      'NAME': 'ISSUE_ASSET'
    },
    'PAYASSET': {
      'TYPE': 3,
      'NAME': 'PAY_ASSET'
    },
    'METADATA': {
      'TYPE': 4,
      'NAME': 'SET_METADATA'
    },
    'PAYCOIN': {
      'TYPE': 7,
      'NAME': 'PAY_COIN'
    },
    'PRIVILEGE': {
      'TYPE': 9,
      'NAME': 'SET_PRIVILEGE'
    },
  },
  'BUILDIN_UNIT_IN': 8,
  'BUILDIN_UNIT_OUT': -8,
};
