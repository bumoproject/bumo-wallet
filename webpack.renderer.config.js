'use strict'

process.env.BABEL_ENV = 'renderer'
const path = require('path')
const pkg = require('./app/package.json')
const settings = require('./config.js')
const webpack = require('webpack')
const fs = require('fs-extra')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
let rendererConfig = {
  devtool: '#eval-source-map',
  devServer: { overlay: true },
  entry: {
    renderer: path.join(__dirname, 'app/src/renderer/main.js')
  },
  externals: Object.keys(pkg.dependencies || {}),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [ path.resolve(__dirname, 'app/src/renderer') ],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            loaders: {
              sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
              scss: 'vue-style-loader!css-loader!sass-loader',
              less: 'vue-style-loader!css-loader!less-loader'
            }
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'imgs/[name].[ext]'
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './app/index.ejs',
      appModules: process.env.NODE_ENV !== 'production'
        ? path.resolve(__dirname, 'app/node_modules')
        : false
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'app/dist')
  },
  resolve: {
    alias: {
      'components': path.join(__dirname, 'app/src/renderer/components'),
      '@': path.join(__dirname, 'app/src/renderer')
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node'],
    modules: [
      path.join(__dirname, 'app/node_modules'),
      path.join(__dirname, 'node_modules')
    ]
  },
  target: 'electron-renderer'
}
if (process.env.NODE_ENV !== 'production') {
  /**
   * Apply ESLint
   */
  if (settings.eslint) {
    rendererConfig.module.rules.push(
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      }
    )
  }
  if(process.platform === 'darwin' && process.env.NODE_ENV === 'renderer'){
    var from = __dirname + '/buchain/' + ((process.platform === 'darwin') ? 'mac' : 'win')
    var to = __dirname + '/app/dist/buchain'
    try {
      fs.copySync(from, to)
      console.log('copy buchain success!')
    } catch (err) {
      console.error(err)
    }
  }
}

/**
 * Adjust rendererConfig for production settings
 */
console.log(process.env.NETWORK_TYPE + '-------NETWORK_TYPE----')
rendererConfig.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NETWORK_TYPE': (process.env.NETWORK_TYPE === 'Lite' || process.env.NETWORK_TYPE === 'test') ? JSON.stringify(process.env.NETWORK_TYPE) : '"Full"'
  })
)

if (process.env.NODE_ENV === 'production') {
  rendererConfig.devtool = ''
  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
}

module.exports = rendererConfig
