import { ACCOUNT_CONSTANT } from 'incognito-chain-web-js/build/wallet';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_SELL_TOKEN,
  ACTION_SET_BUY_TOKEN,
  ACTION_SET_FEE_TOKEN,
  ACTION_SET_FOCUS_TOKEN,
  ACTION_SET_SELECTING_TOKEN,
  ACTION_SET_SWAPING_TOKEN,
  ACTION_SET_INITIING_SWAP,
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
  networkfee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
  swaping: false,
  selecting: false,
  initing: false,
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
  case ACTION_SET_SELECTING_TOKEN: {
    return {
      ...state,
      selecting: action.payload,
    };
  }
  case ACTION_SET_SWAPING_TOKEN: {
    return {
      ...state,
      swaping: action.payload,
    };
  }
  case ACTION_SET_INITIING_SWAP: {
    return {
      ...state,
      initing: action.payload,
    };
  }
  default:
    return state;
  }
};
