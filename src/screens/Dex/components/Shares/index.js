import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';

const Shares = ({
  share,
  totalShare,
  showPercent,
}) => {
  if (!share) return null;
  const percent = showPercent && totalShare ? `(${(share / totalShare) * 100})%` : '';
  return (
    <ExtraInfo
      left="Shares"
      right={`${share} ${percent}`}
    />
  );
};

Shares.defaultProps = {
  showPercent: true,
};
Shares.propTypes = {
  share: PropTypes.number.isRequired,
  totalShare: PropTypes.number.isRequired,
  showPercent: PropTypes.bool,
};


export default memo(Shares);
