"use strict";

/*global require*/
var configureWebpackForTerriaJS = require("terriajs/buildprocess/configureWebpack");
var configureWebpackForPlugins = require("./configureWebpackForPlugins");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var path = require("path");
// Use dart-sass instead of node-sass
const sass = require("sass");

module.exports = function (devMode, hot) {
  var config = {
    mode: devMode ? "development" : "production",
    entry: "./entry.js",
    output: {
      path: path.resolve(__dirname, "..", "wwwroot", "build"),
      filename: "TerriaMap.js",
      // work around chrome needing the full URL when using sourcemaps
      publicPath: hot ? "http://localhost:3003/build/" : "build/",
      sourcePrefix: "",
      globalObject: "(self || window)"
    },
    devtool: devMode ? "eval-cheap-module-source-map" : false,
    module: {
      rules: [
        {
          test: /\.html$/,
          include: path.resolve(__dirname, "..", "lib", "Views"),
          loader: "raw-loader"
        },
        {
          test: /\.(ts|js)x?$/,
          include: [
            path.resolve(__dirname, "..", "index.js"),
            path.resolve(__dirname, "..", "entry.js"),
            path.resolve(__dirname, "..", "plugins.ts"),
            path.resolve(__dirname, "..", "lib"),
            path.resolve(__dirname, "..", "node_modules", "es-toolkit"),
            path.resolve(__dirname, "..", "node_modules", "recharts")
          ],
          use: [
            {
              loader: require.resolve("string-replace-loader"),
              options: {
                search:
                  "function _get\\(\\).*?return _get\\.apply\\(this, arguments\\).*",
                replace:
                  "var _get = require('terriajs/lib/Core/superGet').default;",
                flags: "g"
              }
            },
            {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
                presets: [
                  ["@babel/preset-env", { corejs: 3, useBuiltIns: "usage" }],
                  "@babel/preset-react",
                  ["@babel/typescript", { allowNamespaces: true }]
                ],
                plugins: [
                  "babel-plugin-jsx-control-statements",
                  "@babel/plugin-transform-modules-commonjs",
                  ["@babel/plugin-proposal-decorators", { legacy: true }],
                  "@babel/proposal-class-properties",
                  "@babel/proposal-object-rest-spread",
                  "babel-plugin-styled-components",
                  require.resolve("@babel/plugin-syntax-dynamic-import"),
                  "@babel/plugin-proposal-nullish-coalescing-operator",
                  "@babel/plugin-proposal-optional-chaining"
                ]
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|svg|gif)$/,
          include: path.resolve(__dirname, "..", "wwwroot", "images"),
          loader: "url-loader",
          options: { limit: 8192 }
        },
        {
          test: /globe\.gif$/,
          include: path.resolve(__dirname, "..", "lib", "Styles"),
          loader: "url-loader",
          options: { limit: 65536 }
        },
        {
          test: /loader\.css$/,
          include: [path.resolve(__dirname, "..", "lib", "Styles")],
          loader: ["style-loader", "css-loader"]
        },
        {
          test: /\.scss$/,
          include: [path.resolve(__dirname, "..", "lib")],
          use: hot
            ? [
                "style-loader",
                {
                  loader: "css-loader",
                  options: {
                    sourceMap: true,
                    modules: true,
                    camelCase: true,
                    localIdentName: "tm-[name]__[local]",
                    importLoaders: 2
                  }
                },
                { loader: "resolve-url-loader", options: { sourceMap: false } },
                {
                  loader: "sass-loader",
                  options: { sourceMap: true, implementation: sass }
                }
              ]
            : [
                MiniCssExtractPlugin.loader,
                {
                  loader: "css-loader",
                  options: {
                    sourceMap: true,
                    modules: true,
                    camelCase: true,
                    localIdentName: "tm-[name]__[local]",
                    importLoaders: 2
                  }
                },
                { loader: "resolve-url-loader", options: { sourceMap: false } },
                {
                  loader: "sass-loader",
                  options: { sourceMap: true, implementation: sass }
                }
              ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "TerriaMap.css",
        ignoreOrder: true,
        allChunks: true
      })
    ],
    resolve: {
      alias: {},
      modules: ["node_modules"]
    }
  };

  config.resolve.alias["terriajs-variables"] = require.resolve(
    "../lib/Styles/variables.scss"
  );
  return configureWebpackForPlugins(
    configureWebpackForTerriaJS(
      path.dirname(require.resolve("terriajs/package.json")),
      config,
      devMode,
      hot,
      MiniCssExtractPlugin
    )
  );
};
