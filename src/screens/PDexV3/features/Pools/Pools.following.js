import {Row} from '@src/components';
import { TouchableOpacity, LoadingContainer} from '@src/components/core';
import React from 'react';
import {View, Text} from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import {useDispatch, useSelector} from 'react-redux';
import Pool from '@screens/PDexV3/features/Pool';
import {
  actionToggleFollowingPool,
  isFetchingSelector,
  followPoolIdsSelector,
} from '@screens/PDexV3/features/Pools';
import routeNames from '@src/router/routeNames';
import PropTypes from 'prop-types';
import {
  styled,
  headStyled,
  poolsListHeaderFollowingStyled,
  footerStyled,
} from './Pools.styled';

const PoolsHeader = React.memo(({ handlePressPool }) => {
  const navigation = useNavigation();
  const onSearchPress = () => {
    navigation.navigate(routeNames.PoolsList, {
      params: { onPressPool: handlePressPool, },
    });
  };
  return (
    <View style={headStyled.headContainer}>
      <Text style={headStyled.titleText}>Market List</Text>
      <TouchableOpacity
        style={headStyled.btnSearch}
        onPress={onSearchPress}
      >
        <Text style={headStyled.searchText}>Search coin</Text>
      </TouchableOpacity>
    </View>
  );
});

const Footer = React.memo(() => {
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const _onPressPool = (poolId) => {
    if (!poolId) return;
    dispatch(actionToggleFollowingPool(poolId));
  };
  return (
    <TouchableOpacity
      style={styled.wrapFooter}
      onPress={() =>
        navigate.navigate(routeNames.PoolsList, {
          params: { onPressPool: _onPressPool },
        })
      }
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

export const PoolsListFollowing = React.memo(({ handlePressPool }) => {
  const followIds = useSelector(followPoolIdsSelector) || [];
  const isFetching = useSelector(isFetchingSelector);
  const onPressPool = (poolId) => {
    typeof handlePressPool === 'function' && handlePressPool(poolId);
  };
  const renderItem = (poolId) => (
    <Pool
      key={poolId}
      poolId={poolId}
      swipable={followIds.length > 1}
      onPressPool={onPressPool}
      checkFollow={false}
    />
  );
  const renderContent = () => {
    if (isFetching) return <LoadingContainer />;
    return (
      <>
        {followIds.map(renderItem)}
        <Footer />
      </>
    );
  };
  return renderContent();
});

const Pools = (props) => {
  const { handlePressPool } = props;
  return (
    <View style={styled.container}>
      <PoolsHeader handlePressPool={handlePressPool} />
      <PoolsListHeaderFollowing />
      <PoolsListFollowing handlePressPool={handlePressPool} />
    </View>
  );
};

Pools.propTypes = {
  handlePressPool: PropTypes.func.isRequired,
};

PoolsListFollowing.propTypes = {
  handlePressPool: PropTypes.func.isRequired,
};

PoolsHeader.propTypes = {
  handlePressPool: PropTypes.func.isRequired,
};


export default React.memo(Pools);
