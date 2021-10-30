import React from 'react';
import { InteractionManager } from 'react-native';

const withLazy = WrappedComp => props => {
  const [hidden, setHidden] = React.useState(true);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setHidden(false);
    });
  }, []);

  if (hidden) return null;
  return (
    <WrappedComp
      {...{
        ...props,
      }}
    />
  );
};

export default withLazy;
