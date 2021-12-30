import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {compose} from 'recompose';
import withFollowToken from '@screens/FollowToken/FollowToken.enhance';
import {useSelector} from 'react-redux';
import {marketTokens} from '@src/redux/selectors/shared';
import withHome from '@screens/MainTabBar/features/Home/Home.enhance';
import withPin from '@components/pin.enhance';

const withMarket = WrappedComp => props => {
  const [filter, setFilter] = React.useState({
    filterField: 'change',
    orderField: 'desc'
  });
  const availableTokens = useSelector(marketTokens);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          ...filter,
          availableTokens,
          onFilter: setFilter,
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  withHome,
  withMarket,
  withPin,
  withFollowToken,
);
