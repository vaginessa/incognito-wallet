import React from 'react';
import {Row} from '@src/components';
import {homeStyled} from '@screens/MainTabBar/MainTabBar.styled';
import {ChatIcon, QRCodeIcon, SearchThinIcon as SearchIcon} from '@components/Icons';
import SelectAccountButton from '@components/SelectAccountButton';

const Header = React.memo(() => {
  return (
    <Row centerVertical spaceBetween style={homeStyled.header}>
      <Row>
        <SearchIcon style={homeStyled.headerIcon} />
        <ChatIcon style={homeStyled.headerIcon} />
        <QRCodeIcon style={homeStyled.headerIcon}  />
      </Row>
      <SelectAccountButton />
    </Row>
  );
});

export default Header;
