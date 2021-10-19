import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { LoadingContainer } from '@src/components/core';
import Welcome from '@screens/GetStarted/Welcome';
import { initialMasterKeySelector } from '@src/redux/selectors/masterKey';
import { actionLoadInitial } from '@src/redux/actions/masterKey';

import { useDispatch, useSelector } from 'react-redux';

const enhance = (WrappedComp) => (props) => {
  const { loading, masterKeyList } = useSelector(initialMasterKeySelector);
  const dispatch = useDispatch();
  const handleFetchData = () => dispatch(actionLoadInitial());
  React.useEffect(() => {
    handleFetchData();
  }, []);
  if (loading) {
    return <LoadingContainer />;
  }
  if (masterKeyList.length === 0 || !masterKeyList) {
    return <Welcome />;
  }
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
