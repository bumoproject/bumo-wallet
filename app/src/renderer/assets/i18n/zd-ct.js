export default {
  'common': {
    'walletName': 'BUMO錢包',
    'welcome': '',
    'copyright': '2018 © BUMO ',
    'computing': '計算中',
    'pwdInputNotice': '為了保證您的賬戶資產安全，請註意周圍是否有他人在瀏覽您的隱私信息！',
    'feature': {
      'loginWallet': '登錄錢包',
      'importPrivKey': {
        'name': '錢包導入',
        'toolTip': '使用私鑰創建錢包，或者通過錢包</br> Keystore 文件導入'
      },
      'createWallet': '創建錢包'
    },
    'dialogButton': {
      'confirm': '確認',
      'cancel': '取消',
      'submit': '提交',
      'confirmSend': '確認轉賬',
      'cancelSend': '取消轉賬'
    }
  },
  'welcome': {
    'title': '歡迎使用BUMO錢包',
    'button': {
      'createWallet': '創建錢包',
      'importPrivKey': '錢包導入'
    }
  },
  'update': {
    'latestVersion': '最新版本：',
    'updateContent': '更新內容：',
    'button': {
      'skip': '跳過',
      'updateNow': '立即升級'
    },
    'updateNotice': '錢包不升級將無法使用最新功能，請立即升級！'
  },
  'create': {
    'title': '創建錢包',
    'friendlyReminder': '警示：密碼不可重置，密碼不可找回，請牢記密碼！',
    'form': {
      'walletName': {
        'label': '錢包名',
        'placeholder': '不超過20個字符'
      },
      'password': {
        'label': '密碼',
        'placeholder': '8-20個字符，含數字、字母和符號'
      },
      'confirmPassword': {
        'label': '確認密碼',
        'placeholder': '8-20個字符，含數字、字母和符號'
      }
    },
    'button': {
      'createWallet': '創建錢包',
      'createWalletLoading': '創建錢包中'
    }
  },
  'createSucc': {
    'title': '錢包創建成功',
    'notice': '為了安全，在您使用前，請備份錢包！',
    'friendlyReminder': {
      'title': '警告',
      'warningContent': '密碼不可找回，如果忘記密碼，只能通過私鑰重新創建錢包'
    },
    'button': {
      'backupPrivKey': '錢包備份'
    }
  },
  'backups': {
    'title': '備份錢包',
    'savePrivKeyFile': '保存私鑰文件',
    'notice': '錢包不存儲用戶密碼，如果忘記密碼，只能通過私鑰或 Keystore 文件恢復。',
    'explain': '什麽是私鑰 / Keystore文件',
    'explainTip': '私鑰： 是您資產的鑰匙，請安全保</br>存，且不能泄露給別人！</br>Keystore：是您錢包的文件，用</br>錢包密碼才能導入使用，請牢記錢包</br>密碼！',
    'button': {
      'exportCleartextPrivKey': '導出私鑰',
      'exportPrivKeyFile': '導出 Keystore 文件'
    },
    'dialog': {
      'exportCleartextPrivKey': {
        'title': '導出私鑰',
        'notice': '為了保證您的賬戶資產安全，請註意周圍是否有他人在瀏覽您的隱私信息！',
        'pwdPlaceholder': '請輸入錢包密碼',
        'tip': '請妥善保存私鑰!'
      }
    }
  },
  'login': {
    'title': '登錄BUMO Wallet',
    'form': {
      'chooseWallet': {
        'label': '錢包名',
        'placeholder': '請選擇登錄錢包'
      },
      'password': {
        'label': '密碼',
        'placeholder': '請輸入錢包密碼'
      }
    },
    'button': {
      'login': '登錄',
      'loginLoading': '登錄中'
    }
  },
  'importPrivKey': {
    'title': '錢包導入',
    'notice': '使用私鑰創建錢包，或者通過錢包Keystore 文件導入',
    'form': {
      'cleartext': {
        'title': '私鑰創建錢包',
        'chooseFile': 'Keystore 文件導入',
        'privKry': {
          'label': '私鑰',
          'placeholder': '請粘貼私鑰字符串'
        },
        'walletName': {
          'label': '新錢包名',
          'placeholder': '請輸入錢包名，不超過20個字符'
        },
        'pwd': {
          'label': '新密碼',
          'placeholder': '8-20個字符，含數字、字母和符號'
        },
        'confirmPwd': {
          'label': '確認新密碼',
          'placeholder': '8-20個字符，含數字、字母和符號'
        }
      },
      'file': {
        'title': 'Keystore文件導入',
        'recoverAccount': '恢復賬戶',
        'chooseStr': '私鑰創建錢包',
        'chooseFileBtn': '選擇錢包文件',
        'privKry': {
          'label': 'Keystore文件',
          'placeholder': '請選擇'
        },
        'confirmPwd': {
          'label': 'Keystore密碼',
          'placeholder': '請輸入舊錢包密碼'
        },
        'walletName': {
          'label': '新錢包名',
          'placeholder': '請輸入錢包名，不超過20個字符'
        }
      }
    },
    'button': {
      'importPrivKey': '導入',
      'importPrivKeyLoading': '導入中'
    }
  },
  'header': {
    'nav': {
      'home': '首頁',
      'send': '轉賬',
      'outlineSignTx': '離線簽名交易',
      'uniteAccountTx': '聯名賬戶交易',
      'logOut': '退出'
    }
  },
  'footer': {
    'noBlockSeq': '正在連接區塊鏈網絡...',
    'synchronizedBlock': '已同步區塊',
    'currentBlock': '當前區塊高度',
    'nodeConnectionSize': '節點連接數'
  },
  'home': {
    'content': {
      'overallBalance': {
        'title': '余額',
        'accountAddress': '賬戶地址',
        'copyBtn': '復制',
        'copyTip': '雙擊可復制賬戶地址',
        'unsyncBlock': '區塊同步中，余額暫時無法獲取'
      },
      'txStatus': {
        'success': '交易成功',
        'processing': '處理中',
        'balanceNotEnougn': '余額不足',
        'feeNotEnoughActiveAccount': '激活目標賬戶費用不足',
        'timeOut': '交易超時',
        'fail': '失敗'
      },
      'latestLocalTxRecord': {
        'title': '最新本地交易記錄',
        'explain': '僅顯示從P2P網絡收到的活躍交易記錄。如</br>需查詢賬戶全部歷史交易，請訪問區塊鏈瀏</br>覽器（explorer.bumo.io）',
        'noData': '您還沒有本地交易記錄',
        'tableHeader': {
          'status': '狀態',
          'time': '時間',
          'srcAddr': '付款賬戶地址',
          'destAddr': '收款賬戶地址',
          'num': '數量'
        },
        'pagination': {
          'total': '共',
          'unit': '頁',
          'content': '條'
        },
        'dialog': {
          'title': '交易詳情',
          'hash': '交易哈希',
          'time': '時間',
          'txStatus': '狀態',
          'srcAddr': '付款賬戶地址',
          'destAddr': '收款賬戶地址',
          'amount': '轉賬數量 (BU)',
          'actualFee': '交易費 (BU)',
          'actualFeeComputing': '計算中',
          'note': '備註',
          'noNote': '暫無備註',
          'close': '關閉'
        }
      }
    }
  },
  'send': {
    'noSyncBlock': '區塊同步中，無法轉賬',
    'form': {
      'destAddr': {
        'label': '收款賬戶地址',
        'placeholder': '以bu開頭的區塊鏈賬戶地址'
      },
      'sentAssetAmount': {
        'label': '轉賬數量',
        'placeholder': '應小於可用余額',
        'balance': '可用余額'
      },
      'fee': {
        'label': '交易費',
        'placeholder': '請輸入費用'
      },
      'note': {
        'label': '備註',
        'placeholder': '200字符以內'
      },
      'nextBtn': '轉賬'
    },
    'dialog': {
      'title': '轉賬詳情',
      'notice': '確認轉賬信息無誤後，輸入錢包密碼，該筆轉賬將提交處理',
      'srcAddr': '付款賬戶地址',
      'destAddr': '收款賬戶地址',
      'sentAssetAmount': '轉賬數量',
      'fee': '交易費',
      'note': '備註',
      'pwdPlaceholder': '請輸入錢包密碼'
    }
  },
  'ost': {
    'buildTx': {
      'title': '生成交易',
      'noSyncBlock': '區塊同步中，無法使用生成交易',
      'buildBlobForm': {
        'srcAddr': {
          'label': '付款賬戶地址',
          'placeholder': '僅支持普通賬戶地址'
        },
        'destAddr': {
          'label': '收款賬戶地址',
          'placeholder': '支持普通及聯名賬戶地址'
        },
        'txAmount': {
          'label': '轉賬數量',
          'placeholder': '不可超過當前余額',
          'balance': '可用余額'
        },
        'fee': {
          'label': '交易費'
        },
        'note': {
          'label': '備註',
          'placeholder': '不能超過200字符'
        },
        'buildBlobBtn': '生成交易串'
      },
      'blobParserDetail': {
        'txDetail': {
          'title': '交易詳情',
          'srcAddr': '付款賬戶地址',
          'destAddr': '收款賬戶地址',
          'txAmount': '轉賬數量',
          'fee': '交易費',
          'note': '備註',
          'noNote': '暫無備註'
        },
        'unsignedBlob': {
          'title': '待簽名的交易串',
          'notice': '請保存以下交易串，然後在離線機上進行“離線簽名”。'
        },
        'clearBtn': '清空'
      }
    },
    'outlineSign': {
      'title': '離線簽名',
      'signBtn': '簽名',
      'clearBtn': '清空',
      'unsignedBlob': {
        'title': '待簽名的交易串',
        'placeholder': '請粘貼完整的交易串（BLOB）'
      },
      'parserDetail': {
        'title': '交易串解析結果',
        'noData': '無解析結果，請在上方文本框中粘貼交易串',
        'srcAddr': '付款賬戶地址',
        'destAddr': '收款賬戶地址',
        'txAmount': '轉賬數量',
        'note': '備註',
        'noNote': '暫無備註'
      },
      'dialog': {
        'title': '請輸入錢包密碼',
        'placeholder': '請輸入錢包密碼'
      },
      'unSubmittedBlob': {
        'title': '待提交的交易串（BLOB）',
        'notice': '請保存以下交易串，然後在聯網機上進行“提交交易”。'
      }
    },
    'submitTx': {
      'title': '提交交易',
      'signBtn': '提交',
      'clearBtn': '清空',
      'noSyncBlock': '區塊同步中，無法使用提交交易',
      'unsubmittedBlob': {
        'title': '待提交的交易串（BLOB）',
        'placeholder': '請粘貼完整的交易串（BLOB）'
      },
      'parserDetail': {
        'title': '交易串解析結果',
        'noData': '無解析結果，請在上方文本框中粘貼交易串',
        'srcAddr': '付款賬戶地址',
        'destAddr': '收款賬戶地址',
        'txAmount': '轉賬數量',
        'note': '備註',
        'noNote': '暫無備註'
      }
    },
    'bottomBarComp': {
      'step1': {
        'title': '1、生成交易（聯網機）',
        'content': '填寫轉賬信息，生成待簽名的交易串'
      },
      'step2': {
        'title': '2、離線簽名（離線機）',
        'content': '在離線機上，付款賬戶對交易串進行簽名，保護付款方私鑰安全'
      },
      'step3': {
        'title': '3、提交交易（聯網機）',
        'content': '將簽名後的交易串，發布到區塊鏈網絡'
      }
    }
  },
  'unite': {
    'listUniteAccount': {
      'title': '創建聯名賬戶',
      'noSyncBlock': '區塊同步中，無法創建聯名賬號',
      'buildAccountForm': {
        'manageType': {
          'label': '共管模式',
          'selfDisgin': '自定義',
          'toolTip': 'M / N：聯名賬戶由N個成員賬戶組成，</br>需要M個成員賬戶先後簽名確認，才</br>能對外實現轉賬'
        },
        'uniteAccountAddress': {
          'label': '聯名賬戶地址',
          'placeholder': ''
        },
        'memberNum': {
          'label': '共管成員數量',
          'placeholder': '請選擇'
        },
        'items': {
          'label': '共管成員',
          'placeholder': '',
          'itemAddr': '成員賬戶地址',
          'itemWeight': '權重'
        },
        'masterWeight': {
          'label': '門限權重',
          'placeholder': '大於0，小於等於成員賬戶權重之和',
          'tips': '提交交易時，簽名賬戶權重之和≥門限權重，才能轉賬成功'
        },
        'fee': {
          'label': '交易費',
          'placeholder': '',
          'tips': '費用在0.01-10之間，可對費用進行修改，修改值不得低於錢包計算值'
        },
        'subBtnText': '創建'
      },
      'checkAccountModal': {
        'checkBtnText': '查詢聯名賬戶',
        'checkModal': {
          'title': '查詢聯名賬戶',
          'placeholder': '請輸入聯名賬戶地址',
          'subBtnText': '提交',
          'cancelBtnText': '取消'
        },
        'resultModal': {
          'title': '查詢聯名賬戶',
          'resultAddr': '聯名賬戶地址',
          'resultBalance': '余額',
          'masterWeight': '門限權重',
          'signerAddr': '成員賬戶地址',
          'signerWeight': '權重',
          'closeBtnText': '關閉'
        }
      },
      'creatSuccessPage': {
        'pageTile': '提交成功',
        'addr': '您的聯名賬戶地址為',
        'clearBtnText': '清空',
        'pageTips': {
          'title': '友情提示',
          'no1': '錢包將不保存聯名賬戶地址，請記錄並妥善保管',
          'no2': '由於交易確認時間需要10秒，如果創建聯名賬戶時交易費過少會導致創建聯名賬戶失敗'
        },
        'clearModal': {
          'clearTips': '錢包將不保存聯名賬戶地址，請記錄並妥善保管',
          'backBtn': '返回',
          'goBtn': '已記錄'
        }
      },
      'pwdModal': {
        'title': '請輸入錢包密碼',
        'modalTips': '為了保證您的賬戶資產安全，請註意周圍是否有他人在瀏覽您的隱私信息',
        'placeholder': '請輸入錢包密碼',
        'enterBtnText': '確認',
        'cancelBtnText': '取消'
      }
    },
    'buildTx': {
      'title': '生成交易',
      'noSyncBlock': '區塊同步中，無法使用生成交易',
      'buildBlobForm': {
        'srcAddr': {
          'label': '付款聯名賬戶地址',
          'placeholder': '僅支持聯名賬戶地址'
        },
        'destAddr': {
          'label': '收款賬戶地址',
          'placeholder': '支持普通及聯名賬戶地址'
        },
        'txAmount': {
          'label': '轉賬數量',
          'placeholder': '不可超過當前余額',
          'balance': '可用余額'
        },
        'fee': {
          'label': '交易費'
        },
        'note': {
          'label': '備註',
          'placeholder': '不能超過200字符'
        },
        'buildBlobBtn': '生成交易串'
      },
      'blobParserDetail': {
        'txDetail': {
          'title': '交易詳情',
          'srcAddr': '付款賬戶地址',
          'destAddr': '收款賬戶地址',
          'txAmount': '轉賬數量',
          'fee': '交易費',
          'note': '備註',
          'noNote': '暫無備註'
        },
        'unsignedBlob': {
          'title': '待簽名的交易串',
          'notice': '請保存以下交易串，然後在離線機上進行“離線簽名”。'
        },
        'clearBtn': '清空'
      }
    },
    'outlineSign': {
      'title': '簽名交易',
      'signBtn': '簽名',
      'clearBtn': '清空',
      'unsignedBlob': {
        'title': '待簽名的交易串',
        'placeholder': '請粘貼完整的交易串（BLOB）'
      },
      'parserDetail': {
        'title': '交易串解析結果',
        'noData': '無解析結果，請在上方文本框中粘貼交易串',
        'srcAddr': '付款賬戶地址',
        'destAddr': '收款賬戶地址',
        'txAmount': '轉賬數量',
        'note': '備註',
        'noNote': '暫無備註',
        'signedUniteMember': '已簽名的共管成員',
        'noSignedUniteMember': '暫無成員簽名'
      },
      'dialog': {
        'title': '請輸入錢包密碼',
        'placeholder': '請輸入錢包密碼'
      },
      'unSubmittedBlob': {
        'title': '待提交的交易串（BLOB）',
        'notice': '請保存以下交易串，然後在聯網機上進行“提交交易”。'
      }
    },
    'submitTx': {
      'title': '提交交易',
      'signBtn': '提交',
      'clearBtn': '清空',
      'noSyncBlock': '區塊同步中，無法使用提交交易',
      'unsubmittedBlob': {
        'title': '待提交的交易串（BLOB）',
        'placeholder': '請粘貼完整的交易串（BLOB）'
      },
      'parserDetail': {
        'title': '交易串解析結果',
        'noData': '無解析結果，請在上方文本框中粘貼交易串',
        'srcAddr': '付款賬戶地址',
        'destAddr': '收款賬戶地址',
        'txAmount': '轉賬數量',
        'note': '備註',
        'noNote': '暫無備註',
        'signedUniteMember': '已簽名的共管成員',
        'noSignedUniteMember': '暫無成員簽名'
      }
    },
    'bottomBarComp': {
      'step1': {
        'title': '1、創建聯名賬戶',
        'content': '創建新的聯名賬戶，用於</br>資產的共管模式'
      },
      'step2': {
        'title': '2、生成交易',
        'content': '填寫轉賬信息，生成待簽名</br>的交易串'
      },
      'step3': {
        'title': '3、簽名交易（多次）',
        'content': '成員賬戶，先後對交易串進行叠代</br>簽名'
      },
      'step4': {
        'title': '4、提交交易',
        'content': '將簽名後的交易串，發布到區塊</br>鏈網絡'
      }
    }
  },
  'mySet': {
    'basicInfo': {
      'title': '基本信息',
      'walletName': '錢包名',
      'walletAddress': '賬戶地址'
    },
    'privKeyInfo': {
      'title': '私鑰信息',
      'privKey': '私鑰',
      'savePrivKeyFile': '保存私鑰文件',
      'button': {
        'show': '顯示私鑰',
        'hide': '隱藏私鑰',
        'backup': '備份Keystore文件'
      },
      'warningTxt': '警告: 密碼不可找回，如果忘記密碼，只能通過私鑰重新創建錢包',
      'dialog': {
        'title': '請輸入錢包密碼',
        'notice': '為了保證您的賬戶資產安全，請註意周圍是否有他人在瀏覽您的隱私信息！',
        'inputPwdPlaceholder': '請輸入錢包密碼'
      }
    },
    'walletLanguage': {
      'title': '錢包語言'
    },
    'walletStorePath': {
      'title': '錢包文件存放路徑',
      'ledgerPath': '賬本路徑',
      'keyStorePath': 'KeyStore文件路徑'
    },
    'versionInfo': {
      'title': '版本信息',
      'currentVersion': '當前版本',
      'content': '最新版本為',
      'clickThere': '點此',
      'updateNow': '立即升級',
      'nowIsLast': '當前為最新版本'
    }
  },
  'page': {
    'account': {
      'w': 'w'
    }
  },
  'error': {
    'walletPwdEmpty': '錢包密碼不能為空',
    'walletName': {
      'empty': '請選擇賬戶名',
      'createEmpty': '請輸入錢包名',
      'limit': '錢包名不合法 [格式僅支持1到20字符的漢字、大小寫字母及數字]'
    },
    'pwd': {
      'empty': '請輸入登錄密碼',
      'createEmpty': '請輸入錢包密碼',
      'wrong': '密碼不正確',
      'limit': '密碼為8到20位，包含數字、字母和字符中最少兩種字符組合',
      'confirmPwdEmpty': '請輸入錢包登錄確認密碼',
      'differentPwdInput': '兩次密碼不壹致'
    },
    'addrEmpty': '賬戶地址不能為空',
    'notUniteAccount': '該賬戶不是聯名賬戶',
    'inputDestAddr': '請輸入收款賬戶地址',
    'sendSelf': '不能給自己轉賬',
    'unactivedAccount': '該錢包賬戶未被激活，可以通過給該賬戶轉賬進行激活',
    'unactivedCantCreate': '您的錢包賬戶還未激活，可以通過給該賬戶轉賬進行激活',
    'manageType': {
      'empty': '請選擇共管模式'
    },
    'memberNum': {
      'empty': '請選擇共管成員數量'
    },
    'uniteAccountAddress': {
      'empty': '聯名賬戶地址不能為空'
    },
    'masterWeight': {
      'empty': '請輸入門限權重',
      'limit': '門限為1-10000整數數值',
      'weightLessThanMasterWeight': '權重總和不得小於聯名賬戶門限'
    },
    'signertHresholds': {
      'empty': '請輸入分配權重',
      'limit': '權重為1-10000整數數值'
    },
    'signerAddr': {
      'empty': '請輸入簽名賬戶地址',
      'sameMember': '共管成員不可重復'
    },
    'srcAddr': {
      'empty': '付款賬戶地址不能為空',
      'uniteEmpty': '請輸入聯名賬戶地址'
    },
    'destAddr': {
      'empty': '收款賬戶地址不能為空',
      'srcSameAsDest': '收款賬戶地址不能與付款賬戶地址相同'
    },
    'txAmount': {
      'empty': '轉賬數量不能為空',
      'lessThanZero': '轉賬數量應大於0',
      'moreThanAvailable': '不可超過可用數量',
      'notNum': '轉賬數量應為數字',
      'numTooBig': '數量過大！',
      'numLimit': '轉賬數量應大於0,最多支持小數點後8位'
    },
    'fee': {
      'empty': '交易費用不能為空',
      'lessThanZero': '交易費用應大於0',
      'numLimit': '交易費用應大於0,最多支持小數點後8位',
      'numTooBig': '交易費用過大',
      'numBig': '費用應為≤10BU的數字'
    },
    'note': {
      'limit200': '字數限200內'
    }
  },
  'errorUtil': {
    'ERRORS': {
      'SUCCESS': '操作成功',
      'FAIL': '操作失敗',
      'INVALID_ACCOUNT_PWD': '錢包密碼錯誤',
      'RECOVER_ACCOUNT_ERROR': '無效私鑰信息',
      'NICKNAME_EXISTS_ERROR': '錢包名已存在',
      'SAVE_ACCOUNT_PRIVATE_KEY_FIEL_ERROR': '賬戶私鑰文件導出失敗',
      'CREATE_ACCOUNT_ERROR': '創建錢包賬戶失敗',
      'INVALID_ACCOUNT_ADDRESS': '無效的賬戶地址',
      'NO_EXIST_ACCOUNT_ADDRESS': '賬戶地址不存在',
      'SET_UNIT_WEIGHT_ERROR': '該聯名賬戶的簽名賬戶權重值過小，不足管控該賬戶',
      'ACCOUNT_BU_TOKEN_NOT_ENOUGH_ERROR': '賬戶BU余額不足',
      'ACCOUNT_NOT_ENOUGH_FOR_FEE_ERROR': '賬戶BU余額不足支付本次交易的費用',
      'NOT_ACTIVE_ACCOUNT_ERROR': '該賬戶地址未激活',
      'NOT_ADD_SIGNER_ACCOUNT_ERROR': '未添加簽名賬戶地址',
      'NOT_ENOUGH_WEIGHT_ERROR': '賬戶權重不足，無法完成本次交易',
      'INVALID_TX_BLOB_STR_ERROR': '無效的交易字符串',
      'ACCOUNT_LOW_RESERVE_ERROR': '賬戶可用余額不足',
      'INVALID_TX_NONCE_ERROR': '交易重復提交',
      'NOT_ENOUGH_TX_FEE_ERROR': '交易費用不足',
      'TX_TIMEOUT_ERROR': '交易超時',
      'SUBMIT_TX_ERROR': '提交失敗',
      'NOT_NORMAL_ACCOUNT': '付款賬戶僅支持普通賬戶地址',
      'NOT_UNIT_ACCOUNT': '付款賬戶僅支持聯名賬戶地址',
      'NET_OFFLINE': '網絡不可用，請在聯網情況下進行操作'
    }
  },
  'msg': {
    'succ': {
      'default': '交易成功',
      'copySucc': '復制成功',
      'acceptTx': '交易已受理',
      'buildSucc': '交易串生成成功',
      'recoverAccount': '賬戶恢復成功',
      'privKeyImport': '賬戶私鑰導入成功',
      'privKeyBackup': '錢包Keystore文件備份成功'
    },
    'error': {
      'formErr': '請按要求填寫所需信息'
    },
    'warning': {
      'fileEmpty': '請選擇錢包文件',
      'walletNameEmpty': '請輸入錢包名',
      'walletNameLimit': '錢包名不合法 [格式僅支持1到20字符的漢字、大小寫字母及數字]',
      'walletPwdEmpty': '請輸入錢包密碼',
      'clearTextEmpty': '請粘貼賬戶明文私鑰',
      'pwdLimit': '密碼為8到20位，包含數字、字母和字符中最少兩種字符組合',
      'confirmPwdEmpty': '請輸入錢包登錄確認密碼',
      'differentPwdInput': '兩次密碼不壹致'
    }
  },
  i: {
    locale: 'zh-CN',
    select: {
      placeholder: '請選擇',
      noMatch: '無匹配數據',
      loading: '加載中'
    },
    table: {
      noDataText: '暫無數據',
      noFilteredDataText: '暫無篩選結果',
      confirmFilter: '篩選',
      resetFilter: '重置',
      clearFilter: '全部'
    },
    datepicker: {
      selectDate: '選擇日期',
      selectTime: '選擇時間',
      startTime: '開始時間',
      endTime: '結束時間',
      clear: '清空',
      ok: '確定',
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
        mon: '壹',
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
      filterPlaceholder: '請輸入搜索內容',
      notFoundText: '列表為空'
    },
    modal: {
      okText: '確定',
      cancelText: '取消'
    },
    poptip: {
      okText: '確定',
      cancelText: '取消'
    },
    page: {
      prev: '上壹頁',
      next: '下壹頁',
      total: '共',
      item: '條',
      items: '條',
      prev5: '向前 5 頁',
      next5: '向後 5 頁',
      page: '條/頁',
      goto: '跳至',
      p: '頁'
    },
    rate: {
      star: '星',
      stars: '星'
    },
    tree: {
      emptyText: '暫無數據'
    }
  }
}
