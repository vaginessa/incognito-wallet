import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {compose} from 'recompose';
import withFollowToken from '@screens/FollowToken/FollowToken.enhance';
import {useSelector} from 'react-redux';
import {marketTokens} from '@src/redux/selectors/shared';

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
  withMarket,
  withFollowToken,
);
