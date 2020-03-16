const fs = require('fs');
const path = require('path');
const minify = require('../core');

const resolve = dir => path.resolve(__dirname, dir);

function getCode() {
  return fs.readFileSync(path.resolve(__dirname, './App.jsx'), {
    encoding: 'utf8',
  });
}

minify(getCode(), resolve('./output.jsx'), resolve('./map.json'));
