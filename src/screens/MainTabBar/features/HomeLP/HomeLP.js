import React, {memo} from 'react';
import {View} from 'react-native';
import Home from '@screens/PDexV3/features/Home';
import Modal from '@components/Modal';

const TabHomeLP = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Home hideBackButton />
      <Modal />
    </View>
  );
};

export default memo(TabHomeLP);
