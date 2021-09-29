import {liquidityHistorySelector, TYPES} from '@screens/PDexV3/features/LiquidityHistories';
import {batch} from 'react-redux';
import {ExHandler} from '@services/exception';
import {actionGetPDexV3Inst} from '@screens/PDexV3';

const actionFetchingContribute = ({ isFetching }) => ({
  type: TYPES.ACTION_SET_FETCHING_CONTRIBUTE_HISTORIES,
  payload: { isFetching }
});

const actionFetchingRemoveLP = ({ isFetching }) => ({
  type: TYPES.ACTION_SET_FETCHING_REMOVE_HISTORIES,
  payload: { isFetching }
});

const actionFetchingWithdrawFeeLP = ({ isFetching }) => ({
  type: TYPES.ACTION_SET_FETCHING_WITHDRAW_FEE_HISTORIES,
  payload: { isFetching }
});

const actionSetContribute = ({ histories }) => ({
  type: TYPES.ACTION_SET_CONTRIBUTE_HISTORIES,
  payload: { histories }
});

const actionSetRemoveLP = ({ histories }) => ({
  type: TYPES.ACTION_SET_REMOVE_HISTORIES,
  payload: { histories }
});

const actionSetWithdrawFeeLP = ({ histories }) => ({
  type: TYPES.ACTION_SET_WITHDRAW_FEE_HISTORIES,
  payload: { histories }
});

const actionGetContributeHistories = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const isFetching = liquidityHistorySelector.isFetchingContribute(state);
    if (isFetching) return;
    dispatch(actionFetchingContribute({ isFetching: true }));
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const histories = await pDexV3Inst.getContributeHistories();
    dispatch(actionSetContribute({ histories }));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionFetchingContribute({ isFetching: false }));
  }
};

const actionGetRemoveLPHistories = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const isFetching = liquidityHistorySelector.isFetchingRemoveLP(state);
    if (isFetching) return;
    dispatch(actionFetchingRemoveLP({ isFetching: true }));
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const histories = await pDexV3Inst.getRemoveLPHistories();
    console.log('SANG TEST: ', histories);
    // const histories = [{'requestTx':'1108be2fdd14eb0abf81ab6cd377e3ca02f7b3e875f6e653c0f59a9cc531e010','respondTxs':['f67ec5ed0188a20dc1e504efcf90003d4f3278837ad37816266052eb6724e103'],'status':'success','tokenId1':'0000000000000000000000000000000000000000000000000000000000000004','tokenId2':'','amount1':500007166,'amount2':0,'shareAmount':22361,'requestime':0,'nftId':'54cf112cbff508de73c33ab7544af0555dd7bc44dc4bfc61fedcc680b66cdba7','poolId':'0000000000000000000000000000000000000000000000000000000000000004-6133dbf8e3d71a8f8e406ebd459492d34180622ba572b2d8f0fc8484b09ddd47-13a6c00e978a0073f28b19a2a1298542341fad56d0dd4eb27f0acfcede0aef35','statusStr':'Completed'}];
    dispatch(actionSetRemoveLP({ histories }));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionFetchingRemoveLP({ isFetching: false }));
  }
};

const actionGetWithdrawLPHistories = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const isFetching = liquidityHistorySelector.isFetchingWithdrawFeeLP(state);
    if (isFetching) return;
    dispatch(actionFetchingRemoveLP({ isFetching: true }));
    // const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    // const histories = await pDexV3Inst.getRemoveLPHistories();
    const histories = [{'requestTx':'1108be2fdd14eb0abf81ab6cd377e3ca02f7b3e875f6e653c0f59a9cc531e010','respondTxs':['f67ec5ed0188a20dc1e504efcf90003d4f3278837ad37816266052eb6724e103'],'status':'success','tokenId1':'0000000000000000000000000000000000000000000000000000000000000004','tokenId2':'','amount1':500007166,'amount2':0,'shareAmount':22361,'requestime':0,'nftId':'54cf112cbff508de73c33ab7544af0555dd7bc44dc4bfc61fedcc680b66cdba7','poolId':'0000000000000000000000000000000000000000000000000000000000000004-6133dbf8e3d71a8f8e406ebd459492d34180622ba572b2d8f0fc8484b09ddd47-13a6c00e978a0073f28b19a2a1298542341fad56d0dd4eb27f0acfcede0aef35','statusStr':'Completed'}];
    dispatch(actionSetWithdrawFeeLP({ histories }));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionFetchingRemoveLP({ isFetching: false }));
  }
};

const actionGetHistories = () => async (dispatch) => {
  try {
    batch(() => {
      dispatch(actionGetContributeHistories());
      dispatch(actionGetRemoveLPHistories());
      dispatch(actionGetWithdrawLPHistories());
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export default ({
  actionFetchingContribute,
  actionFetchingRemoveLP,
  actionFetchingWithdrawFeeLP,

  actionSetContribute,
  actionSetRemoveLP,
  actionSetWithdrawFeeLP,

  actionGetContributeHistories,
  actionGetRemoveLPHistories,
  actionGetWithdrawLPHistories,
  actionGetHistories,
});
