import React from 'react';
import { ScrollView, View } from 'react-native';
import PropTypes from 'prop-types';
import {GroupInput, Header} from '@src/components';
import {compose} from 'recompose';
import {RoundCornerButton} from '@components/core';
import { styled as mainStyle } from '@screens/PDexV3/PDexV3.styled';

const RemovePool = React.memo(() => {
  return (
    <View style={mainStyle.container}>
      <Header title="Remove Liquidity" />
      <ScrollView>
        <GroupInput />
        <RoundCornerButton
          style={mainStyle.button}
          title="Remove Liquidity"
        />
      </ScrollView>
    </View>
  );
});

RemovePool.propTypes = {};

export default compose(
)(RemovePool);

