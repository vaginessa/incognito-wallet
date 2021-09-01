import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
} from './Chart.constant';

const initialState = {
  isFetching: true,
  isFetched: false,
  poolid: '',
  orderBook: {
    data: [],
    decimal: 1
  },
  priceHistory: {
    data: [],
    period: '1d',
    datapoint: 100,
    fromtime: new Date().getTime()
  },
  tradingVolume24: '',
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
      data: {...action.payload},
    };
  }
  case ACTION_FETCH_FAIL: {
    return {
      ...state,
      isFetched: false,
      isFetching: false,
    };
  }
  default:
    return state;
  }
};
