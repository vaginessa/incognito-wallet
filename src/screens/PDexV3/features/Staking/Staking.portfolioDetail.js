import React, {memo} from 'react';
import {Image, RefreshControl, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Header, Row, RowSpaceText} from '@src/components';
import {STAKING_MESSAGES} from '@screens/PDexV3/features/Staking/Staking.constant';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {useFocusEffect, useNavigation, useNavigationParam} from 'react-navigation-hooks';
import {useDispatch, useSelector} from 'react-redux';
import {stakingActions, stakingSelector} from '@screens/PDexV3/features/Staking/index';
import {coinStyles as coinStyled} from '@screens/PDexV3/features/Staking/Staking.styled';
import {COLORS} from '@src/styles';
import {ArrowDown} from '@components/Icons';
import {BTNBorder, BTNPrimary} from '@components/core/Button';
import {HeaderRow, OneRowCoin} from '@screens/PDexV3/features/Staking/Staking.item';
import isEmpty from 'lodash/isEmpty';
import {isFetchingNFTSelector} from '@src/redux/selectors/account';
import debounce from 'lodash/debounce';
import routeNames from '@routers/routeNames';
import {actionToggleModal} from '@components/Modal';
import ModalBottomSheet from '@components/Modal/ModalBottomSheet';

const PortfolioDetail = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const tokenId = useNavigationParam('tokenId');
  const coin = useSelector(stakingSelector.stakingCoinByTokenIDSelector)(tokenId);
  const pool = useSelector(stakingSelector.stakingPoolByTokenId)(tokenId);
  const loading = useSelector(isFetchingNFTSelector);
  const onFetchData = () => dispatch(stakingActions.actionFetchCoins());
  const debounceFetchData = debounce(React.useCallback(onFetchData, []), 300);
  const renderModelCell = (data) => <OneRowCoin token={data.token} valueText={data.rewardStr} />;
  const showDetailReward = () => {
    const { rewardsMerged } = coin.reward || {};
    if (isEmpty(rewardsMerged)) return;
    dispatch(actionToggleModal({
      data: (
        <ModalBottomSheet
          title='Exchange rate'
          headerView={<HeaderRow array={['Name', 'Amount']} />}
          contentView={<View style={{ marginTop: 24 }}>{rewardsMerged.map(renderModelCell)}</View>}
        />
      ),
      visible: true,
      shouldCloseModalWhenTapOverlay: true
    }));
  };
  const renderMainContent = () => {
    const { token, staking } = coin;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onFetchData} />
          }
        >
          <Row spaceBetween style={{ marginBottom: 32, marginTop: 24 }}>
            <Row centerVertical>
              <Image source={{uri: token.iconUrl}} style={coinStyled.image} />
              <Text style={[coinStyled.coinName, { marginLeft: 12 }]}>{token.symbol}</Text>
            </Row>
            <Text style={coinStyled.coinName}>{staking.stakingAmountStr}</Text>
          </Row>
          <RowSpaceText
            label="APY"
            leftStyle={coinStyled.regularGray}
            rightStyle={coinStyled.regularDark}
            value={pool.apyStr}
          />
          <RowSpaceText
            label="Reward"
            leftStyle={coinStyled.regularGray}
            customRight={(
              <TouchableOpacity style={coinStyled.rowCenterVertical} onPress={showDetailReward}>
                <Text
                  style={[[coinStyled.regularDark], { color: COLORS.green2, marginRight: 5  }]}
                >
                  {`+ ${coin.reward.totalRewardUSDStr}`}
                </Text>
                <ArrowDown />
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </View>
    );
  };
  const renderContent = () => {
    if (!coin || !pool) return null;
    const { disableAction } = coin;
    return(
      <View style={{ justifyContent: 'space-between', flex: 1 }}>
        {renderMainContent()}
        <BTNBorder
          title={STAKING_MESSAGES.withdrawStaking}
          wrapperStyle={{ marginBottom: 8 }}
          onPress={() => {
            navigation.navigate(routeNames.StakingWithdrawInvest);
            dispatch(stakingActions.actionSetWithdrawInvestCoin({ tokenID: tokenId }));
          }}
          disabled={disableAction}
        />
        <BTNPrimary
          title={STAKING_MESSAGES.withdrawReward}
          onPress={() => {
            navigation.navigate(routeNames.StakingWithdrawReward);
            dispatch(stakingActions.actionSetWithdrawRewardCoin({ tokenID: tokenId }));
          }}
          disabled={disableAction}
        />
      </View>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      debounceFetchData();
    }, [])
  );

  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.staking} />
      {renderContent()}
    </View>
  );
};

PortfolioDetail.propTypes = {};

export default memo(PortfolioDetail);
