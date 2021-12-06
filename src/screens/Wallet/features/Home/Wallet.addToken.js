import React, {memo} from 'react';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { Text, TouchableOpacity } from '@components/core';
import {styledAddToken} from '@screens/Wallet/features/Home/Wallet.styled';
import globalStyled from '@src/theme/theme.styled';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme/theme.selector';

const AddToken = () => {
  const navigation = useNavigation();
  const handleFollowToken = () => navigation.navigate(routeNames.FollowToken);
  const colors = useSelector(colorsSelector);
  return (
    <TouchableOpacity style={[styledAddToken.container, globalStyled.defaultPadding, { backgroundColor: colors.background1 }]} onPress={handleFollowToken}>
      <Text style={styledAddToken.title}>Add a coin +</Text>
    </TouchableOpacity>
  );
};

export default memo(AddToken);
