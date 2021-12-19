import React from 'react';
import More from '@screens/MainTabBar/features/More';
import TabAssets from '@screens/MainTabBar/features/Assets';
import TabTrade from '@screens/MainTabBar/features/Trade';
import TabPrivacyApps from '@screens/MainTabBar/features/PrivacyApps';
import {
  MoreIcon,
  TradeIcon,
  AssetsIcon,
  PrivacyAppsIcon,
  ShieldIcon,
  MarketIcon
} from '@components/Icons';
import { View, Text } from 'react-native';
import Market from '@screens/MainTabBar/features/Market';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import styledComp from 'styled-components/native';
import { SafeAreaView } from '@components/core';
import { styled } from './MainTabBar.styled';

const CustomBottomTabBar = styledComp(BottomTabBar)`
  background-color: ${({ theme }) => theme.background2};
  display: flex;
  align-items: center;
`;

const CustomSafeAreaView = styledComp(SafeAreaView)`
  background-color: ${({ theme }) => theme.background2};
`;

const TabBarComponent = (props) => (
  <CustomSafeAreaView>
    <CustomBottomTabBar {...props} />
  </CustomSafeAreaView>
);

const TabNavigator = createBottomTabNavigator(
  {
    Market: {
      screen: Market,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <MarketIcon active={focused} />
            <Text style={[styled.label, { color: tintColor }]}>{focused ? 'Markets' : ''}</Text>
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
            <Text style={[styled.label, { color: tintColor }]}>{focused ? 'Wallet' : ''}</Text>
          </View>
        ),
      },
    },
    Trade: {
      screen: TabTrade,
      navigationOptions: {
        tabBarIcon: () => (
          <View style={styled.centerTab}>
            <TradeIcon />
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
            <Text style={[styled.label, { color: tintColor }]}>{focused ? 'Apps' : ''}</Text>
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
            <Text style={[styled.label, { color: tintColor }]}>{focused ? 'More' : ''}</Text>
          </View>
        ),
      },
    }
  },
  {
    tabBarComponent: (props) => (
      <TabBarComponent {...props} />
    ),
    tabBarOptions: {
      showLabel: false,
      style: {
        borderTopWidth: 0,
        paddingTop: 8,
      },
      shifting: false,
      labeled: false,
      keyboardHidesTabBar: true,
      safeAreaInset: { bottom: 'always', top: 'never' },
      borderWidth: 0
    }
  },
);

export default TabNavigator;
