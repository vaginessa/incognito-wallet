import React from 'react';
import {Row} from '@src/components';
import {homeStyled} from '@screens/MainTabBar/MainTabBar.styled';
import {ChatIcon, QRCodeIcon, SearchThinIcon as SearchIcon} from '@components/Icons';
import SelectAccountButton from '@components/SelectAccountButton';
import {batch, useDispatch, useSelector} from 'react-redux';
import {actionToggleModal} from '@components/Modal';
import AddressModal from '@screens/MainTabBar/features/Home/Home.qrCode';
import {newsSelector} from '@screens/News';
import routeNames from '@routers/routeNames';
import {useNavigation} from 'react-navigation-hooks';
import {View} from '@components/core';
import {actionChangeTab} from '@components/core/Tabs/Tabs.actions';
import {ROOT_TAB_TRADE, TAB_MARKET_ID} from '@screens/PDexV3/features/Trade/Trade.constant';

const Bulletin = React.memo(() => {
  const navigation = useNavigation();
  const { isReadAll } = useSelector(newsSelector);
  const handleNavNotification = () => navigation.navigate(routeNames.News, {'lastNewsID': isReadAll});
  return (
    <View>
      <ChatIcon style={homeStyled.headerIcon} onPress={handleNavNotification} />
      {isReadAll !== 0 && (
        <View style={homeStyled.notify} />
      )}
    </View>
  );
});

const Header = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <Row centerVertical spaceBetween style={homeStyled.header}>
      <Row>
        <SearchIcon
          style={homeStyled.headerIcon}
          onPress={() => {
            batch(() => {
              dispatch(
                actionChangeTab({
                  rootTabID: ROOT_TAB_TRADE,
                  tabID: TAB_MARKET_ID,
                }),
              );
              navigation.navigate(routeNames.Trade);
            });
          }}
        />
        <Bulletin  />
        <QRCodeIcon
          style={homeStyled.headerIcon}
          onPress={() => dispatch(actionToggleModal({
            data: (<AddressModal />),
            visible: true,
            shouldCloseModalWhenTapOverlay: true
          }))}
        />
      </Row>
      <SelectAccountButton />
    </Row>
  );
});

export default Header;
