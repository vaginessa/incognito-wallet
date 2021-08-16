import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { ListToken, TokenTrade } from '@src/components/Token';
import { Header } from '@src/components';
import { withLayout_2 } from '@src/components/Layout';
import { useNavigationParam } from 'react-navigation-hooks';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  styledListToken: {
    paddingTop: 27,
  },
});

const SelectToken = (props) => {
  const data = props?.data || useNavigationParam('data') || [];
  const _onSelectToken =
    props?.onSelectToken || useNavigationParam('onSelectToken');
  const onPress = (item) => {
    if (typeof _onSelectToken === 'function') {
      _onSelectToken(item);
    }
  };
  return (
    <View style={styled.container}>
      <Header canSearch title="Search coins" />
      <ListToken
        visible
        data={data}
        renderItem={({ item }) => (
          <TokenTrade onPress={() => onPress(item)} tokenId={item?.tokenId} />
        )}
        styledListToken={styled.styledListToken}
      />
    </View>
  );
};

SelectToken.propTypes = {
  data: PropTypes.array.isRequired,
};

export default withLayout_2(React.memo(SelectToken));
