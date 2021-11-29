import React from 'react';
import { InteractionManager, View, StyleSheet } from 'react-native';
import { Header, LoadingContainer } from '@src/components';
import { COLORS } from '@src/styles';

const withLazy = (WrappedComp) => (props) => {
  const { shouldLazy = true } = props;
  if (!shouldLazy) {
    return (
      <WrappedComp
        {...{
          ...props,
        }}
      />
    );
  }
  const [hidden, setHidden] = React.useState(true);
  const EmptyView = React.useMemo(
    () => (
      <View style={styled.container}>
        <Header hideBackButton style={styled.header} />
        <LoadingContainer />
      </View>
    ),
    [],
  );

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        setHidden(false);
      }, 200);
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

const styled = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    marginHorizontal: 25,
  },
});

export default withLazy;
