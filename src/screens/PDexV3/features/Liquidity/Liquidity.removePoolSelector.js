import {createSelector} from 'reselect';
import {liquiditySelector} from '@screens/PDexV3/features/Liquidity/Liquidity.selector';
import {getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector} from '@src/redux/selectors/selectedPrivacy';
import {getDataShareByPoolIdSelector} from '@screens/PDexV3/features/Portfolio/Portfolio.selector';
import {getExchangeRate} from '@screens/Liquidity3/Liquidity3.utils';
import {formatBalance, getPoolSize} from '@screens/PDexV3';
import helper from '@src/constants/helper';
import {sharedSelector} from '@src/redux/selectors';
import {getInputAmount} from '@screens/PDexV3/features/Liquidity/Liquidity.utils';
import BigNumber from 'bignumber.js';
import format from '@utils/format';

const removePoolSelector = createSelector(
  liquiditySelector,
  ({ removePool }) => removePool
);

const isFetchingSelector = createSelector(
  removePoolSelector,
  ({ isFetching }) => isFetching,
);

export const feeAmountSelector = createSelector(
  removePoolSelector,
  ({ feeAmount }) => feeAmount,
);

export const poolIDSelector = createSelector(
  removePoolSelector,
  ({ poolId }) => poolId,
);

export const tokenSelector = createSelector(
  removePoolSelector,
  getPrivacyDataByTokenIDSelector,
  ({ inputToken, outputToken }, getPrivacyDataByTokenID) => {
    if (!inputToken || !outputToken) return {};
    const _inputToken = getPrivacyDataByTokenID(inputToken);
    const _outputToken = getPrivacyDataByTokenID(outputToken);
    return {
      inputToken: _inputToken,
      outputToken: _outputToken,
    };
  },
);

export const shareDataSelector = createSelector(
  removePoolSelector,
  tokenSelector,
  getDataShareByPoolIdSelector,
  (removePool, { inputToken, outputToken }, getDataShareByPoolID) => {
    const shareData = getDataShareByPoolID('111');
    if (!shareData) return {};
    const { shareStr, token1PoolValue, token2PoolValue , amp} = shareData;
    const exchangeRateStr = getExchangeRate(inputToken, outputToken, token1PoolValue, token2PoolValue);
    const poolSize = getPoolSize(inputToken, outputToken, token1PoolValue, token2PoolValue);
    const balanceStr = formatBalance(inputToken, outputToken, inputToken.amount, outputToken?.amount);
    const hookFactories = [
      {
        label: 'AMP',
        value: amp,
        info: helper.HELPER_CONSTANT.AMP
      },
      {
        label: 'Balance',
        value: balanceStr,
      },
      {
        label: 'Share',
        value: shareStr,
      },
      {
        label: 'Exchange rate',
        value: exchangeRateStr,
      },
      {
        label: 'Pool size',
        value: poolSize,
      },
    ];
    return {
      ...shareData,
      hookFactories,
    };
  }
);

export const inputAmountSelector = createSelector(
  (state) => state,
  sharedSelector.isGettingBalance,
  tokenSelector,
  feeAmountSelector,
  getInputAmount,
);

export const maxShareAmountSelector = createSelector(
  poolIDSelector,
  getDataShareByPoolIdSelector,
  tokenSelector,
  (poolId, getDataShareByPoolID, { inputToken, outputToken }) => {
    const shareData = getDataShareByPoolID(poolId);
    if (!shareData) return {
      share: 0,
      totalShare: 0,
      sharePercent: 0,
      maxInputShare: 0,
      maxInputShareStr: '',
      maxOutputShare: 0,
      maxOutputShareStr: '',
    };
    const { share, totalShare, token1PoolValue, token2PoolValue } = shareData;
    const sharePercent = new BigNumber(share).dividedBy(totalShare).toNumber();
    const maxInputShare = new BigNumber(sharePercent).multipliedBy(token1PoolValue).toNumber() || 0;
    const maxOutputShare = new BigNumber(sharePercent).multipliedBy(token2PoolValue).toNumber() || 0;
    const maxInputShareStr = format.amountFull(maxInputShare, inputToken.pDecimals);
    const maxOutputShareStr = format.amountFull(maxOutputShare, outputToken.pDecimals);
    return {
      maxInputShare,
      maxOutputShare,
      share,
      totalShare,
      sharePercent,
      maxInputShareStr,
      maxOutputShareStr,
    };
  }
);

export default ({
  isFetchingSelector,
  feeAmountSelector,
  poolIDSelector,
  tokenSelector,
  shareDataSelector,
  inputAmountSelector,
  maxShareAmountSelector,
});
