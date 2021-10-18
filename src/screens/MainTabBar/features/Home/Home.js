import React, {memo} from 'react';
import {ScrollView, View} from 'react-native';
import {styled} from '@screens/MainTabBar/MainTabBar.styled';
import Header from './Home.header';
import Banner from './Home.banner';
import Category from './Home.category';

const TabHome = () => {
  return (
    <View style={styled.container}>
      <Header />
      <ScrollView style={{ overflow: 'visible' }}>
        <Banner />
        <Category />
      </ScrollView>
    </View>
  );
};

TabHome.propTypes = {};

export default memo(TabHome);
