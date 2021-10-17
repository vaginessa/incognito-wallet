import React from 'react';
import {View} from 'react-native';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createAppContainer} from 'react-navigation';
import {COLORS} from '@src/styles';
import Home from '@screens/Home';
import Shield from '@screens/Shield';
import Trade from '@screens/PDexV3/features/Trade';
import Liquidity from '@screens/PDexV3/features/Home/Home';
import Wallet from '@screens/Wallet/features/Home/Wallet';
import {HomeIcon, AssetIcon, LiquidityIcon, TradeIcon, ShieldIcon} from '@screens/MainTabBar/MainTabBar.icons';

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return (
            <View>
              <HomeIcon />
            </View>
          );
        },
      },
    },
    Shield: {
      screen: Shield,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <ShieldIcon />
        ),
      }
    },
    Trade: {
      screen: Trade,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <TradeIcon />
        ),
      },
    },
    Liquidity: {
      screen: Liquidity,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <LiquidityIcon />
        ),
      },
    },
    Assets: {
      screen: Wallet,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <AssetIcon />
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
    labelStyle: {
      paddingTop: 10,
      backgroundColor: COLORS.red
    },
  }
);

export default createAppContainer(TabNavigator);
