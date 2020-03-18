const { getContext } = require('./context');

const getType = val => {
  return typeof val === 'string' ? typeof val : Object.prototype.toString.call(val).slice(8, -1);
};

const isString = v => typeof v === 'string';
const isRegExp = v => getType(v) === 'RegExp';

module.exports = function shouldIgnore(cls) {
  const ctx = getContext();
  const prefix = ctx.options.ignorePrefix;
  if (isString(prefix) && prefix) {
    return cls.startsWith(prefix);
  } else if (isRegExp(prefix)) {
    return cls.test(prefix);
  }

  return false;
};
