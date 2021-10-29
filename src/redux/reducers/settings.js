import type from '@src/redux/types/settings';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
  data: [],
  error: null,
  banners: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case type.SET_SETTINGS:
    return {
      ...state,
      data: action.payload
    };
  case type.SET_BANNERS:
    return {
      ...state,
      banners: action.payload || []
    };
  default:
    return state;
  }
};

const persistConfig = {
  key: 'settings',
  storage: AsyncStorage,
  whitelist: [
    'banners',
  ],
  stateReconciler: autoMergeLevel2,
};

export default persistReducer(persistConfig, reducer);
