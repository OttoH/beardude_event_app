var webpack = require('webpack')
var path = require('path')
var fs = require('fs')

var HtmlWebpackPlugin = require('html-webpack-plugin')

const browserBabelCfg = () => {
  const babelCfg = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'))
  babelCfg.plugins.shift()
  babelCfg.babelrc = false
  return babelCfg
}

module.exports = {
  context: path.resolve(__dirname, './'),

  entry: {
    main: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:3030',
      'webpack/hot/only-dev-server',
      'babel-polyfill',
      'whatwg-fetch',
      './src/index.js'
    ]
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
    new webpack.DefinePlugin({
      'SERVICE_URL': JSON.stringify('http://localhost:1337')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/statics/views/sharePage.ejs', // input
      filename: 'index.html',
      favicon: './src/statics/assets/imgs/favicon.ico'
    })
  ],

  devtool: 'cheap-module-eval-source-map',

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
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
              limit: 10000,
              publicPath: 'http://localhost:3030/'
            }
          }
        ]
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            query: {
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
      }
    ]
  },

  resolve: {
    extensions: ['*', '.js', '.jsx', 'css'],
    modules: ['node_modules']
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.map'
  },

  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    hot: true,
    publicPath: '/',
    historyApiFallback: true,
    port: 3030,
    proxy: {
      '/api/**/**': {
        target: 'http://localhost:1337',
        secure: false,
        changeOrigin: true
      }
    }
  }
}
