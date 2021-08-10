import TYPES from '@screens/PDexV3/features/ContributePool/Contribute.constant';

export const actionUpdateContributePoolID = ({ poolId }) => ({
  type: TYPES.ACTION_UPDATE_POOL_ID,
  payload: poolId,
});
