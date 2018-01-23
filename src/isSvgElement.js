module.exports = function isSvgElement(path) {
  return path.isJSXOpeningElement() &&
    path.get('name').isJSXIdentifier({name: 'svg'});
};
