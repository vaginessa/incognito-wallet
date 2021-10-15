import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import uniqBy from 'lodash/uniqBy';
import { LoadingContainer } from '@src/components/core';
import LocalDatabase from '@utils/LocalDatabase';
import Welcome from '@screens/GetStarted/Welcome';

const enhance = (WrappedComp) => (props) => {
  const [loading, setLoading] = React.useState(false);
  const [masterKeyList, setMasterKeyList] = React.useState([]);
  const loadMasterKey = async () => {
    let list = [];
    try {
      await setLoading(true);
      list = uniqBy(
        await LocalDatabase.getMasterKeyList(),
        (item) => item.name,
      );
      await setMasterKeyList(list);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    loadMasterKey();
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
