import React, {memo} from 'react';
import Wallet from '@screens/Wallet/features/Home/Wallet';
import withTab from '@screens/MainTabBar/MainTabBar.enhanceTab';

const TabAssets = () => {
  return (
    <Wallet hideBackButton />
  );
};

export default withTab(memo(TabAssets));
