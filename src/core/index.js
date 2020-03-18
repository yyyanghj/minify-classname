const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

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

const CLASS_NAME_REGEX = /\/\*[\s\S]*?\*\/|(\.[a-zA-Z_-][\w-]*)(?=[^{}]*{)/g;

const DEFAULT_OPTIONS = {
  ignorePrefix: null,
};

const getType = val => {
  return typeof val === 'string' ? typeof val : Object.prototype.toString.call(val).slice(8, -1);
};

const isString = v => typeof v === 'string';
const isRegExp = v => getType(v) === 'RegExp';

class Minify {
  constructor(options = {}) {
    this.index = 0;
    this.map = {};
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
  }

  getNewClass(className) {
    if (this.map[className]) {
      return this.map[className];
    }

    return (this.map[className] = generatorClassName(this.index++));
  }

  shouldIgnore(cls) {
    const prefix = this.options.ignorePrefix;
    if (isString(prefix) && prefix) {
      return cls.startsWith(prefix);
    } else if (isRegExp(prefix)) {
      return cls.test(prefix);
    }

    return false;
  }

  handleStringLiteral(node) {
    node.value = node.value
      .split(' ')
      .map(cls => cls.trim())
      .reduce((res, cls) => {
        const newCls = this.shouldIgnore(cls) ? cls : this.getNewClass(cls);
        res.push(newCls);
        return res;
      }, [])
      .join(' ');
  }

  handleObjectExpression(node) {
    node.properties.forEach(property => {
      const key = property.key;

      if (key.type === 'StringLiteral') {
        this.handleStringLiteral(key);
      } else if (key.type === 'Identifier' && !property.computed) {
        const name = key.name;
        if (!this.shouldIgnore(name)) {
          key.name = this.getNewClass(name);
        }
      }
    });
  }

  handleArrayExpression(node) {
    node.elements.forEach(elem => {
      if (elem.type === 'StringLiteral') {
        this.handleStringLiteral(elem);
      }
    });
  }

  handleJSXExpressionContainer(expNode) {
    const expr = expNode.expression;
    if (expr.type !== 'CallExpression') {
      return;
    }

    expr.arguments.forEach(node => {
      if (node.type === 'StringLiteral') {
        this.handleStringLiteral(node);
      }
      if (node.type === 'ObjectExpression') {
        this.handleObjectExpression(node);
      }
      if (node.type === 'ArrayExpression') {
        this.handleArrayExpression(node);
      }
    });
  }

  minify(code) {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx'],
    });

    traverse(ast, {
      JSXAttribute: path => {
        const attr = path.node;
        const name = attr.name.name;
        const value = attr.value;
        if (name !== 'className') {
          return;
        }

        if (value.type === 'StringLiteral') {
          this.handleStringLiteral(value);
        }

        if (value.type === 'JSXExpressionContainer') {
          this.handleJSXExpressionContainer(value, path);
        }
      },
    });

    const output = generator(ast);
    return output;
  }

  replaceCSS(cssString) {
    const getNewClassName = cls => {
      if (this.shouldIgnore(cls)) {
        return cls;
      }
      return this.map[cls] || cls;
    };

    return cssString.replace(CLASS_NAME_REGEX, (match, capturingGroup) => {
      if (!capturingGroup) return match;
      const className = capturingGroup.substr(1);
      return `.${getNewClassName(className)}`;
    });
  }

  getMap() {
    return this.map;
  }
}

module.exports = Minify;
