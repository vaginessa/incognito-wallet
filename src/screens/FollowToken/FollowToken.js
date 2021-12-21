import React from 'react';
import { View, Text, TouchableOpacity } from '@src/components/core';
import { View2 } from '@src/components/core/View';
import globalStyled from '@src/theme/theme.styled';
import Header from '@src/components/Header';
import {TokenBasic as Token, ListAllToken, TokenFollow} from '@src/components/Token';
import PropTypes from 'prop-types';
import routeNames from '@src/router/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import { styled } from './FollowToken.styled';
import withFollowToken from './FollowToken.enhance';

const AddManually = () => {
  const title = 'Don\'t see your coin?';
  const navigation = useNavigation();
  const handleAddTokenManually = () =>
    navigation?.navigate(routeNames.AddManually, { type: 'ERC20' });
  return (
    <View style={styled.addManually}>
      <Text style={styled.text}>{title}</Text>
      <TouchableOpacity onPress={handleAddTokenManually}>
        <Text style={[styled.text, styled.boldText, { marginTop: 5 }]}>
          Add manually +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const Item = ({ item, handleToggleFollowToken }) =>
  React.useMemo(() => {
    return (
      <Token
        onPress={() => handleToggleFollowToken(item)}
        tokenId={item?.tokenId}
        name="displayName"
        symbol="pSymbol"
        shouldShowFollowed
      />
    );
  }, [item?.isFollowed]);

const FollowTokenList = React.memo((props) => {
  const { handleToggleFollowToken, ...rest } = props;
  return (
    <View2 style={styled.container}>
      <Header title="Add a coin" canSearch />
      <View borderTop style={[{ paddingTop: 20, flex : 1 }]}>
        <ListAllToken
          {...rest}
          renderItem={({ item }) => (
            <TokenFollow item={item} handleToggleFollowToken={handleToggleFollowToken} onPress={() => handleToggleFollowToken(item)} />
          )}
        />
      </View>
      <AddManually />
    </View2>
  );
});

FollowTokenList.propTypes = {
  handleToggleFollowToken: PropTypes.func.isRequired,
  tokensFactories: PropTypes.array.isRequired,
};

export default withFollowToken(FollowTokenList);
