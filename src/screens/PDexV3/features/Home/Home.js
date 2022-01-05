import React from 'react';
import { Row } from '@src/components';
import { Tabs } from '@src/components/core';
import Portfolio from '@src/screens/PDexV3/features/Portfolio';
import { View } from 'react-native';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { liquidityActions } from '@screens/PDexV3/features/Liquidity';
import ReturnLP from '@screens/PDexV3/features/Share/Share.returnLP';
import { listPoolsSelector, PoolsList } from '@screens/PDexV3/features/Pools';
import SelectAccountButton from '@components/SelectAccountButton';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout';
import globalStyled from '@src/theme/theme.styled';
import { PoolReward } from '@screens/PDexV3/features/Share';
import { BtnPrimary } from '@components/core/Button';
import PortfolioReward from '@screens/PDexV3/features/Portfolio/Portfolio.reward';
import withHome from './Home.enhance';
import { ROOT_TAB_HOME, TAB_POOLS_ID, TAB_PORTFOLIO_ID, TAB_REWARDS_ID } from './Home.constant';
import { styled } from './Home.styled';

const TabPools = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const listPools = useSelector(listPoolsSelector);
  const onNavigateContribute = (poolId) => {
    batch(() => {
      dispatch(liquidityActions.actionSetContributeID({ poolId, nftId: '' }));
      navigation.navigate(routeNames.ContributePool);
    });
  };
  return (
    <>
      <PoolsList onPressPool={onNavigateContribute} listPools={listPools} canSearch={false} />
      <View style={styled.btnSearchPool}>
        <BtnPrimary onPress={() => navigation.navigate(routeNames.PoolsTab)} title="Search pools" wrapperStyle={{ marginBottom: 0 }}  />
      </View>
    </>
  );
});

const HeaderPortfolioView = React.memo(() => {
  const renderContent = () => (
    <View style={globalStyled.defaultPaddingHorizontal}>
      <Row spaceBetween style={styled.headerRow}>
        <ReturnLP />
      </Row>
    </View>
  );
  return renderContent();
});


const HeaderRewardView = React.memo(() => {
  const renderContent = () => (
    <View style={globalStyled.defaultPaddingHorizontal}>
      <Row spaceBetween style={styled.headerRow}>
        <PoolReward />
      </Row>
    </View>
  );
  return renderContent();
});

const Home = () => {
  const _TabPools = React.useMemo(() => (
    <View tabID={TAB_POOLS_ID} label="Select pools">
      <TabPools />
    </View>
  ), []);
  const _TabPortfolio = React.useMemo(() => (
    <View tabID={TAB_PORTFOLIO_ID} label="Pools">
      <HeaderPortfolioView />
      <Portfolio />
    </View>
  ), []);
  const _TabReward = React.useMemo(() => (
    <View tabID={TAB_REWARDS_ID} label="Rewards">
      <HeaderRewardView />
      <PortfolioReward />
    </View>
  ), []);
  return (
    <Tabs
      rootTabID={ROOT_TAB_HOME}
      useTab1
      defaultTabHeader
      rightCustom={(<SelectAccountButton />)}
    >
      {_TabPools}
      {_TabPortfolio}
      {_TabReward}
    </Tabs>
  );
};

export default compose(
  withHome,
  withLayout_2
)(React.memo(Home));
