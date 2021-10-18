import React from 'react';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createAppContainer} from 'react-navigation';
import {COLORS} from '@src/styles';
import Shield from '@screens/Shield';
import Trade from '@screens/PDexV3/features/Trade';
import Liquidity from '@screens/PDexV3/features/Home/Home';
import Wallet from '@screens/Wallet/features/Home/Wallet';
import TabHome from '@screens/MainTabBar/features/Home';
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
      screen: Shield,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <ShieldIcon active={focused} />
        )
      }
    },
    Trade: {
      screen: Trade,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <TradeIcon active={focused} />
        ),
      },
    },
    Liquidity: {
      screen: Liquidity,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <LiquidityIcon active={focused} />
        ),
      },
    },
    Assets: {
      screen: Wallet,
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

export default createAppContainer(TabNavigator);
