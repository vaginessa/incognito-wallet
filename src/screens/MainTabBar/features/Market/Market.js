import React from 'react';
import PropTypes from 'prop-types';
import Header from '@screens/MainTabBar/features/Market/Market.header';
import {TokenFollow} from '@components/Token';
import MarketList from '@components/Token/Token.marketList';
import withMarket from '@screens/MainTabBar/features/Market/Market.enhance';

const Market = React.memo((props) => {
  const { handleToggleFollowToken, keySearch, onFilter, ...rest } = props;

  return (
    <>
      <Header onFilter={onFilter} />
      <MarketList
        keySearch={keySearch}
        {...rest}
        renderItem={(item) => (
          <TokenFollow
            item={item}
            key={item.tokenId}
            hideStar={!keySearch}
            handleToggleFollowToken={handleToggleFollowToken}
          />
        )}
      />
    </>
  );
});

Market.propTypes = {
  handleToggleFollowToken: PropTypes.func.isRequired,
  keySearch: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired
};

export default withMarket(Market);
