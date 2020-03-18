const babelPlugin = require('./babel');
const webpackPlugin = require('./webpack');

webpackPlugin.babelPlugin = babelPlugin;

module.exports = webpackPlugin;
