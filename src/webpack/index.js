const replaceCSS = require('../replaceCSS');
const { setContext } = require('../context');

class minifyClassNamePlugin {
  constructor(options = {}) {
    setContext(ctx => {
      ctx.options = Object.assign({}, ctx.options, options);
    });
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('minifyClassnamePlugin', (compilation, callback) => {
      Object.keys(compilation.assets).forEach(assetName => {
        if (assetName.endsWith('css')) {
          const asset = compilation.assets[assetName];
          const newcss = replaceCSS(asset.source());
          asset.source = function() {
            return newcss;
          };
          asset.size = function() {
            return newcss.length;
          };
        }
      });

      callback();
    });
  }
}

module.exports = minifyClassNamePlugin;
