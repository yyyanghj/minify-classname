const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const minifyClassNamePlugin = require('./src');

const resolve = dir => path.resolve(__dirname, dir);

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const config = {
    mode: isProduction ? 'production' : 'development',

    target: 'web',

    // 入口
    entry: {
      app: resolve('playground/main.js'),
    },

    // 出口
    output: {
      // 输出目录
      path: resolve('dist'),

      // 输出文件名
      filename: '[name].[hash:8].js',

      // 发布到线上的所有资源的 URL 前缀
      publicPath: '/',
      chunkFilename: '[chunkhash].js',
    },

    devtool: 'cheap-module-eval-source-map',

    devServer: {
      // 配置 DevServer HTTP 服务器的文件根目录
      contentBase: './dist',

      // 热模块替换
      hot: true,

      // 自动打开浏览器
      open: true,
    },

    resolve: {
      alias: {
        '@': resolve('src'),
      },

      modules: [resolve('src'), 'node_modules'],

      // 文件查找顺序
      extensions: ['.jsx', '.js', '.json'],

      // 是否强制导入语句必须要写明文件后缀
      enforceExtension: false,
    },

    optimization: {
      usedExports: true,
      // minimizer: isProduction
    },

    // 插件
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new minifyClassNamePlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new HtmlWebpackPlugin({
        template: resolve('public/index.html'),
        filename: 'index.html',
      }),
    ],

    // 模块相关
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            'babel-loader',
          ],
        },
        {
          test: /\.jsx$/,
          use: [
            'babel-loader',
            { loader: minifyClassNamePlugin.loader }
          ],
        },

        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader'
          ],
        },
      ],
    },
  };

  return config;
};
