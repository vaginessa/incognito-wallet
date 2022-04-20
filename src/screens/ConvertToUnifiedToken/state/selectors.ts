import { createSelector } from 'reselect';
import { PTokenConvert, TokenConvert } from './models';

const listUnifiedTokenSelector = createSelector(
  (state: any) => state?.convertToUnifiedToken,
  (data) => data?.listUnifiedToken,
);

const loadingGetListUnifiedTokenSelector = createSelector(
  (state: any) => state?.convertToUnifiedToken,
  (data) => data?.isFetchingListUnifiedToken,
);

const listUnifiedTokenSelectedSelector = createSelector(
  listUnifiedTokenSelector,
  (listUnifiedToken) =>
    listUnifiedToken?.filter((token: TokenConvert) => token?.selected),
);

const listTokenConvertSelector = createSelector(
  listUnifiedTokenSelector,
  (listUnifiedToken) => {
    const listTokenConvert: PTokenConvert[] = [];
    for (var i = 0; i < listUnifiedToken.length; i++) {
      if (listUnifiedToken[i]?.selected) {
        for (var j = 0; j < listUnifiedToken[i].listUnifiedToken.length; j++) {
          listTokenConvert.push(listUnifiedToken[i].listUnifiedToken[j]);
        }
      }
    }
    return listTokenConvert;
  },
);

export {
  listUnifiedTokenSelector,
  listTokenConvertSelector,
  listUnifiedTokenSelectedSelector,
  loadingGetListUnifiedTokenSelector,
};
