const getNewClass = require('../classname.js');
const shouldIgnore = require('../shouldIgnore');

module.exports = function() {
  let csName = 'classnames';

  function handleStringLiteral(node) {
    node.value = node.value
      .split(' ')
      .map(cls => cls.trim())
      .reduce((res, cls) => {
        const newCls = shouldIgnore(cls) ? cls : getNewClass(cls);
        res.push(newCls);
        return res;
      }, [])
      .join(' ');
  }

  function handleObjectExpression(node) {
    node.properties.forEach(property => {
      const key = property.key;

      if (key.type === 'StringLiteral') {
        handleStringLiteral(key);
      } else if (key.type === 'Identifier' && !property.computed) {
        const name = key.name;
        if (!shouldIgnore(name)) {
          key.name = getNewClass(name);
        }
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

  function handleJSXExpressionContainer(expNode) {
    const expr = expNode.expression;
    if (expr.type !== 'CallExpression') {
      return;
    }

    if (expr.callee.name !== csName) {
      return;
    }

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
