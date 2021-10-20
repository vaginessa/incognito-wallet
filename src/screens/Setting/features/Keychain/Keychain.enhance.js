import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch } from 'react-redux';
import { actionFetchDevices } from '@screens/Setting/Setting.actions';
import { ExHandler } from '@src/services/exception';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const handleFetchData = async () => {
    try {
      //
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      dispatch(actionFetchDevices());
    }
  };
  React.useEffect(() => {
    handleFetchData();
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
