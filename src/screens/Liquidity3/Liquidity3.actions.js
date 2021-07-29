import {apiGetFavoritePool, apiGetPortfolio, apiSearchPools} from '@screens/Liquidity3/Liquidity3.services';
import TYPES from '@screens/Liquidity3/Liquidity3.actionName';
import {batch} from 'react-redux';

export const actionUpdatePoolList = (poolList) => ({
  type: TYPES.ACTION_UPDATE_POOL_LIST,
  payload: poolList,
});

export const actionUpdateSearchPoolText = (searchText) => ({
  type: TYPES.ACTION_SEARCH_POOL_TEXT,
  payload: searchText,
});

export const actionUpdateFetchingPool = (isFetching) => ({
  type: TYPES.ACTION_UPDATE_FETCHING_POOL,
  payload: isFetching,
});

export const actionUpdateRefreshPool = (isRefresh) => ({
  type: TYPES.ACTION_UPDATE_REFRESH_POOL,
  payload: isRefresh,
});

export const actionClearPoolList = () => ({
  type: TYPES.ACTION_CLEAR_POOL_LIST,
});

export const actionUpdateFavoritePool = ({ poolIDs = [], favoritePool = [] }) => ({
  type: TYPES.ACTION_UPDATE_FAVORITE_POOL,
  payload: { poolIDs, favoritePool }
});

export const actionSearchPoolList = (newText, isRefresh) => async (dispatch) => {
  let data = [];
  try {
    batch(() => {
      isRefresh
        ? dispatch(actionUpdateRefreshPool(true))
        : dispatch(actionUpdateFetchingPool(true));
      dispatch(actionUpdateSearchPoolText(newText));
    });
    data = await apiSearchPools(newText);
  } catch (error) {
    console.log('actionSearchPoolList error: ', error);
  } finally {
    batch(() => {
      isRefresh
        ? dispatch(actionUpdateRefreshPool(false))
        : dispatch(actionUpdateFetchingPool(false));
      dispatch(actionUpdatePoolList(data));
    });
  }
};

export const actionRemoveFavoritePool = (poolID) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { favoritePoolIDs, favoritePool } = state?.liquidity3;
    const newPoolIDs = favoritePoolIDs.filter(id => id !== poolID);
    const newFavoritePool = favoritePool.filter(item => item?.poolID !== poolID);
    dispatch(actionUpdateFavoritePool({
      poolIDs: newPoolIDs,
      favoritePool: newFavoritePool
    }));
  } catch (error) {
    console.log('actionRemoveFavoritePool error: ', error);
  }
};

export const actionAddFavoritePool = (poolID) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { favoritePoolIDs, favoritePool } = state?.liquidity3;
    const newPoolIDs = favoritePoolIDs.filter(id => id !== poolID);
    const newFavoritePool = favoritePool.filter(item => item?.poolID !== poolID);
    dispatch(actionUpdateFavoritePool({
      poolIDs: newPoolIDs,
      favoritePool: newFavoritePool
    }));
  } catch (error) {
    console.log('actionRemoveFavoritePool error: ', error);
  }
};

export const actionGetFavoritePool = () => async (dispatch, getState) => {
  let data = [];
  try {
    const state = getState();
    const { favoritePoolIDs } = state?.liquidity3;
    dispatch(actionUpdateRefreshPool(true));

    data = (await apiGetFavoritePool(favoritePoolIDs)) || [];
    data = data.filter(item => {
      return favoritePoolIDs.includes(item?.poolID);
    });
  } catch (error) {
    console.log('actionGetFavoritePool error: ', error);
  } finally {
    batch(() => {
      dispatch(actionUpdateRefreshPool(false));
      dispatch(actionUpdateFavoritePool({
        favoritePool: data
      }));
    });
  }
};

export const actionGetPortfolio = () => async (dispatch, getState) => {
  let data = [];
  try {
    const state = getState();
    data = (await apiGetPortfolio()) || [];
  } catch (error) {
    console.log('actionGetPortfolio error: ', error);
  }
};
