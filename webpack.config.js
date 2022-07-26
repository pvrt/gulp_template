const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');
const outputDir = path.resolve(__dirname, 'build');


module.exports = {
  entry: [],
  entry: './source/js/script.js',
  mode: "development",
  // mode: "production",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false
    })],
  },
  devtool: "source-map",
  output: {
    filename: "app.js",
    path: outputDir
  },
  resolve: {
    extensions: [".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: ['babel-loader']
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ]
  }
};



