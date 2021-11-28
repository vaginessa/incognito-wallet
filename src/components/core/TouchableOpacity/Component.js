import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity as RNComponent,
  TouchableOpacityProps,
} from 'react-native';
import { delay } from '@src/utils/delay';

const TouchableOpacity = (props: TouchableOpacityProps) => {
  const { onPress, activeOpacity = 0, ...rest } = props;
  const _onPress = async () => {
    await delay(0);
    requestAnimationFrame(() => {
      if (typeof onPress === 'function') {
        onPress();
      }
    });
  };

  return (
    <RNComponent
      onPress={_onPress}
      activeOpacity={activeOpacity}
      delayPressIn={0}
      delayPressOut={0}
      delayLongPress={0}
      {...rest}
    />
  );
};

TouchableOpacity.defaultProps = {
  activeOpacity: undefined,
};

TouchableOpacity.propTypes = {
  onPress: PropTypes.func.isRequired,
  activeOpacity: PropTypes.number,
};

export default TouchableOpacity;
