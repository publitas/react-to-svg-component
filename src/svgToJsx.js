const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const SVGO = require("svgo");
var svg = new SVGO({ plugins: [{ removeViewBox: false }] });

const isSvgElement = require("./isSvgElement");
const addSpreadAttribute = require("./addSpreadAttribute");
const camelizeAttribute = require("./camelizeAttribute");
const parameterizeColors = require("./parameterizeColors");

module.exports = function svgToJsx(svgString) {
  return svg.optimize(svgString).then(r => convert(r.data));
};

function convert(jsxLikeSvg) {
  return transform(parse(jsxLikeSvg, { plugins: ["jsx"] }));
}

function transform(ast) {
  traverse(ast, { enter: visit });
  return ast;
}

function visit(path) {
  if (path.isJSXAttribute()) transformJsxAttribute(path);
  if (isSvgElement(path)) transformSvgElement(path);
}

function transformSvgElement(path) {
  addSpreadAttribute(path, "svgProps");
}

function transformJsxAttribute(path) {
  const { parentPath } = path;
  if (isSvgElement(parentPath)) {
    if (!path.get("name").isJSXIdentifier({ name: "viewBox" })) {
      path.remove();
    }
  } else {
    camelizeAttribute(path);
    parameterizeColors(path);
  }
}
