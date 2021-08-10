import React from 'react';
import { View, Text } from 'react-native';
import { FollowingPools } from '@screens/PDexV3/features/Pools';
import { styled } from './OrderLimit.styled';

const OrderLimit = (props) => {
  return (
    <View style={styled.container}>
      <FollowingPools />
    </View>
  );
};

OrderLimit.propTypes = {};

export default React.memo(OrderLimit);
