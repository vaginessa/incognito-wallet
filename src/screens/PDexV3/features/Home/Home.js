import React from 'react';
import { BottomView, Row } from '@src/components';
import { Tabs } from '@src/components/core';
import Portfolio from '@src/screens/PDexV3/features/Portfolio';
import { View } from 'react-native';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { liquidityActions } from '@screens/PDexV3/features/Liquidity';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import ReturnLP from '@screens/PDexV3/features/Share/Share.returnLP';
import {listPoolsSelector, PoolsList} from '@screens/PDexV3/features/Pools';
import {nftTokenDataSelector} from '@src/redux/selectors/account';
import SelectAccountButton from '@components/SelectAccountButton';
import {compose} from 'recompose';
import {withLayout_2} from '@components/Layout';
import withHome from './Home.enhance';
import { ROOT_TAB_HOME, TAB_POOLS_ID, TAB_PORTFOLIO_ID } from './Home.constant';
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
      <PoolsList onPressPool={onNavigateContribute} listPools={listPools} />
      <BottomView
        title="Create a pool +"
        onPress={() => {
          navigation.navigate(routeNames.CreatePool);
        }}
      />
    </>
  );
});

const HeaderView = React.memo(() => {
  const renderContent = () => (
    <Row spaceBetween style={styled.headerRow}>
      <ReturnLP />
    </Row>
  );
  return renderContent();
});

const Home = () => {
  const navigation = useNavigation();
  const { titleStr } = useSelector(nftTokenDataSelector);
  const _TabPools = React.useMemo(() => (
    <View tabID={TAB_POOLS_ID} label="Pools">
      <HeaderView />
      <TabPools />
    </View>
  ), []);
  const _TabPortfolio = React.useMemo(() => (
    <View tabID={TAB_PORTFOLIO_ID} label="Portfolio">
      <HeaderView />
      <Portfolio />
      {!titleStr && (
        <BottomView
          title="History"
          onPress={() => {
            navigation.navigate(routeNames.LiquidityHistories);
          }}
        />
      )}
    </View>
  ), [titleStr]);
  return (
    <Tabs
      rootTabID={ROOT_TAB_HOME}
      styledTabs={mainStyle.tab1}
      styledTabList={mainStyle.styledTabList1}
      defaultTabIndex={1}
      useTab1
      rightCustom={(
        <Row style={{ borderRadius: 20 }}>
          <SelectAccountButton />
        </Row>
      )}
    >
      {_TabPools}
      {_TabPortfolio}
    </Tabs>
  );
};

export default compose(
  withHome,
  withLayout_2
)(React.memo(Home));
