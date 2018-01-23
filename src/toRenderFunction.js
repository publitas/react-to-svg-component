var babel = require('babel-core');
var traverse = require('babel-traverse').default;
var generate = require('babel-generator').default;
var SVGO = require('svgo');
var svg = new SVGO({plugins: [
  {removeViewBox: false},
]});

module.exports = function toReact(rawSvgString) {
  return svg.optimize(rawSvgString).then(r => convert(r.data));
};

function convert(svgString) {
  var trans = babel.transform(stripSvgArguments(svgString), {
    code: false,
    presets: ['es2015', 'react'],
  });

  var inCreateElCall = false;
  traverse(trans.ast, {
    enter: function(path) {
      const node = path.node;
      const parent = path.parent;
      if (isReactCreateElement(node)) inCreateElCall = true;

      // check if we are inside a react props object
      if (inCreateElCall && parent.type === 'ObjectExpression') {
        camelizeProps(node);
        removeHardcodedDimensions(node, path);
        parameterizeColors(node);
      }
    },
    exit: function(path) {
      if (isReactCreateElement(path.node)) inCreateElCall = false;
    },
  });

  var program = trans.ast.program;
  program.body.unshift(buildColorEvalAst());
  makeLastStatementReturn(program);


  return 'function render(props) {\n' + generate(trans.ast).code + '\n}';
}

function stripSvgArguments(svgString) {
  var viewBox = (svgString.match(/viewBox=['"]([^'"]*)['"]/) || [])[1];
  var viewBoxStr = '';
  if (viewBox) viewBoxStr = 'viewBox="'+viewBox+'"';

  return svgString
    // remove and parameterize all svg attributes except viewbox
    .replace(/<svg([^>]*)*>/, '<svg {...props} '+viewBoxStr+' color={null}>');
}

function camelizeProps(node) {
  if (node.type === 'ObjectProperty' && node.key.type === 'StringLiteral' ) {
    node.key = {
      type: 'Identifier',
      name: camelize(node.key.value),
    };
  }
}

function removeHardcodedDimensions(node, context) {
  if (isPropertyIdentifierWithNames(node, ['width', 'height'])) {
    context.remove();
  }
}

function parameterizeColors(node) {
  var evalColor;

  if (isPropertyIdentifierWithNames(node, ['fill', 'stroke'])) {
    if (node.value.value !== 'none') {
      evalColor = 'evalColor("'+node.key.name+'", "'+node.value.value+'")';
      node.computed = false;
      node.value = getAst(evalColor).body[0].expression;
    }
  }
}

function makeLastStatementReturn(program) {
  var idx = program.body.length-1;
  var lastStatement = program.body[idx];

  if (lastStatement && lastStatement.type !== 'ReturnStatement') {
    program.body[idx] = {
      'type': 'ReturnStatement',
      'argument': lastStatement
    };
  }
}

function camelize(string) {
  return string.replace(/-(.)/g, function(_, letter) {
    return letter.toUpperCase();
  });
}

function isPropertyIdentifier(node) {
  return node.type === 'ObjectProperty' && node.key.type === 'Identifier';
}

function isPropertyIdentifierWithNames(node, names) {
  var itIs = false;
  if (!isPropertyIdentifier(node)) return false;

  for (var i=0; i < names.length; i++) {
    if (names[i] === node.key.name) {
      itIs = true;
      break;
    }
  }

  return itIs;
}

function isReactCreateElement(node) {
  return (
    node.type === 'CallExpression'
    && (node.callee.object && node.callee.object.name === 'React')
    && (node.callee.property && node.callee.property.name === 'createElement')
  );
}

function buildColorEvalAst() {
  var makeColorEval = function() {
    if (typeof props.color === 'function') {
      return props.color;
    } else {
      return function() { return props.color; };
    }
  };

  return getAst('var evalColor = ('+makeColorEval+'());').body[0];
}

function getAst(code) {
  var trans = babel.transform(code, {code: false});
  return trans.ast.program;
}
