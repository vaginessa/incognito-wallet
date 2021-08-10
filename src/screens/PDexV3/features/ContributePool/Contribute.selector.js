import { createSelector } from 'reselect';
import {getDataByPoolIdSelector} from '@screens/PDexV3/features/Pools';
import {getDataShareByPoolIdSelector} from '@screens/PDexV3/features/Portfolio';
import helper from '@src/constants/helper';

export const contributeSelector = createSelector(
  (state) => state.pDexV3,
  ({ contribute }) => {
    return contribute;
  },
);
export const contributePoolIDSelector = createSelector(
  contributeSelector,
  ({ poolId }) => poolId,
);
export const getContributeData = createSelector(
  contributePoolIDSelector,
  getDataByPoolIdSelector,
  getDataShareByPoolIdSelector,
  (poolId, getDataByPoolId, getDataShareByPoolId) => {
    const dataContribute = getDataByPoolId(poolId);
    const dataShare = getDataShareByPoolId(poolId);
    if (!dataShare) return dataContribute;
    const { shareStr, amp, exchangeRateStr } = dataShare;
    console.log('SANG TEST: ', dataShare);
    const hookFactories = [
      {
        label: 'AMP',
        value: amp,
        info: helper.HELPER_CONSTANT.AMP
      },
      {
        label: 'Share',
        value: shareStr,
      },
      {
        label: 'Exchange rate',
        value: exchangeRateStr,
      },
    ];
    return {
      ...dataContribute,
      hookFactories
    };
  }
);

