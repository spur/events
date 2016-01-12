var webpack = require('webpack');
var ip = require('ip');

module.exports = {
  devtool: "source-map",
  devServer: {
    historyApiFallback: true
  },
  entry: [
    'webpack-dev-server/client?http://' + ip.address() + ':8080',
    './test/index.html',
    './test/index.jsx'
  ],
  output: {
    filename: 'bundle.js',
    path: __dirname
  },
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: "style!css!less"
      },
      {
        test: /\.jsx?$/,
        loader: 'jsx-loader',
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'React': 'react'
    })
  ],
  historyApiFallback: true
};
