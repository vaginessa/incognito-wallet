import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import {useDispatch, useSelector} from 'react-redux';
import {switchAccountSelector} from '@src/redux/selectors/account';
import { actionFreeHomePDexV3, actionRefresh } from './Home.actions';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const switching = useSelector(switchAccountSelector);
  const handleOnRefresh = () => {
    dispatch(actionRefresh());
  };
  React.useEffect(() => {
    if (!switching) handleOnRefresh();
    return () => {
      dispatch(actionFreeHomePDexV3());
    };
  }, [switching]);
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleOnRefresh }} />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
);
