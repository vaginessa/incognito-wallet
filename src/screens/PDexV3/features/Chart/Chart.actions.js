import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
} from './Chart.constant';

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = payload => ({
  type: ACTION_FETCHED,
  payload,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionFetch = () => async (dispatch, getState) => {
  try {
    await dispatch(actionFetching());
    await dispatch(actionFetched());
  } catch (error) {
    await dispatch(actionFetchFail());
  }
};
