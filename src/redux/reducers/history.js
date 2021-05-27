import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_FREE,
} from '@src/redux/actions/history';

const initialState = {
  isFetching: false,
  isFetched: false,
  txsTransactor: [],
  txsReceiver: [],
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
    const { txsTransactor, txsReceiver } = action.payload;
    return {
      ...state,
      isFetching: false,
      isFetched: true,
      txsTransactor,
      txsReceiver,
    };
  }
  case ACTION_FETCH_FAIL: {
    return {
      ...state,
      isFetched: false,
      isFetching: false,
    };
  }
  case ACTION_FREE: {
    return Object.assign(state, initialState);
  }
  default:
    return state;
  }
};
