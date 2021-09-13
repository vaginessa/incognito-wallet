import TYPES from '@screens/PDexV3/features/Staking/Staking.constant';
import {defaultAccountSelector} from '@src/redux/selectors/account';
import {getPDexV3Instance} from '@screens/PDexV3';
import {ExHandler} from '@services/exception';
import {getBalance} from '@src/redux/actions/token';
import {PRVIDSTR} from 'incognito-chain-web-js/build/wallet';
import {batch} from 'react-redux';
import {
  isFetchingSelector,
  stakingHistoriesKeySelector,
  stakingHistoriesStatus,
  stakingPoolStatusSelector,
} from '@screens/PDexV3/features/Staking';
import uniq from 'lodash/uniq';

const actionFetching = ({ isFetching }) => ({
  type: TYPES.ACTION_FETCHING,
  payload: { isFetching }
});

const actionUpdateData = (payload) => ({
  type: TYPES.ACTION_UPDATE_DATA,
  payload,
});

const actionGetBalances = (tokenIDs) => async (dispatch) => {
  try {
    if (!tokenIDs.includes(PRVIDSTR)) {
      tokenIDs.push(PRVIDSTR);
    }
    tokenIDs.forEach((tokenId) => {
      dispatch(getBalance(tokenId));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

const actionFetchData = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const isFetching = isFetchingSelector(state);
    if (isFetching) return;
    dispatch(actionFetching({ isFetching: true }));
    const account = defaultAccountSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const data = (await pDexV3Inst.getStakingData()) || [];
    const tokenIDs = uniq((data || []).map(({ tokenId }) => tokenId));
    batch(() => {
      dispatch(actionGetBalances(tokenIDs));
      dispatch(actionUpdateData(data));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionFetching({ isFetching: false }));
  }
};

const actionSetInvestCoin = ({ tokenID }) => ({
  type: TYPES.ACTION_SET_INVEST_COIN,
  payload: { tokenID }
});

const actionSetWithdrawInvestCoin = ({ tokenID }) => ({
  type: TYPES.ACTION_SET_WITHDRAW_INVEST_COIN,
  payload: { tokenID }
});

const actionSetWithdrawRewardCoin = ({ tokenID }) => ({
  type: TYPES.ACTION_SET_WITHDRAW_REWARD_COIN,
  payload: { tokenID }
});

const actionChangeAccount = () => ({
  type: TYPES.ACTION_CHANGE_ACCOUNT,
});

const actionUpdateFetchingHistories = () => ({
  type: TYPES.ACTION_FETCHING_HISTORIES,
});

const actionUpdateFetchedHistories = () => ({
  type: TYPES.ACTION_FETCHED_HISTORIES,
});

const actionUpdateHistories = ({ histories, key }) => ({
  type: TYPES.ACTION_UPDATE_HISTORIES,
  payload: { histories, key }
});

const actionSetHistoriesKey = ({ tokenID, nftID }) => ({
  type: TYPES.ACTION_SET_HISTORIES_KEY,
  payload: { tokenID, nftID }
});

const actionFetchHistories = () => async (dispatch, getState) => {
  const state = getState(getState);
  const { isFetching, isLoadMore } = stakingHistoriesStatus(state);
  if (isFetching || isLoadMore) return;
  try {
    dispatch(actionUpdateFetchingHistories());
    const account = defaultAccountSelector(state);
    const { tokenID, nftID, key } = stakingHistoriesKeySelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const histories = (await pDexV3Inst.getStakingHistories({ tokenID, nftID })) || [];
    dispatch(actionUpdateHistories({ histories, key }));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionUpdateFetchedHistories());
  }
};

const actionUpdateFetchingPool = ({ isFetching }) => ({
  type: TYPES.ACTION_UPDATE_FETCHING_POOL,
  payload: { isFetching }
});

const actionSetStakingPools = ({ pools }) => ({
  type: TYPES.ACTION_SET_POOL,
  payload: { pools }
});

const actionFetchStakingPool = () => async (dispatch, getState) => {
  const state = getState(getState);
  const isFetching = stakingPoolStatusSelector(state);
  if (isFetching) return;
  try {
    dispatch(actionUpdateFetchingPool({ isFetching: true }));
    const account = defaultAccountSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const pools = (await pDexV3Inst.getStakingPool()) || [];
    dispatch(actionSetStakingPools({ pools }));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionUpdateFetchingPool({ isFetching: false }));
  }
};


export default ({
  actionFetchData,
  actionSetInvestCoin,
  actionSetWithdrawInvestCoin,
  actionSetWithdrawRewardCoin,
  actionChangeAccount,
  actionSetHistoriesKey,
  actionFetchHistories,
  actionFetchStakingPool,
});
