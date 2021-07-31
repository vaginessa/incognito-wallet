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

export const actionFetchingFavoritePool = (isFetching) => ({
  type: TYPES.ACTION_FETCHING_FAVORITE_POOL,
  payload: isFetching,
});

export const actionClearPoolList = () => ({
  type: TYPES.ACTION_CLEAR_POOL_LIST,
});

export const actionUpdateFavoritePool = ({ poolIDs = [], favoritePool = [] }) => ({
  type: TYPES.ACTION_UPDATE_FAVORITE_POOL,
  payload: { poolIDs, favoritePool }
});

export const actionUpdateFetchingPortfolio = (isFetching) => ({
  type: TYPES.ACTION_UPDATE_FETCHING_PORTFOLIO_DATA,
  payload: isFetching
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
    dispatch(actionFetchingFavoritePool(true));

    data = (await apiGetFavoritePool(favoritePoolIDs)) || [];
    data = data.filter(item => {
      return favoritePoolIDs.includes(item?.poolID);
    });
  } catch (error) {
    console.log('actionGetFavoritePool error: ', error);
  } finally {
    batch(() => {
      dispatch(actionFetchingFavoritePool(false));
      dispatch(actionUpdateFavoritePool({
        favoritePool: data
      }));
    });
  }
};

export const actionUpdatePortfolioData = (portfolioList) => ({
  type: TYPES.ACTION_UPDATE_PORTFOLIO_DATA,
  payload: portfolioList,
});

export const actionGetPortfolio = () => async (dispatch) => {
  let data = [];
  try {
    dispatch(actionUpdateFetchingPortfolio(true));
    console.log('SANG TEST: 1');
    data = (await apiGetPortfolio()) || [];
    console.log('SANG TEST: ', data);
  } catch (error) {
    console.log('actionGetPortfolio error: ', error);
  } finally {
    batch(() => {
      dispatch(actionUpdateFetchingPortfolio(false));
      dispatch(actionUpdatePortfolioData(data));
    });
  }
};
