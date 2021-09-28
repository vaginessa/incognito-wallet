import { Header } from '@src/components';
import { FlatList, KeyboardAwareScrollView } from '@src/components/core';
import { withLayout_2 } from '@src/components/Layout';
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {
  isFetchingSelector,
  listPoolsSelector,
} from '@screens/PDexV3/features/Pools';
import Pool from '@screens/PDexV3/features/Pool';
import { useNavigationParam } from 'react-navigation-hooks';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { styled as generalStyled } from './Pools.styled';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const PoolsList = React.memo(({ onPressPool, pools }) => {
  // const poolIds = useSelector(poolPairIdsSelector);
  const isFetching = useSelector(isFetchingSelector);
  return (
    <KeyboardAwareScrollView contentContainerStyle={{ paddingTop: 27 }}>
      {isFetching && (<ActivityIndicator style={{ marginBottom: 30 }} />)}
      <FlatList
        data={pools}
        renderItem={({ item }) => (
          <Pool poolId={item.poolId} onPressPool={() => onPressPool(item.poolId)} />
        )}
        keyExtractor={({ poolId }) => poolId}
        showsVerticalScrollIndicator={false}
        style={generalStyled.listPools}
      />
    </KeyboardAwareScrollView>
  );
});

const PoolsListContainer = (props) => {
  const params = useNavigationParam('params');
  const { headerTitle = 'Search pools', onPressPool } = params || props;
  const purePools = useSelector(listPoolsSelector);
  const [pools, setPools] = React.useState(() => purePools.filter(({ verified }) => verified));
  const onSearch = (searchText) => {
    const dataByPoolId = purePools.filter(({ poolId }) => searchText.toLowerCase() === poolId.toLowerCase());
    if (!isEmpty(dataByPoolId)) {
      setPools(dataByPoolId);
      return;
    }
    const searchData = purePools.filter(({ token1, token2, verified }) => (
      (
        token1.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
        token2.symbol.toLowerCase().includes(searchText.toLowerCase())
      ) &&
      verified
    ));
    setPools(searchData);
  };
  return (
    <View style={styled.container}>
      <Header
        title={headerTitle}
        canSearch
        isNormalSearch
        onTextSearchChange={onSearch}
      />
      <PoolsList onPressPool={onPressPool} pools={pools} />
    </View>
  );
};

PoolsList.propTypes = {
  onPressPool: PropTypes.func.isRequired,
};

export default withLayout_2(React.memo(PoolsListContainer));
