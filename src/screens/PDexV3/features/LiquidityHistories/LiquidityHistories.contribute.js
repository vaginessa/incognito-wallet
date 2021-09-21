import React, {memo} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
// import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {liquidityHistorySelector} from '@screens/PDexV3/features/LiquidityHistories/index';
// import {useNavigation} from 'react-navigation-hooks';
// import routeNames from '@routers/routeNames';
import styled from '@screens/PDexV3/features/LiquidityHistories/LiquidityHistories.styled';

const Item = React.memo(({ history, isLast }) => {
  // const navigation = useNavigation();
  // const onNextPress = () => navigation.navigate(routeNames.ContributeHistoryDetail);
  return (
    <TouchableOpacity style={[styled.wrapperItem, isLast && { marginBottom: 20 }]}>
      <View style={styled.topRow}>
        <Text style={styled.title}>Contribute</Text>
        <Text style={styled.status}>{history?.statusStr}</Text>
      </View>
      <View style={styled.bottomRow}>
        <Text style={styled.desc}>{history?.contributeAmountDesc}</Text>
      </View>
    </TouchableOpacity>
  );
});

const Contribute = () => {
  const histories = useSelector(liquidityHistorySelector.mapContributeData);
  const renderItem = (data) => <Item history={data.item} isLast={data.index === (histories.length - 1)} />;
  const renderContent = () => {
    return (
      <View style={{ paddingTop: 20 }}>
        <FlatList
          data={histories}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };
  return (
    renderContent()
  );
};

Contribute.propTypes = {};

export default memo(Contribute);
