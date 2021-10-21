import React from 'react';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {COLORS} from '@src/styles';
import TabHome from '@screens/MainTabBar/features/Home';
import TabShield from '@screens/MainTabBar/features/Shield';
import TabAssets from '@screens/MainTabBar/features/Assets';
import TabTrade from '@screens/MainTabBar/features/Trade';
import TabHomeLP from '@screens/MainTabBar/features/HomeLP';
import {HomeIcon, ShieldIcon, TradeIcon, LiquidityIcon, AssetsIcon} from '@components/Icons';

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: TabHome,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <HomeIcon active={focused} />
        )
      },
    },
    Shield: {
      screen: TabShield,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <ShieldIcon active={focused} />
        )
      }
    },
    Trade: {
      screen: TabTrade,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <TradeIcon active={focused} />
        ),
      },
    },
    Liquidity: {
      screen: TabHomeLP,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <LiquidityIcon active={focused} />
        ),
      },
    },
    Assets: {
      screen: TabAssets,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <AssetsIcon active={focused} />
        ),
        activeColor: COLORS.colorBlue,
        inactiveColor: COLORS.lightGrey34,
      },
    },
  },
  {
    initialRouteName: 'Home',
    activeColor: COLORS.colorBlue,
    inactiveColor: COLORS.lightGrey34,
    barStyle: {
      backgroundColor: COLORS.white
    },
    shifting: false,
  }
);

export default TabNavigator;
