import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import TYPES from '@screens/Liquidity3/Liquidity3.actionName';
import { DEFAULT_FAVORITE_POOL_IDS } from '@screens/Liquidity3/Liquidity3.constants';
import isEmpty from 'lodash/isEmpty';

const initialState = {
  favoritePoolIDs: DEFAULT_FAVORITE_POOL_IDS,
  favoritePool: [],

  fetchingPool: false,
  refreshPool: false,
  searchPoolText: '',
  poolList: []
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
