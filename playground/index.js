const fs = require('fs');
const path = require('path');
const minify = require('../src/core');
const CssShortener = require('css-shortener');
const resolve = dir => path.resolve(__dirname, dir);

function getCode(filename) {
  return fs.readFileSync(resolve(filename), {
    encoding: 'utf8',
  });
}


function main() {
  const { output, map } = minify(getCode('./App.jsx'));
  const cs = new CssShortener();
  cs.importMap(map)
  const newcss = cs.replaceCss(getCode('./App.css'));

  fs.writeFileSync(resolve('./output.jsx'), output.code);
  fs.writeFileSync(resolve('./map.json'), JSON.stringify(map, null, 4));
  fs.writeFileSync(resolve('./new.css'), newcss);
}
main()


