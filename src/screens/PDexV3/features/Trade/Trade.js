import { Header, LoadingContainer } from '@src/components';
import { KeyboardAwareScrollView, Tabs } from '@src/components/core';
import React from 'react';
import { View } from 'react-native';
import TabSwap from '@screens/PDexV3/features/Swap';
import { TabHomeOrderLimit } from '@screens/PDexV3/features/OrderLimit';
import { NFTTokenBottomBar } from '@screens/PDexV3/features/NFTToken';
import { useSelector } from 'react-redux';
import { ROOT_TAB_TRADE, TAB_LIMIT_ID, TAB_SWAP_ID } from './Trade.constant';
import { styled } from './Trade.styled';
import withTrade from './Trade.enhance';
import { tradePDexV3Selector } from './Trade.selector';

const Trade = () => {
  const { isFetching } = useSelector(tradePDexV3Selector);
  return (
    <View style={styled.container}>
      <Header title="pDex" accountSelectable />
      {isFetching ? (
        <LoadingContainer />
      ) : (
        <>
          <KeyboardAwareScrollView contentContainerStyle={styled.main}>
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
        </>
      )}
    </View>
  );
};

Trade.propTypes = {};

export default withTrade(React.memo(Trade));
