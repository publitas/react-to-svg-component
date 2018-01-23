const toComponent = require('./src/toReactComponent');

module.exports = function(src) {
  const cb = this.async();

  toComponent(String(src), this.resourcePath)
    .then(res => cb(null, res.code, res.map))
    .catch(err => cb(err));
};
