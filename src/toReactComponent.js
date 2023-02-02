const toJsx = require("./svgToJsx");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const { transformFromAst } = require("@babel/core");
const upperCamelCase = require("uppercamelcase");
const prettier = require("prettier");

module.exports = function toReactComponent(svgString, fileName) {
  return Promise.all([toJsx(svgString), readTemplate()]).then(
    ([jsx, template]) => wrap(jsx, template, fileName)
  );
};

function wrap(jsx, template, fileName) {
  const ast = parse(template, {
    sourceType: "module",
    plugins: ["objectRestSpread"]
  });
  traverse(ast, { enter: visit(jsx, componentName(fileName)) });
  return transformFromAst(
    ast,
    prettier.format(generate(ast).code, { parser: "@babel/parser" }),
    {
      presets: ["env", "react"],
      plugins: ["@babel/plugin-proposal-object-rest-spread"],
      sourceMaps: true,
      sourceFileName: fileName
    }
  );
}

const visit = (jsx, name) => path => {
  const { node } = path;
  if (path.isReturnStatement() && node.argument.name === "JSX") {
    path.get("argument").replaceWith(jsx.program.body[0].expression);
  } else if (node.name === "COMPONENT_NAME") {
    node.name = name;
  }
};

function componentName(fileName) {
  if (!fileName) return "Svg";
  return upperCamelCase(require("path").basename(fileName, ".svg")) + "Svg";
}

function readTemplate() {
  return new Promise((resolve, reject) => {
    require("fs").readFile(__dirname + "/template.js", "utf8", (err, src) => {
      err ? reject(err) : resolve(src);
    });
  });
}
