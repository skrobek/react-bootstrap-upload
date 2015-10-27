var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  context: __dirname + "/src",
  entry: {
    javascript: "./index.js",
    html: "./index.html",
    css: "./styles.scss"
  },

  output: {
    filename: "index.js",
    path: __dirname + "/build",
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel-loader?experimental&stage=0"],
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loaders: ["react-hot", "babel-loader?experimental&stage=0"],
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", "css!sass")
      }
    ],
  },

  plugins: [
    new ExtractTextPlugin("style.css", {
        allChunks: true
    })
  ]
}
