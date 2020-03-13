const fs = require('fs');
const path = require('path');
module.exports = function getCode() {
  return fs.readFileSync(path.resolve(__dirname, './components/App.jsx'), {
    encoding: 'utf8',
  });
};
