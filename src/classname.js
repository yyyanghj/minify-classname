const { getContext, setContext } = require('./context');

function generatorClassName(n) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const len = chars.length;
  const res = [];
  let div = n;
  let y;
  if (div === 0) {
    res.push(chars[0]);
  } else {
    while (div !== 0) {
      y = div % len;
      res.unshift(chars[y]);
      div = Math.floor(div / len);
    }
  }

  return res.join('');
}

function getNewClass(className) {
  const ctx = getContext();
  if (ctx.map[className]) {
    return ctx.map[className];
  }

  return setContext(ctx => (ctx.map[className] = generatorClassName(ctx.index++)));
}

module.exports = getNewClass;
