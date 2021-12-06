import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { SafeAreaView, StyleSheet } from 'react-native';
import withLazy from '@components/LazyHoc/LazyHoc';
import { compose } from 'recompose';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme/theme.selector';
import { background1Screen } from '@components/core/StatusBar/StatusBar';
import { currentScreenSelector } from '@screens/Navigation';
import { View } from '@components/core';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingBottom: 0,
  },
});

const enhance = (WrappedComp) => (props) => {
  const colors = useSelector(colorsSelector);
  const currentScreen = useSelector(currentScreenSelector);
  const _background = React.useMemo(() => {
    if (background1Screen.includes(currentScreen)) {
      return colors.background1;
    }
    return colors.background2;
  }, [currentScreen]);
  return (
    <ErrorBoundary>
      <SafeAreaView style={[styled.container, { backgroundColor: _background }, props?.containerStyled]}>
        <View style={[styled.wrapper, props?.wrapperStyled]}>
          <WrappedComp {...props} />
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

export default compose(
  withLazy,
  enhance
);
