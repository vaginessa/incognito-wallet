import { walletSelector } from '@src/redux/selectors/wallet';
import { accountSelector } from '@src/redux/selectors';
import accountService from '@services/wallet/accountService';
import { PRV_ID } from '@screens/Dex/constants';
import { switchAccountSelector } from '@src/redux/selectors/account';
import { TYPES } from '@screens/Home/features/Convert/Convert.actionsName';
import {getDefaultAccountWalletSelector} from '@src/redux/selectors/shared';
import {isEmpty} from 'lodash';
import {convertCoinsDataSelector} from '@screens/Home/features/Convert/Convert.selector';
import {ExHandler} from '@services/exception';

export const actionFetched = (payload) => ({
  type: TYPES.ACTION_FETCH_COINS_V1,
  payload
});

export const actionClearConvertData = () => ({
  type: TYPES.ACTION_CLEAR_CONVERT_DATA,
});

export const actionFetching = (payload) => ({
  type: TYPES.ACTION_FETCHING_COINS_V1,
  payload
});

export const actionRefreshing = (payload) => ({
  type: TYPES.ACTION_REFRESHING_COINS_V1,
  payload
});

export const actionConverting = (payload) => ({
  type: TYPES.ACTION_CONVERTING,
  payload
});

export const actionUpdateCurrentConvertStep = (payload) => ({
  type: TYPES.ACTION_UPDATE_CURRENT_CONVERT_STEP,
  payload
});

export const actionUpdateConvertMessages = (payload) => ({
  type: TYPES.ACTION_UPDATE_CONVERT_MESSAGE,
  payload
});

export const actionConverted = () => ({
  type: TYPES.ACTION_CONVERTED,
});

export const actionFetchCoinsV1 = (isRefresh = false) => async (dispatch, getState) => {
  let hasUnspentCoins = false;
  let data = { unspentCoins: [], address: undefined };

  const state = getState();
  const switchingAccount = switchAccountSelector(state);
  if(switchingAccount) return hasUnspentCoins;

  try {
    if (isRefresh) {
      dispatch(actionRefreshing(true));
    } else {
      dispatch(actionClearConvertData());
    }
    dispatch(actionFetching(true));
    const wallet = walletSelector(state);
    const account = accountSelector.defaultAccountSelector(state);
    const address = account.PaymentAddress;
    let { unspentCoins } = await accountService.getUnspentCoinsV1({
      account,
      wallet,
      fromApi: true
    });
    unspentCoins = unspentCoins.map(coin => {
      if ((coin.tokenID === PRV_ID && coin.balance < 100) || (coin.tokenID !== PRV_ID && coin.balance === 0)) {
        return {
          ...coin,
          balance: 0,
          unspentCoins: []
        };
      }
      return coin;
    });
    data = { unspentCoins, address };
  } catch (error) {
    console.log('ACTION FETCH COINS V1 error: ', error);
  } finally {
    dispatch(actionFetched({ data }));
  }
};

export const actionConvertCoins = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const switchingAccount = switchAccountSelector(state);
    if(switchingAccount) return;
    dispatch(actionConverting(true));
    const { prvUnspent, pTokenUnspent } = convertCoinsDataSelector(state);
    const accountWallet = getDefaultAccountWalletSelector(state);
    if (!isEmpty(prvUnspent)) {
      const { tokenID, balance } = prvUnspent;
      let errorMessage = undefined;
      try {
        dispatch(actionUpdateCurrentConvertStep(tokenID));
        await accountWallet.createAndSendConvertNativeToken({ tokenID, balance });
      } catch (error) {
        errorMessage = new ExHandler(error).getMessage();
      } finally {
        dispatch(actionUpdateConvertMessages({ tokenID, errorMessage }));
      }
    }

    if (!isEmpty(pTokenUnspent)) {
      for (const coin of pTokenUnspent) {
        const { tokenID, balance } = coin;
        let errorMessage = undefined;
        try {
          dispatch(actionUpdateCurrentConvertStep(tokenID));
          await accountWallet.createAndSendConvertPToken({ tokenID, balance });
        } catch (error) {
          errorMessage = new ExHandler(error).getMessage();
        } finally {
          dispatch(actionUpdateConvertMessages({ tokenID, errorMessage }));
        }
      }
    }

  } catch (error) {
    console.log('ACTION CONVERT COINS V1 error: ', error);
  } finally {
    dispatch(actionConverted());
  }
};
