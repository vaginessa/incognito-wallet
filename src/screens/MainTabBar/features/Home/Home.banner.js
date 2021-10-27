import React from 'react';
import {ScreenWidth} from '@utils/devices';
import {DEFAULT_PADDING, homeStyled} from '@screens/MainTabBar/MainTabBar.styled';
import {View, Image} from 'react-native';
import bannerSrc from '@screens/MainTabBar/features/Home/banner.png';
import Carousel from 'react-native-snap-carousel';

const BANNER_WIDTH = (ScreenWidth - (DEFAULT_PADDING * 2));
const Banner = React.memo(() => {
  const getImageHeight = () => {
    const ratio = 110 / 327;
    return BANNER_WIDTH * ratio;
  };
  const test = [{ image: bannerSrc }, { image: bannerSrc }, { image: bannerSrc }];
  const renderItem = ({ item, index }) => {
    return <Image key={`banner-${index}`} source={item.image} style={{ width: (ScreenWidth - (DEFAULT_PADDING * 2)), height: getImageHeight() }} />;
  };
  return (
    <View style={homeStyled.wrapBanner}>
      <Carousel
        sliderWidth={BANNER_WIDTH}
        sliderHeight={BANNER_WIDTH}
        itemWidth={BANNER_WIDTH}
        data={test}
        renderItem={renderItem}
        lockScrollWhileSnapping
        autoplay
        loop
      />
    </View>
  );
});

export default Banner;
