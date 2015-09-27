var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    app: './src/assets/js/app.js',

    // split vendor to another file
    vendors: [
      'react',
      'react-router',
      'marked',
      // 'prism',
      'lodash',
      'jquery',
      // 'bluebird',
      // 'query-string',
    ]
  },
  output: {
    // filename: './build/assets/js/bundle.js',
    path: path.resolve(__dirname, 'build/assets/js'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:3000/assets/js'
  },

  // enabling source maps
  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  // externals: {
  //   //don't bundle the 'react' npm package with our bundle.js
  //   //but get it from a global 'React' variable
  //   'react': 'React'
  // },
  // externals: {
  //   $: "jquery"
  // }
  plugins: [

    // split vendor to another file
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),

    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })

  ]
};
