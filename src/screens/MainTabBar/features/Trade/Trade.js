import React, {memo} from 'react';
import Trade from '@screens/PDexV3/features/Trade';
import withTab from '@screens/MainTabBar/MainTabBar.enhanceTab';

const TabTrade = () => {
  return (
    <Trade hideBackButton />
  );
};

export default withTab(memo(TabTrade));
