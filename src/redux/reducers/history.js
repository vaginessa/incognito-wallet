import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_FREE,
  ACTION_SET_SELECTED_TX,
  ACTION_FETCHING_TX,
  ACTION_FETCHED_TX,
} from '@src/redux/actions/history';

const initialState = {
  isFetching: false,
  isFetched: false,
  txsTransactor: [],
  txsReceiver: [],
  detail: {
    fetching: false,
    tx: null,
  },
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
  case ACTION_SET_SELECTED_TX: {
    return {
      ...state,
      detail: {
        ...state.detail,
        tx: { ...action.payload },
      },
    };
  }
  case ACTION_FETCHING_TX: {
    return {
      ...state,
      detail: {
        ...state.detail,
        fetching: true,
      },
    };
  }
  case ACTION_FETCHED_TX: {
    return {
      ...state,
      detail: {
        ...state.detail,
        tx: { ...action.payload },
        fetching: false,
      },
    };
  }
  default:
    return state;
  }
};
