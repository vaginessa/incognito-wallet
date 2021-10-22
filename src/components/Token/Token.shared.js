import React from 'react';
import { Image } from '@src/components/core';
import PropTypes from 'prop-types';
import incognito from '@assets/images/new-icons/incognito.png';

export const Icon = React.memo((props) => {
  const { iconUrl, style } = props;
  return (
    <Image
      style={[{ width: 20, height: 20 }, style]}
      source={{ uri: iconUrl || '' }}
      defaultSource={incognito}
    />
  );
});

Icon.defaultProps = {
  style: null
};

Icon.propTypes = {
  iconUrl: PropTypes.string.isRequired,
  style: PropTypes.any
};
