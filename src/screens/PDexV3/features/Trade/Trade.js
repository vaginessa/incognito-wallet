import { Header, Row } from '@src/components';
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
import { activedTabSelector } from '@src/components/core/Tabs';
import { ROOT_TAB_TRADE, TAB_LIMIT_ID, TAB_SWAP_ID } from './Trade.constant';
import { styled } from './Trade.styled';
import withTrade from './Trade.enhance';

export const RightHeader = React.memo(
  ({ callback, visibleBtnHistory, selectAccountable = true } = {}) => {
    const navigation = useNavigation();
    const handleNavOrderHistory = () =>
      navigation.navigate(routeNames.TradeOrderHistory);
    return (
      <Row style={styled.rightHeader}>
        {visibleBtnHistory && (
          <BtnOrderHistory
            style={styled.btnOrderHistory}
            onPress={handleNavOrderHistory}
          />
        )}
        {selectAccountable && <SelectAccountButton callback={callback} />}
      </Row>
    );
  },
);

const Trade = (props) => {
  const { refreshing, onRefresh } = props;
  const activedTab = useSelector(activedTabSelector)(ROOT_TAB_TRADE);
  return (
    <View style={styled.container}>
      <Header
        title="pDex"
        rightHeader={
          <RightHeader
            callback={onRefresh}
            visibleBtnHistory={activedTab === TAB_SWAP_ID}
          />
        }
      />
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
