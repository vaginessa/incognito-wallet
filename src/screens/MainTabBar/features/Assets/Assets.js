import React, {memo} from 'react';
import Wallet from '@screens/Wallet/features/Home/Wallet';
import withTab from '@screens/MainTabBar/MainTabBar.enhanceTab';
import {compose} from 'recompose';

const TabAssets = () => {
  return (
    <Wallet hideBackButton />
  );
};

export default compose(
  withTab
)(memo(TabAssets));
