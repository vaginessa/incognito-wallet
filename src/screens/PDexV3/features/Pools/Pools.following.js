import { Row } from '@src/components';
import { FlatList, TouchableOpacity } from '@src/components/core';
import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
import Pool from '@screens/PDexV3/features/Pool';
import { listPoolsFollowingSelector } from '@screens/PDexV3/features/Pools';
import routeNames from '@src/router/routeNames';
import {
  styled,
  headStyled,
  poolsListHeaderFollowingStyled,
  poolsListFollowingStyled,
  footerStyled,
} from './Pools.styled';

const PoolsHeader = React.memo(() => {
  const navigate = useNavigation();
  return (
    <View style={headStyled.headContainer}>
      <Text style={headStyled.titleText}>Market List</Text>
      <TouchableOpacity
        style={headStyled.btnSearch}
        onPress={() => navigate.navigate()}
      >
        <Text style={headStyled.searchText}>Search coin</Text>
      </TouchableOpacity>
    </View>
  );
});

const Footer = React.memo(() => {
  const navigate = useNavigation();
  return (
    <TouchableOpacity
      style={styled.wrapFooter}
      onPress={() => navigate.navigate(routeNames.PoolsList)}
    >
      <Text style={footerStyled.text}>Add favorite list +</Text>
    </TouchableOpacity>
  );
});

const HEADER_FACTORIES = [
  {
    text: '#Name / Vol',
    styled: [poolsListHeaderFollowingStyled.wrapperFirstSection],
    textStyle: null,
  },
  {
    text: '#APY',
    styled: [
      poolsListHeaderFollowingStyled.wrapperSecondSection,
      poolsListHeaderFollowingStyled.centerText,
    ],
  },
  {
    text: '#Change %',
    styled: [
      poolsListHeaderFollowingStyled.wrapperThirdSection,
      poolsListHeaderFollowingStyled.rightText,
    ],
  },
];

const PoolsListHeaderFollowing = React.memo(() => {
  return (
    <Row style={{ marginVertical: 15, justifyContent: 'space-between' }}>
      {HEADER_FACTORIES.map((item) => (
        <Text
          key={item.text}
          style={[poolsListHeaderFollowingStyled.text, item.styled]}
        >
          {item.text}
        </Text>
      ))}
    </Row>
  );
});

export const PoolsListFollowing = React.memo(() => {
  const listPoolsFollowing = useSelector(listPoolsFollowingSelector);
  const dispatch = useDispatch();
  const handleNavigateToPools = (poolId) =>
    console.log('navigate to pool', poolId);
  return (
    <FlatList
      data={listPoolsFollowing}
      renderItem={({ item }) => (
        <Pool poolId={item} swipable onPressPool={handleNavigateToPools} />
      )}
      keyExtractor={(pool) => pool?.poolId}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={<Footer />}
      style={poolsListFollowingStyled.flatList}
    />
  );
});

const Pools = (props) => {
  return (
    <View style={styled.container}>
      <PoolsHeader />
      <PoolsListHeaderFollowing />
      <PoolsListFollowing />
    </View>
  );
};

Pools.propTypes = {};

export default React.memo(Pools);
