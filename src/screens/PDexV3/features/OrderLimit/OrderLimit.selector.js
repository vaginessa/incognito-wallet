import { PRV } from '@src/constants/common';
import { sharedSelector } from '@src/redux/selectors';
import { ACCOUNT_CONSTANT } from 'incognito-chain-web-js/build/wallet';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import { COLORS } from '@src/styles';
import convert from '@src/utils/convert';
import format from '@src/utils/format';
import floor from 'lodash/floor';
import { formValueSelector, isValid } from 'redux-form';
import isEmpty from 'lodash/isEmpty';
import { createSelector } from 'reselect';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { getExchangeRate, getPairRate } from '@screens/PDexV3';
import { getDataByPoolIdSelector } from '@screens/PDexV3/features/Pools';
import { activedTabSelector } from '@src/components/core/Tabs/Tabs.selector';
import BigNumber from 'bignumber.js';
import isEqual from 'lodash/isEqual';
import {
  formConfigs,
  ROOT_TAB_ORDER_LIMIT,
  TAB_BUY_ID,
  TAB_SELL_ID,
} from './OrderLimit.constant';
import { getInputAmount } from './OrderLimit.utils';

export const orderLimitSelector = createSelector(
  (state) => state.pDexV3.orderLimit,
  (orderLimit) => orderLimit,
);

export const poolSelectedDataSelector = createSelector(
  orderLimitSelector,
  getDataByPoolIdSelector,
  ({ poolId }, getDataByPoolId) => {
    try {
      return getDataByPoolId(poolId);
    } catch (error) {
      console.log('poolSelectedDataSelector-error', error);
    }
  },
);

export const feeSelectedSelector = createSelector(
  orderLimitSelector,
  ({ feetoken }) => feetoken || '',
);

export const feetokenDataSelector = createSelector(
  (state) => state,
  orderLimitSelector,
  feeSelectedSelector,
  getPrivacyDataByTokenIDSelector,
  (state, { data }, feetoken, getPrivacyDataByTokenID) => {
    try {
      const feeTokenData: SelectedPrivacy = getPrivacyDataByTokenID(feetoken);
      const selector = formValueSelector(formConfigs.formName);
      const fee = selector(state, formConfigs.feetoken);
      const { fee: minFeeOriginal = 0 } = data;
      const feeAmount = convert.toNumber(fee, true) || 0;
      const feeAmountText = fee;
      const origininalFeeAmount = convert.toOriginalAmount(
        feeAmount,
        feeTokenData?.pDecimals,
        false,
      );
      const minFeeAmount = convert.toHumanAmount(
        minFeeOriginal,
        feeTokenData?.pDecimals,
      );
      const minFeeAmountText = format.toFixed(
        minFeeAmount,
        feeTokenData?.pDecimals,
      );
      const minFeeAmountStr = `${minFeeAmountText} ${feeTokenData?.symbol}`;
      return {
        feetoken,
        symbol: feeTokenData?.symbol,
        pDecimals: feeTokenData?.pDecimals,

        feeAmount,
        feeAmountText,
        origininalFeeAmount,

        minFeeOriginal,
        minFeeAmount,
        minFeeAmountStr,
        minFeeAmountText,
      };
    } catch (error) {
      console.log('feetokenDataSelector-error', error);
    }
  },
);

export const inputAmountSelector = createSelector(
  (state) => state,
  feetokenDataSelector,
  orderLimitSelector,
  sharedSelector.isGettingBalance,
  getPrivacyDataByTokenIDSelector,
  poolSelectedDataSelector,
  getInputAmount,
);

export const inpuTokenSelector = createSelector(
  getPrivacyDataByTokenIDSelector,
  orderLimitSelector,
  (getPrivacyDataByTokenID, orderLimit) => (field) => {
    try {
      const tokenId = orderLimit[field];
      if (!tokenId) {
        return {};
      }
      const token = getPrivacyDataByTokenID(orderLimit[field]);
      return token;
    } catch (error) {
      console.log('inpuTokenSelector-error', error);
    }
  },
);

export const selltokenSelector = createSelector(
  inpuTokenSelector,
  (getInputToken) => getInputToken(formConfigs.selltoken),
);

export const buytokenSelector = createSelector(
  inpuTokenSelector,
  (getInputToken) => getInputToken(formConfigs.buytoken),
);

export const feeTypesSelector = createSelector(
  selltokenSelector,
  feeSelectedSelector,
  (selltoken: SelectedPrivacy, feetoken) => {
    let types = [
      {
        tokenId: PRV.id,
        symbol: PRV.symbol,
        actived: feetoken == PRV.id,
      },
    ];
    if (selltoken?.tokenId && !selltoken.isMainCrypto) {
      types.push({
        tokenId: selltoken.tokenId,
        symbol: selltoken.symbol,
        actived: feetoken == selltoken.tokenId,
      });
    }
    return types;
  },
);

export const rateDataSelector = createSelector(
  (state) => state,
  inputAmountSelector,
  (state, getInputAmount) => {
    let rate = '';
    let rateStr = '';
    let rateText = '';
    let customRate = '';
    try {
      const sellInputAmount = getInputAmount(formConfigs.selltoken);
      const buyInputAmount = getInputAmount(formConfigs.buytoken);
      if (isEmpty(sellInputAmount) || isEmpty(buyInputAmount)) {
        return {
          rate,
          rateStr,
          rateText,
          customRate,
        };
      }
      rate = getPairRate({
        token1: sellInputAmount,
        token2: buyInputAmount,
        token1Value: sellInputAmount.poolValue,
        token2Value: buyInputAmount.poolValue,
      });
      rateStr = getExchangeRate(
        sellInputAmount,
        buyInputAmount,
        sellInputAmount.poolValue,
        buyInputAmount.poolValue,
      );
      rateText = format.amountFull(rate, 0, false);
      const selector = formValueSelector(formConfigs.formName);
      customRate = selector(state, formConfigs.rate);
    } catch (error) {
      console.log('rateSelector-error', error);
    }
    return {
      rate,
      rateStr,
      rateText,
      customRate: customRate || rate,
    };
  },
);

export const orderLimitDataSelector = createSelector(
  (state) => state,
  orderLimitSelector,
  activedTabSelector,
  getPrivacyDataByTokenIDSelector,
  inputAmountSelector,
  feetokenDataSelector,
  rateDataSelector,
  poolSelectedDataSelector,
  (
    state,
    { networkfee, initing, isFetching, isFetched, percent },
    getActivedTab,
    getPrivacyDataByTokenID,
    getInputAmount,
    feeTokenData,
    rateData,
    pool,
  ) => {
    const sellInputAmount = getInputAmount(formConfigs.selltoken);
    const buyInputAmount = getInputAmount(formConfigs.buytoken);
    const activedTab = getActivedTab(ROOT_TAB_ORDER_LIMIT);
    let btnActionTitle;
    const buyColor = COLORS.green;
    const sellColor = COLORS.red;
    let reviewOrderTitle = '';
    let mainColor;
    let reviewOrderDesc = '';
    let reviewOrderDescValue = '';
    let cfmTitle = '';
    switch (activedTab) {
    case TAB_SELL_ID: {
      mainColor = sellColor;
      btnActionTitle = `Sell ${sellInputAmount?.symbol}`;
      reviewOrderTitle = `Sell ${sellInputAmount?.amountText} ${sellInputAmount?.symbol}`;
      reviewOrderDesc = 'Receive at least';
      reviewOrderDescValue = `${buyInputAmount?.amountText} ${buyInputAmount?.symbol}`;
      cfmTitle = `You placed an order to buy ${reviewOrderDescValue} for ${sellInputAmount?.amountText} ${sellInputAmount?.symbol}`;
      break;
    }
    case TAB_BUY_ID: {
      mainColor = buyColor;
      btnActionTitle = `Buy ${buyInputAmount?.symbol}`;
      reviewOrderTitle = `Buy ${buyInputAmount?.amountText} ${buyInputAmount?.symbol}`;
      reviewOrderDesc = 'Pay with';
      reviewOrderDescValue = `${sellInputAmount?.amountText} ${sellInputAmount?.symbol}`;
      cfmTitle = `You placed an order to sell ${reviewOrderDescValue} for $${buyInputAmount?.amountText} ${buyInputAmount?.symbol}`;
      break;
    }
    default:
      break;
    }
    const networkfeeAmount = format.toFixed(
      convert.toHumanAmount(networkfee, PRV.pDecimals),
      PRV.pDecimals,
    );
    const networkfeeAmountStr = `${networkfeeAmount} ${PRV.symbol}`;
    const prv: SelectedPrivacy = getPrivacyDataByTokenID(PRV.id);
    const showPRVBalance =
      !sellInputAmount.isMainCrypto && !buyInputAmount.isMainCrypto;
    const prvBalance = format.amountFull(prv.amount, PRV.pDecimals, false);
    const prvBalanceStr = `${prvBalance} ${PRV.symbol}`;
    const balanceStr = `${sellInputAmount?.balanceStr} ${sellInputAmount?.symbol} + ${buyInputAmount?.balanceStr} ${buyInputAmount?.symbol}`;
    const poolSizeStr = `${sellInputAmount?.poolValueStr} ${sellInputAmount?.symbol} + ${buyInputAmount?.poolValueStr} ${buyInputAmount?.symbol}`;
    const editableInput = !initing && isFetched && !isFetching;
    const calculating = initing || isFetching;
    const disabledBtn =
      calculating ||
      (!isFetched && !isFetching) ||
      !isValid(formConfigs.formName)(state);
    if (calculating) {
      btnActionTitle = 'Calculating...';
    }
    const tradingFeeStr = `${feeTokenData?.feeAmountText} ${feeTokenData?.symbol}`;
    const rateStr = `1 ${sellInputAmount?.symbol} = ${rateData.customRate} ${buyInputAmount?.symbol}`;
    return {
      mainColor,
      buyColor,
      sellColor,
      btnActionTitle,
      activedTab,
      editableInput,
      networkfeeAmount,
      networkfeeAmountStr,
      networkfee,
      showPRVBalance,
      prvBalance,
      prvBalanceStr,
      balanceStr,
      poolSizeStr,
      disabledBtn,
      percent,
      tradingFeeStr,
      rateStr,
      reviewOrderTitle,
      reviewOrderDesc,
      reviewOrderDescValue,
      cfmTitle,
      poolTitle: pool?.poolTitle || '',
      poolId: pool?.poolId,
    };
  },
);

const BTN_CANCEL_ORDER = {
  [ACCOUNT_CONSTANT.TX_STATUS.PROCESSING]: 'Cancel pending',
  [ACCOUNT_CONSTANT.TX_STATUS.TXSTATUS_PENDING]: 'Cancel pending',
  [ACCOUNT_CONSTANT.TX_STATUS.TXSTATUS_SUCCESS]: 'Cancel success',
};

export const openOrdersSelector = createSelector(
  orderLimitSelector,
  poolSelectedDataSelector,
  ({ orders, cancelingOrder, cancelingOrderTxs }, pool) => {
    try {
      if (!pool || !orders) {
        return [];
      }
      const token1: SelectedPrivacy = pool?.token1;
      const token2: SelectedPrivacy = pool?.token2;
      return orders.map((order) => {
        const {
          selltoken,
          requesttime,
          matched,
          amount,
          price,
          requesttx,
          cancel,
        } = order;
        let type,
          mainColor,
          pDecimals,
          infoStr,
          amountStr,
          priceStr,
          btnCancel,
          cancelTx;
        cancelTx =
          cancelingOrderTxs.find((tx) => isEqual(tx?.requesttx, requesttx)) ||
          {};
        const visibleBtnCanceling = cancelingOrder.includes(requesttx);
        const { status: cancelTxStatus, cancelTxId } = cancelTx || {};
        const fullMatched = new BigNumber(matched).isEqualTo(
          new BigNumber(amount),
        );
        let visibleBtnCancel =
          !fullMatched && !cancelTxId && (cancel.length === 0 || !cancel);
        btnCancel = BTN_CANCEL_ORDER[cancelTxStatus] || '';
        if (selltoken === token1.tokenId) {
          type = 'sell';
          mainColor = COLORS.red;
          pDecimals = token1.pDecimals;
          amountStr = format.amountFull(amount, pDecimals, false);
          priceStr = format.amountFull(price, token2.pDecimals, false);
          infoStr = `Sell ${amountStr} ${token1.symbol}\nPrice ${priceStr} ${token2.symbol}`;
        }
        if (selltoken === token2.tokenId) {
          type = 'buy';
          mainColor = COLORS.green;
          pDecimals = token2.pDecimals;
          amountStr = format.amountFull(amount, pDecimals, false);
          priceStr = format.amountFull(price, token1.pDecimals, false);
          infoStr = `Buy ${amountStr} ${token2.symbol}\nPrice ${priceStr} ${token1.symbol}`;
        }
        const percent = floor(
          new BigNumber(matched)
            .dividedBy(new BigNumber(amount))
            .multipliedBy(100)
            .toNumber(),
        );
        const percentStr = `Filled ${percent}%`;
        const timeStr = format.formatDateTime(requesttime);
        const result = {
          ...order,
          type,
          mainColor,
          timeStr,
          percent,
          percentStr,
          infoStr,
          btnCancel,
          visibleBtnCancel,
          visibleBtnCanceling,
        };
        // console.log('result', result);
        return result;
      });
    } catch (error) {
      console.log('openOrdersSelector-error', error);
    }
  },
);

export const orderCancelingSelector = createSelector(
  orderLimitSelector,
  ({ orderCanceling }) => orderCanceling || [],
);

export const isOrderCancelingSelector = createSelector(
  orderCancelingSelector,
  (orderCanceling) => (id) => id && orderCanceling?.includes(id),
);
