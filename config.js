'use strict'

const path = require('path')

let config = {
  // Name of electron app
  // Will be used in production builds
  name: 'BumoWallet',
  // Use ESLint (extends `standard`)
  // Further changes can be made in `.eslintrc.js`
  eslint: true,

  // webpack-dev-server port
  port: 36007,

  // electron-packager options
  // Docs: https://simulatedgreg.gitbooks.io/electron-vue/content/docs/building_your_app.html
  building: {
    arch: 'x64',
    asar: true,
    dir: path.join(__dirname, 'app'),
    'app-copyright': 'BUMO foundation',
    icon: path.join(__dirname, 'app/icons/logo'),
    ignore: /\b(src|index\.ejs|icons)\b/,
    out: path.join(__dirname, 'build'),
    overwrite: true,
    versionStringCompanyName: 'bumoWallet',
    versionStringProductName: 'bumoWallet',
    platform: process.env.PLATFORM_TARGET || 'all',
    'version-string': {
      'CompanyName': 'BUMO foundation',
      'FileDescription': 'BumoWallet',
      'OriginalFilename': 'BumoWallet',
      'ProductName': 'BumoWallet',
      'InternalName': 'BumoWallet'
    }
  }
}

config.building.name = config.name

module.exports = config
