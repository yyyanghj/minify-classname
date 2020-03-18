const { getContext } = require('./context');
const shouldIgnore = require('./shouldIgnore');
const CLASS_NAME_REGEX = /\/\*[\s\S]*?\*\/|(\.[a-zA-Z_-][\w-]*)(?=[^{}]*{)/g;

module.exports = function replaceCSS(cssString) {
  const map = getContext().map;
  const getNewClassName = cls => {
    if (shouldIgnore(cls)) {
      return cls;
    }
    return map[cls] || cls;
  };

  return cssString.replace(CLASS_NAME_REGEX, (match, capturingGroup) => {
    if (!capturingGroup) return match;
    const className = capturingGroup.substr(1);
    return `.${getNewClassName(className)}`;
  });
};
