const fs = require('fs');
const path = require('path');
const Minify = require('../src/core');

const resolve = dir => path.resolve(__dirname, dir);

function getCode(filename) {
  return fs.readFileSync(resolve(filename), {
    encoding: 'utf8',
  });
}


function main() {
  const instance = new Minify();
  const output = instance.minify(getCode('./App.jsx'));
  const newcss = instance.replaceCSS(getCode('./App.css'));
  const map = instance.getMap();

  fs.writeFileSync(resolve('./output.jsx'), output.code);
  fs.writeFileSync(resolve('./map.json'), JSON.stringify(map, null, 4));
  fs.writeFileSync(resolve('./new.css'), newcss);
}
main()


