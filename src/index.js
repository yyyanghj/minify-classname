const fs = require('fs');
const path = require('path');

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const getClass = require('./classname');
const getCode = require('./code');

// step
// 1. traverse ast , generator map
// 2. update jsx ast
// 3. update css

function main() {
  const code = getCode();
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  const map = {};
  function handleLiteral(node) {
    const oldClassNames = node.value.split(' ').map(cls => cls.trim());
    const newClassNames = oldClassNames.reduce((res, cls) => {
      const newCls = getClass();
      if (!map[cls]) {
        map[cls] = newCls;
      }
      res.push(newCls);
      return res;
    }, []);

    node.value = newClassNames.join(' ');
  }

  function handleObjectExpression(node) {
    node.properties.forEach(propNode => {
      const oldValue = propNode.key.name;
      propNode.key.name = getClass();
      if (!map[oldValue]) {
        map[oldValue] = propNode.key.name;
      }
    });
  }

  function handleArrayExpression(node) {
    node.elements.forEach(elem => {
      if (elem.type === 'StringLiteral') {
        handleLiteral(elem);
      }
    });
  }

  function handleJSXExpressionContainer(node) {
    const expr = node.expression;
    if (expr.type !== 'CallExpression') {
      return;
    }

    expr.arguments.forEach(argNode => {
      if (argNode.type === 'StringLiteral') {
        handleLiteral(argNode);
      }
      if (argNode.type === 'ObjectExpression') {
        handleObjectExpression(argNode);
      }
      if (argNode.type === 'ArrayExpression') {
        handleArrayExpression(argNode);
      }
    });
  }

  traverse(ast, {
    JSXAttribute: function(path) {
      const node = path.node;
      const attrName = node.name.name;
      const attrValue = node.value;
      if (attrName !== 'className') {
        return;
      }

      if (attrValue.type === 'StringLiteral') {
        handleLiteral(attrValue);
      }

      if (attrValue.type === 'JSXExpressionContainer') {
        handleJSXExpressionContainer(attrValue, path);
      }
    },
  });

  const output = generator(ast);
  fs.writeFileSync(path.resolve(__dirname, '../output.jsx'), output.code);
  fs.writeFileSync(path.resolve(__dirname, '../map.json'), JSON.stringify(map, null, 4));
}

main();
