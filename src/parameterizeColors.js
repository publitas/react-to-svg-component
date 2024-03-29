const colorAttrs = ['stroke', 'fill'];
const {parseExpression} = require('@babel/parser');
const t = require('@babel/types');

module.exports = function parameterizeColors(path) {
  const node = path.node;
  if (!node.name || colorAttrs.indexOf(node.name.name) === -1) return;
  const name = node.name.name;
  const value = node.value.value;
  if (value === 'none') return;
  path.get('value').replaceWith(
    t.jSXExpressionContainer(
      parseExpression(`evalColor('${name}', '${value}', props.color)`)
    )
  );
};
