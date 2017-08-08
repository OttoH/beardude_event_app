const webpack = require('webpack')
const path = require('path')
var fs = require('fs')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const WebpackChunkHash = require('webpack-chunk-hash')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const publicPath = '/dist'
const outputPath = path.join(__dirname, publicPath)

const browserBabelCfg = () => {
  const babelCfg = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'))
  babelCfg.plugins.shift()
  babelCfg.babelrc = false
  return babelCfg
}

const plugins = [
  new CleanWebpackPlugin([outputPath]),
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor'],
    minChunks: Infinity
  }),
  new webpack.optimize.CommonsChunkPlugin({
    names: 'core'
  }),
  new webpack.HashedModuleIdsPlugin(),
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'production'
  }),
  new webpack.DefinePlugin({
    'SERVICE_URL': JSON.stringify('http://azai.synology.me:8888')
  }),
  new WebpackChunkHash(),
  new ManifestPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: true
    }
  }),
  new ExtractTextPlugin({
    filename: '[name].[contenthash].css',
    allChunks: true
  }),
  new HtmlWebpackPlugin({
    template: './src/statics/views/sharePage.ejs', // input
    filename: 'index.html',
    favicon: './src/statics/assets/imgs/favicon.ico'
  })
]

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2000,
              publicPath: (process.env.NODE_ENV === 'production') ? './' : undefined
            }
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: browserBabelCfg()
          }
        ]

      },
      {
        test: /\.(png|jpg|woff)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              query: {
                minimize: true,
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        })
      }
    ]
  },
  entry: {
    main: [
      'babel-polyfill', './src/index'
    ],
    vendor: [
      'react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'url-search-params-polyfill', 'socket.io-client', 'whatwg-fetch'
    ]
  },
  devtool: 'source-map',
  output: {
    path: outputPath,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: `/`
  },
  plugins: plugins,
  resolve: {
    extensions: ['*', '.js', '.css'],
    modules: ['node_modules']
  },
  stats: {
    assets: true,
    cached: false,
    children: false,
    chunks: true,
    chunkModules: true,
    chunkOrigins: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
    modules: true,
    publicPath: true,
    reasons: false,
    source: false,
    timings: false,
    version: false,
    warnings: false
  }
}
