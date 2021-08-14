import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_SELL_TOKEN,
  ACTION_SET_BUY_TOKEN,
  ACTION_SET_FEE_TOKEN,
  ACTION_SET_FOCUS_TOKEN
} from './Swap.constant';

const initialState = {
  isFetching: true,
  isFetched: false,
  data: {},
  buytoken: '',
  selltoken: '',
  feetoken: '',
  estimateTrade: null,
  focustoken: '',
  networkfee: 100,
};

export default (state = initialState, action) => {
  switch (action.type) {
  case ACTION_FETCHING: {
    return {
      ...state,
      isFetching: true,
    };
  }
  case ACTION_FETCHED: {
    return {
      ...state,
      isFetching: false,
      isFetched: true,
      data: { ...action.payload },
    };
  }
  case ACTION_FETCH_FAIL: {
    return {
      ...state,
      isFetched: false,
      isFetching: false,
    };
  }
  case ACTION_SET_SELL_TOKEN: {
    return {
      ...state,
      selltoken: action.payload,
    };
  }
  case ACTION_SET_BUY_TOKEN: {
    return {
      ...state,
      buytoken: action.payload,
    };
  }
  case ACTION_SET_FEE_TOKEN: {
    return {
      ...state,
      feetoken: action.payload,
    };
  }
  case ACTION_SET_FOCUS_TOKEN: {
    return {
      ...state,
      focustoken: action.payload,
    };
  }
  default:
    return state;
  }
};
