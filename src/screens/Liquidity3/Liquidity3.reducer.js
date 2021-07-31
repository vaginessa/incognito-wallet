import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import TYPES from '@screens/Liquidity3/Liquidity3.actionName';
import { DEFAULT_FAVORITE_POOL_IDS } from '@screens/Liquidity3/Liquidity3.constants';
import isEmpty from 'lodash/isEmpty';

const initialState = {
  fetchingFavorite: false,
  fetchingPool: false,
  refreshPool: false,
  fetchingPortfolio: false,

  searchPoolText: '',

  favoritePoolIDs: DEFAULT_FAVORITE_POOL_IDS,

  favoritePool: [],
  poolList: [],
  portfolioList: []
};

const Liquidity3Reducer = (state = initialState, action) => {
  switch (action.type) {
  case TYPES.ACTION_SEARCH_POOL_TEXT: {
    return {
      ...state,
      searchPoolText: action?.payload
    };
  }
  case TYPES.ACTION_UPDATE_FETCHING_POOL: {
    return {
      ...state,
      fetchingPool: action?.payload,
    };
  }
  case TYPES.ACTION_UPDATE_REFRESH_POOL: {
    return {
      ...state,
      refreshPool: action?.payload,
    };
  }
  case TYPES.ACTION_UPDATE_POOL_LIST: {
    return {
      ...state,
      poolList: action?.payload
    };
  }
  case TYPES.ACTION_CLEAR_POOL_LIST: {
    return {
      ...state,
      fetchingPool: false,
      refreshPool: false,
      searchPoolText: '',
      poolList: []
    };
  }
  case TYPES.ACTION_UPDATE_FAVORITE_POOL: {
    const { poolIDs, favoritePool } = action.payload;
    let favoritePoolIDs = state?.favoritePoolIDs;
    if (!isEmpty(poolIDs)) {
      favoritePoolIDs = poolIDs;
    }
    return {
      ...state,
      favoritePoolIDs: favoritePoolIDs,
      favoritePool,
    };
  }
  case TYPES.ACTION_FETCHING_FAVORITE_POOL: {
    return {
      ...state,
      fetchingFavorite: action?.payload
    };
  }
  case TYPES.ACTION_UPDATE_FETCHING_PORTFOLIO_DATA: {
    return {
      ...state,
      fetchingPortfolio: action?.payload
    };
  }
  case TYPES.ACTION_UPDATE_PORTFOLIO_DATA: {
    return {
      ...state,
      portfolioList: action.payload || []
    };
  }
  default:
    return state;
  }
};

const persistConfig = {
  key: 'Liquidity3',
  storage: AsyncStorage,
  whitelist: ['favoritePoolIDs'],
  stateReconciler: autoMergeLevel2,
};

export default persistReducer(persistConfig, Liquidity3Reducer);
