import { defaultAccountWalletSelector } from '@src/redux/selectors/account';
import { ExHandler } from '@src/services/exception';
import { getPDexV3Instance } from '@screens/PDexV3';
import { Toast } from '@components/core';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_FETCHED_TRADING_VOLUME_24H,
  ACTION_FETCHED_LIST_POOLS,
  ACTION_FETCHED_LIST_POOLS_DETAIL,
  ACTION_FETCHED_LIST_POOLS_FOLLOWING,
  ACTION_FREE_LIST_POOL,
} from './Pools.constant';
import { followPoolIdsSelector } from './Pools.selector';

export const actionFetchedTradingVolume24h = (payload) => ({
  type: ACTION_FETCHED_TRADING_VOLUME_24H,
  payload,
});

export const actionFetchedListPools = (payload) => ({
  type: ACTION_FETCHED_LIST_POOLS,
  payload,
});

export const actionFetchedListPoolsDetail = (payload) => ({
  type: ACTION_FETCHED_LIST_POOLS_DETAIL,
  payload,
});

export const actionFetchedListPoolsFollowing = (payload) => ({
  type: ACTION_FETCHED_LIST_POOLS_FOLLOWING,
  payload,
});

export const actionFetchTradingVolume24h = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const tradingVolume24h = await pDexV3Inst.getTradingVolume24h('all');
    console.log('tradingVolume24h', tradingVolume24h);
    dispatch(actionFetchedTradingVolume24h(tradingVolume24h));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionSetFetching = ({ isFetching }) => ({
  type: ACTION_FETCHING,
  payload: { isFetching },
});

export const actionFetched = () => ({
  type: ACTION_FETCHED,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionFreeListPools = () => ({
  type: ACTION_FREE_LIST_POOL,
});

export const actionFetchListPools = ({ pairId }) => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    await dispatch(actionSetFetching({ isFetching: true }));
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const pools = (await pDexV3Inst.getListPools(pairId)) || [];
    await dispatch(actionFetchedListPools([...pools]));
    // let poolsIDs = listPools.map((pool) => pool.poolId);
    // console.log('poolsIDs', poolsIDs);
    // let listPoolsDetail = await pDexV3Inst.getListPoolsDetail(poolsIDs);
    // listPoolsDetail = listPoolsDetail.filter(
    //   (pool) => !!pool?.poolId && !!pool?.token1Id && !!pool?.token2Id,
    // );
    // console.log('poolsIDs detail', listPoolsDetail.map((pool) => pool?.poolId));
    // poolsIDs = intersection(
    //   poolsIDs,
    //   listPoolsDetail.map((pool) => pool?.poolId),
    // );
    // console.log('poolsIDs will follow', poolsIDs);
    // const isFollowedDefaultListPools = await pDexV3Inst.isFollowedDefaultPools();
    // if (!isFollowedDefaultListPools) {
    //   await pDexV3Inst.followingDefaultPools({ poolsIDs });
    // }
    // await pDexV3Inst.addListFollowingPool({ poolsIDs });
  } catch (error) {
    throw error;
  } finally {
    await dispatch(actionSetFetching({ isFetching: false }));
  }
};

export const actionFetchListFollowingPools = () => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const followPoolIds = await pDexV3Inst.getListFollowingPools();
    if (followPoolIds.length === 0) return;
    const followPools =
      (await pDexV3Inst.getListPoolsDetail(followPoolIds)) || [];
    await dispatch(actionFetchedListPoolsFollowing({ followPools }));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionFetchPools = () => async (dispatch) => {
  try {
    await dispatch(actionSetFetching({ isFetching: true }));
    await Promise.all([
      dispatch(actionFetchTradingVolume24h()),
      dispatch(actionFetchListFollowingPools()),
    ]);
    dispatch(actionFetched());
  } catch (error) {
    new ExHandler(error).showErrorToast();
    dispatch(actionFetchFail());
  }
};

export const actionToggleFollowingPool = (poolId) => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const followPoolIds = followPoolIdsSelector(state);
    const isFollowed =
      followPoolIds.findIndex((_poolId) => _poolId === poolId) > -1;
    if (isFollowed) {
      await pDexV3Inst.removeFollowingPool({ poolId });
      Toast.showSuccess('Remove favorite pool successfully');
    } else {
      await pDexV3Inst.addFollowingPool({ poolId });
      Toast.showSuccess('Add favorite pool successfully');
    }
    await dispatch(actionFetchPools());
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};
