import React from 'react';
import { View } from 'react-native';
import {
  RFTradeInputAmount as TradeInputAmount,
  validator,
} from '@components/core/reduxForm';
import { change, Field } from 'redux-form';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { SwapButton, Text } from '@src/components/core';
import SelectPercentAmount from '@src/components/SelectPercentAmount';
import BigNumber from 'bignumber.js';
import format from '@src/utils/format';
import convert from '@src/utils/convert';
import { Row } from '@src/components';
import { ButtonTrade } from '@src/components/Button';
import { COLORS, FONT } from '@src/styles';
import { maxAmountValidatorForSellInput } from './Swap.utils';
import { formConfigs } from './Swap.constant';
import {
  listPairsSelector,
  selltokenSelector,
  buytokenSelector,
  swapSelector,
  inputAmountSelector,
  swapInfoSelector,
} from './Swap.selector';
import {
  actionEstimateTrade,
  actionSelectToken,
  actionSetFocusToken,
  actionSwapToken,
  actionSetPercent,
} from './Swap.actions';
import { inputGroupStyled as styled } from './Swap.styled';
import { Hook } from '../Extra';

const SelectPercentAmountInput = React.memo(() => {
  const dispatch = useDispatch();
  const inputAmount = useSelector(inputAmountSelector);
  const sellInputAmount = inputAmount(formConfigs.selltoken);
  const buyInputAmount = inputAmount(formConfigs.buytoken);
  const { percent: selected } = useSelector(swapInfoSelector);
  const onPressPercent = (percent) => {
    let _percent;
    if (percent === selected) {
      _percent = 0;
      dispatch(actionSetPercent(0));
    } else {
      _percent = percent;
      dispatch(actionSetPercent(percent));
    }
    _percent = _percent / 100;
    let amount =
      convert.toNumber(sellInputAmount?.availableAmountText, true) || 0;
    let originalAmount = convert.toOriginalAmount(
      new BigNumber(amount).multipliedBy(_percent).toNumber(),
      sellInputAmount?.pDecimals,
    );
    amount = convert.toHumanAmount(originalAmount, sellInputAmount?.pDecimals);
    const amounText = format.toFixed(amount, sellInputAmount?.pDecimals);
    dispatch(change(formConfigs.formName, formConfigs.selltoken, amounText));
    dispatch(actionEstimateTrade());
  };
  return (
    <SelectPercentAmount
      size={4}
      containerStyled={styled.selectPercentAmountContainer}
      selected={selected}
      onPressPercent={onPressPercent}
    />
  );
});

const SwapInputsGroup = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const swapInfo = useSelector(swapInfoSelector);
  const swap = useSelector(swapSelector);
  const pairsToken = useSelector(listPairsSelector);
  const selltoken: SelectedPrivacy = useSelector(selltokenSelector);
  const buytoken: SelectedPrivacy = useSelector(buytokenSelector);
  const inputAmount = useSelector(inputAmountSelector);
  const sellInputAmount = inputAmount(formConfigs.selltoken);
  const buyInputAmount = inputAmount(formConfigs.buytoken);
  const onSelectToken = (token, field) => {
    dispatch(actionSelectToken(token, field));
    navigation.pop();
  };
  const onSelectSellToken = () =>
    navigation.navigate(routeNames.SelectTokenTrade, {
      data: pairsToken.filter(
        (token: SelectedPrivacy) => token?.tokenId !== selltoken?.tokenId,
      ),
      onSelectToken: (token) => onSelectToken(token, formConfigs.selltoken),
    });
  const onSelectBuyToken = () =>
    navigation.navigate(routeNames.SelectTokenTrade, {
      data: pairsToken.filter(
        (token: SelectedPrivacy) => token?.tokenId !== buytoken?.tokenId,
      ),
      onSelectToken: (token) => onSelectToken(token, formConfigs.buytoken),
    });
  const onFocusToken = (e, field) => dispatch(actionSetFocusToken(swap[field]));
  const onEndEditing = () => dispatch(actionEstimateTrade());
  const onSwapButtons = () => dispatch(actionSwapToken());
  let _maxAmountValidatorForSellInput = React.useCallback(
    () => maxAmountValidatorForSellInput(sellInputAmount),
    [
      sellInputAmount?.originalAmount,
      sellInputAmount?.availableOriginalAmount,
      sellInputAmount?.availableAmountText,
      sellInputAmount?.symbol,
    ],
  );
  const onPressInfinityIcon = () => {
    dispatch(
      change(
        formConfigs.formName,
        formConfigs.selltoken,
        sellInputAmount.availableAmountText,
      ),
    );
    dispatch(actionEstimateTrade());
  };

  return (
    <View style={styled.inputGroups}>
      <Field
        component={TradeInputAmount}
        name={formConfigs.selltoken} //
        hasIcon
        srcIcon={selltoken.iconUrl}
        canSelectSymbol
        symbol={selltoken?.symbol}
        onPressSymbol={onSelectSellToken}
        onFocus={(e) => onFocusToken(e, formConfigs.selltoken)}
        onEndEditing={onEndEditing}
        onPressInfinityIcon={onPressInfinityIcon}
        validate={[
          ...(selltoken.isIncognitoToken
            ? validator.combinedNanoAmount
            : validator.combinedAmount),
          _maxAmountValidatorForSellInput,
        ]}
        loadingBalance={!!sellInputAmount?.loadingBalance}
        editableInput={!!swapInfo?.editableInput}
        visibleHeader
        label="From"
        rightHeader={(
          <Row style={styled.rightHeaderSell}>
            <Text
              style={styled.balanceStr}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Balance: {swapInfo.balanceStr}
            </Text>
            <ButtonTrade
              btnStyle={styled.btnStyle}
              titleStyle={styled.titleStyle}
              title="MAX"
              onPress={onPressInfinityIcon}
            />
          </Row>
        )}
      />
      <SwapButton onSwapButtons={onSwapButtons} />
      <Field
        component={TradeInputAmount}
        name={formConfigs.buytoken} //
        canSelectSymbol
        hasIcon
        srcIcon={buytoken.iconUrl}
        symbol={buytoken?.symbol}
        onPressSymbol={onSelectBuyToken}
        onFocus={(e) => onFocusToken(e, formConfigs.buytoken)}
        onEndEditing={onEndEditing}
        validate={[...validator.combinedAmount]}
        loadingBalance={!!buyInputAmount?.loadingBalance}
        editableInput={!!swapInfo?.editableInput}
        visibleHeader
        label="To"
      />
      <Hook
        label="Rate"
        value={swapInfo?.maxPriceStr}
        hasQuestionIcon
        styledHook={{ marginTop: 32, marginBottom: 0 }}
        customStyledLabel={{ color: COLORS.black, fontSize: FONT.SIZE.regular }}
        customStyledValue={{
          color: COLORS.colorGrey3,
          fontSize: FONT.SIZE.regular,
        }}
      />
    </View>
  );
});

export default SwapInputsGroup;
