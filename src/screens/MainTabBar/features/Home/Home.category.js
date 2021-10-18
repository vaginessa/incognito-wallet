import React, {memo} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import routeNames from '@routers/routeNames';
import srcShield from '@src/assets/images/new-icons/shield.png';
import srcTrade from '@src/assets/images/new-icons/trade.png';
import {Row} from '@src/components';
import {homeStyled} from '@screens/MainTabBar/MainTabBar.styled';
import {CircleArrowIcon} from '@components/Icons';

const MainCategories = [
  {
    route: routeNames.Shield,
    label: routeNames.Shield,
    desc: 'Lorem Ipsum',
    source: srcShield
  },
  {
    route: routeNames.Trade,
    label: routeNames.Trade,
    desc: 'Lorem Ipsum',
    source: srcTrade,
    style: { marginLeft: 8 }
  }
];

const Category = () => {
  const renderMainCategory = (item) => (
    <TouchableOpacity style={[homeStyled.mainCategory, item.style]}>
      <Text style={homeStyled.mediumBlack}>{item.label}</Text>
      <Text style={homeStyled.regularGray}>{item.desc}</Text>
      <Row style={homeStyled.rowImg} spaceBetween>
        <Image source={item.source} style={homeStyled.imgMedium} />
        <CircleArrowIcon />
      </Row>
    </TouchableOpacity>
  );
  return (
    <View>
      <Row>
        {MainCategories.map(renderMainCategory)}
      </Row>
    </View>
  );
};

Category.propTypes = {};

export default memo(Category);
