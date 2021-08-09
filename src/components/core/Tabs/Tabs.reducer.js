import { ACTION_CHANGE_TAB } from './Tabs.constant';

const initialState = {
  active: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case ACTION_CHANGE_TAB: {
    return {
      ...state,
      active: action.payload,
    };
  }
  default:
    return state;
  }
};

export default reducer;
