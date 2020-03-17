const path = require('path');
const CssShortener = require('css-shortener');
const { getMap } = require('./map');

class minifyClassnamePlugin {
  constructor() {}

  apply(compiler) {
    compiler.hooks.emit.tapAsync('minifyClassnamePlugin', (compilation, callback) => {
      const assets = compilation.getAssets();
      const cs = new CssShortener();
      const map = getMap();
      cs.importMap(map);
      assets.forEach(asset => {
        if (asset.name.endsWith('css')) {
          const _asset = compilation.assets[asset.name];
          const newcss = cs.replaceCss(_asset.source());
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

minifyClassnamePlugin.loader = path.resolve(__dirname, './loader');

module.exports = minifyClassnamePlugin;
