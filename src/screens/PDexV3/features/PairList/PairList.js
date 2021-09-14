import React from 'react';
import {RefreshControl, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header} from '@src/components';
import withPairs from '@screens/PDexV3/features/PairList/PairList.enhance';
import styled from '@screens/PDexV3/features/PairList/PairList.styled';
import {useSelector} from 'react-redux';
import {pairsSelector} from '@screens/PDexV3/features/PairList/index';

const PairItem = ({ pair }) => {
  return (
    <TouchableOpacity style={styled.wrapper}>
      <Text style={styled.title}>{pair.symbolStr}</Text>
      <Text style={styled.poolSize}>{pair.poolSizeStr}</Text>
    </TouchableOpacity>
  );
};

const PairList = ({ onSearch, pairs }) => {
  const isFetching = useSelector(pairsSelector.isFetchingSelector);
  const renderItem = (pair) => <PairItem pair={pair} key={pair.id} />;
  return (
    <View style={mainStyle.container}>
      <Header
        title="Search coins"
        canSearch
        isNormalSearch
        onTextSearchChange={onSearch}
      />
      <ScrollView
        refreshControl={(<RefreshControl refreshing={isFetching} />)}
      >
        {pairs.map(renderItem)}
      </ScrollView>
    </View>
  );
};

PairList.propTypes = {
  pairs: PropTypes.array.isRequired,
  onSearch: PropTypes.func.isRequired,
};

PairItem.propTypes = {
  pair: PropTypes.object.isRequired,
};

export default withPairs(React.memo(PairList));
