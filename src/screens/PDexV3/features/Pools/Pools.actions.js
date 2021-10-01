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

export const actionFetchListPools = () => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    await dispatch(actionSetFetching({ isFetching: true }));
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    // const pools = (await pDexV3Inst.getListPools(pairId)) || [];
    const pools = [
      {
        poolId: '0000000000000000000000000000000000000000000000000000000000000004-c730c34221c277158aa4b44f7eb542a50e5eb858a8fd89b68d3c83388e866162-fdf80fb59d1e378ef22f664c3b3e36de9b2dcf7f4983cafa55e5336fcd9bb068',
        token1Id: '0000000000000000000000000000000000000000000000000000000000000004',
        token2Id: 'c730c34221c277158aa4b44f7eb542a50e5eb858a8fd89b68d3c83388e866162',
        token1Value: 100049,
        token2Value: 395817,
        virtual1Value: 199548,
        virtual2Value: 793816,
        totalShare: 199000,
        amp: 20000,
        price: 0,
        volume: 0,
        priceChange24H: 0,
        apy: 0,
        verified: true,
      },
      {
        poolId: '0000000000000000000000000000000000000000000000000000000000000004-aad9c0bd04c44b592e92c8a86ce96116a7b7a165ce186acc8129f4a62c27cb3a-3f0fa0198f14d52c332e4c6afaf0ae27301cc29cfa941384486796fec1c2c862',
        token1Id: '0000000000000000000000000000000000000000000000000000000000000004',
        token2Id: 'aad9c0bd04c44b592e92c8a86ce96116a7b7a165ce186acc8129f4a62c27cb3a',
        amp: 20000,
        apy: 0,
        price: 0,
        priceChange24H: 0,
        token1Value: 100000,
        token2Value: 400000,
        totalShare: 200000,
        virtual1Value: 200000,
        virtual2Value: 800000,
        volume: 0,
        verified: true,
      },
      {
        poolId: '0000000000000000000000000000000000000000000000000000000000000004-91103a2ca297f502a996f2a27595a7efa1cb6f499409224a7471a1ddd382a7e2-2b0838d855ab72a67a09b5ff423a4f0c0793e56ab33d0838de18809fb9d71d51',
        token1Id: '0000000000000000000000000000000000000000000000000000000000000004',
        token2Id: '91103a2ca297f502a996f2a27595a7efa1cb6f499409224a7471a1ddd382a7e2',
        amp: 20000,
        apy: 0,
        price: 0,
        priceChange24H: 0,
        token1Value: 100000,
        token2Value: 400000,
        totalShare: 200000,
        virtual1Value: 200000,
        virtual2Value: 800000,
        volume: 0,
        verified: true,
      },
      {
        poolId: '0000000000000000000000000000000000000000000000000000000000000004-970cd08487f0c62412efeb1681a7e8faf0e6e9aabe24e293a2c1d95cb091d956-dc59619c051ae371a32097dbd56f2f51217850b1aa2ed6167003f0814317bbd0',
        token1Id: '0000000000000000000000000000000000000000000000000000000000000004',
        token2Id: '970cd08487f0c62412efeb1681a7e8faf0e6e9aabe24e293a2c1d95cb091d956',
        amp: 20000,
        apy: 0,
        price: 0,
        priceChange24H: 0,
        token1Value: 100000,
        token2Value: 400000,
        totalShare: 200000,
        virtual1Value: 200000,
        virtual2Value: 800000,
        volume: 0,
        verified: true,
      },
      {
        poolId: '0000000000000000000000000000000000000000000000000000000000000004-5952a58e6e00e9406cb480e150a629bb03f0ef603f026d1f6b173a5fa79661e2-cc503cd8be212bcc68d9020d75f198c6c783dab51fa9179fa757cc888b7d876d',
        token1Id: '0000000000000000000000000000000000000000000000000000000000000004',
        token2Id: '5952a58e6e00e9406cb480e150a629bb03f0ef603f026d1f6b173a5fa79661e2',
        amp: 20000,
        apy: 0,
        price: 0,
        priceChange24H: 0,
        token1Value: 100000,
        token2Value: 400000,
        totalShare: 200000,
        virtual1Value: 200000,
        virtual2Value: 800000,
        volume: 0,
        verified: true,
      },
      {
        poolId: '0000000000000000000000000000000000000000000000000000000000000004-2fabc23caaa8de5bf0f58c27850388415c0d62dbb3ec4c53e3d4deb0d5d7d614-7cf8712fde07b5a5af458023a2d33139d5c1d769d0dc32c604971ec7ac51c52d',
        token1Id: '0000000000000000000000000000000000000000000000000000000000000004',
        token2Id: '2fabc23caaa8de5bf0f58c27850388415c0d62dbb3ec4c53e3d4deb0d5d7d614',
        amp: 25000,
        apy: 0,
        price: 1,
        priceChange24H: 0,
        token1Value: 100,
        token2Value: 100,
        totalShare: 100,
        virtual1Value: 250,
        virtual2Value: 250,
        volume: 0,
        verified: true,
      },
      {
        poolId: '0000000000000000000000000000000000000000000000000000000000000004-2fabc23caaa8de5bf0f58c27850388415c0d62dbb3ec4c53e3d4deb0d5d7d614-a4c7aaca3f5a16c6c6bc96f14c5f408e74a47fc86cb41793f80e6c1aeb2d9f15',
        token1Id: '0000000000000000000000000000000000000000000000000000000000000004',
        token2Id: '2fabc23caaa8de5bf0f58c27850388415c0d62dbb3ec4c53e3d4deb0d5d7d614',
        amp: 25000,
        apy: 0,
        price: 0,
        priceChange24H: 0,
        token1Value: 250,
        token2Value: 450,
        totalShare: 259,
        virtual1Value: 374,
        virtual2Value: 1122,
        volume: 0,
        verified: true,
      }
    ];
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
    const followIds = (await pDexV3Inst.getListFollowingPools()) || [];
    // const followPools = (await pDexV3Inst.getListPoolsDetail(followPoolIds)) || [];
    await dispatch(actionFetchedListPoolsFollowing({ followIds }));
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
      dispatch(actionFetchListPools()),
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
    const isFollowed = followPoolIds.findIndex((_poolId) => _poolId === poolId) > -1;
    if (isFollowed && followPoolIds.length > 1) {
      await pDexV3Inst.removeFollowingPool({ poolId });
      Toast.showSuccess('Remove favorite pool successfully');
    }
    if (!isFollowed) {
      await pDexV3Inst.addFollowingPool({ poolId });
      Toast.showSuccess('Add favorite pool successfully');
    }
    await dispatch(actionFetchListFollowingPools());
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};
