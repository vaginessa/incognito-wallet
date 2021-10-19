import React from 'react';
import {Row} from '@src/components';
import {homeStyled} from '@screens/MainTabBar/MainTabBar.styled';
import {ChatIcon, QRCodeIcon, SearchThinIcon as SearchIcon} from '@components/Icons';
import SelectAccountButton from '@components/SelectAccountButton';
import {useDispatch} from 'react-redux';
import {actionToggleModal} from '@components/Modal';
import AddressModal from '@screens/MainTabBar/features/Home/Home.qrCode';

const Header = React.memo(() => {
  const dispatch = useDispatch();
  return (
    <Row centerVertical spaceBetween style={homeStyled.header}>
      <Row>
        <SearchIcon style={homeStyled.headerIcon} />
        <ChatIcon style={homeStyled.headerIcon} />
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
