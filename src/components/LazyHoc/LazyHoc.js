import React from 'react';
import { InteractionManager } from 'react-native';
import {Header, LoadingContainer} from '@src/components';

const withLazy = WrappedComp => props => {
  const [hidden, setHidden] = React.useState(true);

  const EmptyView = React.useMemo(() => (
    <>
      <Header style={{ marginHorizontal: 25 }} />
      <LoadingContainer />
    </>
  ), []);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        setHidden(false);
      }, 300);
    });
  }, []);

  if (hidden) return EmptyView;
  return (
    <WrappedComp
      {...{
        ...props,
      }}
    />
  );
};

export default withLazy;
