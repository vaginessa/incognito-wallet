import React, {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import routeNames from '@routers/routeNames';
import {Row} from '@src/components';
import {homeStyled} from '@screens/MainTabBar/MainTabBar.styled';
import {
  CircleArrowIcon,
  ShieldIcon,
  TradeIcon,
  StakeIcon,
  ExplorerIcon,
  FaucetIcon,
  MintIcon,
  KeyChainIcon, PowerIcon, ProvideIcon
} from '@components/Icons';

const MainCategories = [
  {
    route: routeNames.Shield,
    label: routeNames.Shield,
    desc: 'Lorem Ipsum',
    icon: ShieldIcon,
  },
  {
    route: routeNames.Trade,
    label: routeNames.Trade,
    desc: 'Lorem Ipsum',
    style: { marginLeft: 8 },
    icon: TradeIcon,
  }
];

const Categories = [
  [
    {
      route: routeNames.Staking,
      label: routeNames.Staking,
      icon: StakeIcon,
    },
    {
      route: routeNames.PoolV2,
      label: 'Provide',
      icon: ProvideIcon,
    },
    {
      route: routeNames.Node,
      label: routeNames.Node,
      icon: PowerIcon,
    },
    {
      route: routeNames.Keychain,
      label: routeNames.Keychain,
      icon: KeyChainIcon,
    }
  ],
  [
    {
      route: routeNames.MintNFTToken,
      label: 'Mint',
      icon: MintIcon,
    },
    {
      route: routeNames.WebView,
      label: 'Faucet',
      icon: FaucetIcon,
    },
    {
      route: routeNames.Staking,
      label: 'Explorer',
      icon: ExplorerIcon,
    },
    {
      route: routeNames.Trade,
      label: routeNames.Trade,
      icon: ExplorerIcon,
    }
  ]
];

const Category = () => {
  const renderMainCategory = (item) => {
    const Icon = item.icon;
    return (
      <TouchableOpacity style={[homeStyled.mainCategory, homeStyled.shadow, item.style]}>
        <Text style={homeStyled.mediumBlack}>{item.label}</Text>
        <Text style={homeStyled.regularGray}>{item.desc}</Text>
        <Row style={homeStyled.rowImg} spaceBetween>
          <Icon size={41} active />
          <CircleArrowIcon />
        </Row>
      </TouchableOpacity>
    );
  };
  const renderCategory = (item) => {
    const Icon = item.icon;
    return (
      <TouchableOpacity style={homeStyled.category}>
        <View style={{ height: 32 }}>
          <Icon />
        </View>
        <Text style={homeStyled.regularBlack}>{item.label}</Text>
      </TouchableOpacity>
    );
  };
  const renderSections = (categories, index) => (
    <Row style={[index !== 0 && homeStyled.paddingTopCategory]}>
      {categories.map(renderCategory)}
    </Row>
  );
  return (
    <View>
      <Row>
        {MainCategories.map(renderMainCategory)}
      </Row>
      <View style={[homeStyled.shadow, homeStyled.wrapCategory]}>
        {Categories.map(renderSections)}
      </View>
    </View>
  );
};

Category.propTypes = {};

export default memo(Category);
