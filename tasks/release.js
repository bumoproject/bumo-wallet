'use strict'

const exec = require('child_process').exec
const packager = require('electron-packager')
const fs = require('fs-extra')
const path = require('path')

// process.env.BD_ENV && (process.env.PLATFORM_TARGET = 'darwin')
if (process.env.PLATFORM_TARGET === 'clean') {
  require('del').sync(['builds/*', '!.gitkeep'])
  console.log('\x1b[33m`builds` directory cleaned.\n\x1b[0m')
} else pack()

/**
 * Build webpack in production
 */
function pack () {
  console.log('\x1b[33mBuilding webpack in production mode...\n\x1b[0m')
  let pack = process.env.NETWORK_TYPE === 'Lite' ? exec('npm run pack-Lite') : exec('npm run pack')

  pack.stdout.on('data', data => console.log(data))
  pack.stderr.on('data', data => console.error(data))
  pack.on('exit', code => build())
}

/**
 * Use electron-packager to build electron app
 */
function build () {
  let options = require('../config').building

  console.log('\x1b[34mBuilding electron app(s)...\n\x1b[0m')
  packager(options, (err, appPaths) => {
    if (err) {
      console.error('\x1b[31mError from `electron-packager` when building app...\x1b[0m')
      console.error(err)
    } else {
      console.log('Build(s) successful!')
      console.log(appPaths)
      if (process.platform === 'win32') {
        var from = path.resolve(__dirname, '..', '') + '/buchain/'+ ((process.platform === 'darwin') ? 'mac' : 'win')
        var to = appPaths + '/buchain'
        fs.copy(from, to, err => {
          if (err) return console.error(err)
          console.log('success!')
        })
      }
      console.log('\n\x1b[34mDONE\n\x1b[0m')
    }
  })
}
