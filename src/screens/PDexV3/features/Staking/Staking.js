import React, {memo} from 'react';
import {View} from 'react-native';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header, Row} from '@src/components';
import {RoundCornerButton, Tabs} from '@components/core';
import routeNames from '@routers/routeNames';
import {useNavigation} from 'react-navigation-hooks';
import {btnStyles as btnStyled, homeStyle, tabStyle} from '@screens/PDexV3/features/Staking/Staking.styled';
import {STAKING_MESSAGES, TABS} from '@screens/PDexV3/features/Staking/Staking.constant';
import AmountGroup from '@components/core/AmountGroup';
import {CalendarClockIcon as CalendarIcon} from '@components/Icons';
import StakingPools from '@screens/PDexV3/features/Staking/Staking.pools';
import {BTNBorder} from '@components/core/Button';
import StakingPortfolio from '@screens/PDexV3/features/Staking/Staking.portfolio';
import PropTypes from 'prop-types';
import withFetch from '@screens/PDexV3/features/Staking/Staking.enhanceFetch';

const Reward = React.memo(() => {
  return (
    <Row spaceBetween style={{ marginTop: 27 }}>
      <AmountGroup />
      <CalendarIcon btnStyle={{ paddingLeft: 15 }} onPress={() => {}} />
    </Row>
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

const tabStyled = {
  titleStyled: tabStyle.title,
  titleDisabledStyled: tabStyle.disabledText,
  tabStyledEnabled: tabStyle.tabEnable,
};

const Staking = ({ handleFetchStakingPools, handleFetchData }) => {
  React.useEffect(() => {
    typeof handleFetchStakingPools === 'function' && handleFetchStakingPools();
    typeof handleFetchData === 'function' && handleFetchData();
  }, []);
  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.staking} accountSelectable />
      <Reward />
      <View style={homeStyle.wrapper}>
        <Tabs rootTabID={TABS.ROOT_ID} styledTabList={{ padding: 0 }}>
          <View tabID={TABS.TAB_COINS} label={STAKING_MESSAGES.listCoins} {...tabStyled}>
            <StakingPools />
          </View>
          <View tabID={TABS.TAB_PORTFOLIO} label={STAKING_MESSAGES.portfolio} {...tabStyled}>
            <StakingPortfolio />
          </View>
        </Tabs>
      </View>
      <BTNBorder title="Stake now" onPress={() => {}} />
    </View>
  );
};

Staking.propTypes = {
  handleFetchStakingPools: PropTypes.func.isRequired,
  handleFetchData: PropTypes.func.isRequired,
};

export default withFetch(memo(Staking));
