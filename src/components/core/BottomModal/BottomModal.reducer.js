import {TYPES} from '@components/core/BottomModal';

const initialState = {
  visible: false,
  title: undefined,
  customHeader: undefined,
  customContent: undefined,
};

const bottomModalReducer = (state = initialState, action) => {
  switch (action.type) {
  case TYPES.ACTION_OPEN_MODAL: {
    const { payload } = action;
    return {
      ...state,
      ...payload,
      visible: true
    };
  }
  case TYPES.ACTION_CLOSE_MODAL: {
    return {
      ...state,
      ...initialState,
    };
  }
  default:
    return state;
  }
};

export default bottomModalReducer;
