const path = require('path');
const Minify = require('../core');

class minifyClassNamePlugin {
  constructor(options = {}) {
    minifyClassNamePlugin.minifyInstance = new Minify(options);
  }

  apply(compiler) {
    const instance = minifyClassNamePlugin.minifyInstance;
    compiler.hooks.emit.tapAsync('minifyClassnamePlugin', (compilation, callback) => {
      const assets = compilation.getAssets();
      assets.forEach(asset => {
        if (asset.name.endsWith('css')) {
          const _asset = compilation.assets[asset.name];
          const newcss = instance.replaceCSS(_asset.source());
          _asset.source = function() {
            return newcss;
          };
          _asset.size = function() {
            return newcss.length;
          };
        }
      });
      callback();
    });
  }
}

minifyClassNamePlugin.minifyInstance = null;
minifyClassNamePlugin.loader = path.resolve(__dirname, './loader');

module.exports = minifyClassNamePlugin;
