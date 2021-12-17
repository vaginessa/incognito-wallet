import Svg, { Path } from 'react-native-svg';
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

const SelectPrivacyApps = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7.125 0h-6C.504 0 0 .504 0 1.125v6C0 7.746.504 8.25 1.125 8.25h6c.621 0 1.125-.504 1.125-1.125v-6C8.25.504 7.746 0 7.125 0ZM16.875 0h-6C10.252 0 9.75.504 9.75 1.125v6c0 .621.503 1.125 1.124 1.125h6c.622 0 1.126-.504 1.126-1.125v-6C18 .504 17.495 0 16.875 0ZM7.125 9.75h-6C.504 9.75 0 10.254 0 10.875v6C0 17.496.504 18 1.125 18h6c.621 0 1.125-.504 1.125-1.125v-6c0-.621-.504-1.125-1.125-1.125ZM16.875 9.75h-6c-.622 0-1.125.504-1.125 1.125v6c0 .621.503 1.125 1.124 1.125h6c.622 0 1.126-.504 1.126-1.125v-6c0-.621-.504-1.125-1.125-1.125Z"
      fill="#1A73E8"
    />
  </Svg>
);

const UnSelectPrivacyApps = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7.125 0h-6C.504 0 0 .504 0 1.125v6C0 7.746.504 8.25 1.125 8.25h6c.621 0 1.125-.504 1.125-1.125v-6C8.25.504 7.746 0 7.125 0ZM16.875 0h-6C10.252 0 9.75.504 9.75 1.125v6c0 .621.503 1.125 1.124 1.125h6c.622 0 1.126-.504 1.126-1.125v-6C18 .504 17.495 0 16.875 0ZM7.125 9.75h-6C.504 9.75 0 10.254 0 10.875v6C0 17.496.504 18 1.125 18h6c.621 0 1.125-.504 1.125-1.125v-6c0-.621-.504-1.125-1.125-1.125ZM16.875 9.75h-6c-.622 0-1.125.504-1.125 1.125v6c0 .621.503 1.125 1.124 1.125h6c.622 0 1.126-.504 1.126-1.125v-6c0-.621-.504-1.125-1.125-1.125Z"
      fill="#9C9C9C"
    />
  </Svg>
);

const PrivacyAppsIcon = React.memo(({ style, active, size }) => (
  <View style={style}>
    {active ? (
      <SelectPrivacyApps size={size} />
    ) : (
      <UnSelectPrivacyApps size={size} />
    )}
  </View>
));

PrivacyAppsIcon.defaultProps = {
  style: null,
  active: false,
  size: 24,
};

UnSelectPrivacyApps.propTypes = {
  size: PropTypes.number.isRequired,
};

SelectPrivacyApps.propTypes = {
  size: PropTypes.number.isRequired,
};

PrivacyAppsIcon.propTypes = {
  style: PropTypes.any,
  active: PropTypes.bool,
  size: PropTypes.number,
};

export default PrivacyAppsIcon;
