import React from 'react';
import { ScrollView, View } from 'react-native';
import { GroupInput, Header, RowSpaceText } from '@src/components';
import {compose} from 'recompose';
import {RoundCornerButton} from '@components/core';
import { styled as mainStyle } from '@screens/PDexV3/PDexV3.styled';
import enhance from '@screens/PDexV3/features/ContributePool/ContributePool.enhance';
import { useSelector } from 'react-redux';
import { getContributeData } from '@screens/PDexV3/features/ContributePool/Contribute.selector';

const ContributePool = React.memo(() => {
  const data = useSelector(getContributeData);
  return (
    <View style={mainStyle.container}>
      <Header title="Add Liquidity" />
      <ScrollView>
        <GroupInput />
        <RoundCornerButton
          style={mainStyle.button}
          title="Add liquidity"
        />
        {data?.hookFactories.map(item => <RowSpaceText {...item} />)}
      </ScrollView>
    </View>
  );
});

ContributePool.propTypes = {};

export default compose(
  enhance
)(ContributePool);

