export default {
  'common': {
    'walletName': 'BUMO Wallet',
    'welcome': '',
    'copyright': '2018 © BUMO ',
    'computing': ' Processing ',
    'pwdInputNotice': 'For Account Secure, please make sure not being watched while typing your private info',
    'feature': {
      'loginWallet': 'Login Wallet',
      'importPrivKey': {
        'name': 'Import Wallet',
        'toolTip': 'Create your Wallet by Private Key, or import</br> one Keystore File'
      },
      'createWallet': 'Create Wallet'
    },
    'dialogButton': {
      'confirm': 'Confirm',
      'cancel': 'Cancel',
      'submit': 'Submit',
      'confirmSend': 'Confirm',
      'cancelSend': 'Cancel'
    }
  },
  'welcome': {
    'title': 'Welcome to BUMO Wallet',
    'button': {
      'createWallet': 'Create Wallet',
      'importPrivKey': 'Import Wallet'
    }
  },
  'update': {
    'latestVersion': 'Latest Version:',
    'updateContent': 'Update for More:',
    'button': {
      'skip': 'Skip',
      'updateNow': 'Update Now'
    },
    'updateNotice': 'Please Update for New Functions in Recent BUMO Packages'
  },
  'create': {
    'title': 'Create Wallet',
    'friendlyReminder': 'WARNING: Password can NOT be reset or recovered, do remember it',
    'form': {
      'walletName': {
        'label': 'Wallet Name',
        'placeholder': '20 characters or shorter'
      },
      'password': {
        'label': 'Password',
        'placeholder': '8-20 characters, letter, number or symbol'
      },
      'confirmPassword': {
        'label': 'Repeat Password',
        'placeholder': 'Please Enter Password Again'
      }
    },
    'button': {
      'createWallet': 'Create',
      'createWalletLoading': 'Creating…'
    }
  },
  'createSucc': {
    'title': 'Successfully Created',
    'notice': 'Keep your account secure by BACKING UP BEFORE USING',
    'friendlyReminder': {
      'title': 'WARNING',
      'warningContent': 'Wallet Password can NOT be recovered, you can only create a new Wallet using Private Key once forgotten'
    },
    'button': {
      'backupPrivKey': 'Backup Wallet'
    }
  },
  'backups': {
    'title': 'Backup Wallet',
    'savePrivKeyFile': 'Save Private Key File',
    'notice': 'Password can only be restored using Private Key or Keystore File once forgotten',
    'explain': 'About Private Key / Keystore File',
    'explainTip': 'Private Key: The key of your assets,<br> please keep it secure and private. </br>Keystore: The File of your Wallet, can be </br>used only after Wallet Password imported.</br> Please do remember your password.',
    'button': {
      'exportCleartextPrivKey': 'Export Private Key',
      'exportPrivKeyFile': 'Export Keystore File'
    },
    'dialog': {
      'exportCleartextPrivKey': {
        'title': 'Export Private Key',
        'notice': 'For Account Secure, please make sure not being watched while typing your password!',
        'pwdPlaceholder': 'Your Wallet Password',
        'tip': 'Please keep your Private Key safe'
      }
    }
  },
  'login': {
    'title': 'Login BUMO Wallet',
    'form': {
      'chooseWallet': {
        'label': 'Wallet Name',
        'placeholder': 'Choose Wallet Name'
      },
      'password': {
        'label': 'Password',
        'placeholder': 'Please Enter Password'
      }
    },
    'button': {
      'login': 'Login',
      'loginLoading': 'Loading'
    }
  },
  'importPrivKey': {
    'title': 'Import Wallet',
    'notice': 'Create Wallet using Private Key or importing Keystore File ',
    'form': {
      'cleartext': {
        'title': 'Create Wallet by Private Key',
        'chooseFile': 'Import Keystore File',
        'privKry': {
          'label': 'Private Key',
          'placeholder': 'Paste Private Key Here'
        },
        'walletName': {
          'label': 'Name Your Wallet',
          'placeholder': '20 characters or shorter'
        },
        'pwd': {
          'label': 'Set Password',
          'placeholder': '8-20 characters. Letter, number or symbol'
        },
        'confirmPwd': {
          'label': 'Confirm Password',
          'placeholder': 'Please Enter Password Again'
        }
      },
      'file': {
        'title': 'Import Keystore File',
        'recoverAccount': 'Account Recover',
        'chooseStr': 'Create Wallet by Private Key',
        'chooseFileBtn': 'Choose Wallet File',
        'privKry': {
          'label': 'Keystore File',
          'placeholder': 'Choose From'
        },
        'confirmPwd': {
          'label': 'Keystore Password',
          'placeholder': 'Old Password'
        },
        'walletName': {
          'label': 'Name Your Wallet',
          'placeholder': '20 characters or shorter for Wallet Name'
        }
      }
    },
    'button': {
      'importPrivKey': 'Import',
      'importPrivKeyLoading': 'Loading'
    }
  },
  'header': {
    'nav': {
      'home': 'Home',
      'token': 'Token',
      'send': 'Send',
      'outlineSignTx': 'Offline Signature Trans.',
      'uniteAccountTx': 'Joint-Account Trans.',
      'logOut': 'Logout'
    }
  },
  'footer': {
    'noBlockSeq': 'Connecting Blockchain...',
    'synchronizedBlock': 'Synced Blocks',
    'currentBlock': 'Current Block Height',
    'nodeConnectionSize': 'Connected Peers'
  },
  'home': {
    'content': {
      'overallBalance': {
        'title': 'Balance',
        'accountAddress': 'Account Address',
        'copyBtn': 'Copy',
        'copyTip': 'Double-click to copy Account Address',
        'unsyncBlock': 'Blocks Syncing, Searching Balance Later'
      },
      'txStatus': {
        'success': 'Transaction Done',
        'processing': 'Processing',
        'balanceNotEnougn': 'Insufficient BU in Account',
        'feeNotEnoughActiveAccount': 'Insufficient Fee for Activation',
        'timeOut': 'Timeout',
        'fail': 'Failed'
      },
      'latestLocalTxRecord': {
        'title': 'Latest Local Transaction Records',
        'explain': 'Show active transactions received from </br>peer-to-peer network only. For all historical </br>transactions of your account, please visit </br>explorer.bumo.io',
        'noData': 'No Local Transaction Records yet',
        'tableHeader': {
          'status': 'Status',
          'time': 'Transaction Time',
          'srcAddr': 'From',
          'destAddr': 'To',
          'num': 'Value'
        },
        'pagination': {
          'total': 'Total',
          'unit': 'Page',
          'content': 'Items'
        },
        'dialog': {
          'title': 'Transaction Details',
          'hash': 'Transaction Hash',
          'time': 'Transaction Time',
          'txStatus': 'Transaction Status',
          'srcAddr': 'From',
          'destAddr': 'To',
          'amount': 'BU Value (BU)',
          'actualFee': 'Fee (BU)',
          'actualFeeComputing': 'Processing',
          'note': 'Note',
          'noNote': 'No Note yet',
          'close': 'Close'
        }
      }
    }
  },
  'token': {
    'content': {
      'overallBalance': {
        'title': 'Balance',
        'accountAddress': 'Account Address',
        'copyBtn': 'Copy',
        'copyTip': 'Double-click to copy Account Address',
        'unsyncBlock': 'Blocks Syncing, Searching Balance Later'
      },
      'txStatus': {
        'success': 'Transaction Done',
        'processing': 'Processing',
        'balanceNotEnougn': 'Insufficient BU in Account',
        'feeNotEnoughActiveAccount': 'Insufficient Fee for Activation',
        'timeOut': 'Timeout',
        'fail': 'Failed'
      },
      'latestLocalTxRecord': {
        'title': 'Latest Local Transaction Records',
        'explain': 'Show active transactions received from </br>peer-to-peer network only. For all historical </br>transactions of your account, please visit </br>explorer.bumo.io',
        'noData': 'No Local Transaction Records yet',
        'sendToken': 'Send',
        'tableHeader': {
          'status': 'Status',
          'time': 'Transaction Time',
          'srcAddr': 'From',
          'destAddr': 'To',
          'num': 'Value'
        },
        'pagination': {
          'total': 'Total',
          'unit': 'Page',
          'content': 'Items'
        },
        'dialog': {
          'title': 'Transaction Details',
          'hash': 'Transaction Hash',
          'time': 'Transaction Time',
          'txStatus': 'Transaction Status',
          'srcAddr': 'From',
          'destAddr': 'To',
          'amount': 'BU Value',
          'actualFee': 'Fee',
          'activationFee': 'Activation Fee',
          'actualFeeComputing': 'Processing',
          'note': 'Note',
          'noNote': 'No Note yet',
          'close': 'Close'
        }
      }
    }
  },
  'send': {
    'noSyncBlock': 'Syncing Blocks, transfer later',
    'form': {
      'currentTokenType': {
        'label': 'Asset Type',
        'placeholder': 'Select'
      },
      'destAddr': {
        'label': 'Receiver\'s Address',
        'placeholder': 'Account Address starts with \'bu\''
      },
      'sentAssetAmount': {
        'label': 'Amount',
        'placeholder': 'Within Available Balance',
        'balance': 'Available Balance'
      },
      'fee': {
        'label': 'Maximum Fee',
        'placeholder': 'Fill Fee'
      },
      'note': {
        'label': 'Note',
        'placeholder': 'Within 200 Characters'
      },
      'nextBtn': 'Send'
    },
    'dialog': {
      'title': 'Send Detail',
      'notice': 'After confirming transfer info, input password to process',
      'srcAddr': 'Sender\'s Address',
      'destAddr': 'Receiver\'s Address',
      'sentAssetAmount': 'Transfer Amount',
      'fee': 'Maximum Fee',
      'note': 'Note',
      'pwdPlaceholder': 'Wallet Password'
    }
  },
  'ost': {
    'buildTx': {
      'title': 'Build Transaction',
      'noSyncBlock': 'Syncing Blocks, transfer later',
      'buildBlobForm': {
        'srcAddr': {
          'label': 'Sender\'s Address',
          'placeholder': 'Standard Account Address Only'
        },
        'destAddr': {
          'label': 'Receiver\'s Address',
          'placeholder': 'Standard or Joint-Account Address'
        },
        'txAmount': {
          'label': 'Amount',
          'placeholder': 'Within Available Balance',
          'balance': 'Available Balance'
        },
        'fee': {
          'label': 'Maximum Fee'
        },
        'note': {
          'label': 'Note',
          'placeholder': 'Within 200 Characters'
        },
        'buildBlobBtn': 'Build TX-String'
      },
      'blobParserDetail': {
        'txDetail': {
          'title': 'parsing Tx-String',
          'srcAddr': 'Sender\'s Address',
          'destAddr': 'Receiver\'s Address',
          'txAmount': 'Amount',
          'fee': 'Maximum Fee',
          'note': 'Note',
          'noNote': 'No Note yet'
        },
        'unsignedBlob': {
          'title': 'TX-String to be signed',
          'notice': 'Please SAVE TX-String below for “Offline Signature”'
        },
        'clearBtn': 'Clear'
      }
    },
    'outlineSign': {
      'title': 'Offline Signature',
      'signBtn': 'Sign',
      'clearBtn': 'Clear',
      'unsignedBlob': {
        'title': 'TX-String to be signed',
        'placeholder': 'Please Paste Whole BLOB'
      },
      'parserDetail': {
        'title': 'parsing Tx-String',
        'noData': 'No results. Please paste TX-String in text box above. ',
        'srcAddr': 'Sender\'s Address',
        'destAddr': 'Receiver\'s Address',
        'txAmount': 'Amount',
        'note': 'Note',
        'noNote': 'No Note yet'
      },
      'dialog': {
        'title': 'Input Password',
        'placeholder': 'Password'
      },
      'unSubmittedBlob': {
        'title': 'TX-String to be submited (BLOB)',
        'notice': 'Please SAVE TX-String below for “Online Signature”'
      }
    },
    'submitTx': {
      'title': 'Submit Transaction',
      'signBtn': 'Submit',
      'clearBtn': 'Empty',
      'noSyncBlock': 'Syncing Blocks, submit later',
      'unsubmittedBlob': {
        'title': 'Tx-String to be transferred',
        'placeholder': 'Please Paste Whole BLOB'
      },
      'parserDetail': {
        'title': 'parsing Tx-String',
        'noData': 'No results. Please paste Tx-String in text box above. ',
        'srcAddr': 'Sender\'s Address',
        'destAddr': 'Receiver\'s Address',
        'txAmount': 'Transaction Amount',
        'note': 'Note',
        'noNote': 'No Note yet'
      }
    },
    'bottomBarComp': {
      'step1': {
        'title': '1. Build Transaction (Online)',
        'content': 'Fill in Transaction Info, get TX-String for signature'
      },
      'step2': {
        'title': '2. Offline Signature (Offline)',
        'content': 'Sender will sign on Tx-String Offline for Private Key Secure'
      },
      'step3': {
        'title': '3. Submit Transaction',
        'content': 'Sending signed TX-String in Blockchain'
      }
    }
  },
  'unite': {
    'listUniteAccount': {
      'title': 'Create Joint-Account',
      'noSyncBlock': 'Syncing Blocks, create later',
      'buildAccountForm': {
        'manageType': {
          'label': 'Joint Mode',
          'selfDisgin': 'User-Customed',
          'toolTip': 'M / N: N members of the </br>Joint-Account, M confirmations are </br>required to successful transaction </br>signed.'
        },
        'uniteAccountAddress': {
          'label': 'Joint-Account Address',
          'placeholder': ''
        },
        'memberNum': {
          'label': 'Members of Joint-Account',
          'placeholder': 'Please Define'
        },
        'items': {
          'label': 'Members of Joint-Account ',
          'placeholder': '',
          'itemAddr': 'Accounts Address',
          'itemWeight': 'Weight'
        },
        'masterWeight': {
          'label': 'Threshold Weight',
          'placeholder': 'More than zero, less than total Weight of all members',
          'tips': 'Transfer done when signed Account Weight ≥Threshold Weight'
        },
        'fee': {
          'label': 'Maximum Fee',
          'placeholder': '',
          'tips': 'Fee can be fixed when it is between 0.01-10, but no less than Wallet brokerage '
        },
        'subBtnText': 'Create'
      },
      'checkAccountModal': {
        'checkBtnText': 'Search Joint-Account',
        'checkModal': {
          'title': 'Search Joint-Account',
          'placeholder': 'Input Joint-Account Address Here',
          'subBtnText': 'Submit',
          'cancelBtnText': 'Cancel'
        },
        'resultModal': {
          'title': 'Search Joint-Account',
          'resultAddr': ' Joint-Account Address ',
          'resultBalance': 'Balance',
          'masterWeight': 'Master Weight',
          'signerAddr': 'Joint-Account Address',
          'signerWeight': 'Weight',
          'closeBtnText': 'Close'
        }
      },
      'creatSuccessPage': {
        'pageTile': 'Joint-Account Created!',
        'addr': 'Your Joint-Account Address',
        'clearBtnText': 'Clear',
        'pageTips': {
          'title': 'Notice',
          'no1': 'Wallet will NOT save Joint-Account Address, do SAVE it somewhere safe. ',
          'no2': 'Least 10 seconds for Transaction Confirmation, insufficient Transaction Fee will cause failure when creating Joint-Account '
        },
        'clearModal': {
          'clearTips': 'Joint-Account can NOT be saved by BUMO Wallet, please SAVE somewhere safe.',
          'backBtn': 'Back',
          'goBtn': 'Recorded'
        }
      },
      'pwdModal': {
        'title': 'Input Password',
        'modalTips': 'For ACCOUNT SECURE, please make sure NOT being watched while typing your private information',
        'placeholder': 'Password',
        'enterBtnText': 'Confirm',
        'cancelBtnText': 'Cancel'
      }
    },
    'buildTx': {
      'title': 'Build Transaction',
      'noSyncBlock': 'Syncing Blocks, transferring later',
      'buildBlobForm': {
        'srcAddr': {
          'label': 'Payment Joint-Account Address',
          'placeholder': ' Joint-Account Address only'
        },
        'destAddr': {
          'label': 'Receiver\'s Address ',
          'placeholder': 'Standard or Joint-Account Address'
        },
        'txAmount': {
          'label': 'Amount',
          'placeholder': 'Within Available Balance',
          'balance': 'Available Balance'
        },
        'fee': {
          'label': 'Maximum Fee'
        },
        'note': {
          'label': 'Note',
          'placeholder': 'Within 200 characters'
        },
        'buildBlobBtn': 'Build Tx-String'
      },
      'blobParserDetail': {
        'txDetail': {
          'title': 'parsing Tx-String',
          'srcAddr': 'Sender\'s Address',
          'destAddr': 'Receiver\'s Address',
          'txAmount': 'Transfer Amount',
          'fee': 'Maximum Fee',
          'note': 'Note',
          'noNote': 'No Note yet'
        },
        'unsignedBlob': {
          'title': 'Tx-String to be signed',
          'notice': 'Please SAVE Strings below then go to “Offline Signature”.'
        },
        'clearBtn': 'Clear'
      }
    },
    'outlineSign': {
      'title': 'Transaction Signature',
      'signBtn': 'Sign',
      'clearBtn': 'Empty',
      'unsignedBlob': {
        'title': 'Tx-String to be signed',
        'placeholder': 'Please Paste Whole BLOB'
      },
      'parserDetail': {
        'title': 'parsing Tx-String',
        'noData': 'No results. Please paste Tx-String in text box above. ',
        'srcAddr': 'Sender\'s Address',
        'destAddr': 'Receiver\'s Address',
        'txAmount': 'Transfer Amount',
        'note': 'Note',
        'noNote': 'No Note yet',
        'signedUniteMember': 'Signed Joint-Account Members',
        'noSignedUniteMember': 'No Member Signed yet.'
      },
      'dialog': {
        'title': 'Input Password',
        'placeholder': 'Password'
      },
      'unSubmittedBlob': {
        'title': 'Tx-String to be transferred (BLOB)',
        'notice': 'Please SAVE Strings below for “Online Transaction”'
      }
    },
    'submitTx': {
      'title': 'Submit Transaction',
      'signBtn': 'Submit',
      'clearBtn': 'Clear',
      'noSyncBlock': 'Syncing Blocks, submit later',
      'unsubmittedBlob': {
        'title': 'Tx-String to be submitted (BLOB)',
        'placeholder': 'Please Paste Whole BLOB'
      },
      'parserDetail': {
        'title': 'parsing Tx-String',
        'noData': 'No results. Please paste Tx-String in text box above. ',
        'srcAddr': 'Sender\'s Address',
        'destAddr': 'Receiver\'s Address',
        'txAmount': 'Transaction Amount',
        'note': 'Note',
        'noNote': 'No Note yet',
        'signedUniteMember': 'Signed Joint-Account Members',
        'noSignedUniteMember': 'No Member Signed yet.'
      }
    },
    'bottomBarComp': {
      'step1': {
        'title': '1. Create Joint-Account',
        'content': 'Create New Joint-Account for </br>  Joint Mode'
      },
      'step2': {
        'title': '2. Build Transaction',
        'content': 'Fill Transfer Info to create </br> Tx-String to be signed'
      },
      'step3': {
        'title': '3. Signatures for Transaction',
        'content': 'Account Members will sign</br>for Tx-String iteratively'
      },
      'step4': {
        'title': '4. Submit Transaction',
        'content': 'Publish the Tx-String already signed on </br> Blockchain'
      }
    }
  },
  'mySet': {
    'basicInfo': {
      'title': 'Basic Info',
      'walletName': 'Wallet Name',
      'walletAddress': 'Account Address'
    },
    'privKeyInfo': {
      'title': 'Private Key Info',
      'privKey': 'Private Key',
      'savePrivKeyFile': 'Save Private Key Info',
      'button': {
        'show': 'Private Key Visible',
        'hide': 'Private Key Hidden',
        'backup': 'Keystore File Backup'
      },
      'warningTxt': 'Wallet Password can’t be recovered, you can only create a new Wallet using Private Key once forgotten',
      'dialog': {
        'title': 'Input Password',
        'notice': 'For Account Secure, please make sure not being watched while typing your private info',
        'inputPwdPlaceholder': 'Password'
      }
    },
    'walletLanguage': {
      'title': 'Language'
    },
    'walletStorePath': {
      'title': 'Store Path for File',
      'ledgerPath': 'Ledger Path',
      'keyStorePath': 'KeyStore File Path'
    },
    'versionInfo': {
      'title': 'Version',
      'currentVersion': 'Current Version',
      'content': 'Latest Version',
      'clickThere': 'Click Here',
      'updateNow': 'Upgrade Now',
      'nowIsLast': 'Latest Version Now'
    }
  },
  'page': {
    'account': {
      'w': 'w'
    }
  },
  'error': {
    'currentTokenType': 'Please Choose Token',
    'walletPwdEmpty': 'Please Enter Password',
    'walletName': {
      'empty': 'Please Choose Account',
      'createEmpty': 'Please Input Wallet Name',
      'limit': 'Invalid Wallet Name [1-20 Chinese or English characters. Letter, number or symbol]'
    },
    'pwd': {
      'empty': 'Please Enter Password',
      'createEmpty': 'Wallet Password',
      'wrong': 'Wrong Password',
      'limit': '8-20 characters, at least one number or symbol',
      'confirmPwdEmpty': 'Please Enter Password Again',
      'differentPwdInput': 'Password Inconsistent'
    },
    'addrEmpty': 'Account Address can NOT be empty',
    'notUniteAccount': 'Not a Joint-Account Recorded',
    'inputDestAddr': 'Please Enter Receiver\'s Address',
    'sendSelf': 'Self-Transfer Forbidden',
    'unactivedAccount': 'Wallet Account NOT activated, activate it by transferring to the Account',
    'unactivedCantCreate': 'Wallet Account NOT activated, activate it by transferring to the Account',
    'manageType': {
      'empty': 'Please Choose Joint Mode'
    },
    'memberNum': {
      'empty': 'Please choose members for Joint-Account'
    },
    'uniteAccountAddress': {
      'empty': 'Please fill in Address of Joint-Account'
    },
    'masterWeight': {
      'empty': 'Please Enter Threshold Weight',
      'limit': 'Choose integer from 1-10000',
      'weightLessThanMasterWeight': 'Sum Weight ≥ Weight of Joint-Account'
    },
    'signertHresholds': {
      'empty': 'Please Enter Distributed Weight',
      'limit': 'Choose integer from 1-10000'
    },
    'signerAddr': {
      'empty': 'Please Enter Signature Account Address',
      'sameMember': 'Member already chosen'
    },
    'srcAddr': {
      'empty': 'Please fill in Sender\'s Address',
      'uniteEmpty': 'Enter Address of Joint-Account'
    },
    'destAddr': {
      'empty': 'Please fill in Receiver\'s Address',
      'srcSameAsDest': 'Receiver\'s Address can NOT be here'
    },
    'txAmount': {
      'empty': 'Transferring Amount can NOT be Empty',
      'lessThanZero': 'More than 0',
      'moreThanAvailable': 'Please within your Available Balance',
      'notNum': 'Amount should be numbers',
      'numTooBig': 'Over Transfer Limit',
      'numLimit': 'Transfer Shall be more than 0, with a maximum of 8 decimal places',
      'tokenNum': 'Amount should be positive integer'
    },
    'fee': {
      'empty': 'Fill in Transaction Fee',
      'lessThanZero': 'Fee ＞ 0',
      'numLimit': 'Fee Shall be more than 0, with a maximum of 8 decimals',
      'numTooBig': 'Over Fee Required',
      'numBig': 'Fee (BU) shall be numbers that ≤ 10',
      'numSmall': 'Transaction fee is not sufficient'
    },
    'note': {
      'limit200': 'Within 200 characters'
    }
  },
  'errorUtil': {
    'ERRORS': {
      'SUCCESS': 'Pass',
      'FAIL': 'Fail',
      'INVALID_ACCOUNT_PWD': 'Wrong Password',
      'RECOVER_ACCOUNT_ERROR': 'Invalid Private Key',
      'NICKNAME_EXISTS_ERROR': 'Wallet Name Already Exists',
      'SAVE_ACCOUNT_PRIVATE_KEY_FIEL_ERROR': 'Failed to Export Private Key File',
      'CREATE_ACCOUNT_ERROR': 'Failed to Created Account',
      'INVALID_ACCOUNT_ADDRESS': 'Invalid Account Address',
      'NO_EXIST_ACCOUNT_ADDRESS': ' Account Address Not Exist',
      'SET_UNIT_WEIGHT_ERROR': 'Weight too Small for Managing',
      'ACCOUNT_BU_TOKEN_NOT_ENOUGH_ERROR': 'Insufficient BU',
      'ACCOUNT_NOT_ENOUGH_FOR_FEE_ERROR': 'Insufficient BU for Transaction',
      'NOT_ACTIVE_ACCOUNT_ERROR': 'Not Activated yet',
      'NOT_ADD_SIGNER_ACCOUNT_ERROR': 'No Signature Account Address yet',
      'NOT_ENOUGH_WEIGHT_ERROR': 'Weight too Small for Transaction',
      'INVALID_TX_BLOB_STR_ERROR': 'Invalid Tx-String',
      'ACCOUNT_LOW_RESERVE_ERROR': 'Insufficient BU',
      'INVALID_TX_NONCE_ERROR': 'Submitted Already',
      'NOT_ENOUGH_TX_FEE_ERROR': 'Insufficient BU for Fee',
      'TX_TIMEOUT_ERROR': 'Timeout',
      'SUBMIT_TX_ERROR': 'Fail to Submit',
      'NOT_NORMAL_ACCOUNT': 'For Standard Account Address Only',
      'NOT_UNIT_ACCOUNT': 'For Joint-Account Address Only',
      'NET_OFFLINE': 'Network NOT Available, Please Reconnect'
    }
  },
  'msg': {
    'succ': {
      'default': 'Successful Transaction',
      'copySucc': 'Successfully Copied',
      'acceptTx': 'Transaction Accepted',
      'buildSucc': 'Tx-String Generated',
      'recoverAccount': 'Account Recovered',
      'privKeyImport': 'Private Key Imported',
      'privKeyBackup': 'Private Key File Backup DONE'
    },
    'error': {
      'formErr': 'Please fill info by rules'
    },
    'warning': {
      'fileEmpty': 'Please Choose Wallet File',
      'walletNameEmpty': 'Please Input Wallet Name',
      'walletNameLimit': 'Invalid Wallet Name [1-20 Characters. Chinese, English or Numbers Only]',
      'walletPwdEmpty': 'Please Enter Wallet Password',
      'clearTextEmpty': 'Please paste Account’s Private Key',
      'pwdLimit': '8-20 characters, at least one number or symbol',
      'confirmPwdEmpty': 'Please Enter Password Again',
      'differentPwdInput': 'Password Inconsistent'
    }
  },
  i: {
    locale: 'en-US',
    select: {
      placeholder: 'Select',
      noMatch: 'No matching data',
      loading: 'Loading'
    },
    table: {
      noDataText: 'No Data',
      noFilteredDataText: 'No filter data',
      confirmFilter: 'Confirm',
      resetFilter: 'Reset',
      clearFilter: 'All'
    },
    datepicker: {
      selectDate: 'Select date',
      selectTime: 'Select time',
      startTime: 'Start Time',
      endTime: 'End Time',
      clear: 'Clear',
      ok: 'OK',
      datePanelLabel: '[mmmm] [yyyy]',
      month: 'Month',
      month1: 'January',
      month2: 'February',
      month3: 'March',
      month4: 'April',
      month5: 'May',
      month6: 'June',
      month7: 'July',
      month8: 'August',
      month9: 'September',
      month10: 'October',
      month11: 'November',
      month12: 'December',
      year: 'Year',
      weekStartDay: '0',
      weeks: {
        sun: 'Sun',
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat'
      },
      months: {
        m1: 'Jan',
        m2: 'Feb',
        m3: 'Mar',
        m4: 'Apr',
        m5: 'May',
        m6: 'Jun',
        m7: 'Jul',
        m8: 'Aug',
        m9: 'Sep',
        m10: 'Oct',
        m11: 'Nov',
        m12: 'Dec'
      }
    },
    transfer: {
      titles: {
        source: 'Source',
        target: 'Target'
      },
      filterPlaceholder: 'Search here',
      notFoundText: 'Not Found'
    },
    modal: {
      okText: 'OK',
      cancelText: 'Cancel'
    },
    poptip: {
      okText: 'OK',
      cancelText: 'Cancel'
    },
    page: {
      prev: 'Previous Page',
      next: 'Next Page',
      total: 'Total',
      item: 'item',
      items: 'items',
      prev5: 'Previous 5 Pages',
      next5: 'Next 5 Pages',
      page: '/page',
      goto: 'Goto',
      p: ''
    },
    rate: {
      star: 'Star',
      stars: 'Stars'
    },
    tree: {
      emptyText: 'No Data'
    }
  }
}
