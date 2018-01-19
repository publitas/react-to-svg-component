const toRenderFunction = require('./toRenderFunction');

module.exports = function toReactComponent(svgString, name) {
  return toRenderFunction(svgString).then(f => convert(f, name));
};

function convert(renderFunction, name) {
  return `
    const React = require('react');
    module.exports = function ${name || ''}(props) {
      const newProps = Object.assign({}, props);
      delete newProps.color;
      newProps.fill = (typeof props.color !== 'function') ? props.color : null;
      return ${renderFunction}(newProps);
    };
  `;
}
