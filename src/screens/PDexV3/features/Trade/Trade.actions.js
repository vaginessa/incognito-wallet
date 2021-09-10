import { defaultAccountWalletSelector } from '@src/redux/selectors/account';
import { getPDexV3Instance } from '@screens/PDexV3';
import { getInternalTokenList, getPTokenList } from '@src/redux/actions/token';
import { actionSetNFTTokenData } from '@src/redux/actions/account';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
} from './Trade.constant';
import { tradePDexV3Selector } from './Trade.selector';

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
    const { isFeching } = tradePDexV3Selector(state);
    if (isFeching) {
      return;
    }
    await dispatch(actionFetching());
    // const account = defaultAccountWalletSelector(state);
    // const pDexV3Inst = await getPDexV3Instance({ account });
    const task = [
      //   pDexV3Inst.getListState(),
      dispatch(getPTokenList()),
      dispatch(getInternalTokenList()),
      dispatch(actionSetNFTTokenData()),
    ];
    await Promise.all(task);
    // const [data] = task;
    const data = [
      {
        token1IdStr:
          '0000000000000000000000000000000000000000000000000000000000000004',
        token1PoolValue: 321312321,
        token2IdStr:
          'fdd928bc86c82bd2a7c54082a68332ebb5f2cde842b1c2e0fa430ededb6e369e',
        token2PoolValue: 312321321321,
        poolid:
          'pdepair-2792627-0000000000000000000000000000000000000000000000000000000000000004-fdd928bc86c82bd2a7c54082a68332ebb5f2cde842b1c2e0fa430ededb6e369e',
      },
      {
        token1IdStr:
          '0000000000000000000000000000000000000000000000000000000000000004',
        token1PoolValue: 50000170018,
        token2IdStr:
          'a61df4d870c17a7dc62d7e4c16c6f4f847994403842aaaf21c994d1a0024b032',
        token2PoolValue: 180000003045,
        poolid:
          'pdepair-2792627-0000000000000000000000000000000000000000000000000000000000000004-a61df4d870c17a7dc62d7e4c16c6f4f847994403842aaaf21c994d1a0024b032',
      },
      {
        token1IdStr:
          '0000000000000000000000000000000000000000000000000000000000000004',
        token1PoolValue: 50000170018,
        token2IdStr:
          'fdd928bc86c82bd2a7c54082a68332ebb5f2cde842b1c2e0fa430ededb6e369e',
        token2PoolValue: 180000003,
        poolid:
          'pdepair-2300000-0000000000000000000000000000000000000000000000000000000000000004-fdd928bc86c82bd2a7c54082a68332ebb5f2cde842b1c2e0fa430ededb6e369e',
      },
    ];
    await dispatch(actionFetched(data));
  } catch (error) {
    await dispatch(actionFetchFail());
  }
};
