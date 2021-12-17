import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { COLORS } from '@src/styles';
import More from '@screens/MainTabBar/features/More';
import TabAssets from '@screens/MainTabBar/features/Assets';
import TabTrade from '@screens/MainTabBar/features/Trade';
import TabHomeLP from '@screens/MainTabBar/features/HomeLP';
import TabPrivacyApps from '@screens/MainTabBar/features/PrivacyApps';
import {
  MoreIcon,
  TradeIcon,
  LiquidityIcon,
  AssetsIcon, ShieldIcon, PrivacyAppsIcon,
} from '@components/Icons';
import { View, Text } from 'react-native';
import Market from '@screens/MainTabBar/features/Market';
import { styled } from './MainTabBar.styled';

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Market: {
      screen: Market,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <TradeIcon active={focused} />
            {focused && (
              <Text style={[styled.label, { color: tintColor }]}>Markets</Text>
            )}
          </View>
        ),
      },
    },
    Assets: {
      screen: TabAssets,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <AssetsIcon active={focused} />
            {focused && (
              <Text style={[styled.label, { color: tintColor }]}>Wallet</Text>
            )}
          </View>
        ),
      },
    },
    Trade: {
      screen: TabTrade,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <View style={{ height: 24 }}>
              <ShieldIcon active={focused} />
            </View>
            {focused && (
              <Text style={[styled.label, { color: tintColor }]}>Trade</Text>
            )}
          </View>
        ),
      },
    },
    PrivacyApps: {
      screen: TabPrivacyApps,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <View style={{ height: 24 }}>
              <PrivacyAppsIcon active={focused} />
            </View>
            {focused && (
              <Text style={[styled.label, { color: tintColor }]}>Apps</Text>
            )}
          </View>
        ),
      },
    },
    Liquidity: {
      screen: TabHomeLP,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <LiquidityIcon active={focused} />
            {focused && (
              <Text style={[styled.label, { color: tintColor }]}>Earn</Text>
            )}
          </View>
        ),
      },
    },
    More: {
      screen: More,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <MoreIcon active={focused} />
            {focused && (
              <Text style={[styled.label, { color: tintColor }]}>More</Text>
            )}
          </View>
        ),
      },
    }
  },
  {
    initialRouteName: 'Market',
    activeColor: COLORS.colorBlue,
    inactiveColor: COLORS.lightGrey34,
    barStyle: {
      backgroundColor: '#191919',
    },
    shifting: false,
    labeled: false,
  },
);

export default TabNavigator;
