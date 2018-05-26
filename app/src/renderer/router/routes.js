const Login = resolve => {
  import('@/views/account/login').then(module => {
    resolve(module)
  })
}

const AccountCreate = resolve => {
  import('@/views/account/create').then(module => {
    resolve(module)
  })
}

const AccountBackups = resolve => {
  import('@/views/account/backups').then(module => {
    resolve(module)
  })
}

const AccountBase = resolve => {
  import('@/views/account/base').then(module => {
    resolve(module)
  })
}

const AccountRecoverByPrivateKeyStr = resolve => {
  import('@/views/account/recover-privateKeyStr').then(module => {
    resolve(module)
  })
}

const AccountRecoverByPrivateKeyFile = resolve => {
  import('@/views/account/recover-privateKeyFile').then(module => {
    resolve(module)
  })
}

const AccountCreateSuccess = resolve => {
  import('@/views/account/createSuccess').then(module => {
    resolve(module)
  })
}

const MySet = resolve => {
  import('@/views/account/myset').then(module => {
    resolve(module)
  })
}

const Main = resolve => {
  import('@/views/index').then(module => {
    resolve(module)
  })
}

const WalletContent = resolve => {
  import('@/views/content').then(module => {
    resolve(module)
  })
}

const Unite = resolve => {
  import('@/views/unite/index').then(module => {
    resolve(module)
  })
}

const Tx = resolve => {
  import('@/views/tx/index').then(module => {
    resolve(module)
  })
}

// const TxList = resolve => {
//   import('@/views/tx/list').then(module => {
//     resolve(module)
//   })
// }

const Welcome = resolve => {
  import('@/views/welcome').then(module => {
    resolve(module)
  })
}

const UpdateVersion = resolve => {
  import('@/views/version').then(module => {
    resolve(module)
  })
}

const OutlineSignTx = resolve => {
  import('@/views/ost/index').then(module => {
    resolve(module)
  })
}

const routes = [
  {
    path: '/account',
    name: '创建账户',
    component: AccountBase,
    children: [{
      path: '/account/create',
      name: 'accountCreate',
      component: AccountCreate
    },
    {
      path: '/account/recover',
      name: 'accountRecoverByPrivateKeyStr',
      component: AccountRecoverByPrivateKeyStr
    },
    {
      path: '/account/recover/privateKeyFile',
      name: 'accountRecoverByPrivateKeyFile',
      component: AccountRecoverByPrivateKeyFile
    },
    {
      path: '/account/backups',
      name: 'accountBackups',
      component: AccountBackups
    },
    {
      path: '/account/createSuccess',
      name: 'accountCreateSuccess',
      component: AccountCreateSuccess
    }]
  },
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/updateVersion',
    name: 'updateVersion',
    component: UpdateVersion
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: Welcome
  },
  {
    path: '/index',
    name: 'index',
    redirect: '/index/content',
    component: Main,
    children: [
      {
        path: '/index/content',
        name: 'walletContent',
        component: WalletContent
      },
      {
        path: '/account/myset',
        name: 'accountMySet',
        component: MySet
      }]
  },
  {
    path: '/tx',
    name: 'tx',
    component: Main,
    redirect: '/tx/index',
    children: [{
      path: '/tx/index',
      name: 'Tx',
      component: Tx
    }]
  },
  {
    path: '/unite',
    name: 'unite',
    component: Main,
    redirect: '/unite/index',
    children: [{
      path: '/unite/index',
      name: 'Unite',
      component: Unite
    }]
  },
  {
    path: '/ost',
    name: 'ost',
    component: Main,
    redirect: '/ost/index',
    children: [{
      path: '/ost/index',
      name: 'ostBuildTx',
      component: OutlineSignTx
    }]
  }
]
export default routes
