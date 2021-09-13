import React, {memo} from 'react';
import {View} from 'react-native';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header, Row} from '@src/components';
import {useSelector} from 'react-redux';
import {selectedPrivacySelector} from '@src/redux/selectors';
import {PRVIDSTR} from 'incognito-chain-web-js/build/wallet';
import {RoundCornerButton, TotalReward} from '@components/core';
import routeNames from '@routers/routeNames';
import {useNavigation} from 'react-navigation-hooks';
import {btnStyles as btnStyled} from '@screens/PDexV3/features/Staking/Staking.styled';
import {STAKING_MESSAGES} from '@screens/PDexV3/features/Staking/Staking.constant';
import StakingHome from '@screens/PDexV3/features/Staking/Staking.home';

const Reward = React.memo(() => {
  const nativeToken = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID)(PRVIDSTR);
  return (
    <TotalReward
      total={10000}
      nativeToken={nativeToken}
      helperScreen={routeNames.PoolV2Help}
    />
  );
});

const GroupsButton = React.memo(() => {
  const withdrawable = true;
  const navigation = useNavigation();
  const handleBuy = () => navigation.navigate(routeNames.Trade);
  const handleWithdraw = () => navigation.navigate(routeNames.StakingWithdrawCoins);
  const handleProvide = () => navigation.navigate(routeNames.StakingMoreCoins);
  const provideButton = (
    <RoundCornerButton
      title={withdrawable ? STAKING_MESSAGES.stakingMore : STAKING_MESSAGES.stakingNow}
      style={btnStyled.button}
      onPress={handleProvide}
    />
  );
  const buyButton = (
    <RoundCornerButton
      title={STAKING_MESSAGES.buyCrypto}
      style={btnStyled.button}
      onPress={handleBuy}
    />
  );
  const withdrawButton = (
    <RoundCornerButton
      title={STAKING_MESSAGES.withdraw}
      style={btnStyled.button}
      onPress={handleWithdraw}
    />
  );
  return (
    <Row center>
      {provideButton}
      {withdrawable ? withdrawButton : buyButton}
    </Row>
  );
});

const Staking = () => {
  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.staking} accountSelectable />
      <Reward />
      <GroupsButton withdrawable />
      <StakingHome />
    </View>
  );
};

export default memo(Staking);
