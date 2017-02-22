const path              = require('path');
const webpack           = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin      = require('assets-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'app/js/main.js')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('./css/[name].css', {
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.IgnorePlugin(/^mock-firmata$/),
    new webpack.ContextReplacementPlugin(/bindings$/, /^$/),
    new AssetsPlugin({
      path: path.join(__dirname, 'server'),
      filename: 'assets.json',
    })
  ],
  externals: ['bindings'],
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.json?$/,
      loader: 'json'
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
    }, {
      test: /\.scss$/,
      loader: 'style!css!sass'
    }, {
      test: /\.(jpe?g|png|gif|ico|mp3|ttf|eot|svg|woff(2)?)$/,
      loader: 'file?name=[path][name].[ext]'
    }]
  },
  node: {
    fs: 'empty',
    tls: 'empty'
  }
};
