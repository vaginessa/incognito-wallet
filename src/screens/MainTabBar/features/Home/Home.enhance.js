import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { ExHandler } from '@src/services/exception';
import { compose } from 'recompose';
import { useDispatch } from 'react-redux';
import { getInternalTokenList, getPTokenList } from '@src/redux/actions/token';
import withFCM from '@screens/Notification/Notification.withFCM';
import Modal from '@src/components/Modal';
import AppUpdater from '@src/components/AppUpdater';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const fetchData = async () => {
    try {
      dispatch(getPTokenList());
      dispatch(getInternalTokenList());
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
      <Modal />
      <AppUpdater />
    </ErrorBoundary>
  );
};

export default compose(
  withFCM,
  enhance,
);
