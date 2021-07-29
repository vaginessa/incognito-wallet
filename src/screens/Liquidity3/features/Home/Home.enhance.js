import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {HEADER_TABS} from '@screens/Liquidity3/Liquidity3.constants';

const enhance = WrappedComp => props => {
  const [selected, setSelected] = React.useState(HEADER_TABS.Home.Portfolio);
  const onChangeHeaderTab = (tab) => setSelected(tab);
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
