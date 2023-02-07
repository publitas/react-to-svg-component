const t = require('@babel/types');

module.exports = function addSpreadAttribute(path, name) {
  path.pushContainer('attributes', t.jSXSpreadAttribute(t.identifier(name)));
};
