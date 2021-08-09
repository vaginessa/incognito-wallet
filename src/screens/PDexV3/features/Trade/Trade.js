import { Header } from '@src/components';
import { KeyboardAwareScrollView, Tabs } from '@src/components/core';
import { withLayout_2 } from '@src/components/Layout';
import React from 'react';
import { View } from 'react-native';
import TabSwap from '@screens/PDexV3/features/Swap';
import TabOrderLimit from '@screens/PDexV3/features/OrderLimit';
import { ROOT_TAB_TRADE, TAB_LIMIT_ID, TAB_SWAP_ID } from './Trade.constant';
import { styled } from './Trade.styled';

const Trade = () => {
  return (
    <View style={styled.container}>
      <Header title="pDex" accountSelectable />
      <KeyboardAwareScrollView contentContainerStyle={styled.main}>
        <Tabs rootTabID={ROOT_TAB_TRADE} styledTabs={styled.styledTabs}>
          <View tabID={TAB_SWAP_ID} label="Swap" onChangeTab={() => null} tab>
            <TabSwap />
          </View>
          <View tabID={TAB_LIMIT_ID} label="Limit" onChangeTab={() => null}>
            <TabOrderLimit />
          </View>
        </Tabs>
      </KeyboardAwareScrollView>
    </View>
  );
};

Trade.propTypes = {};

export default withLayout_2(React.memo(Trade));
