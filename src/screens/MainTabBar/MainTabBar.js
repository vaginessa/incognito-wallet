import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { COLORS } from '@src/styles';
import TabHome from '@screens/MainTabBar/features/Home';
import TabShield from '@screens/MainTabBar/features/Shield';
import TabAssets from '@screens/MainTabBar/features/Assets';
import TabTrade from '@screens/MainTabBar/features/Trade';
import TabHomeLP from '@screens/MainTabBar/features/HomeLP';
import {
  HomeIcon,
  ShieldIcon,
  TradeIcon,
  LiquidityIcon,
  AssetsIcon,
} from '@components/Icons';
import { View, Text } from 'react-native';
import { styled } from './MainTabBar.styled';

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: TabHome,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <HomeIcon active={focused} />
            <Text style={[styled.label, { color: tintColor }]}>Home</Text>
          </View>
        ),
      },
    },
    Shield: {
      screen: TabShield,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <View style={styled.wrapBar}>
            <ShieldIcon active={focused} />
            <Text style={[styled.label, { color: tintColor }]}>Shield</Text>
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
              <TradeIcon active={focused} />
            </View>
            <Text style={[styled.label, { color: tintColor }]}>Trade</Text>
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
            <Text style={[styled.label, { color: tintColor }]}>Liquidity</Text>
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
            <Text style={[styled.label, { color: tintColor }]}>Assets</Text>
          </View>
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
      backgroundColor: COLORS.white,
    },
    shifting: false,
    labeled: false,
  },
);

export default TabNavigator;
