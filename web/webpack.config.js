const webpack = require('webpack');
const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');

const reactToolboxVariables = {};

module.exports = {
  entry: {
      app: ['./ui/index.js'],
      vendor: [
        'react', 'react-dom'
      ]
  },
  output: {
    path: path.resolve(__dirname, 'build/ui/'),
    filename: '[name].js',
    chunkFilename: '[id].js',
  },

  plugins: [
    new BundleTracker({
      filename: './build/webpack-stats.json',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity,
    }),
  ],
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: "[name]--[local]--[hash:base64:8]"
            }
          },
          "postcss-loader" // has separate config, see postcss.config.js nearby
        ]
      },
    ]
  },
};
