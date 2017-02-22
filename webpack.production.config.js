const path              = require('path');
const webpack           = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin       = require('stats-webpack-plugin');
const AssetsPlugin      = require('assets-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, 'app/js/main.js')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name]-[hash].min.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('[name]-[hash].min.css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
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
  postcss: [
    require('autoprefixer')
  ],
  node: {
    fs: 'empty',
    tls: 'empty'
  }
};
