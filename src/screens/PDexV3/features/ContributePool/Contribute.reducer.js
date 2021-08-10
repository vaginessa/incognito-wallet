import TYPES from '@screens/PDexV3/features/ContributePool/Contribute.constant';

const initialState = {
  poolId: ''
};

const contributeReducer = (state = initialState, action) => {
  switch (action.type) {
  case TYPES.ACTION_UPDATE_POOL_ID: {
    return {
      ...state,
      poolId: action.payload,
    };
  }
  default:
    return state;
  }
};

export default contributeReducer;
