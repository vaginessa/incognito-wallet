import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FollowingPools } from '@screens/PDexV3/features/Pools';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const TabOrderLimit = (props) => {
  const navigation = useNavigation();
  const handlePressPool = (poolId) => {
    navigation.navigate(routeNames.OrderLimit);
  };
  return (
    <View style={styled.container}>
      <FollowingPools handlePressPool={handlePressPool} />
    </View>
  );
};

TabOrderLimit.propTypes = {};

export default React.memo(TabOrderLimit);
