import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_SHARE_DETAIL
} from './Portfolio.constant';

const initialState = {
  isFetching: false,
  isFetched: false,
  data: [],
  shareDetails: []
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
      data: action.payload,
    };
  }
  case ACTION_FETCH_FAIL: {
    return {
      ...state,
      isFetched: false,
      isFetching: false,
    };
  }
  case ACTION_SET_SHARE_DETAIL: {
    return {
      ...state,
      shareDetails: action.payload
    };
  }
  default:
    return state;
  }
};
