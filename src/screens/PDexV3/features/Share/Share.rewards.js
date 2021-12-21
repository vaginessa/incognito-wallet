import React from 'react';
import { HomeTabHeader } from '@screens/PDexV3/features/Home';
import { useSelector } from 'react-redux';
import {
  isFetchingSelector,
} from '@src/screens/PDexV3/features/Pools';
import { totalShareSelector } from '@screens/PDexV3/features/Portfolio';

export default React.memo(() => {
  const totalShare = useSelector(totalShareSelector);
  const loading = useSelector(isFetchingSelector);
  return <HomeTabHeader title="Reward Balance" desc={`$${totalShare}`} loading={loading} />;
});
