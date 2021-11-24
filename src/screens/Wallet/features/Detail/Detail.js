import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Header from '@src/components/Header';
import {
  selectedPrivacySelector,
  sharedSelector,
  tokenSelector,
  accountSelector,
} from '@src/redux/selectors';
import {useDispatch, useSelector} from 'react-redux';
import { BtnInfo } from '@src/components/Button';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import {
  Amount,
  AmountBasePRV,
  AmountBaseUSDT,
  ChangePrice, Price,
} from '@src/components/Token/Token';
import HistoryToken from '@screens/Wallet/features/HistoryToken';
import MainCryptoHistory from '@screens/Wallet/features/MainCryptoHistory';
import { isGettingBalance as isGettingTokenBalanceSelector } from '@src/redux/selectors/token';
import { isGettingBalance as isGettingMainCryptoBalanceSelector } from '@src/redux/selectors/account';
import useFeatureConfig from '@src/shared/hooks/featureConfig';
import { pTokenSelector } from '@src/redux/selectors/shared';
import { useHistoryEffect } from '@screens/Wallet/features/History';
import appConstant from '@src/constants/app';
import {actionChangeTab} from '@components/core/Tabs/Tabs.actions';
import {ROOT_TAB_TRADE, TAB_BUY_LIMIT_ID, TAB_SELL_LIMIT_ID} from '@screens/PDexV3/features/Trade/Trade.constant';
import {actionInit, actionSetPoolSelected} from '@screens/PDexV3/features/OrderLimit';
import {BTNBorder, BTNPrimary} from '@components/core/Button';
import {COLORS} from '@src/styles';
import {ThreeDotsVerIcon} from '@components/Icons';
import {actionToggleModal} from '@components/Modal';
import ModalBottomSheet from '@components/Modal/features/ModalBottomSheet';
import {Row} from '@src/components';
import {
  styled,
  groupBtnStyled,
  balanceStyled,
  historyStyled,
} from './Detail.styled';

const GroupButton = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selected = useSelector(selectedPrivacySelector.selectedPrivacy);
  const handleBuy = () => {
    navigation.navigate(routeNames.Trade, { tabIndex: 0 });
    const poolId = selected.defaultPoolPair;
    if (poolId) {
      dispatch(
        actionChangeTab({ rootTabID: ROOT_TAB_TRADE, tabID: TAB_BUY_LIMIT_ID }),
      );
      dispatch(actionSetPoolSelected(poolId));
      setTimeout(() => {
        dispatch(actionInit());
      }, 200);
    }
  };
  const handleSell = () => {
    const poolId = selected.defaultPoolPair;
    navigation.navigate(routeNames.Trade, { tabIndex: 1 });
    if (poolId) {
      dispatch(
        actionChangeTab({ rootTabID: ROOT_TAB_TRADE, tabID: TAB_SELL_LIMIT_ID }),
      );
      dispatch(actionSetPoolSelected(poolId));
      setTimeout(() => {
        dispatch(actionInit());
      }, 200);
    }
  };

  return (
    <View style={groupBtnStyled.groupButton}>
      <BTNPrimary
        title="Buy"
        wrapperStyle={groupBtnStyled.btnStyle}
        background={COLORS.green}
        onPress={handleBuy}
      />
      <BTNPrimary
        title="Sell"
        wrapperStyle={groupBtnStyled.btnStyle}
        background={COLORS.red2}
        onPress={handleSell}
      />
    </View>
  );
});

const Balance = React.memo(() => {
  const selected = useSelector(selectedPrivacySelector.selectedPrivacy);
  const isGettingBalance = useSelector(
    sharedSelector.isGettingBalance,
  ).includes(selected?.tokenId);
  const tokenData = {
    ...selected,
    isGettingBalance,
  };
  const amountProps = {
    customStyle: balanceStyled.amount,
    ...tokenData,
    showSymbol: false,
  };
  const changePriceProps = {
    customStyle: balanceStyled.changePrice,
    ...tokenData,
  };
  return (
    <View style={balanceStyled.container}>
      <Amount {...amountProps} />
      <View style={balanceStyled.hook}>
        <Price pricePrv={selected.pricePrv} priceUsd={selected.priceUsd} />
        <ChangePrice {...changePriceProps} />
      </View>
    </View>
  );
});

const History = React.memo(() => {
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  return (
    <View style={historyStyled.container}>
      {selectedPrivacy?.isMainCrypto ? <MainCryptoHistory /> : <HistoryToken />}
    </View>
  );
});

const CustomRightHeader = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleSend = () => {
    navigation.navigate(routeNames.Send);
    dispatch(actionToggleModal({ visible: false }));
  };
  const handleReceive = () => {
    navigation.navigate(routeNames.ReceiveCrypto);
    dispatch(actionToggleModal({ visible: false }));
  };
  const [onPressSend, isSendDisabled] = useFeatureConfig(
    appConstant.DISABLED.SEND,
    handleSend,
  );
  const onToggle = () => {
    dispatch(actionToggleModal({
      data: (
        <ModalBottomSheet
          style={{ height: '15%' }}
          contentView={(
            <Row style={groupBtnStyled.groupButton}>
              <BTNBorder
                title="Receive"
                wrapperStyle={groupBtnStyled.btnStyle}
                onPress={handleReceive}
              />
              <BTNPrimary
                title="Send"
                wrapperStyle={groupBtnStyled.btnStyle}
                onPress={onPressSend}
                disabled={isSendDisabled}
              />
            </Row>
          )}
        />
      ),
      visible: true,
      shouldCloseModalWhenTapOverlay: true
    }));
  };
  return (
    <TouchableOpacity style={{ height: 30, justifyContent: 'center' }} onPress={onToggle}>
      <ThreeDotsVerIcon />
    </TouchableOpacity>
  );
};

const Detail = (props) => {
  const navigation = useNavigation();
  const selected = useSelector(selectedPrivacySelector.selectedPrivacy);
  const { isFetching } = useSelector(tokenSelector.historyTokenSelector);
  const token = useSelector(
    selectedPrivacySelector.selectedPrivacyByFollowedSelector,
  );
  const isGettingTokenBalance = useSelector(isGettingTokenBalanceSelector);
  const isGettingMainCryptoBalance = useSelector(
    isGettingMainCryptoBalanceSelector,
  );
  const defaultAccount = useSelector(accountSelector.defaultAccountSelector);
  const refreshing =
    !!isFetching || selected?.isMainCrypto
      ? isGettingMainCryptoBalance.length > 0 || !defaultAccount
      : isGettingTokenBalance.length > 0 || !token;
  const onGoBack = () => navigation.navigate(routeNames.Wallet);
  const { onRefresh } = useHistoryEffect();
  return (
    <>
      <View style={[styled.container, { marginHorizontal: 25 }]}>
        <Header
          title={selected?.name}
          customHeaderTitle={<BtnInfo />}
          rightHeader={<CustomRightHeader />}
          onGoBack={onGoBack}
          handleSelectedAccount={onRefresh}
        />
        <Balance />
        <GroupButton />
        <History {...{ ...props, refreshing }} />
      </View>
    </>
  );
};

Detail.propTypes = {};

History.propTypes = {};

export default React.memo(Detail);
