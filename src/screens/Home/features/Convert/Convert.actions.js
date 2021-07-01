import {walletSelector} from '@src/redux/selectors/wallet';
import {accountSelector} from '@src/redux/selectors';
import accountService from '@services/wallet/accountService';
import { PRV_ID } from '@screens/Dex/constants';
import { switchAccountSelector } from '@src/redux/selectors/account';
import { TYPES } from '@screens/Home/features/Convert/Convert.actionsName';

export const actionFetched = (payload) => ({
  type: TYPES.ACTION_FETCH_COINS_V1,
  payload
});

export const actionClearConvertData = () => ({
  type: TYPES.ACTION_CLEAR_CONVERT_DATA,
});

export const actionFetchCoinsV1 = () => async (dispatch, getState) => {
  let hasUnspentCoins = false;
  try {
    const state = getState();
    const switchingAccount = switchAccountSelector(state);
    if(!switchingAccount) {
      dispatch(actionClearConvertData());
      const wallet = walletSelector(state);
      const account = accountSelector.defaultAccountSelector(state);
      const { unspentCoins } = await accountService.getUnspentCoinsV1({
        account,
        wallet,
        fromApi: true
      });
      hasUnspentCoins = unspentCoins.some(coin => {
        if (coin.tokenID === PRV_ID) {
          return coin.balance > 100;
        }
        return coin.balance > 0;
      });
    }
  } catch (error) {
    console.log('actionFetchCoinsV1 error: ', error);
  } finally {
    dispatch(actionFetched(hasUnspentCoins));
  }
};
