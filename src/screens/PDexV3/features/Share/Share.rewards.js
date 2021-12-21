import React from 'react';
import { HomeTabHeader } from '@screens/PDexV3/features/Home';
import { useSelector } from 'react-redux';
import {
  isFetchingSelector,
} from '@src/screens/PDexV3/features/Pools';
import { totalShareSelector } from '@screens/PDexV3/features/Portfolio';
import { useNavigation } from 'react-navigation-hooks';
import { TouchableOpacity } from 'react-native';
import routeNames from '@routers/routeNames';
import AddSolidIcon from '@components/Icons/icon.addSolid';

const HistoryIcon = React.memo(() => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate(routeNames.LiquidityHistories)}>
      <AddSolidIcon />
    </TouchableOpacity>
  );
});

export default React.memo(() => {
  const totalShare = useSelector(totalShareSelector);
  const loading = useSelector(isFetchingSelector);
  return <HomeTabHeader title="Reward Balance" desc={`$${totalShare}`} loading={loading} rightIcon={<HistoryIcon />} />;
});
