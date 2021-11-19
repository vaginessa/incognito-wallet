import React from 'react';
import { StyleSheet, View } from 'react-native';

const styled = StyleSheet.create({
  divider: {
    flex: 1,
  },
});

const DividerComponent = ({ dividerStyled = null }) => {
  return <View style={[styled.divider, dividerStyled]} />;
};

DividerComponent.propTypes = {};

export default React.memo(DividerComponent);
