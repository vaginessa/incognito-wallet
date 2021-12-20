import React, {memo} from 'react';
import Wallet from '@screens/Wallet/features/Home/Wallet';
import withTab from '@screens/MainTabBar/MainTabBar.enhanceTab';
import {compose} from 'recompose';
import { Tabs, View } from '@components/core';
import { ROOT_TAB_ASSETS, TAB_COINS_ID, TAB_LIQUIDITY_ID } from '@screens/MainTabBar/features/Assets/Assets.constants';
import Portfolio from '@screens/PDexV3/features/Portfolio/Portfolio';
import { withLayout_2 } from '@components/Layout';
import { Row } from '@src/components';
import { styled } from '@screens/PDexV3/features/Home/Home.styled';
import ReturnLP from '@screens/PDexV3/features/Share/Share.returnLP';

const HeaderView = React.memo(() => {
  const renderContent = () => (
    <Row spaceBetween style={styled.headerRow}>
      <ReturnLP />
    </Row>
  );
  return renderContent();
});

const TabAssets = () => {
  return (
    <Tabs rootTabID={ROOT_TAB_ASSETS} useTab1>
      <View tabID={TAB_COINS_ID} label="Coins">
        <Wallet hideBackButton />
      </View>
      <View tabID={TAB_LIQUIDITY_ID} label="Pools">
        <HeaderView />
        <Portfolio />
      </View>
    </Tabs>
  );
};

export default compose(
  withLayout_2,
  withTab
)(memo(TabAssets));
