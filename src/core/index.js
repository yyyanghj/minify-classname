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

class Minify {
  constructor(options = {}) {
    this.index = 0;
    this.map = {};
    this.options = options;
  }

  getNewClass(className) {
    if (this.map[className]) {
      return this.map[className];
    }

    return (this.map[className] = generatorClassName(this.index++));
  }

  handleStringLiteral(node) {
    node.value = node.value
      .split(' ')
      .map(cls => cls.trim())
      .reduce((res, cls) => {
        // TODO: ignore
        const newCls = this.getNewClass(cls);
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
        // TODO: ignore
        const name = key.name;
        key.name = this.getNewClass(name);
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
      // TODO: ignore
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
