import React from 'react';

function renderSvg(props) {

}

export default function SvgComponent(props) {
  const {color, ...rest} = props;
  return renderSvg({
    ...rest,
    fill: color !== 'function' ? color : undefined,
  });
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.any,
  preserveAspectRatio: PropTypes.string,
};

Icon.defaultProps = {
  color: (_, original) => original,
  preserveAspectRatio: 'xMidYMid meet',
};
