import {createSelector} from 'reselect';
import uniq from 'lodash/uniq';
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
    const _histories = histories.map(history => {
      const refund = (history.returnTokens || []).map((tokenId, index) => {
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
      const timeStr = format.formatDateTime(history.requesttime);
      const statusStr = 'Completed';
      const key = (history.requestTxs || []).join('-');
      return {
        ...history,
        refund,
        timeStr,
        statusStr,
        key,
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
