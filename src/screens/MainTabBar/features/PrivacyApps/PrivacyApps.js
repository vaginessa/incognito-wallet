import React, { memo } from 'react';
import PrivacyApps from '@screens/PDexV3/features/PrivacyApps';
import withTab from '@screens/MainTabBar/MainTabBar.enhanceTab';

const TabPrivacyApps = () => {
  return <PrivacyApps hideBackButton />;
};

export default withTab(memo(TabPrivacyApps));
