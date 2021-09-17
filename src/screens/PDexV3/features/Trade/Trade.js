import { Header, LoadingContainer, Row } from '@src/components';
import PropTypes from 'prop-types';
import {
  KeyboardAwareScrollView,
  Tabs,
  RefreshControl,
} from '@src/components/core';
import React from 'react';
import { View } from 'react-native';
import TabSwap from '@screens/PDexV3/features/Swap';
import { TabHomeOrderLimit } from '@screens/PDexV3/features/OrderLimit';
import { NFTTokenBottomBar } from '@screens/PDexV3/features/NFTToken';
import { useSelector } from 'react-redux';
import { BtnOrderHistory } from '@src/components/Button';
import SelectAccountButton from '@src/components/SelectAccountButton';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { ROOT_TAB_TRADE, TAB_LIMIT_ID, TAB_SWAP_ID } from './Trade.constant';
import { styled } from './Trade.styled';
import withTrade from './Trade.enhance';
import { tradePDexV3Selector } from './Trade.selector';

const RightHeader = React.memo(() => {
  const navigation = useNavigation();
  const handleNavOrderHistory = () =>
    navigation.navigate(routeNames.TradeOrderHistory);
  return (
    <Row style={styled.rightHeader}>
      <BtnOrderHistory
        style={styled.btnOrderHistory}
        onPress={handleNavOrderHistory}
      />
      <SelectAccountButton />
    </Row>
  );
});

const Trade = (props) => {
  const { refreshing, onRefresh } = props;
  const { isFetching, isFetched } = useSelector(tradePDexV3Selector);
  return (
    <View style={styled.container}>
      <Header title="pDex" rightHeader={<RightHeader />} />
      <KeyboardAwareScrollView
        contentContainerStyle={styled.main}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Tabs rootTabID={ROOT_TAB_TRADE} styledTabs={styled.styledTabs}>
          <View tabID={TAB_SWAP_ID} label="Swap" onChangeTab={() => null}>
            <TabSwap />
          </View>
          <View tabID={TAB_LIMIT_ID} label="Limit" onChangeTab={() => null}>
            <TabHomeOrderLimit />
          </View>
        </Tabs>
      </KeyboardAwareScrollView>
      <NFTTokenBottomBar />
    </View>
  );
};

Trade.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
};

export default withTrade(React.memo(Trade));
