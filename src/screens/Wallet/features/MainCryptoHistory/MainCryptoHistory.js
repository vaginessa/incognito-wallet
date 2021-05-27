import React, { memo } from 'react';
import HistoryList from '@src/screens/Wallet/features/HistoryList';
import { useDispatch, useSelector } from 'react-redux';
import { accountSelector, selectedPrivacySelector } from '@src/redux/selectors';
import { ExHandler } from '@src/services/exception';
import { getBalance as getAccountBalance } from '@src/redux/actions/account';
import { historyTxsSelector } from '@src/redux/selectors/history';
import { actionFetch as actionFetchHistory } from '@src/redux/actions/history';
import { switchAccountSelector } from '@src/redux/selectors/account';
import { walletSelector } from '@src/redux/selectors/wallet';
import withMainCryptoHistory from './MainCryptoHistory.enhance';
import EmptyHistory from './MainCryptoHistory.empty';

const MainCryptoHistory = () => {
  const wallet = useSelector(walletSelector);
  const account = useSelector(accountSelector.defaultAccountSelector);
  const dispatch = useDispatch();
  const switchAccount = useSelector(switchAccountSelector);
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const { histories, isEmpty, isFetching, refreshing, oversize } = useSelector(
    historyTxsSelector,
  );
  const handleRefresh = () => {
    try {
      dispatch(getAccountBalance(account));
      dispatch(actionFetchHistory());
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  React.useEffect(() => {
    if (!switchAccount) {
      handleRefresh();
    }
  }, [selectedPrivacy.tokenId, account.PaymentAddress, wallet, switchAccount]);
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

export default withMainCryptoHistory(memo(MainCryptoHistory));
