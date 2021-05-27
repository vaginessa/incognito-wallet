import { Validator } from 'incognito-chain-web-js/build/wallet';
import { accountServices } from '@src/services/wallet';
import { selectedPrivacySelector } from '@src/redux/selectors';
import { historySelector } from '@src/redux/selectors/history';
import { defaultAccountSelector } from '../selectors/account';
import { walletSelector } from '../selectors/wallet';

export const ACTION_FETCHING = '[history] Fetching data';
export const ACTION_FETCHED = '[history] Fetched data';
export const ACTION_FETCH_FAIL = '[history] Fetch fail data';
export const ACTION_FREE = '[history] Free data';

export const actionFree = () => ({
  type: ACTION_FREE,
});

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

export const actionFetch = ({ tokenID } = {}) => async (dispatch, getState) => {
  try {
    const state = getState();
    const history = historySelector(state);
    const { isFetching } = history;
    if (isFetching) {
      return;
    }
    const selectedPrivacy = selectedPrivacySelector.selectedPrivacy(state);
    const account = defaultAccountSelector(state);
    const wallet = walletSelector(state);
    await dispatch(actionFetching());
    const _tokenID = tokenID || selectedPrivacy.tokenId;
    console.log('_tokenID', _tokenID);
    new Validator('tokenID', _tokenID).required().string();
    const data = await accountServices.getTxsHistory({
      tokenID: _tokenID,
      account,
      wallet,
    });
    await dispatch(actionFetched(data));
  } catch (error) {
    await dispatch(actionFetchFail());
    throw error;
  }
};
