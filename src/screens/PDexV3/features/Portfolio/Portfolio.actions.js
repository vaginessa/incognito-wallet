import { defaultAccountWalletSelector } from '@src/redux/selectors/account';
import { ExHandler } from '@src/services/exception';
import { getPDexV3Instance } from '@src/screens/PDexV3';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
} from './Portfolio.constant';
import { portfolioSelector } from './Portfolio.selector';

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = (payload) => ({
  type: ACTION_FETCHED,
  payload,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionFetch = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { isFetching } = portfolioSelector(state);
    if (isFetching) {
      return;
    }
    await dispatch(actionFetching());
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const listShare = await pDexV3Inst.getListShare();
    await dispatch(actionFetched(listShare));
  } catch (error) {
    new ExHandler(error).showErrorToast();
    await dispatch(actionFetchFail());
  }
};
