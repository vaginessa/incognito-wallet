import React from 'react';
import PropTypes from 'prop-types';
import Header from '@screens/MainTabBar/features/Market/Market.header';
import {TokenFollow} from '@components/Token';
import withFollowToken from '@screens/FollowToken/FollowToken.enhance';
import MarketList from '@components/Token/Token.marketList';

const Market = React.memo((props) => {
  const { handleToggleFollowToken, keySearch, ...rest } = props;

  return (
    <>
      <Header />
      <MarketList
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
  handleToggleFollowToken: PropTypes.func.isRequired
};

export default withFollowToken(Market);
