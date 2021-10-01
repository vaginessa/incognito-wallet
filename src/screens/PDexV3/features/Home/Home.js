import React from 'react';
import {Header, Row} from '@src/components';
import { ScrollView, Tabs } from '@src/components/core';
import PropTypes from 'prop-types';
import {
  FollowingPools,
} from '@src/screens/PDexV3/features/Pools';
import Portfolio from '@src/screens/PDexV3/features/Portfolio';
import { View, RefreshControl } from 'react-native';
import { batch, useDispatch, useSelector } from 'react-redux';
import {BtnOrderHistory, ButtonTrade} from '@src/components/Button';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { TradingVol24h } from '@screens/PDexV3/features/Share';
import { liquidityActions } from '@screens/PDexV3/features/Liquidity';
import SelectAccountButton from '@components/SelectAccountButton';
import {liquidityHistorySelector} from '@screens/PDexV3/features/LiquidityHistories';
import withHome from './Home.enhance';
import { styled } from './Home.styled';
import { ROOT_TAB_HOME, TAB_POOLS_ID, TAB_PORTFOLIO_ID } from './Home.constant';
import { homePDexV3Selector } from './Home.selector';
import { styled as tradeStyled } from '../Trade/Trade.styled';

const GroupButton = React.memo(() => {
  const navigation = useNavigation();
  return (
    <View style={styled.groupBtns}>
      <ButtonTrade
        title="Create new pool"
        btnStyle={styled.createNewPoolBtn}
        onPress={() => navigation.navigate(routeNames.CreatePool)}
      />
    </View>
  );
});

const TabPools = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const onNavigateContribute = (poolId) => {
    batch(() => {
      dispatch(liquidityActions.actionSetContributePoolID({ poolId }));
      navigation.navigate(routeNames.ContributePool);
    });
  };
  return (
    <>
      <TradingVol24h />
      <GroupButton />
      <FollowingPools handlePressPool={onNavigateContribute} />
    </>
  );
});

const RightHeader = React.memo(() => {
  const navigation = useNavigation();
  const showHistory = useSelector(liquidityHistorySelector.showHistorySelector);
  const handleNavOrderHistory = () => {
    navigation.navigate(routeNames.LiquidityHistories);
  };
  return (
    <Row style={tradeStyled.rightHeader}>
      {!!showHistory && (
        <BtnOrderHistory
          style={tradeStyled.btnOrderHistory}
          onPress={handleNavOrderHistory}
        />
      )}
      <SelectAccountButton />
    </Row>
  );
});

const Home = (props) => {
  const { isFetching } = useSelector(homePDexV3Selector);
  const { handleOnRefresh } = props;
  return (
    <View style={styled.container}>
      <Header title="Pools" rightHeader={<RightHeader />} />
      <ScrollView
        style={styled.main}
        refreshControl={(
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() =>
              typeof handleOnRefresh === 'function' && handleOnRefresh()
            }
          />
        )}
      >
        <Tabs rootTabID={ROOT_TAB_HOME}>
          <View
            tabID={TAB_POOLS_ID}
            label="Pools"
          >
            <TabPools />
          </View>
          <View
            tabID={TAB_PORTFOLIO_ID}
            label="Your portfolio"
          >
            <Portfolio />
          </View>
        </Tabs>
      </ScrollView>
    </View>
  );
};

Home.propTypes = {
  handleOnRefresh: PropTypes.func.isRequired,
};

export default withHome(React.memo(Home));
