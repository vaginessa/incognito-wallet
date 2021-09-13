import {createSelector} from 'reselect';
import {liquiditySelector} from '@screens/PDexV3/features/Liquidity/Liquidity.selector';
import {getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector} from '@src/redux/selectors/selectedPrivacy';
import {sharedSelector} from '@src/redux/selectors';
import {formatBalance} from '@screens/PDexV3';
import {allTokensIDsSelector} from '@src/redux/selectors/token';
import {getInputAmount} from '@screens/PDexV3/features/Liquidity/Liquidity.utils';
import {formValueSelector} from 'redux-form';
import {formConfigsCreatePool} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';

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
  ({ feeAmount }) => feeAmount,
);

export const hookFactoriesSelector = createSelector(
  tokenSelector,
  sharedSelector.isGettingBalance,
  ({ inputToken, outputToken }, isGettingBalance) => {
    let balanceStr = '';
    let isLoadingBalance = true;
    if (inputToken || outputToken) {
      balanceStr = formatBalance(inputToken, outputToken, inputToken.amount, outputToken?.amount);
      isLoadingBalance = isGettingBalance.includes(inputToken?.tokenId) || isGettingBalance.includes(outputToken?.tokenId);
    }
    return [
      {
        label: 'Balance',
        value: balanceStr,
        loading: isLoadingBalance
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

export const inputAmountSelector = createSelector(
  (state) => state,
  sharedSelector.isGettingBalance,
  tokenSelector,
  feeAmountSelector,
  getInputAmount,
);

export const ampValueSelector = createSelector(
  (state) => state,
  (state) => {
    const selector = formValueSelector(formConfigsCreatePool.formName);
    return selector(state, formConfigsCreatePool.amp);
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
});
