import React from 'react';
import PropTypes from 'prop-types';

function evalColor(type, color, colorProp) {
  return typeof colorProp === 'function'
    ? colorProp(type, color)
    : colorProp;
}

export default function COMPONENT_NAME(props) {
  const {color, ...rest} = props;
  const svgProps = {
    ...rest,
    fill: typeof color !== 'function' ? color : undefined,
  };
  return (
    JSX
  );
}

COMPONENT_NAME.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.any,
  preserveAspectRatio: PropTypes.string,
};

COMPONENT_NAME.defaultProps = {
  color: (_, original) => original,
  preserveAspectRatio: 'xMidYMid meet',
};
