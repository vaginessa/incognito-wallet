import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {HEADER_TABS} from '@screens/Liquidity3/Liquidity3.constants';
import {batch, useDispatch} from 'react-redux';
import {actionGetFavoritePool, actionGetPortfolio} from '@screens/Liquidity3/Liquidity3.actions';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const [selected, setSelected] = React.useState(HEADER_TABS.Home.Portfolio);
  const onChangeHeaderTab = (tab) => setSelected(tab);

  const handleLoadData = () => {
    batch(() => {
      dispatch(actionGetFavoritePool());
      dispatch(actionGetPortfolio());
    });
  };

  React.useEffect(() => {
    handleLoadData();
  }, []);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          selected,
          onChangeHeaderTab
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
