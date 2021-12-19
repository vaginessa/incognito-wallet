import React from 'react';
import srcThreeDotsVerIcon from '@src/assets/images/icons/three_dots_ver.png';
import { Image1 } from '@components/core';

const ThreeDotsVerIcon = props => {
  const defaultStyle = {
    width: 22,
    height: 6,
  };
  const {style, source, ...rest} = props;
  return (
    <Image1
      source={srcThreeDotsVerIcon}
      style={[defaultStyle, style]}
      {...rest}
    />
  );
};

export default ThreeDotsVerIcon;
