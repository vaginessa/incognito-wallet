import React, {memo} from 'react';
import {RefreshControl, View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header, Row} from '@src/components';
import {STAKING_MESSAGES} from '@screens/PDexV3/features/Staking/Staking.constant';
import {batch, useDispatch, useSelector} from 'react-redux';
import {
  stakingActions,
  stakingPoolSelector,
  stakingPoolStatusSelector
} from '@screens/PDexV3/features/Staking';
import {ActivityIndicator, ScrollView, Text, TouchableOpacity} from '@components/core';
import {coinStyles as coinStyled} from '@screens/PDexV3/features/Staking/Staking.styled';
import routeNames from '@routers/routeNames';
import {useNavigation} from 'react-navigation-hooks';
import withFetch from '@screens/PDexV3/features/Staking/Staking.enhanceFetch';

const CoinItem = React.memo(({ coin }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { token, userBalanceStr, isLoadingBalance, tokenId, disabled, poolAmountStr } = coin;
  const onInvestCoin = () => {
    batch(() => {
      dispatch(stakingActions.actionSetInvestCoin({ tokenID: tokenId }));
      navigation.navigate(routeNames.StakingMoreInput);
    });
  };
  return (
    <TouchableOpacity
      key={tokenId}
      style={coinStyled.coin}
      disabled={disabled}
      onPress={onInvestCoin}
    >
      <View style={disabled && coinStyled.disabled}>
        <Row spaceBetween>
          <Text style={coinStyled.coinName}>{token.symbol}</Text>
          <Text style={coinStyled.coinName}>{poolAmountStr}</Text>
        </Row>
        <Row>
          {isLoadingBalance ?
            <ActivityIndicator /> :
            <Text style={coinStyled.coinExtra}>{`${userBalanceStr}`}</Text>
          }
        </Row>
      </View>
    </TouchableOpacity>
  );
});

const StakingMoreCoins = ({ handleFetchPool, handleFetchData }) => {
  const coins = useSelector(stakingPoolSelector);
  const isFetching = useSelector(stakingPoolStatusSelector);
  const renderItem = (coin) => <CoinItem coin={coin} />;
  const onRefresh = () => {
    if (typeof handleFetchPool === 'function') handleFetchPool();
    if (typeof handleFetchData === 'function') handleFetchData();
  };
  React.useEffect(() => {
    if (typeof handleFetchPool === 'function') handleFetchPool();
  }, []);
  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.selectCoin} />
      <ScrollView
        refreshControl={(
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
        )}
        style={coinStyled.coinContainer}
      >
        {coins.map(renderItem)}
      </ScrollView>
    </View>
  );
};

CoinItem.propTypes = {
  coin: PropTypes.object.isRequired,
};

StakingMoreCoins.propTypes = {
  handleFetchPool: PropTypes.func.isRequired,
  handleFetchData: PropTypes.func.isRequired,
};

export default withFetch(memo(StakingMoreCoins));
