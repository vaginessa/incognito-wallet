import { ButtonTrade } from '@src/components/Button';
import { SwapButton, TradeInputAmount } from '@src/components/core';
import React from 'react';
import { View, Text } from 'react-native';
import { Tabs1 } from '@src/components/core/Tabs';
import { styled, tabsStyled } from './Swap.styled';
import { ROOT_TAB_ID, TAB_SIMPLE_ID, TAB_PRO_ID } from './Swap.constant';
import TabSimple from './Swap.simpleTab';
import TabPro from './Swap.proTab';

const SwapInputsGroup = React.memo(() => {
  return (
    <View>
      <TradeInputAmount hasInfinityIcon canSelectSymbol symbol="PRV" />
      <SwapButton />
      <TradeInputAmount canSelectSymbol symbol="USDT" />
    </View>
  );
});

const Swap = (props) => {
  const { handleTrade } = props;
  const tabsFactories = [
    {
      tabID: TAB_SIMPLE_ID,
      label: 'Simple',
      onChangeTab: () => null,
      tabStyled: tabsStyled.tabBtn,
      tabStyledDisabled: tabsStyled.tabBtnDisabled,
      titleStyled: tabsStyled.tabTitleStyled,
      titleDisabledStyled: tabsStyled.tabTitleDisabledStyled,
      tab: <TabSimple />,
    },
    {
      tabID: TAB_PRO_ID,
      label: 'Pro',
      onChangeTab: () => null,
      tabStyled: tabsStyled.tabBtn,
      tabStyledDisabled: tabsStyled.tabBtnDisabled,
      titleStyled: tabsStyled.tabTitleStyled,
      titleDisabledStyled: tabsStyled.tabTitleDisabledStyled,
      tab: <TabPro />,
    },
  ];
  return (
    <View style={styled.container}>
      <SwapInputsGroup />
      <ButtonTrade
        btnStyle={styled.btnTrade}
        onPress={handleTrade}
        title="Preview your order"
      />
      <Tabs1 rootTabID={ROOT_TAB_ID} styledTabList={tabsStyled.styledTabList}>
        {tabsFactories.map(({ tab, ...rest }) => (
          <View key={rest.tabID} {...rest}>
            {tab}
          </View>
        ))}
      </Tabs1>
    </View>
  );
};

Swap.propTypes = {};

export default React.memo(Swap);
