const toComponent = require('./src/toComponent');
const path = require('path');
const upperCamelCase = require('uppercamelcase');

module.exports = function(src) {
  const cb = this.async();
  const name = upperCamelCase(path.basename(this.resourcePath, '.svg'));
  toComponent(String(src), name)
    .then(c => cb(null, c))
    .catch(err => cb(err));
};
