import React from 'react';
import { View } from 'react-native';
import { Header } from '@src/components';
import { HEADER_TABS, HEADER_TITLES } from '@screens/Liquidity3/Liquidity3.constants';
import { compose } from 'recompose';
import styled from '@screens/Liquidity3/features/Home/Home.styled';
import { HeaderTab } from '@screens/Liquidity3/components';
import FavoritePool from '@screens/Liquidity3/features/FavoritePool/FavoritePool';
import enhance from '@screens/Liquidity3/features/Home/Home.enhance';
import PropTypes from 'prop-types';
import Portfolio from '@screens/Liquidity3/features/Portfolio/Portfolio';

const Home = React.memo(({ selected, onChangeHeaderTab }) => {

  const renderContent = () => {
    if (selected === HEADER_TABS.Home.Pool) return <FavoritePool />;
    return <Portfolio />;
  };

  return (
    <View style={styled.container}>
      <Header title={HEADER_TITLES.Market} />
      <HeaderTab
        tabs={HEADER_TABS.Home}
        selected={selected}
        onChangeTab={onChangeHeaderTab}
      />
      {renderContent()}
    </View>
  );
});

Home.propTypes = {
  selected: PropTypes.string.isRequired,
  onChangeHeaderTab: PropTypes.func.isRequired
};

export default compose(
  enhance
)(Home);
