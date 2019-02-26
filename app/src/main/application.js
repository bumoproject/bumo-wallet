'use strict'
import {app, BrowserWindow, ipcMain, globalShortcut, Menu} from 'electron'
import path from 'path'
import proc from 'child_process'
import cfg from '../config'
import fs from 'fs'
// import asar from 'asar'
var syncNode = null
var subprocessTimer = null

export default class Application {
  constructor () {
    this.winURL = process.env.NODE_ENV === 'development'
      ? `http://localhost:${require('../../../config').port}`
      : `file://${__dirname}/index.html`
    this.mainWindow = undefined
  }
  createWindow () {
    this.mainWindow = new BrowserWindow({
      width: 1000,
      height: 620,
      autoHideMenuBar: true,
      maximizable: false,
      resizable: false,
      frame: false
    })
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.webContents.openDevTools()
    }
    this.mainWindow.loadURL(this.winURL)
    this.mainWindow.on('closed', () => {
      this.mainWindow = null
      if (syncNode === null) {
        return
      }
      try {
        syncNode.stdin.write('exit\n')
        subprocessTimer = setTimeout(() => {
          console.log('bumo wallet terminate subprocess')
          syncNode.kill()
        }, 8000)
      } catch (error) {
        console.log('error: ' + error)
        syncNode.kill()
      }
    })
    ipcMain.on('close', e => {
      if (process.platform === 'darwin') {
        this.mainWindow.minimize()
      } else {
        this.mainWindow.close()
      }
    })
    ipcMain.on('min', e => this.mainWindow.minimize())
    ipcMain.on('max', e => {
      if (this.mainWindow.isMaximized()) {
        this.mainWindow.unmaximize()
      } else {
        this.mainWindow.maximize()
      }
    })
  }
  makeSingleInstance () {
    if (process.platform === 'darwin') {
      return false
    }
    return app.makeSingleInstance(function () {
      if (this.mainWindow) {
        if (this.mainWindow.isMinimized()) {
          this.mainWindow.restore()
        }
        this.mainWindow.focus()
      }
    })
  }
  onReady () {
    this.createWindow()
    if (process.env.NODE_ENV !== 'development' && process.platform === 'darwin') {
      this.copyBuchain()
    }
    console.log(process.env.NETWORK_TYPE)
    if (process.env.NETWORK_TYPE === 'Lite') {
      console.log('Bumo do not launch!!!')
    } else {
      this.startBumo()
      console.log('Bumo has start synchronous....')
    }
    this.registerShortcut()
    this.setAppMenu()
  }
  setAppMenu () {
    var template = [{
      label: 'Application',
      submenu: [
        { label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
        { type: 'separator' },
        {label: 'Quit', accelerator: 'Command+Q', click: function () { app.quit() }}
      ]}, {
        label: 'Edit',
        submenu: [
            { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
            { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
            { type: 'separator' },
            { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
            { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
            { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
            { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
        ]}
    ]
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  }
  getApplicationPath () {
    var appPath = null
    if (process.env.NODE_ENV !== 'development' && process.platform === 'darwin') {
      appPath = app.getPath('appData') + '/' + cfg.walletCatalog
    } else {
      if (process.platform === 'win32') {
        if (process.execPath.endsWith('electron.exe')) {
          appPath = path.resolve(path.dirname(process.execPath), '../../..', '')
        } else {
          appPath = path.resolve(path.dirname(process.execPath), '', '')
        }
      } else if (process.platform === 'darwin') {
        appPath = path.resolve(path.dirname(process.execPath), '../../../../../..', '')
      }
    }
    console.log('main appPath: ' + appPath)
    return appPath
  }
  registerShortcut () {
    var that = this
    globalShortcut.register('CommandOrControl+Alt+I', function () {
      that.mainWindow.webContents.openDevTools()
    })
    // 注册一个打开高级功能快捷键
    globalShortcut.register('CommandOrControl+Alt+G', function () {
      console.log('bumo wallet show-wallet-advanced:')
      that.mainWindow.webContents.send('show-wallet-advanced', 'open')
    })
    // 注册一个enter快捷键
    // globalShortcut.register('Return', function () {
    //   that.mainWindow.webContents.send('enter')
    // })
  }
  startBumo () {
    let bumoExePath = null
    if (process.env.NODE_ENV !== 'development') {
      bumoExePath = this.getApplicationPath() + '/buchain/bin/bumo'
    } else {
      bumoExePath = this.getApplicationPath() + '/buchain/' + ((process.platform === 'darwin') ? 'mac' : 'win') + '/bin/bumo'
    }
    console.log('startBUmo bumoExePath: ' + bumoExePath)
    syncNode = proc.spawn(bumoExePath, ['--console'])
    syncNode.on('error', function (err) {
      console.log('faild to start buchain' + err)
      syncNode = null
    })
    syncNode.stdout.on('data', function (data) {
      console.log('start buchain :' + data.toString())
    })
    syncNode.on('close', () => {
      if (subprocessTimer !== null) {
        clearTimeout(subprocessTimer)
      }
    })
  }
  copyBuchain () {
    var bumoWalletPath = app.getPath('appData') + '/' + cfg.walletCatalog
    var asarPath = app.getAppPath()
    console.log('asarPath: ' + asarPath)
    var catalogList = ['bin', 'config', 'data', 'jslib', 'log']
    console.log(app.getPath('appData') + '/' + cfg.walletCatalog)

    if (!fs.existsSync(bumoWalletPath)) {
      fs.mkdirSync(bumoWalletPath)
    }
    if (!fs.existsSync(bumoWalletPath + '/buchain')) {
      fs.mkdirSync(bumoWalletPath + '/buchain')
    }
    for (var c of catalogList) {
      var catalogPath = app.getPath('appData') + '/' + cfg.walletCatalog + '/buchain/' + c
      console.log(catalogPath)
      if (!fs.existsSync(catalogPath)) {
        fs.mkdirSync(catalogPath)
      }
      var fileArr = fs.readdirSync(asarPath + '/dist/buchain/' + c)

      for (var f of fileArr) {
        if (f === '.DS_Store') { continue }
        console.log(asarPath + '/dist/buchain/' + c + '/' + f)
        var fileData = fs.readFileSync(asarPath + '/dist/buchain/' + c + '/' + f)
        fs.writeFileSync(catalogPath + '/' + f, fileData, {'mode': '0777'})
      }
    }
  }

  registerApplicationCallback () {
    app.on('ready', this.onReady.bind(this))
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
    app.on('activate', () => {
      if (this.mainWindow === null) {
        this.createWindow()
      }
    })
    var handleStartupEvent = function () {
      if (process.platform !== 'win32') {
        return false
      }
      var squirrelCommand = process.argv[1]

      switch (squirrelCommand) {
        case '--squirrel-install':
        case '--squirrel-updated':
          install()
          return true
        case '--squirrel-uninstall':
          uninstall()
          app.quit()
          return true
        case '--squirrel-obsolete':
          app.quit()
          return true
      }

      function install () {
        var cp = require('child_process')
        var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe')
        var target = path.basename(process.execPath)
        var child = cp.spawn(updateDotExe, [
          '--createShortcut', target
        ], {detached: true})
        child.on('close', function (code) {
          app.quit()
        })
      }
      function uninstall () {
        var cp = require('child_process')
        var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe')
        var target = path.basename(process.execPath)
        var child = cp.spawn(updateDotExe, [
          '--removeShortcut', target
        ], {detached: true})
        child.on('close', function (code) {
          app.quit()
        })
      }
    }

    if (handleStartupEvent()) {
      return
    }
  }

  run () {
    var shouldQuit = this.makeSingleInstance()
    if (shouldQuit) return app.quit()
    this.registerApplicationCallback()
  }
}
