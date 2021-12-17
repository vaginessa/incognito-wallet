import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@src/components/core';
import TabSwap, {
  KEYS_PLATFORMS_SUPPORTED,
} from '@screens/PDexV3/features/Swap';
import { withLayout_2 } from '@src/components/Layout';
import Header from '@src/components/Header';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const PrivacyAppsPancake = () => {
  React.useEffect(() => {
    return () => {};
  }, []);
  return (
    <View style={styled.container}>
      <Header title="pPancake" />
      <TabSwap isPrivacyApp exchange={KEYS_PLATFORMS_SUPPORTED.pancake} />
    </View>
  );
};

PrivacyAppsPancake.propTypes = {};

export default withLayout_2(React.memo(PrivacyAppsPancake));
