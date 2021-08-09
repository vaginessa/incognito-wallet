import React from 'react';
import { View, Text } from 'react-native';
import { styled } from './OrderLimit.styled';

const OrderLimit = (props) => {
  return (
    <View style={styled.container}>
      <Text>This is tab order limit</Text>
    </View>
  );
};

OrderLimit.propTypes = {};

export default React.memo(OrderLimit);
