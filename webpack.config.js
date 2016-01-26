var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DEBUG = JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))

module.exports = {
  context: __dirname + '/src',
  entry: {
    javascript: './index.js',
    html: './index.html',
    css: './styles.scss'
  },

  resolve: {
    modulesDirectories: ['node_modules', 'src/scripts']
  },

  output: {
    filename: 'index.js',
    path: __dirname + '/build',
  },

  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel?presets[]=es2015,presets[]=stage-0,presets[]=react']
      },
      {
        test: /\.json?$/,
        exclude: /node_modules/,
        loaders: ['json']
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.scss$/,
        loaders: DEBUG ? ['style', 'css', 'sass'] : ExtractTextPlugin.extract('style-loader', 'css!sass')
      }
    ],
  },

  sassLoader: {
    includePaths: ['./src/styles/sass']
  },

  plugins: [
    new ExtractTextPlugin('style.css', {
        allChunks: true
    }),
    new webpack.DefinePlugin({
      __DEV__: DEBUG
    })
  ]
};
