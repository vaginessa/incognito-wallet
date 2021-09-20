import {createSelector} from 'reselect';
import {liquiditySelector} from '@screens/PDexV3/features/Liquidity/Liquidity.selector';
import {getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector} from '@src/redux/selectors/selectedPrivacy';
import {sharedSelector} from '@src/redux/selectors';
import {getExchangeRate} from '@screens/PDexV3';
import {allTokensIDsSelector} from '@src/redux/selectors/token';
import {getInputAmount} from '@screens/PDexV3/features/Liquidity/Liquidity.utils';
import {formValueSelector} from 'redux-form';
import {formConfigsCreatePool} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import uniqBy from 'lodash/uniqBy';
import format from '@utils/format';
import convert from '@utils/convert';

const createPoolSelector = createSelector(
  liquiditySelector,
  (liquidity) => liquidity?.createPool,
);

export const tokenSelector = createSelector(
  createPoolSelector,
  getPrivacyDataByTokenIDSelector,
  ({ inputToken, outputToken }, getPrivacyDataByTokenID) => {
    if (!inputToken || !outputToken) return {};
    const _inputToken = getPrivacyDataByTokenID(inputToken);
    const _outputToken = getPrivacyDataByTokenID(outputToken);
    return {
      inputToken: _inputToken,
      outputToken: _outputToken,
    };
  }
);

export const feeAmountSelector = createSelector(
  createPoolSelector,
  getPrivacyDataByTokenIDSelector,
  ({ feeAmount, feeToken }, getPrivacyDataByTokenID) =>
    ({ feeAmount, feeToken, token: getPrivacyDataByTokenID(feeToken) }),
);

export const inputAmountSelector = createSelector(
  (state) => state,
  sharedSelector.isGettingBalance,
  tokenSelector,
  feeAmountSelector,
  getInputAmount,
);

export const hookFactoriesSelector = createSelector(
  tokenSelector,
  sharedSelector.isGettingBalance,
  feeAmountSelector,
  inputAmountSelector,
  ({ inputToken, outputToken }, isGettingBalance, { token: feeToken }, inputAmount) => {
    if (!inputToken || !outputToken || !feeToken) return [];
    const tokens = uniqBy([inputToken, outputToken, feeToken], (token) => token.tokenId);
    const input = inputAmount(formConfigsCreatePool.formName, formConfigsCreatePool.inputToken);
    const output = inputAmount(formConfigsCreatePool.formName, formConfigsCreatePool.outputToken);
    const hookBalances = tokens.map((token) => ({
      label: 'Balance',
      value: `${format.amountFull(token.amount, token.pDecimals)} ${token.symbol}`,
      loading: isGettingBalance.includes(token?.tokenId)
    }));
    const exchangeRateStr = getExchangeRate(inputToken, outputToken, input.originalInputAmount, output.originalInputAmount);
    return [
      ...hookBalances,
      {
        label: 'Exchange rate',
        value: exchangeRateStr,
      },
    ];
  }
);

export const inputTokensListSelector = createSelector(
  allTokensIDsSelector,
  tokenSelector,
  getPrivacyDataByTokenIDSelector,
  (tokenIDs, { inputToken }, getPrivacyDataByTokenID) => {
    if (!tokenIDs || !inputToken) return [];
    return tokenIDs.filter((tokenID) => (tokenID !== inputToken?.tokenId)).map(tokenID => getPrivacyDataByTokenID(tokenID));
  }
);

export const outputTokensListSelector = createSelector(
  allTokensIDsSelector,
  tokenSelector,
  getPrivacyDataByTokenIDSelector,
  (tokenIDs, { outputToken }, getPrivacyDataByTokenID) => {
    if (!tokenIDs || !outputToken) return [];
    return tokenIDs.filter((tokenID) => (tokenID !== outputToken?.tokenId)).map(tokenID => getPrivacyDataByTokenID(tokenID));
  }
);

export const ampValueSelector = createSelector(
  (state) => state,
  (state) => {
    const selector = formValueSelector(formConfigsCreatePool.formName);
    const ampStr = selector(state, formConfigsCreatePool.amp);
    const amp = convert.toNumber(ampStr, true);
    const isValid = !isNaN(amp) && amp > 0;
    return { ampStr, amp, isValid };
  }
);

export const disableCreatePool = createSelector(
  inputAmountSelector,
  ampValueSelector,
  ( inputAmount, { isValidAMP } ) => {
    const { error: inputError } = inputAmount(formConfigsCreatePool.formName, formConfigsCreatePool.inputToken);
    const { error: outputError } = inputAmount(formConfigsCreatePool.formName, formConfigsCreatePool.outputToken);
    return !!inputError || !!outputError || !isValidAMP;
  }
);

export default ({
  createPoolSelector,
  tokenSelector,
  hookFactoriesSelector,
  feeAmountSelector,
  inputTokensListSelector,
  outputTokensListSelector,
  inputAmountSelector,
  ampValueSelector,
  disableCreatePool,
});
