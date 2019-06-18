export default {
  ERRORS: {
    SUCCESS: {
      CODE: 0,
      MSG: '操作成功'
    },
    FAIL: {
      CODE: 1,
      MSG: '操作失败'
    },
    INVALID_ACCOUNT_PWD: {
      CODE: 100100,
      MSG: '钱包密码错误'
    },
    RECOVER_ACCOUNT_ERROR: {
      CODE: 100101,
      MSG: '无效私钥信息'
    },
    NICKNAME_EXISTS_ERROR: {
      CODE: 100102,
      MSG: '钱包名称已存在'
    },
    SAVE_ACCOUNT_PRIVATE_KEY_FIEL_ERROR: {
      CODE: 100103,
      MSG: '账户私钥文件导出失败'
    },
    CREATE_ACCOUNT_ERROR: {
      CODE: 100104,
      MSG: '创建钱包账户失败'
    },
    INVALID_ACCOUNT_ADDRESS: {
      CODE: 100105,
      MSG: '无效的账户地址'
    },
    NO_EXIST_ACCOUNT_ADDRESS: {
      CODE: 100106,
      MSG: '账户地址不存在'
    },
    SET_UNIT_WEIGHT_ERROR: {
      CODE: 100107,
      MSG: '该联名账户的签名账户权重值过小，不足管控该账户'
    },
    ACCOUNT_BU_TOKEN_NOT_ENOUGH_ERROR: {
      CODE: 100108,
      MSG: '账户BU余额不足'
    },
    ACCOUNT_NOT_ENOUGH_FOR_FEE_ERROR: {
      CODE: 100109,
      MSG: '账户BU余额不足支付本次交易的费用'
    },
    NOT_ACTIVE_ACCOUNT_ERROR: {
      CODE: 100110,
      MSG: '该账户地址未激活'
    },
    NOT_ADD_SIGNER_ACCOUNT_ERROR: {
      CODE: 100111,
      MSG: '该添加签名账户地址'
    },
    NOT_ENOUGH_WEIGHT_ERROR: {
      CODE: 100112,
      MSG: '账户权重不足，无法完成本次交易'
    },
    INVALID_TX_BLOB_STR_ERROR: {
      CODE: 100113,
      MSG: '无效的交易字符串'
    },
    ACCOUNT_LOW_RESERVE_ERROR: {
      CODE: 100114,
      MSG: '账户可用余额不足'
    },
    INVALID_TX_NONCE_ERROR: {
      CODE: 100115,
      MSG: '交易重复提交'
    },
    NOT_ENOUGH_TX_FEE_ERROR: {
      CODE: 100116,
      MSG: '交易费用不足'
    },
    TX_TIMEOUT_ERROR: {
      CODE: 100117,
      MSG: '交易超时'
    },
    SUBMIT_TX_ERROR: {
      CODE: 100118,
      MSG: '提交失败'
    },
    NOT_NORMAL_ACCOUNT: {
      CODE: 100119,
      MSG: '付款账户仅支持普通账户地址'
    },
    NOT_UNIT_ACCOUNT: {
      CODE: 100120,
      MSG: '付款账户仅支持联名账户地址'
    },
    NET_OFFLINE: {
      CODE: 100121,
      MSG: '网络不可用，请在联网情况下进行操作'
    },
    INSERT_TX_TO_BUFFER_FAIL: {
      CODE: 100122,
      MSG: '当前有交易正在处理中，请稍后再试'
    }
  },
  ACCOUNT_ADDRESS_STATUS: {
    S1: 0, // 未上链
    S2: 1, // 已上链
    S3: -1 // 非法
  },
  LOGIN_STATE: {
    SUCCESS: 0,  // 登录成功
    FAILED: -1    // 登录失败
  },
  INPORT_ACCOUNT_PARIVATE_KEY: {
    NICKNAME_EXISTS_CODE: 2
  },
  ACCOUNT_STATE: {
    INVALID_ACCOUNT_PWD: 3
  },
  BUMO_ERROR: {
    ACCOUNT_LOW_RESERVE: 21,
    NOT_ENOUGH_WEIGHT: 24,
    NOT_ENOUGH_TX_FEE: 26,
    INVALID_TX_BLOB_STR: 20,
    INVALID_TX_NONCE: 25,
    TX_TIMEOUT: 23
  },
  INSERT_TX_TO_BUFFER_FAIL: 113
}
// export default {
//   ERRORS: {
//     SUCCESS: {
//       CODE: 0,
//       MSG: this.$t('error.errorUtil.success')
//     },
//     FAIL: {
//       CODE: 1,
//       MSG: this.$t('error.errorUtil.fail')
//     },
//     INVALID_ACCOUNT_PWD: {
//       CODE: 100100,
//       MSG: this.$t('error.errorUtil.invalid_account_pwd')
//     },
//     RECOVER_ACCOUNT_ERROR: {
//       CODE: 100101,
//       MSG: this.$t('error.errorUtil.recover_account_error')
//     },
//     NICKNAME_EXISTS_ERROR: {
//       CODE: 100102,
//       MSG: this.$t('error.errorUtil.nickname_exists_error')
//     },
//     SAVE_ACCOUNT_PRIVATE_KEY_FIEL_ERROR: {
//       CODE: 100103,
//       MSG: this.$t('error.errorUtil.save_account_private_key_fiel_error')
//     },
//     CREATE_ACCOUNT_ERROR: {
//       CODE: 100104,
//       MSG: this.$t('error.errorUtil.create_account_error')
//     },
//     INVALID_ACCOUNT_ADDRESS: {
//       CODE: 100105,
//       MSG: this.$t('error.errorUtil.invalid_account_address')
//     },
//     NO_EXIST_ACCOUNT_ADDRESS: {
//       CODE: 100106,
//       MSG: this.$t('error.errorUtil.no_exist_account_address')
//     },
//     SET_UNIT_WEIGHT_ERROR: {
//       CODE: 100107,
//       MSG: this.$t('error.errorUtil.set_unit_weight_error')
//     },
//     ACCOUNT_BU_TOKEN_NOT_ENOUGH_ERROR: {
//       CODE: 100108,
//       MSG: this.$t('error.errorUtil.account_bu_token_not_enough_error')
//     },
//     ACCOUNT_NOT_ENOUGH_FOR_FEE_ERROR: {
//       CODE: 100109,
//       MSG: this.$t('error.errorUtil.account_not_enough_for_fee_error')
//     },
//     NOT_ACTIVE_ACCOUNT_ERROR: {
//       CODE: 100110,
//       MSG: this.$t('error.errorUtil.not_active_account_error')
//     },
//     NOT_ADD_SIGNER_ACCOUNT_ERROR: {
//       CODE: 100111,
//       MSG: this.$t('error.errorUtil.not_add_signer_account_error')
//     },
//     NOT_ENOUGH_WEIGHT_ERROR: {
//       CODE: 100112,
//       MSG: this.$t('error.errorUtil.not_enough_weight_error')
//     },
//     INVALID_TX_BLOB_STR_ERROR: {
//       CODE: 100113,
//       MSG: this.$t('error.errorUtil.invalid_tx_blob_str_error')
//     },
//     ACCOUNT_LOW_RESERVE_ERROR: {
//       CODE: 100114,
//       MSG: this.$t('error.errorUtil.account_low_reserve_error')
//     },
//     INVALID_TX_NONCE_ERROR: {
//       CODE: 100115,
//       MSG: this.$t('error.errorUtil.invalid_tx_nonce_error')
//     },
//     NOT_ENOUGH_TX_FEE_ERROR: {
//       CODE: 100116,
//       MSG: this.$t('error.errorUtil.not_enough_tx_fee_error')
//     },
//     TX_TIMEOUT_ERROR: {
//       CODE: 100117,
//       MSG: this.$t('error.errorUtil.tx_timeout_error')
//     },
//     SUBMIT_TX_ERROR: {
//       CODE: 100118,
//       MSG: this.$t('error.errorUtil.submit_tx_error')
//     },
//     NOT_NORMAL_ACCOUNT: {
//       CODE: 100119,
//       MSG: this.$t('error.errorUtil.not_normal_account')
//     },
//     NOT_UNIT_ACCOUNT: {
//       CODE: 100120,
//       MSG: this.$t('error.errorUtil.not_unit_account')
//     },
//     NET_OFFLINE: {
//       CODE: 100121,
//       MSG: this.$t('error.errorUtil.net_offline')
//     }
//   },
//   ACCOUNT_ADDRESS_STATUS: {
//     S1: 0, // 未上链
//     S2: 1, // 已上链
//     S3: -1 // 非法
//   },
//   LOGIN_STATE: {
//     SUCCESS: 0,  // 登录成功
//     FAILED: -1    // 登录失败
//   },
//   INPORT_ACCOUNT_PARIVATE_KEY: {
//     NICKNAME_EXISTS_CODE: 2
//   },
//   ACCOUNT_STATE: {
//     INVALID_ACCOUNT_PWD: 3
//   },
//   BUMO_ERROR: {
//     ACCOUNT_LOW_RESERVE: 21,
//     NOT_ENOUGH_WEIGHT: 24,
//     NOT_ENOUGH_TX_FEE: 26,
//     INVALID_TX_BLOB_STR: 20,
//     INVALID_TX_NONCE: 25,
//     TX_TIMEOUT: 23
//   }
// }
