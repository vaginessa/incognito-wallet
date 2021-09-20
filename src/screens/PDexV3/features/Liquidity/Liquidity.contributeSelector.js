import {createSelector} from 'reselect';
import {liquiditySelector} from '@screens/PDexV3/features/Liquidity/Liquidity.selector';
import {getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector} from '@src/redux/selectors/selectedPrivacy';
import {getDataByShareIdSelector} from '@screens/PDexV3/features/Portfolio/Portfolio.selector';
import {sharedSelector} from '@src/redux/selectors';
import {getExchangeRate, getPoolSize} from '@screens/PDexV3';
import helper from '@src/constants/helper';
import {getInputAmount} from '@screens/PDexV3/features/Liquidity/Liquidity.utils';
import uniqBy from 'lodash/uniqBy';
import format from '@utils/format';
import {formConfigsContribute} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';

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
  getPrivacyDataByTokenIDSelector,
  ({ feeAmount, feeToken }, getPrivacyDataByTokenID) =>
    ({ feeAmount, feeToken, token: getPrivacyDataByTokenID(feeToken) }),
);

export const mappingDataSelector = createSelector(
  poolDataSelector,
  getPrivacyDataByTokenIDSelector,
  getDataByShareIdSelector,
  tokenSelector,
  sharedSelector.isGettingBalance,
  feeAmountSelector,
  (
    poolData,
    getPrivacyDataByTokenID,
    getDataShareByPoolId,
    { inputToken, outputToken },
    isGettingBalance,
    { token: feeToken }
  ) => {
    if (!poolData || !inputToken || !outputToken) return {};
    const { poolId, amp, token1Value: token1PoolValue, token2Value: token2PoolValue } = poolData;
    const shareStr = getDataShareByPoolId(poolId)?.shareStr || '0 (0%)';
    const exchangeRateStr = getExchangeRate(inputToken, outputToken, token1PoolValue, token2PoolValue);
    const poolSize = getPoolSize(inputToken, outputToken, token1PoolValue, token2PoolValue);
    const isLoadingBalance =
      isGettingBalance.includes(inputToken?.tokenId)
      || isGettingBalance.includes(outputToken?.tokenId)
      || isGettingBalance.includes(feeToken?.tokenId);
    const tokens = uniqBy([inputToken, outputToken, feeToken], (token) => token.tokenId);
    const hookBalances = tokens.map((token) => ({
      label: 'Balance',
      value: `${format.amount(token.amount, token.pDecimals)} ${token.symbol}`,
      loading: isGettingBalance.includes(token?.tokenId)
    }));
    const hookFactories = [
      {
        label: 'AMP',
        value: amp,
        info: helper.HELPER_CONSTANT.AMP
      },
      ...hookBalances,
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
      isLoadingBalance,
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

export const disableContribute = createSelector(
  statusSelector,
  inputAmountSelector,
  ( isFetching, inputAmount ) => {
    const { error: inputError } = inputAmount(formConfigsContribute.formName, formConfigsContribute.inputToken);
    const { error: outputError } = inputAmount(formConfigsContribute.formName, formConfigsContribute.outputToken);
    return isFetching || !!inputError || !!outputError;
  }
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
  disableContribute,
});
