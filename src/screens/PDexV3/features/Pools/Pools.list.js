import { Header } from '@src/components';
import { FlatList, KeyboardAwareScrollView } from '@src/components/core';
import { withLayout_2 } from '@src/components/Layout';
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  actionFreeListPools,
  isFetchingSelector,
  poolPairIdsSelector,
} from '@screens/PDexV3/features/Pools';
import Pool from '@screens/PDexV3/features/Pool';
import { useNavigationParam } from 'react-navigation-hooks';
import PropTypes from 'prop-types';
import { styled as generalStyled } from './Pools.styled';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const PoolsList = React.memo(({ onPressPool }) => {
  const poolIds = useSelector(poolPairIdsSelector);
  const isFetching = useSelector(isFetchingSelector);
  return (
    <KeyboardAwareScrollView contentContainerStyle={{ paddingTop: 27 }}>
      {isFetching && (<ActivityIndicator style={{ marginBottom: 30 }} />)}
      <FlatList
        data={poolIds}
        renderItem={({ item: poolId }) => (
          <Pool poolId={poolId} onPressPool={() => onPressPool(poolId)} />
        )}
        keyExtractor={(pool) => pool?.poolId}
        showsVerticalScrollIndicator={false}
        style={generalStyled.listPools}
      />
    </KeyboardAwareScrollView>
  );
});

const PoolsListContainer = (props) => {
  const dispatch = useDispatch();
  const params = useNavigationParam('params');
  const { headerTitle = 'Pools', onPressPool } = params || props;
  React.useEffect(() => {
    return () => dispatch(actionFreeListPools());
  }, []);
  return (
    <View style={styled.container}>
      <Header title={headerTitle} />
      <PoolsList onPressPool={onPressPool} />
    </View>
  );
};

PoolsList.propTypes = {
  onPressPool: PropTypes.func.isRequired,
};

export default withLayout_2(React.memo(PoolsListContainer));
