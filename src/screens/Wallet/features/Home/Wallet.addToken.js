import React, {memo} from 'react';
import {Text} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import {TouchableOpacity} from '@components/core';
import {styledAddToken} from '@screens/Wallet/features/Home/Wallet.styled';

const AddToken = () => {
  const navigation = useNavigation();
  const handleFollowToken = () => navigation.navigate(routeNames.FollowToken);
  return (
    <TouchableOpacity style={styledAddToken.container} onPress={handleFollowToken}>
      <Text style={styledAddToken.title}>Add a coin +</Text>
    </TouchableOpacity>
  );
};

export default memo(AddToken);
