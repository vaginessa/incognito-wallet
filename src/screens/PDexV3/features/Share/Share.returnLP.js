import React, {memo} from 'react';
import {HomeTabHeader} from '@screens/PDexV3/features/Home';
import {useSelector} from 'react-redux';
import {isFetchingSelector, totalShareSelector} from '@screens/PDexV3/features/Portfolio';

const ReturnLP = () => {
  const totalShare = useSelector(totalShareSelector);
  const loading = useSelector(isFetchingSelector);
  return <HomeTabHeader title="Pool Balance" desc={`$${totalShare}`} loading={loading} />;
};

export default memo(ReturnLP);
