import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_FETCHED_TRADING_VOLUME_24H,
  ACTION_FETCHED_LIST_POOLS,
  ACTION_FETCHED_LIST_POOLS_DETAIL,
  ACTION_FETCHED_LIST_POOLS_FOLLOWING,
} from './Pools.constant';

const initialState = {
  isFetching: true,
  isFetched: false,
  tradingVolume24h: 0,
  listPools: [],
  listPoolsFollowing: [],
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
    };
  }
  case ACTION_FETCH_FAIL: {
    return {
      ...state,
      isFetched: false,
      isFetching: false,
    };
  }
  case ACTION_FETCHED_TRADING_VOLUME_24H: {
    return {
      ...state,
      tradingVolume24h: action.payload,
    };
  }
  case ACTION_FETCHED_LIST_POOLS: {
    return {
      ...state,
      listPools: action.payload,
    };
  }
  case ACTION_FETCHED_LIST_POOLS_DETAIL: {
    return {
      ...state,
      listPoolsDetail: action.payload,
    };
  }
  case ACTION_FETCHED_LIST_POOLS_FOLLOWING: {
    return {
      ...state,
      listPoolsFollowing: action.payload,
    };
  }
  default:
    return state;
  }
};
