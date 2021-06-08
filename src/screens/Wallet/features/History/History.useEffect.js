import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accountSelector, selectedPrivacySelector } from '@src/redux/selectors';
import { ExHandler } from '@src/services/exception';
import { getBalance as getAccountBalance } from '@src/redux/actions/account';
import { actionFetch as actionFetchHistory } from '@src/redux/actions/history';
import { switchAccountSelector } from '@src/redux/selectors/account';
import { walletSelector } from '@src/redux/selectors/wallet';
import { getBalance as getTokenBalance } from '@src/redux/actions/token';

export const useHistoryEffect = () => {
  const wallet = useSelector(walletSelector);
  const account = useSelector(accountSelector.defaultAccountSelector);
  const dispatch = useDispatch();
  const switchAccount = useSelector(switchAccountSelector);
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);

  const handleRefresh = async () => {
    try {
      if (selectedPrivacy.isMainCrypto) {
        await dispatch(getAccountBalance(account));
      } else if (selectedPrivacy.isToken) {
        await dispatch(getTokenBalance(selectedPrivacy.tokenId));
      }
      await dispatch(actionFetchHistory());
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const handleCancelEtaHistory = async (history) => {
    try {
      // const data = await removeHistory({
      //   historyId: history?.id,
      //   currencyType: history?.currencyType,
      //   isDecentralized: history?.decentralized,
      //   signPublicKeyEncode,
      // });
      // if (data) {
      //   Toast.showSuccess('Canceled');
      //   handleLoadHistory(true);
      // }
    } catch (e) {
      new ExHandler(e).showErrorToast();
    }
  };
  React.useEffect(() => {
    if (!switchAccount) {
      handleRefresh();
    }
  }, [selectedPrivacy.tokenId, account.PaymentAddress, wallet, switchAccount]);

  return {
    handleRefresh,
    handleCancelEtaHistory,
  };
};
