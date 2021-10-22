import React, {memo} from 'react';
import Home from '@screens/PDexV3/features/Home';
import withTab from '@screens/MainTabBar/MainTabBar.enhanceTab';

const TabHomeLP = () => {
  return (
    <Home hideBackButton />
  );
};

export default withTab(memo(TabHomeLP));
