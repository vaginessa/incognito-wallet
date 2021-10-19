import React, {memo} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import AccountSection from '@screens/Setting/features/AccountSection';
import MainLayout from '@components/MainLayout';

const Masterless = ({ isMasterless }) => {
  return (
    <AccountSection
      label="Masterless keychains"
    />
  );
};

Masterless.propTypes = {};

export default memo(Masterless);
