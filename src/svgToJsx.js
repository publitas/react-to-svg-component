const {parse} = require('babylon');
const traverse = require('babel-traverse').default;
const {optimize} = require('svgo');

const isSvgElement = require('./isSvgElement');
const addSpreadAttribute = require('./addSpreadAttribute');
const camelizeAttribute = require('./camelizeAttribute');
const parameterizeColors = require('./parameterizeColors');

module.exports = function svgToJsx(svgString) {
  return new Promise((resolve) => {
    const result = optimize(svgString);
    resolve(convert(result.data));
  });
};

function convert(jsxLikeSvg) {
  return transform(parse(jsxLikeSvg, {plugins: ['jsx']}));
}

function transform(ast) {
  traverse(ast, {enter: visit});
  return ast;
}

function visit(path) {
  if (path.isJSXAttribute()) transformJsxAttribute(path);
  if (isSvgElement(path)) transformSvgElement(path);
}

function transformSvgElement(path) {
  addSpreadAttribute(path, 'svgProps');
}

function transformJsxAttribute(path) {
  const {parentPath} = path;
  if (isSvgElement(parentPath)) {
    if (!path.get('name').isJSXIdentifier({name: 'viewBox'})) {
      path.remove();
    }
  } else {
    camelizeAttribute(path);
    parameterizeColors(path);
  }
}
