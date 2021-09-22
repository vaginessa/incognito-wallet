import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatList } from '@src/components/core';
import { Header } from '@src/components';
import { useDispatch } from 'react-redux';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const OrderHistory = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    return () => {};
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
