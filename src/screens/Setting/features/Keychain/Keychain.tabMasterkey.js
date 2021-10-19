import React, {memo} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import AccountSection from '@screens/Setting/features/AccountSection';
import MainLayout from '@components/MainLayout';

const TabMasterkey = ({ isMasterless }) => {
  return (
    <AccountSection
      label="Your keychains"
    />
  );
};

TabMasterkey.propTypes = {};

export default memo(TabMasterkey);
