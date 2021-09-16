import {createSelector} from 'reselect';
import {liquiditySelector} from '@screens/PDexV3/features/Liquidity/Liquidity.selector';
import {getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector} from '@src/redux/selectors/selectedPrivacy';
import {getDataByShareIdSelector} from '@screens/PDexV3/features/Portfolio/Portfolio.selector';
import {sharedSelector} from '@src/redux/selectors';
import {formatBalance, getExchangeRate, getPoolSize} from '@screens/PDexV3';
import helper from '@src/constants/helper';
import {getInputAmount} from '@screens/PDexV3/features/Liquidity/Liquidity.utils';

const contributeSelector = createSelector(
  liquiditySelector,
  (liquidity) => liquidity?.contribute,
);

const poolIDSelector = createSelector(
  contributeSelector,
  ({ poolId }) => poolId,
);

const statusSelector = createSelector(
  contributeSelector,
  ({ isFetching }) => isFetching,
);

const poolDataSelector = createSelector(
  contributeSelector,
  ({ data }) => data,
);

const tokenSelector = createSelector(
  contributeSelector,
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

export const feeAmountSelector = createSelector(
  contributeSelector,
  ({ feeAmount }) => feeAmount,
);

export const mappingDataSelector = createSelector(
  poolDataSelector,
  getPrivacyDataByTokenIDSelector,
  getDataByShareIdSelector,
  tokenSelector,
  sharedSelector.isGettingBalance,
  (
    poolData,
    getPrivacyDataByTokenID,
    getDataShareByPoolId,
    { inputToken, outputToken },
    isGettingBalance,
  ) => {
    if (!poolData || !inputToken || !outputToken) return {};
    const { poolId, amp, token1Value: token1PoolValue, token2Value: token2PoolValue } = poolData;
    const shareStr = getDataShareByPoolId(poolId)?.shareStr || '0 (0%)';
    const exchangeRateStr = getExchangeRate(inputToken, outputToken, token1PoolValue, token2PoolValue);
    const poolSize = getPoolSize(inputToken, outputToken, token1PoolValue, token2PoolValue);
    const balanceStr = formatBalance(inputToken, outputToken, inputToken.amount, outputToken?.amount);
    const isLoadingBalance = isGettingBalance.includes(inputToken?.tokenId) || isGettingBalance.includes(outputToken?.tokenId);
    const hookFactories = [
      {
        label: 'AMP',
        value: amp,
        info: helper.HELPER_CONSTANT.AMP
      },
      {
        label: 'Balance',
        value: balanceStr,
        loading: isLoadingBalance
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
      ...poolData,
      hookFactories,
      inputToken,
      outputToken,
      token1PoolValue,
      token2PoolValue,
    };
  }
);

export const inputAmountSelector = createSelector(
  (state) => state,
  sharedSelector.isGettingBalance,
  tokenSelector,
  feeAmountSelector,
  getInputAmount
);

export default ({
  contributeSelector,
  poolIDSelector,
  statusSelector,
  poolDataSelector,
  tokenSelector,
  feeAmountSelector,
  mappingDataSelector,
  inputAmountSelector,
});
