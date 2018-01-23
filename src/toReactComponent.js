const toJsx = require('./svgToJsx');
const {parse} = require('babylon');
const traverse = require('babel-traverse').default;
const generate = require('babel-generator').default;
const {transformFromAst} = require('babel-core');
const upperCamelCase = require('uppercamelcase');
const prettier = require('prettier');
const template = require('fs').readFileSync(__dirname + '/template.js')
  .toString();

module.exports = function toReactComponent(svgString, name) {
  return toJsx(svgString).then(jsx => wrap(jsx, name));
};

function wrap(jsx, fileName) {
  const ast = parse(template, {
    sourceType: 'module',
    plugins: ['objectRestSpread'],
  });
  traverse(ast, {enter: visit(jsx, componentName(fileName))});
  return transformFromAst(ast, prettier.format(generate(ast).code), {
    presets: ['env', 'react'],
    plugins: ['transform-object-rest-spread'],
    sourceMaps: true,
    sourceFileName: fileName,
  });
}

const visit = (jsx, name) => (path) => {
  const {node} = path;
  if (path.isReturnStatement() && node.argument.name === 'JSX') {
    path.get('argument').replaceWith(jsx.program.body[0].expression);
  } else if (node.name === 'COMPONENT_NAME') {
    node.name = name;
  }
};

function componentName(fileName) {
  if (!fileName) return 'Svg';
  return upperCamelCase(require('path').basename(fileName, '.svg')) + 'Svg';
}
