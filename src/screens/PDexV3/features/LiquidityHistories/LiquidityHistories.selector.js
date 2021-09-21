import {createSelector} from 'reselect';
import selectedPrivacySelector from '@src/redux/selectors/selectedPrivacy';
import format from '@utils/format';

const liquidityHistoriesSelector = createSelector(
  (state) => state.pDexV3,
  ({ liquidityHistory }) => liquidityHistory,
);

const contribute = createSelector(
  liquidityHistoriesSelector,
  ({ contribute }) => contribute,
);

const isFetchingContribute = createSelector(
  contribute,
  ({ isFetching }) => isFetching,
);

const contributePureData = createSelector(
  contribute,
  ({ histories }) => histories,
);

const mapContributeData = createSelector(
  contributePureData,
  selectedPrivacySelector.getPrivacyDataByTokenID,
  (histories, getPrivacyDataByTokenID) => {
    const _histories = (histories || []).map((history) => {
      const returnValue = (history.returnTokens || []).map((tokenId, index) => {
        const token = getPrivacyDataByTokenID(tokenId);
        const returnAmount = history.returnAmount[index];
        const returnAmountStr = format.amountFull(returnAmount, token.pDecimals, true);
        const returnAmountSymbolStr = `${returnAmountStr} ${token.symbol}`;
        return {
          token,
          returnAmount,
          returnAmountStr,
          returnAmountSymbolStr,
        };
      });
      const contributes = (history['contributeTokens'] || []).map((tokenId, index) => {
        const token = getPrivacyDataByTokenID(tokenId);
        const contributeAmount = history['contributeAmount'][index];
        const requestTx = history['requestTxs'][index];
        const contributeAmountStr = format.amountFull(contributeAmount, token.pDecimals, true);
        const contributeAmountSymbolStr = `${contributeAmountStr} ${token.symbol}`;
        return {
          token,
          contributeAmount,
          contributeAmountStr,
          contributeAmountSymbolStr,
          requestTx,
        };
      });
      const key = (history.requestTxs || []).join('-');
      const timeStr = format.formatDateTime(history.requesttime);
      const contributeAmountDesc = contributes.map(item => item.contributeAmountSymbolStr).join(' + ');

      const storageValue = (history['storageContribute'] || []).map((item) => {
        const token = getPrivacyDataByTokenID(item.tokenId);
        const contributeAmount = item['contributeAmount'];
        const requestTx = item['requestTx'];
        const contributeAmountStr = format.amountFull(contributeAmount, token.pDecimals, true);
        const contributeAmountSymbolStr = `${contributeAmountStr} ${token.symbol}`;
        return {
          token,
          contributeAmount,
          contributeAmountStr,
          contributeAmountSymbolStr,
          requestTx,
        };
      });

      return {
        ...history,
        key,
        contributes,
        returnValue,
        timeStr,
        contributeAmountDesc,
        storageValue,
      };
    });
    return _histories;
  },
);

export default ({
  contribute,
  isFetchingContribute,
  contributePureData,
  mapContributeData,
});
