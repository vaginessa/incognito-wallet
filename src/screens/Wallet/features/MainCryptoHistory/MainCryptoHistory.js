import React from 'react';
import HistoryList from '@src/screens/Wallet/features/HistoryList';
import { historyTxsSelector } from '@src/redux/selectors/history';
import { useHistoryEffect } from '@src/screens/Wallet/features/History';
import { useSelector } from 'react-redux';
import EmptyHistory from './MainCryptoHistory.empty';

const MainCryptoHistory = () => {
  const { histories, isEmpty, isFetching, refreshing, oversize } = useSelector(
    historyTxsSelector,
  );
  const { handleRefresh } = useHistoryEffect();
  return (
    <HistoryList
      histories={histories}
      onRefreshHistoryList={handleRefresh}
      refreshing={refreshing}
      loading={isFetching}
      renderEmpty={() => <EmptyHistory />}
      showEmpty={isEmpty}
      oversize={oversize}
    />
  );
};

MainCryptoHistory.propTypes = {};

export default MainCryptoHistory;
