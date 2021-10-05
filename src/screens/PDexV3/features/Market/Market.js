import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withLayout_2 } from '@src/components/Layout';
import { Text } from '@src/components/core';

const styled = StyleSheet.create({
  container: {},
});

const Market = (props) => {
  return (
    <View style={styled.container}>
      <Text>Tab market</Text>
    </View>
  );
};

Market.propTypes = {};

export default React.memo(Market);
