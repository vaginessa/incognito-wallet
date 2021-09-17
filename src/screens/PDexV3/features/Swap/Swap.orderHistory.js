import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatList } from '@src/components/core';
import { useDispatch } from 'react-redux';
import { Header } from '@src/components';
import { actionFetchHistory } from './Swap.actions';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const OrderHistory = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(actionFetchHistory());
  }, []);
  return (
    <View style={styled.container}>
      <Header title="Order history" />
      <FlatList />
    </View>
  );
};

OrderHistory.propTypes = {};

export default React.memo(OrderHistory);
