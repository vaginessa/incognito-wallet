import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { PoolsList } from '@screens/PDexV3/features/Pools';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const MarketList = (props) => {
  const { onPressPool } = props;
  return (
    <View style={styled.container}>
      <PoolsList onPressPool={onPressPool} />
    </View>
  );
};

MarketList.propTypes = {
  onPressPool: PropTypes.func.isRequired,
};

export default React.memo(MarketList);
