const fs = require('fs');
const path = require('path');

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
// const bt = require('@babel/types');
const getClass = require('./classname');
const getCode = require('./code');

function main() {
  const code = getCode();
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  const changes = [];
  function handleLiteral(node) {
    console.log('handleLiteral', handleLiteral);
    console.log('node', node);
    const oldValue = node.value;
    node.value = getClass();

    changes.push(`Literal: ${oldValue} -> ${node.value}`);
  }

  function handleObjectExpression(node) {
    node.properties.forEach(propNode => {
      const oldValue = propNode.key.name;
      propNode.key.name = getClass();
      changes.push(`Object Prop: ${oldValue} -> ${propNode.key.name}`);
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
      console.log('attrValue.type', attrValue.type);
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
  console.log('changes', changes);
  fs.writeFileSync(path.resolve(__dirname, '../output.js'), output.code);
}

main();
