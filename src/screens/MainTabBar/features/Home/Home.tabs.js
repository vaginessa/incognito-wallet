import React, { memo } from 'react';
import { View } from 'react-native';
import { Tabs, Text } from '@src/components/core';
import { TABS } from '@screens/MainTabBar/features/Home/Home.constant';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionFetchListPools,
  listPoolsVerifySelector,
} from '@screens/PDexV3/features/Pools';
import { Row } from '@src/components';
import formatUtils from '@utils/format';
import { homeStyled } from '@screens/MainTabBar/MainTabBar.styled';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

const Item = React.memo(({ pool }) => {
  const {
    price,
    perChange24hToStr,
    perChange24hColor,
    perChange24hBGColor,
    poolTitle,
  } = pool;
  return (
    <Row centerVertical style={homeStyled.wrapPoolBox}>
      <Text style={[homeStyled.mediumBlack, homeStyled.itemBox]}>
        {poolTitle}
      </Text>
      <Text
        style={[
          homeStyled.mediumBlack,
          homeStyled.itemBox,
          { color: perChange24hColor, textAlign: 'right', marginRight: 15 },
        ]}
      >
        {formatUtils.toFixed(price, 9)}
      </Text>
      <View
        style={[
          homeStyled.percentBox,
          homeStyled.percentBoxWidth,
          { backgroundColor: perChange24hBGColor },
        ]}
      >
        <Text
          style={[
            homeStyled.mediumBlack,
            { color: COLORS.white, fontSize: 12 },
          ]}
        >
          {perChange24hToStr}
        </Text>
      </View>
    </Row>
  );
});

const Header = React.memo(() => (
  <Row>
    <Text style={[homeStyled.itemBox, homeStyled.tabHeaderText]}>Name</Text>
    <Text
      style={[
        homeStyled.itemBox,
        homeStyled.tabHeaderText,
        { textAlign: 'right', marginRight: 15 },
      ]}
    >
      Price
    </Text>
    <Text
      style={[
        homeStyled.percentBoxWidth,
        homeStyled.tabHeaderText,
        { textAlign: 'right' },
      ]}
    >
      Change
    </Text>
  </Row>
));

const tabStyle = {
  titleStyled: homeStyled.mediumBlack,
  titleDisabledStyled: homeStyled.tabDisable,
};

const MainTab = () => {
  const dispatch = useDispatch();
  const pools = useSelector(listPoolsVerifySelector);
  const renderItem = (pool) => <Item pool={pool} key={pool.poolId} />;
  React.useEffect(() => {
    dispatch(actionFetchListPools());
  }, []);
  if (!pools || pools.length === 0) return null;
  return (
    <Tabs rootTabID={TABS.TAB_HOME_ID} useTab1 styledTabList={homeStyled.tab}>
      <View
        tabID={TABS.TAB_HOME_INCREASE_ID}
        label="Increase price"
        {...tabStyle}
      >
        <Header />
        {orderBy(pools, 'priceChange24H', 'desc').map(renderItem)}
      </View>
      <View tabID={TABS.TAB_HOME_REDUCE_ID} label="Reduced price" {...tabStyle}>
        <Header />
        {orderBy(pools, 'priceChange24H', 'asc').map(renderItem)}
      </View>
      <View tabID={TABS.TAB_HOME_POPULAR_ID} label="Popular" {...tabStyle}>
        <Header />
        {orderBy(pools, 'volume', 'desc').map(renderItem)}
      </View>
    </Tabs>
  );
};

Item.propTypes = {
  pool: PropTypes.object.isRequired,
};

export default memo(MainTab);
