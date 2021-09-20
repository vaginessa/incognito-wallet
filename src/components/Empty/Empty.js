import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import imgEmpty from '@src/assets/images/pdexv3/empty.png';

const styled = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60
  }
});

const Empty = () => {
  return (
    <View style={styled.main}>
      <Image style={styled.image} source={imgEmpty} />
    </View>
  );
};

export default memo(Empty);
