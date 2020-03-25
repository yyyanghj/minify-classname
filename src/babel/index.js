const getNewClass = require('../classname.js');
const shouldIgnore = require('../shouldIgnore');

module.exports = function() {
  let csName = 'classnames';

  /**
   * @param {string} classNameStr
   * @example getNewClassStr('hello world  hello1   react') => 'a b c d'
   */
  const getNewClassStr = classNameStr => {
    if (!classNameStr) {
      return '';
    }

    return classNameStr
      .split(/\s+/)
      .filter(c => c.trim())
      .map(cn => (shouldIgnore(cn) ? cn : getNewClass(cn)))
      .join(' ');
  };

  function handleStringLiteral(node, name = 'value') {
    node[name] = getNewClassStr(node[name]);
  }

  function handleJSXExpressionContainer(expNode) {
    const expr = expNode.expression;

    // string
    if (expr.type === 'StringLiteral') {
      handleStringLiteral(expr);
    }

    // template string
    if (expr.type === 'TemplateLiteral') {
      handleTemplateLiteral(expr);
    }

    // handle classnames call
    if (expr.type === 'CallExpression' && expr.callee.name === csName) {
      expr.arguments.forEach(node => {
        if (node.type === 'StringLiteral') {
          handleStringLiteral(node);
        }
        if (node.type === 'ObjectExpression') {
          handleObjectExpression(node);
        }
        if (node.type === 'ArrayExpression') {
          handleArrayExpression(node);
        }
      });
    }
  }

  function handleTemplateLiteral(node) {
    node.quasis.forEach(({ value }) => {
      value.raw = ' ' + getNewClassStr(value.raw) + ' ';
      value.cooked = value.raw;
    });
  }

  function handleObjectExpression(node) {
    node.properties.forEach(property => {
      const key = property.key;

      if (key.type === 'StringLiteral') {
        handleStringLiteral(key);
      } else if (key.type === 'Identifier' && !property.computed) {
        key.name = getNewClassStr(key.name);
      }
    });
  }

  function handleArrayExpression(node) {
    node.elements.forEach(elem => {
      if (elem.type === 'StringLiteral') {
        handleStringLiteral(elem);
      }
    });
  }

  return {
    visitor: {
      JSXAttribute: path => {
        const attr = path.node;
        const name = attr.name.name;
        const value = attr.value;
        if (name !== 'className') {
          return;
        }

        if (value.type === 'StringLiteral') {
          handleStringLiteral(value);
        }

        if (value.type === 'JSXExpressionContainer') {
          handleJSXExpressionContainer(value, path);
        }
      },
      ImportDeclaration: path => {
        const node = path.node;

        if (node.source.value === 'classnames') {
          node.specifiers.forEach(p => {
            if (p.type === 'ImportDefaultSpecifier') {
              csName = p.local.name;
            }
          });
        }
      },
    },
  };
};
