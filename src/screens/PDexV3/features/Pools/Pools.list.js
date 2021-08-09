import { Header } from '@src/components';
import { FlatList, KeyboardAwareScrollView } from '@src/components/core';
import { withLayout_2 } from '@src/components/Layout';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionToggleFollowingPool,
  listPoolsSelector,
} from '@screens/PDexV3/features/Pools';
import Pool from '@screens/PDexV3/features/Pool';
import { useSearchBox } from '@src/components/Header';
import { styled as generalStyled } from './Pools.styled';
import { handleFilterPoolByKeySeach } from './Pools.utils';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const PoolsList = React.memo(() => {
  const data = useSelector(listPoolsSelector);
  const dispatch = useDispatch();
  const handleTogglePool = (poolId) =>
    dispatch(actionToggleFollowingPool(poolId));
  const [_data, keySearch] = useSearchBox({
    data,
    shouldCleanSearch: false,
    handleFilter: () => handleFilterPoolByKeySeach({ data, keySearch }),
  });
  const listPoolsIDs = _data.map((pool) => pool?.poolId);
  return (
    <KeyboardAwareScrollView contentContainerStyle={{ paddingTop: 27 }}>
      <FlatList
        data={listPoolsIDs}
        renderItem={({ item }) => (
          <Pool poolId={item} onPressPool={handleTogglePool} />
        )}
        keyExtractor={(pool) => pool?.poolId}
        showsVerticalScrollIndicator={false}
        style={generalStyled.listPools}
      />
    </KeyboardAwareScrollView>
  );
});

const PoolsListContainer = () => {
  return (
    <View style={styled.container}>
      <Header title="Search coins pair" canSearch />
      <PoolsList />
    </View>
  );
};

PoolsListContainer.propTypes = {};

export default withLayout_2(React.memo(PoolsListContainer));
