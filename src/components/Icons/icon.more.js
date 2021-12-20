import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import {View} from 'react-native';
import PropTypes from 'prop-types';

const SelectMore = (props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Rect
      x={10.3333}
      y={2}
      width={3.33333}
      height={20}
      rx={1.66667}
      fill="#1A73E8"
    />
    <Rect
      x={22}
      y={10.3334}
      width={3.33333}
      height={20}
      rx={1.66667}
      transform="rotate(90 22 10.3334)"
      fill="#1A73E8"
    />
  </Svg>
);


const UnSelectMore = (props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Rect
      x={10.3333}
      y={2}
      width={3.33333}
      height={20}
      rx={1.66667}
      fill="#DDDDDD"
    />
    <Rect
      x={22}
      y={10.3334}
      width={3.33333}
      height={20}
      rx={1.66667}
      transform="rotate(90 22 10.3334)"
      fill="#DDDDDD"
    />
  </Svg>
);

const MoreIcon = React.memo(({ style, active }) => (
  <View style={style}>
    {active ? <SelectMore /> : <UnSelectMore />}
  </View>
));

MoreIcon.defaultProps = {
  style: null,
  active: false
};

MoreIcon.propTypes = {
  style: PropTypes.any,
  active: PropTypes.bool
};

export default MoreIcon;
