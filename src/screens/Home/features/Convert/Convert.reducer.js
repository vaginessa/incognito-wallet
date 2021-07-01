import { TYPES } from '@screens/Home/features/Convert/Convert.actionsName';

const initialState = {
  hasUnspentCoins: false
};

const convertReducer = (state = initialState, action) => {
  switch (action.type) {
  case TYPES.ACTION_FETCH_COINS_V1: {
    return {
      ...state,
      hasUnspentCoins: action.payload
    };
  }
  case TYPES.ACTION_CLEAR_CONVERT_DATA: {
    return {
      ...state,
      hasUnspentCoins: false
    };
  }
  default:
    return state;
  }
};

export default convertReducer;
