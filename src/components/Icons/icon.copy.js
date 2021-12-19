import React from 'react';
import { StyleSheet } from 'react-native';
import { Image1, View } from '@src/components/core';
import srcCopy from '@src/assets/images/new-icons/copy.png';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme/theme.selector';

const styled = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 15.09,
    height: 18,
  },
});

const IconCopy = (props) => {
  const { isHeader } = props;
  const colors = useSelector(colorsSelector);
  return (
    <View style={[styled.container, props?.containerStyle, isHeader ? { backgroundColor: colors.background10 } : {} ]}>
      <Image1 style={[styled.icon, props?.style]} source={srcCopy} />
    </View>
  );
};

IconCopy.propTypes = {};

export default IconCopy;
