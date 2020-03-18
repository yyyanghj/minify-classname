module.exports = function minifyClassnameLoader(source) {
  const instance = require('./index.js').minifyInstance;
  if (!instance) {
    throw new Error('minify classname: no minify instance');
  }
  const output = instance.minify(source);
  return output.code;
};
