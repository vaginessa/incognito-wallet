import React from 'react';
import { Image } from '@src/components/core';
import PropTypes from 'prop-types';
import incognito from '@assets/images/new-icons/incognito.png';

export const Icon = React.memo((props) => {
  const { iconUrl, style } = props;
  const [error, setError] = React.useState(false);
  const source = React.useMemo(() => {
    if (error) return incognito;
    return { uri: iconUrl || '' };
  }, [error]);
  return (
    <Image
      style={[{ width: 20, height: 20 }, style]}
      source={source}
      defaultSource={incognito}
      onError={() => setError(true)}
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
