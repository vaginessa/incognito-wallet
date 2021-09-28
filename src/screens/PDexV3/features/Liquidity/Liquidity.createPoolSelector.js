import {createSelector} from 'reselect';
import {liquiditySelector} from '@screens/PDexV3/features/Liquidity/Liquidity.selector';
import {getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector} from '@src/redux/selectors/selectedPrivacy';
import {sharedSelector} from '@src/redux/selectors';
import {getExchangeRate} from '@screens/PDexV3';
import {allTokensIDsSelector} from '@src/redux/selectors/token';
import {filterTokenList, getInputAmount} from '@screens/PDexV3/features/Liquidity/Liquidity.utils';
import {formConfigsCreatePool} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import uniqBy from 'lodash/uniqBy';
import format from '@utils/format';
import {listPoolsPureSelector} from '@screens/PDexV3/features/Pools';
import {getDataShareByPoolIdSelector} from '@screens/PDexV3/features/Portfolio';
import {nftTokenDataSelector} from '@src/redux/selectors/account';

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
  listPoolsPureSelector,
  (tokenIDs, { inputToken, outputToken }, getPrivacyDataByTokenID, pools) => {
    if (!tokenIDs || !outputToken) return [];
    const tokens = filterTokenList({
      tokenId: inputToken.tokenId,
      pools,
      tokenIds: tokenIDs,
      ignoreTokens: [outputToken.tokenId, inputToken.tokenId],
    });
    return tokens.map(tokenID => getPrivacyDataByTokenID(tokenID));
  }
);

export const ampValueSelector = createSelector(
  createPoolSelector,
  ({ amp }) => {
    return { amp };
  }
);

export const isFetchingSelector = createSelector(
  createPoolSelector,
  ({ isFetching }) => isFetching
);

export const disableCreatePool = createSelector(
  inputAmountSelector,
  isFetchingSelector,
  nftTokenDataSelector,
  ( inputAmount, isFetching, { nftToken } ) => {
    const { error: inputError } = inputAmount(formConfigsCreatePool.formName, formConfigsCreatePool.inputToken);
    const { error: outputError } = inputAmount(formConfigsCreatePool.formName, formConfigsCreatePool.outputToken);
    const disabled = !!inputError || !!outputError || isFetching || !nftToken;
    return {
      disabled,
    };
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
  isFetchingSelector,
});
