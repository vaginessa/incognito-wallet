import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout';
import { Header } from '@src/components';
import { View } from '@components/core';
import withSearch from '@screens/MainTabBar/features/Market/Market.withSearch';
import { TokenFollow } from '@components/Token';
import MarketList from '@components/Token/Token.marketList';
import { headerStyled } from '@screens/MainTabBar/features/Market/Market.styled';
import { batch, useDispatch } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { actionLogEvent } from '@screens/Performance';
import { actionInit, actionSetPoolSelected } from '@screens/PDexV3/features/OrderLimit';
import { actionChangeTab } from '@components/core/Tabs/Tabs.actions';
import { ROOT_TAB_TRADE, TAB_BUY_LIMIT_ID } from '@screens/PDexV3/features/Trade/Trade.constant';

const MarketSearchCoins = (props) => {
  const { handleToggleFollowToken, ...rest } = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const onOrderPress = (item) => {
    const poolId = item.defaultPoolPair;
    navigation.navigate(routeNames.Trade, { tabIndex: 0 });
    dispatch(actionLogEvent({
      desc: 'POOL-SELECTED-Market-' + JSON.stringify(poolId || '')
    }));
    if (poolId) {
      batch(() => {
        dispatch(actionSetPoolSelected(poolId));
        dispatch(actionChangeTab({ rootTabID: ROOT_TAB_TRADE, tabID: TAB_BUY_LIMIT_ID }));
        setTimeout(() => {
          dispatch(actionInit());
        }, 200);
      });
    }
  };
  return (
    <>
      <Header
        title="Search privacy coins"
        canSearch
        autoFocus
        titleStyled={headerStyled.title}
      />
      <View fullFlex borderTop style={{ overflow: 'hidden', paddingTop: 0 }}>
        <MarketList
          {...rest}
          renderItem={(item) => (
            <TokenFollow
              item={item}
              key={item.tokenId}
              hideStar
              onPress={onOrderPress}
            />
          )}
        />
      </View>
    </>
  );
};

MarketSearchCoins.propTypes = {
  handleToggleFollowToken: PropTypes.func.isRequired
};

export default compose(
  withSearch,
  withLayout_2,
)(memo(MarketSearchCoins));
