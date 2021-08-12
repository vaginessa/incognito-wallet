import { createSelector } from 'reselect';
import { listPairsSelector } from '@screens/PDexV3/features/Trade';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import { allTokensIDsSelector } from '@src/redux/selectors/token';
import format from '@src/utils/format';
import includes from 'lodash/includes';
import { formValueSelector } from 'redux-form';
import { formConfigs } from './Swap.constant';
import { getPairRate } from '../../PDexV3.utils';

export const swapSelector = createSelector(
  (state) => state.pDexV3,
  ({ swap }) => swap,
);

export const listTokenHasPairSelector = createSelector(
  allTokensIDsSelector,
  listPairsSelector,
  getPrivacyDataByTokenIDSelector,
  (tokenIDs, pairs, getPrivacyDataByTokenID) =>
    tokenIDs
      .filter((tokenId) =>
        pairs.find(({ poolid }) => includes(poolid, tokenId)),
      )
      .map((tokenId) => getPrivacyDataByTokenID(tokenId)),
);

export const sellTokenPairsSwapSelector = createSelector(
  swapSelector,
  listTokenHasPairSelector,
  ({ buytoken, selltoken }, tokens) => {
    return tokens.filter((token) => token?.tokenId !== selltoken) || [];
  },
);

export const buyTokenPairsSwapSelector = createSelector(
  swapSelector,
  listTokenHasPairSelector,
  ({ buytoken, selltoken }, tokens) => {
    return tokens.filter((token) => token?.tokenId !== buytoken) || [];
  },
);

export const defaultPairSelector = createSelector(
  listPairsSelector,
  (pairs) => pairs[0] || null,
);

export const selltokenSelector = createSelector(
  getPrivacyDataByTokenIDSelector,
  swapSelector,
  (getPrivacyDataByTokenID, { selltoken }) =>
    selltoken && getPrivacyDataByTokenID(selltoken),
);

export const buytokenSelector = createSelector(
  getPrivacyDataByTokenIDSelector,
  swapSelector,
  (getPrivacyDataByTokenID, { buytoken }) =>
    buytoken && getPrivacyDataByTokenID(buytoken),
);

export const swapInfoSelector = createSelector(
  selltokenSelector,
  buytokenSelector,
  listPairsSelector,
  (selltoken, buytoken, pairs) => {
    const selltokenId = selltoken.tokenId;
    const buytokenId = buytoken.token;
    const pair =
      pairs.find(({ poolid }) => {
        return poolid.includes(selltokenId) && poolid.includes(buytokenId);
      }) || {};
    const { token1IdStr, token1PoolValue, token2PoolValue } = pair;
    let rate = getPairRate({
      token1: selltoken,
      token2: buytoken,
      token1Value:
        selltoken === token1IdStr ? token1PoolValue : token2PoolValue,
      token2Value: buytoken === token1IdStr ? token1PoolValue : token2PoolValue,
    });
    const selltokenBalance = format.amount(
      selltoken.amount,
      selltoken.pDecimals,
      false,
    );
    const buytokenBalance = format.amount(
      buytoken.amount,
      buytoken.pDecimals,
      false,
    );
    return {
      balanceStr: `${selltokenBalance} ${selltoken.symbol} + ${buytokenBalance} ${buytoken.symbol}`,
      routing: '',
      rate,
    };
  },
);

export const swapInputsAmountSelector = createSelector(
  selltokenSelector,
  buytokenSelector,
  formValueSelector,
  (state) => state,
  (selltoken, buytoken, getFormValue, state) => {
    let selltokenAmount = '0';
    let buyttokenAmount = '0';
    try {
      const selector = formValueSelector(formConfigs.formName);
      const values = selector(
        state,
        formConfigs.selltoken,
        formConfigs.buytoken,
      );
      console.log('values', values);
    } catch {
      //
    }
    return {
      selltokenAmount,
      buyttokenAmount,
    };
  },
);
