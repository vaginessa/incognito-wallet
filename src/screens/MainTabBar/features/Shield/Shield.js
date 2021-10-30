import React, {memo} from 'react';
import Shield from '@screens/Shield';
import withTab from '@screens/MainTabBar/MainTabBar.enhanceTab';

const TabShield = () => {
  return (
    <Shield hideBackButton />
  );
};

export default withTab(memo(TabShield));
