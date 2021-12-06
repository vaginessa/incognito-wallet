import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { StyleSheet } from 'react-native';
import withLazy from '@components/LazyHoc/LazyHoc';
import { compose } from 'recompose';
import { View2 } from '@components/core/View';
import styled from 'styled-components/native';

const _styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingBottom: 0,
  },
});

const SafeAreaView = styled.SafeAreaView`
  background-color: ${({ theme }) => theme.background2};
`;

const enhance = (WrappedComp) => (props) => {
  return (
    <ErrorBoundary>
      <SafeAreaView style={[_styled.container, props?.containerStyled]}>
        <View2 style={[_styled.wrapper, props?.wrapperStyled]}>
          <WrappedComp {...props} />
        </View2>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

export default compose(
  withLazy,
  enhance
);
