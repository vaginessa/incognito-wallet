import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { AppIcon } from '@src/components/Icons';
import { Image } from '@src/components/core';

export const Icon = React.memo((props) => {
  const { iconUrl } = props;
  if (isEmpty(iconUrl)) {
    return <AppIcon />;
  }
  return <Image style={{ width: 20, height: 20 }} source={{ uri: iconUrl }} />;
});
