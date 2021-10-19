import React, {memo} from 'react';
import {View} from 'react-native';
import Home from '@screens/PDexV3/features/Home';

const TabHomeLP = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Home hideBackButton />
    </View>
  );
};

export default memo(TabHomeLP);
