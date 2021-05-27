import {
  ACCOUNT_CONSTANT,
  Validator,
} from 'incognito-chain-web-js/build/wallet';
import { accountServices } from '@src/services/wallet';
import { selectedPrivacySelector } from '@src/redux/selectors';
import {
  historyDetailSelector,
  historySelector,
  mappingTxRecieverSelector,
  mappingTxTransactorSelector,
} from '@src/redux/selectors/history';
import { defaultAccountSelector } from '../selectors/account';
import { walletSelector } from '../selectors/wallet';
import { selectedPrivacy } from '../selectors/selectedPrivacy';

export const ACTION_FETCHING = '[history] Fetching data';
export const ACTION_FETCHED = '[history] Fetched data';
export const ACTION_FETCH_FAIL = '[history] Fetch fail data';
export const ACTION_FREE = '[history] Free data';
export const ACTION_SET_SELECTED_TX = '[history] Set selected tx';
export const ACTION_FETCHING_TX = '[history] Fetching tx';
export const ACTION_FETCHED_TX = '[history] Fetched tx';

export const actionSetSelectedTx = (payload) => ({
  type: ACTION_SET_SELECTED_TX,
  payload,
});

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

export const actionFetchingTx = () => ({
  type: ACTION_FETCHING_TX,
});

export const actionFetchedTx = (payload) => ({
  type: ACTION_FETCHED_TX,
  payload,
});

export const actionFetchTx = () => async (dispatch, getState) => {
  const state = getState();
  let { tx, fetching } = historyDetailSelector(state);
  if (fetching) {
    return tx;
  }
  try {
    new Validator('tx', tx).required().object();
    await dispatch(actionFetchingTx());
    if (!tx.txId) {
      return;
    }
    const { txType, txId } = tx;
    const { tokenId: tokenID } = selectedPrivacy(state);
    const account = defaultAccountSelector(state);
    const wallet = walletSelector(state);
    switch (txType) {
    case ACCOUNT_CONSTANT.TX_TYPE.RECEIVE: {
      tx = mappingTxRecieverSelector(state)(tx);
      break;
    }
    default: {
      const txt = await accountServices.getTxHistoryByTxID({
        account,
        wallet,
        txId,
        tokenID,
      });
      tx = mappingTxTransactorSelector(state)(txt);
      break;
    }
    }
  } catch (error) {
    throw error;
  } finally {
    await dispatch(actionFetchedTx(tx));
  }
  return tx;
};
