import React from 'react';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import { StyleSheet } from 'react-native';
import { getBottomAreaHeight } from '@src/utils/SafeAreaHelper';

const BOTTOM_BAR_PADDING_BOTTOM = getBottomAreaHeight() + 10;

const styled = StyleSheet.create({
  contentContainerStyle: {
    // paddingBottom: 50 + BOTTOM_BAR_PADDING_BOTTOM,
    // flex: 1,
  },
});

const Component = (props: KeyboardAwareScrollViewProps) => {
  const { contentContainerStyle, fullFlex, paddingBottom, ...rest } = props;
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      enableOnAndroid
      enableResetScrollToCoords={false}
      contentContainerStyle={[
        styled.contentContainerStyle,
        contentContainerStyle,
        fullFlex && { flex: 1 },
        paddingBottom && { paddingBottom: 50 + BOTTOM_BAR_PADDING_BOTTOM},
      ]}
      {...rest}
    />
  );
};

export default Component;
