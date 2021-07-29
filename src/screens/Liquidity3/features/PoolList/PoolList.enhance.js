import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import { actionClearPoolList, actionSearchPoolList } from '@screens/Liquidity3/Liquidity3.actions';
import { debounce } from 'lodash';
import { liquidity3Selector } from '@screens/Liquidity3/Liquidity3.selector';
import { useNavigation } from 'react-navigation-hooks';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { searchPoolText: searchText } = useSelector(liquidity3Selector);
  const onTextSearchChange = React.useCallback(debounce((newText) => {
    dispatch(actionSearchPoolList(newText, false));
  }, 500), [dispatch]);

  const onPullRefresh = () => {
    dispatch(actionSearchPoolList(searchText, true));
  };

  const onItemPress = () => {};

  const onBackPress = () => {
    navigation.goBack();
    dispatch(actionClearPoolList());
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onTextSearchChange,
          onItemPress,
          onPullRefresh,
          onBackPress
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
