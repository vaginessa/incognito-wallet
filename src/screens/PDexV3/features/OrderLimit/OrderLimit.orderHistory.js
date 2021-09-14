import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatList } from '@src/components/core';
import { Header } from '@src/components';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const OrderHistory = () => {
  return (
    <View style={styled.container}>
      <Header title="Order history" />
      <FlatList />
    </View>
  );
};

OrderHistory.propTypes = {};

export default React.memo(OrderHistory);
