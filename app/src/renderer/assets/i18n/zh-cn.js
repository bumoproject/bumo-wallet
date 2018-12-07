export default {
  'common': {
    'walletName': 'BUMO钱包',
    'welcome': '',
    'copyright': '2018 © BUMO ',
    'computing': '计算中',
    'pwdInputNotice': '为了保证您的账户资产安全，请注意周围是否有他人在浏览您的隐私信息！',
    'feature': {
      'loginWallet': '登录钱包',
      'importPrivKey': {
        'name': '钱包导入',
        'toolTip': '使用私钥创建钱包，或者通过钱包</br> Keystore 文件导入'
      },
      'createWallet': '创建钱包'
    },
    'dialogButton': {
      'confirm': '确认',
      'cancel': '取消',
      'submit': '提交',
      'confirmSend': '确认转账',
      'cancelSend': '取消转账'
    }
  },
  'welcome': {
    'title': '欢迎使用BUMO钱包',
    'button': {
      'createWallet': '创建钱包',
      'importPrivKey': '钱包导入'
    }
  },
  'update': {
    'latestVersion': '最新版本：',
    'updateContent': '更新内容：',
    'button': {
      'skip': '跳过',
      'updateNow': '立即升级'
    },
    'updateNotice': '钱包不升级将无法使用最新功能，请立即升级！'
  },
  'create': {
    'title': '创建钱包',
    'friendlyReminder': '警示：密码不可重置，密码不可找回，请牢记密码！',
    'form': {
      'walletName': {
        'label': '钱包名',
        'placeholder': '不超过20个字符'
      },
      'password': {
        'label': '密码',
        'placeholder': '8-20个字符，含数字、字母和符号'
      },
      'confirmPassword': {
        'label': '确认密码',
        'placeholder': '8-20个字符，含数字、字母和符号'
      }
    },
    'button': {
      'createWallet': '创建钱包',
      'createWalletLoading': '创建钱包中'
    }
  },
  'createSucc': {
    'title': '钱包创建成功',
    'notice': '为了安全，在您使用前，请备份钱包！',
    'friendlyReminder': {
      'title': '警告',
      'warningContent': '密码不可找回，如果忘记密码，只能通过私钥重新创建钱包'
    },
    'button': {
      'backupPrivKey': '钱包备份'
    }
  },
  'backups': {
    'title': '备份钱包',
    'savePrivKeyFile': '保存私钥文件',
    'notice': '钱包不存储用户密码，如果忘记密码，只能通过私钥或 Keystore 文件恢复。',
    'explain': '什么是私钥 / Keystore文件',
    'explainTip': '私钥： 是您资产的钥匙，请安全保</br>存，且不能泄露给别人！</br>Keystore：是您钱包的文件，用</br>钱包密码才能导入使用，请牢记钱包</br>密码！',
    'button': {
      'exportCleartextPrivKey': '导出私钥',
      'exportPrivKeyFile': '导出 Keystore 文件'
    },
    'dialog': {
      'exportCleartextPrivKey': {
        'title': '导出私钥',
        'notice': '为了保证您的账户资产安全，请注意周围是否有他人在浏览您的隐私信息！',
        'pwdPlaceholder': '请输入钱包密码',
        'tip': '请妥善保存私钥!'
      }
    }
  },
  'login': {
    'title': '登录BUMO Wallet',
    'form': {
      'chooseWallet': {
        'label': '钱包名',
        'placeholder': '请选择登录钱包'
      },
      'password': {
        'label': '密码',
        'placeholder': '请输入钱包密码'
      }
    },
    'button': {
      'login': '登录',
      'loginLoading': '登录中'
    }
  },
  'importPrivKey': {
    'title': '钱包导入',
    'notice': '使用私钥创建钱包，或者通过钱包Keystore 文件导入',
    'form': {
      'cleartext': {
        'title': '私钥创建钱包',
        'chooseFile': 'Keystore 文件导入',
        'privKry': {
          'label': '私钥',
          'placeholder': '请粘贴私钥字符串'
        },
        'walletName': {
          'label': '新钱包名',
          'placeholder': '请输入钱包名，不超过20个字符'
        },
        'pwd': {
          'label': '新密码',
          'placeholder': '8-20个字符，含数字、字母和符号'
        },
        'confirmPwd': {
          'label': '确认新密码',
          'placeholder': '8-20个字符，含数字、字母和符号'
        }
      },
      'file': {
        'title': 'Keystore文件导入',
        'recoverAccount': '恢复账户',
        'chooseStr': '私钥创建钱包',
        'chooseFileBtn': '选择钱包文件',
        'privKry': {
          'label': 'Keystore文件',
          'placeholder': '请选择'
        },
        'confirmPwd': {
          'label': 'Keystore密码',
          'placeholder': '请输入旧钱包密码'
        },
        'walletName': {
          'label': '新钱包名',
          'placeholder': '请输入钱包名，不超过20个字符'
        }
      }
    },
    'button': {
      'importPrivKey': '导入',
      'importPrivKeyLoading': '导入中'
    }
  },
  'header': {
    'nav': {
      'home': '首页',
      'token': 'Token',
      'send': '转账',
      'outlineSignTx': '离线签名交易',
      'uniteAccountTx': '联名账户交易',
      'logOut': '退出'
    }
  },
  'footer': {
    'noBlockSeq': '正在连接区块链网络...',
    'synchronizedBlock': '已同步区块',
    'currentBlock': '当前区块高度',
    'nodeConnectionSize': 'Peer的连接数'
  },
  'home': {
    'content': {
      'overallBalance': {
        'title': '余额',
        'accountAddress': '账户地址',
        'copyBtn': '复制',
        'copyTip': '双击可复制账户地址',
        'unsyncBlock': '区块同步中，余额暂时无法获取'
      },
      'txStatus': {
        'success': '交易成功',
        'processing': '处理中',
        'balanceNotEnougn': '余额不足',
        'feeNotEnoughActiveAccount': '激活目标账户费用不足',
        'timeOut': '交易超时',
        'fail': '失败'
      },
      'latestLocalTxRecord': {
        'title': '最新本地交易记录',
        'explain': '仅显示从P2P网络收到的活跃交易记录。如</br>需查询账户全部历史交易，请访问区块链浏</br>览器（explorer.bumo.io）',
        'noData': '您还没有本地交易记录',
        'tableHeader': {
          'status': '状态',
          'time': '时间',
          'srcAddr': '付款账户地址',
          'destAddr': '收款账户地址',
          'num': '数量'
        },
        'pagination': {
          'total': '共',
          'unit': '页',
          'content': '条'
        },
        'dialog': {
          'title': '交易详情',
          'hash': '交易哈希',
          'time': '时间',
          'txStatus': '状态',
          'srcAddr': '付款账户地址',
          'destAddr': '收款账户地址',
          'amount': '转账数量 (BU)',
          'actualFee': '交易费 (BU)',
          'actualFeeComputing': '计算中',
          'note': '备注',
          'noNote': '暂无备注',
          'close': '关闭'
        }
      }
    }
  },
  'token': {
    'content': {
      'overallBalance': {
        'loadingBalance': '余额获取中...',
        'title': '余额',
        'accountAddress': '账户地址',
        'copyBtn': '复制',
        'copyTip': '双击可复制账户地址',
        'unsyncBlock': '区块同步中，余额暂时无法获取'
      },
      'txStatus': {
        'success': '交易成功',
        'processing': '处理中',
        'balanceNotEnougn': '余额不足',
        'feeNotEnoughActiveAccount': '激活目标账户费用不足',
        'timeOut': '交易超时',
        'fail': '失败'
      },
      'latestLocalTxRecord': {
        'title': '最新本地交易记录',
        'explain': '仅显示从P2P网络收到的活跃交易记录。如</br>需查询账户全部历史交易，请访问区块链浏</br>览器（explorer.bumo.io）',
        'noData': '您还没有本地交易记录',
        'sendToken': '转账',
        'tableHeader': {
          'status': '状态',
          'time': '时间',
          'srcAddr': '付款账户地址',
          'destAddr': '收款账户地址',
          'num': '数量'
        },
        'pagination': {
          'total': '共',
          'unit': '页',
          'content': '条'
        },
        'dialog': {
          'title': '交易详情',
          'hash': '交易哈希',
          'time': '时间',
          'txStatus': '状态',
          'srcAddr': '付款账户地址',
          'destAddr': '收款账户地址',
          'amount': '转账数量',
          'actualFee': '交易费',
          'activationFee': '账户激活费用',
          'actualFeeComputing': '计算中',
          'note': '备注',
          'noNote': '暂无备注',
          'close': '关闭'
        }
      }
    }
  },
  'send': {
    'noSyncBlock': '区块同步中，无法转账',
    'form': {
      'currentTokenType': {
        'label': '资产类型',
        'placeholder': '请选择'
      },
      'destAddr': {
        'label': '收款账户地址',
        'placeholder': '以bu开头的区块链账户地址'
      },
      'sentAssetAmount': {
        'label': '转账数量',
        'placeholder': '应小于可用余额',
        'balance': '可用余额'
      },
      'fee': {
        'label': '最多交易费',
        'placeholder': '请输入交易费用'
      },
      'note': {
        'label': '备注',
        'placeholder': '200字符以内'
      },
      'nextBtn': '转账'
    },
    'dialog': {
      'title': '转账详情',
      'notice': '确认转账信息无误后，输入钱包密码，该笔转账将提交处理',
      'srcAddr': '付款账户地址',
      'destAddr': '收款账户地址',
      'sentAssetAmount': '转账数量',
      'fee': '最多交易费',
      'note': '备注',
      'pwdPlaceholder': '请输入钱包密码'
    }
  },
  'ost': {
    'buildTx': {
      'title': '生成交易',
      'noSyncBlock': '区块同步中，无法使用生成交易',
      'buildBlobForm': {
        'srcAddr': {
          'label': '付款账户地址',
          'placeholder': '仅支持普通账户地址'
        },
        'destAddr': {
          'label': '收款账户地址',
          'placeholder': '支持普通及联名账户地址'
        },
        'txAmount': {
          'label': '转账数量',
          'placeholder': '不可超过当前余额',
          'balance': '可用余额'
        },
        'fee': {
          'label': '最多交易费'
        },
        'note': {
          'label': '备注',
          'placeholder': '不能超过200字符'
        },
        'buildBlobBtn': '生成交易串'
      },
      'blobParserDetail': {
        'txDetail': {
          'title': '交易详情',
          'srcAddr': '付款账户地址',
          'destAddr': '收款账户地址',
          'txAmount': '转账数量',
          'fee': '最多交易费',
          'note': '备注',
          'noNote': '暂无备注'
        },
        'unsignedBlob': {
          'title': '待签名的交易串',
          'notice': '请保存以下交易串，然后在离线机上进行“离线签名”。'
        },
        'clearBtn': '清空'
      }
    },
    'outlineSign': {
      'title': '离线签名',
      'signBtn': '签名',
      'clearBtn': '清空',
      'unsignedBlob': {
        'title': '待签名的交易串',
        'placeholder': '请粘贴完整的交易串（BLOB）'
      },
      'parserDetail': {
        'title': '交易串解析结果',
        'noData': '无解析结果，请在上方文本框中粘贴交易串',
        'srcAddr': '付款账户地址',
        'destAddr': '收款账户地址',
        'txAmount': '转账数量',
        'note': '备注',
        'noNote': '暂无备注'
      },
      'dialog': {
        'title': '请输入钱包密码',
        'placeholder': '请输入钱包密码'
      },
      'unSubmittedBlob': {
        'title': '待提交的交易串（BLOB）',
        'notice': '请保存以下交易串，然后在联网机上进行“提交交易”。'
      }
    },
    'submitTx': {
      'title': '提交交易',
      'signBtn': '提交',
      'clearBtn': '清空',
      'noSyncBlock': '区块同步中，无法使用提交交易',
      'unsubmittedBlob': {
        'title': '待提交的交易串（BLOB）',
        'placeholder': '请粘贴完整的交易串（BLOB）'
      },
      'parserDetail': {
        'title': '交易串解析结果',
        'noData': '无解析结果，请在上方文本框中粘贴交易串',
        'srcAddr': '付款账户地址',
        'destAddr': '收款账户地址',
        'txAmount': '转账数量',
        'note': '备注',
        'noNote': '暂无备注'
      }
    },
    'bottomBarComp': {
      'step1': {
        'title': '1、生成交易（联网机）',
        'content': '填写转账信息，生成待签名的交易串'
      },
      'step2': {
        'title': '2、离线签名（离线机）',
        'content': '在离线机上，付款账户对交易串进行签名，保护付款方私钥安全'
      },
      'step3': {
        'title': '3、提交交易（联网机）',
        'content': '将签名后的交易串，发布到区块链网络'
      }
    }
  },
  'unite': {
    'listUniteAccount': {
      'title': '创建联名账户',
      'noSyncBlock': '区块同步中，无法创建联名账号',
      'buildAccountForm': {
        'manageType': {
          'label': '共管模式',
          'selfDisgin': '自定义',
          'toolTip': 'M / N：联名账户由N个成员账户组成，</br>需要M个成员账户先后签名确认，才</br>能对外实现转账'
        },
        'uniteAccountAddress': {
          'label': '联名账户地址',
          'placeholder': ''
        },
        'memberNum': {
          'label': '共管成员数量',
          'placeholder': '请选择'
        },
        'items': {
          'label': '共管成员',
          'placeholder': '',
          'itemAddr': '成员账户地址',
          'itemWeight': '权重'
        },
        'masterWeight': {
          'label': '门限权重',
          'placeholder': '大于0，小于等于成员账户权重之和',
          'tips': '提交交易时，签名账户权重之和≥门限权重，才能转账成功'
        },
        'fee': {
          'label': '最多交易费',
          'placeholder': '',
          'tips': '费用在0.01-10之间，可对费用进行修改，修改值不得低于钱包计算值'
        },
        'subBtnText': '创建'
      },
      'checkAccountModal': {
        'checkBtnText': '查询联名账户',
        'checkModal': {
          'title': '查询联名账户',
          'placeholder': '请输入联名账户地址',
          'subBtnText': '提交',
          'cancelBtnText': '取消'
        },
        'resultModal': {
          'title': '查询联名账户',
          'resultAddr': '联名账户地址',
          'resultBalance': '余额',
          'masterWeight': '门限权重',
          'signerAddr': '成员账户地址',
          'signerWeight': '权重',
          'closeBtnText': '关闭'
        }
      },
      'creatSuccessPage': {
        'pageTile': '提交成功',
        'addr': '您的联名账户地址为',
        'clearBtnText': '清空',
        'pageTips': {
          'title': '友情提示',
          'no1': '钱包将不保存联名账户地址，请记录并妥善保管',
          'no2': '由于交易确认时间需要10秒，如果创建联名账户时交易费过少会导致创建联名账户失败'
        },
        'clearModal': {
          'clearTips': '钱包将不保存联名账户地址，请记录并妥善保管',
          'backBtn': '返回',
          'goBtn': '已记录'
        }
      },
      'pwdModal': {
        'title': '请输入钱包密码',
        'modalTips': '为了保证您的账户资产安全，请注意周围是否有他人在浏览您的隐私信息',
        'placeholder': '请输入钱包密码',
        'enterBtnText': '确认',
        'cancelBtnText': '取消'
      }
    },
    'buildTx': {
      'title': '生成交易',
      'noSyncBlock': '区块同步中，无法使用生成交易',
      'buildBlobForm': {
        'srcAddr': {
          'label': '付款联名账户地址',
          'placeholder': '仅支持联名账户地址'
        },
        'destAddr': {
          'label': '收款账户地址',
          'placeholder': '支持普通及联名账户地址'
        },
        'txAmount': {
          'label': '转账数量',
          'placeholder': '不可超过当前余额',
          'balance': '可用余额'
        },
        'fee': {
          'label': '最多交易费'
        },
        'note': {
          'label': '备注',
          'placeholder': '不能超过200字符'
        },
        'buildBlobBtn': '生成交易串'
      },
      'blobParserDetail': {
        'txDetail': {
          'title': '交易详情',
          'srcAddr': '付款账户地址',
          'destAddr': '收款账户地址',
          'txAmount': '转账数量',
          'fee': '最多交易费',
          'note': '备注',
          'noNote': '暂无备注'
        },
        'unsignedBlob': {
          'title': '待签名的交易串',
          'notice': '请保存以下交易串，然后在离线机上进行“离线签名”。'
        },
        'clearBtn': '清空'
      }
    },
    'outlineSign': {
      'title': '签名交易',
      'signBtn': '签名',
      'clearBtn': '清空',
      'unsignedBlob': {
        'title': '待签名的交易串',
        'placeholder': '请粘贴完整的交易串（BLOB）'
      },
      'parserDetail': {
        'title': '交易串解析结果',
        'noData': '无解析结果，请在上方文本框中粘贴交易串',
        'srcAddr': '付款账户地址',
        'destAddr': '收款账户地址',
        'txAmount': '转账数量',
        'note': '备注',
        'noNote': '暂无备注',
        'signedUniteMember': '已签名的共管成员',
        'noSignedUniteMember': '暂无成员签名'
      },
      'dialog': {
        'title': '请输入钱包密码',
        'placeholder': '请输入钱包密码'
      },
      'unSubmittedBlob': {
        'title': '待提交的交易串（BLOB）',
        'notice': '请保存以下交易串，然后在联网机上进行“提交交易”。'
      }
    },
    'submitTx': {
      'title': '提交交易',
      'signBtn': '提交',
      'clearBtn': '清空',
      'noSyncBlock': '区块同步中，无法使用提交交易',
      'unsubmittedBlob': {
        'title': '待提交的交易串（BLOB）',
        'placeholder': '请粘贴完整的交易串（BLOB）'
      },
      'parserDetail': {
        'title': '交易串解析结果',
        'noData': '无解析结果，请在上方文本框中粘贴交易串',
        'srcAddr': '付款账户地址',
        'destAddr': '收款账户地址',
        'txAmount': '转账数量',
        'note': '备注',
        'noNote': '暂无备注',
        'signedUniteMember': '已签名的共管成员',
        'noSignedUniteMember': '暂无成员签名'
      }
    },
    'bottomBarComp': {
      'step1': {
        'title': '1、创建联名账户',
        'content': '创建新的联名账户，用于</br>资产的共管模式'
      },
      'step2': {
        'title': '2、生成交易',
        'content': '填写转账信息，生成待签名</br>的交易串'
      },
      'step3': {
        'title': '3、签名交易（多次）',
        'content': '成员账户，先后对交易串进行迭代</br>签名'
      },
      'step4': {
        'title': '4、提交交易',
        'content': '将签名后的交易串，发布到区块</br>链网络'
      }
    }
  },
  'mySet': {
    'basicInfo': {
      'title': '基本信息',
      'walletName': '钱包名',
      'walletAddress': '账户地址'
    },
    'privKeyInfo': {
      'title': '私钥信息',
      'privKey': '私钥',
      'savePrivKeyFile': '保存私钥文件',
      'button': {
        'show': '显示私钥',
        'hide': '隐藏私钥',
        'backup': '备份Keystore文件'
      },
      'warningTxt': '警告: 密码不可找回，如果忘记密码，只能通过私钥重新创建钱包',
      'dialog': {
        'title': '请输入钱包密码',
        'notice': '为了保证您的账户资产安全，请注意周围是否有他人在浏览您的隐私信息！',
        'inputPwdPlaceholder': '请输入钱包密码'
      }
    },
    'walletLanguage': {
      'title': '钱包语言'
    },
    'walletStorePath': {
      'title': '钱包文件存放路径',
      'ledgerPath': '账本路径',
      'keyStorePath': 'KeyStore文件路径'
    },
    'versionInfo': {
      'title': '版本信息',
      'currentVersion': '当前版本',
      'content': '最新版本为',
      'clickThere': '点此',
      'updateNow': '立即升级',
      'nowIsLast': '当前为最新版本'
    }
  },
  'page': {
    'account': {
      'w': 'w'
    }
  },
  'error': {
    'currentTokenType': '请选择token',
    'walletPwdEmpty': '钱包密码不能为空',
    'walletName': {
      'empty': '请选择账户名',
      'createEmpty': '请输入钱包名',
      'limit': '钱包名不合法 [格式仅支持1到20字符的汉字、大小写字母及数字]'
    },
    'pwd': {
      'empty': '请输入登录密码',
      'createEmpty': '请输入钱包密码',
      'wrong': '密码不正确',
      'limit': '密码为8到20位，包含数字、字母和字符中最少两种字符组合',
      'confirmPwdEmpty': '请输入钱包登录确认密码',
      'differentPwdInput': '两次密码不一致'
    },
    'addrEmpty': '账户地址不能为空',
    'notUniteAccount': '该账户不是联名账户',
    'inputDestAddr': '请输入收款账户地址',
    'sendSelf': '不能给自己转账',
    'unactivedAccount': '该钱包账户未被激活，可以通过给该账户转账进行激活',
    'unactivedCantCreate': '您的钱包账户还未激活，可以通过给该账户转账进行激活',
    'manageType': {
      'empty': '请选择共管模式'
    },
    'memberNum': {
      'empty': '请选择共管成员数量'
    },
    'uniteAccountAddress': {
      'empty': '联名账户地址不能为空'
    },
    'masterWeight': {
      'empty': '请输入门限权重',
      'limit': '门限为1-10000整数数值',
      'weightLessThanMasterWeight': '权重总和不得小于联名账户门限'
    },
    'signertHresholds': {
      'empty': '请输入分配权重',
      'limit': '权重为1-10000整数数值'
    },
    'signerAddr': {
      'empty': '请输入签名账户地址',
      'sameMember': '共管成员不可重复'
    },
    'srcAddr': {
      'empty': '付款账户地址不能为空',
      'uniteEmpty': '请输入联名账户地址'
    },
    'destAddr': {
      'empty': '收款账户地址不能为空',
      'srcSameAsDest': '收款账户地址不能与付款账户地址相同'
    },
    'txAmount': {
      'empty': '转账数量不能为空',
      'lessThanZero': '转账数量应大于0',
      'moreThanAvailable': '不可超过可用数量',
      'notNum': '转账数量应为数字',
      'numTooBig': '数量过大！',
      'numLimit': '转账数量应大于0,最多支持小数点后8位',
      'tokenNum': '转移数量应为正整数',
      'decimals': '转账数量应大于0,最多支持小数点后',
      'decimalsUnit': '位'
    },
    'fee': {
      'empty': '交易费用不能为空',
      'lessThanZero': '交易费用应大于0',
      'numLimit': '交易费用应大于0,最多支持小数点后8位',
      'numTooBig': '交易费用过大',
      'numBig': '交易费用应为≤10BU的数字',
      'numSmall': '交易费用不足'
    },
    'note': {
      'limit200': '字数限200内'
    }
  },
  'errorUtil': {
    'ERRORS': {
      'SUCCESS': '操作成功',
      'FAIL': '操作失败',
      'INVALID_ACCOUNT_PWD': '钱包密码错误',
      'RECOVER_ACCOUNT_ERROR': '无效私钥信息',
      'NICKNAME_EXISTS_ERROR': '钱包名已存在',
      'SAVE_ACCOUNT_PRIVATE_KEY_FIEL_ERROR': '账户私钥文件导出失败',
      'CREATE_ACCOUNT_ERROR': '创建钱包账户失败',
      'INVALID_ACCOUNT_ADDRESS': '无效的账户地址',
      'NO_EXIST_ACCOUNT_ADDRESS': '账户地址不存在',
      'SET_UNIT_WEIGHT_ERROR': '该联名账户的签名账户权重值过小，不足管控该账户',
      'ACCOUNT_BU_TOKEN_NOT_ENOUGH_ERROR': '账户BU余额不足',
      'ACCOUNT_NOT_ENOUGH_FOR_FEE_ERROR': '账户BU余额不足支付本次交易的费用',
      'NOT_ACTIVE_ACCOUNT_ERROR': '该账户地址未激活',
      'NOT_ADD_SIGNER_ACCOUNT_ERROR': '未添加签名账户地址',
      'NOT_ENOUGH_WEIGHT_ERROR': '账户权重不足，无法完成本次交易',
      'INVALID_TX_BLOB_STR_ERROR': '无效的交易字符串',
      'ACCOUNT_LOW_RESERVE_ERROR': '账户可用余额不足',
      'INVALID_TX_NONCE_ERROR': '交易重复提交',
      'NOT_ENOUGH_TX_FEE_ERROR': '交易费用不足',
      'TX_TIMEOUT_ERROR': '交易超时',
      'SUBMIT_TX_ERROR': '提交失败',
      'NOT_NORMAL_ACCOUNT': '付款账户仅支持普通账户地址',
      'NOT_UNIT_ACCOUNT': '付款账户仅支持联名账户地址',
      'NET_OFFLINE': '网络不可用，请在联网情况下进行操作',
      'NETWORK_ERROR': '网络错误'
    }
  },
  'msg': {
    'succ': {
      'default': '交易成功',
      'copySucc': '复制成功',
      'acceptTx': '交易已受理',
      'buildSucc': '交易串生成成功',
      'recoverAccount': '账户恢复成功',
      'privKeyImport': '账户私钥导入成功',
      'privKeyBackup': '钱包Keystore文件备份成功'
    },
    'error': {
      'formErr': '请按要求填写所需信息'
    },
    'warning': {
      'fileEmpty': '请选择钱包文件',
      'walletNameEmpty': '请输入钱包名',
      'walletNameLimit': '钱包名不合法 [格式仅支持1到20字符的汉字、大小写字母及数字]',
      'walletPwdEmpty': '请输入钱包密码',
      'clearTextEmpty': '请粘贴账户明文私钥',
      'pwdLimit': '密码为8到20位，包含数字、字母和字符中最少两种字符组合',
      'confirmPwdEmpty': '请输入钱包登录确认密码',
      'differentPwdInput': '两次密码不一致'
    }
  },
  i: {
    locale: 'zh-CN',
    select: {
      placeholder: '请选择',
      noMatch: '无匹配数据',
      loading: '加载中'
    },
    table: {
      noDataText: '暂无数据',
      noFilteredDataText: '暂无筛选结果',
      confirmFilter: '筛选',
      resetFilter: '重置',
      clearFilter: '全部'
    },
    datepicker: {
      selectDate: '选择日期',
      selectTime: '选择时间',
      startTime: '开始时间',
      endTime: '结束时间',
      clear: '清空',
      ok: '确定',
      datePanelLabel: '[yyyy年] [m月]',
      month: '月',
      month1: '1 月',
      month2: '2 月',
      month3: '3 月',
      month4: '4 月',
      month5: '5 月',
      month6: '6 月',
      month7: '7 月',
      month8: '8 月',
      month9: '9 月',
      month10: '10 月',
      month11: '11 月',
      month12: '12 月',
      year: '年',
      weekStartDay: '0',
      weeks: {
        sun: '日',
        mon: '一',
        tue: '二',
        wed: '三',
        thu: '四',
        fri: '五',
        sat: '六'
      },
      months: {
        m1: '1月',
        m2: '2月',
        m3: '3月',
        m4: '4月',
        m5: '5月',
        m6: '6月',
        m7: '7月',
        m8: '8月',
        m9: '9月',
        m10: '10月',
        m11: '11月',
        m12: '12月'
      }
    },
    transfer: {
      titles: {
        source: '源列表',
        target: '目的列表'
      },
      filterPlaceholder: '请输入搜索内容',
      notFoundText: '列表为空'
    },
    modal: {
      okText: '确定',
      cancelText: '取消'
    },
    poptip: {
      okText: '确定',
      cancelText: '取消'
    },
    page: {
      prev: '上一页',
      next: '下一页',
      total: '共',
      item: '条',
      items: '条',
      prev5: '向前 5 页',
      next5: '向后 5 页',
      page: '条/页',
      goto: '跳至',
      p: '页'
    },
    rate: {
      star: '星',
      stars: '星'
    },
    tree: {
      emptyText: '暂无数据'
    }
  }
}
