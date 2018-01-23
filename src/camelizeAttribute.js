const camelCase = require('camelcase');
const t = require('babel-types');

module.exports = function camelizeAttribute(path) {
  const name = camelCase(path.get('name').node.name);
  path.get('name').replaceWith(t.jSXIdentifier(name));
};
