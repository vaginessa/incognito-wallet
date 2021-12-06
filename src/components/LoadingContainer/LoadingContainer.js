import React from 'react';
import { Container, ActivityIndicator, View } from '@src/components/core';
import styleSheet from './style';

const LoadingContainer = () => (
  <View style={styleSheet.container}>
    <ActivityIndicator size="large" />
  </View>
);

export default LoadingContainer;
