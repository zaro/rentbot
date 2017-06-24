const webpack = require('webpack');
const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
const prod = process.argv.indexOf('-p') !== -1;

const reactToolboxVariables = {};

module.exports = {
  entry: {
      app: ['./ui/index.js'],
      vendor: [
        'react', 'react-dom',
      ]
  },
  output: {
    path: path.resolve(__dirname, 'build/ui/'),
    filename: '[name].js',
    chunkFilename: '[id].js',
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'vendor.css',
      allChunks: true
    }),
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
      { test: /\.js$/, exclude: /node_modules/,
        use:{
          loader: "babel-loader" ,
          options: {
            "plugins": [
              [
                "css-modules-transform", {
                  "preprocessCss": "./babel-sass-render.js",
                  "extensions": [".css"],
                  "generateScopedName": "[name]--[local]--[hash:base64:8]",
                  "extractCss": prod ? "./build/ui/app.css" : undefined,
                }
              ]
            ],
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            //"style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
                sourceMap: true,
                importLoaders: 2,
                localIdentName: "[name]--[local]--[hash:base64:8]"
              }
            },
            "postcss-loader", // has separate config, see postcss.config.js nearby
            "sass-loader",
          ],
        }),
      },
    ]
  },
};
