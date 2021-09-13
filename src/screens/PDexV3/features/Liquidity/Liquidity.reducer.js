import {TYPES} from '@screens/PDexV3/features/Liquidity';
import {ACCOUNT_CONSTANT} from 'incognito-chain-web-js/build/wallet';

const contributeState = {
  isFetching: false,
  poolId: '',
  data: undefined,
  inputToken: undefined,
  outputToken: undefined,
  feeAmount: ACCOUNT_CONSTANT.MAX_FEE_PER_TX * 2,
};

const createPoolState = {
  inputToken: undefined,
  outputToken: undefined,
  feeAmount: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
};

const removePoolState = {
  poolId: '',
  isFetching: false,
  isFetched: false,
  inputToken: undefined,
  outputToken: undefined,
  feeAmount: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
};

const initialState = {
  contribute: {
    ...contributeState
  },
  createPool: {
    ...createPoolState
  },
  removePool: {
    ...removePoolState
  },
};

const liquidityReducer = (state = initialState, action) => {
  switch (action.type) {
  case TYPES.ACTION_SET_CONTRIBUTE_POOL_ID: {
    const { poolId } = action.payload;
    return {
      ...state,
      contribute: {
        ...state.contribute,
        poolId,
      }
    };
  }
  case TYPES.ACTION_FETCHING_CONTRIBUTE_DATA: {
    const { isFetching } = action.payload;
    return {
      ...state,
      contribute: {
        ...state.contribute,
        isFetching,
      }
    };
  }
  case TYPES.ACTION_SET_CONTRIBUTE_POOL_DATA: {
    const { data, inputToken, outputToken } = action.payload;
    return {
      ...state,
      contribute: {
        ...state.contribute,
        data,
        inputToken,
        outputToken,
      }
    };
  }
  case TYPES.ACTION_SET_CREATE_POOL_TOKEN: {
    return {
      ...state,
      createPool: {
        ...state.createPool,
        ...action.payload
      }
    };
  }
  case TYPES.ACTION_SET_REMOVE_POOL_TOKEN: {
    return {
      ...state,
      removePool: {
        ...state.removePool,
        ...action.payload,
      }
    };
  }
  case TYPES.ACTION_SET_REMOVE_POOL_ID: {
    return {
      ...state,
      removePool: {
        ...state.removePool,
        poolId: action.payload,
      }
    };
  }
  default:
    return state;
  }
};

export default liquidityReducer;
