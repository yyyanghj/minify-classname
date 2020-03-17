const minify = require('../core');
const { setMap } = require('./map');

module.exports = function minifyClassnameLoader(source) {
  const { output, map } = minify(source);
  setMap(map);
  return output.code;
};
