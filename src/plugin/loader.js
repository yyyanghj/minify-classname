const minify = require('../core');
const { setMap } = require('./map');

module.exports = function minifyClassnameLoader(source) {
  //   const options = getOptions(this);
  const { output, map } = minify(source);
  setMap(map);
  console.log('output.code', output.code);
  console.log('map', map);
  return output.code;
};
