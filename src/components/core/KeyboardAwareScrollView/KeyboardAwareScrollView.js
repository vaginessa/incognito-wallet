import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyleSheet } from 'react-native';
import { getBottomAreaHeight } from '@src/utils/SafeAreaHelper';

const BOTTOM_BAR_PADDING_BOTTOM = getBottomAreaHeight() + 10;

const styled = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: 40 + BOTTOM_BAR_PADDING_BOTTOM,
  },
});

const Component = ({ contentContainerStyle, ...rest }) => {
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      enableOnAndroid
      enableResetScrollToCoords={false}
      contentContainerStyle={[
        styled.contentContainerStyle,
        contentContainerStyle,
      ]}
      {...rest}
    />
  );
};

export default Component;
