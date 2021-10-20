import React from 'react';
import {ScreenWidth} from '@utils/devices';
import {DEFAULT_PADDING, homeStyled} from '@screens/MainTabBar/MainTabBar.styled';
import {Image, View} from 'react-native';
import bannerSrc from '@screens/MainTabBar/features/Home/banner.png';

const Banner = React.memo(() => {
  const getImageHeight = () => {
    const ratio = 110 / 327;
    return (ScreenWidth - (DEFAULT_PADDING * 2)) * ratio;
  };
  return (
    <View style={homeStyled.wrapBanner}>
      <Image source={bannerSrc} style={{ width: '100%', height: getImageHeight() }} />
    </View>
  );
});

export default Banner;
