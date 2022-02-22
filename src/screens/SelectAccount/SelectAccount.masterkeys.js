import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { RefreshControl } from '@src/components/core';
import {
  groupMasterKeys,
  isLoadingAllMasterKeyAccountSelector,
} from '@src/redux/selectors/masterKey';
import GroupItem from '@screens/SelectAccount/SelectAccount.groupItem';
import AccountItem from '@screens/SelectAccount/SelectAccount.item';
import { loadAllMasterKeyAccounts } from '@src/redux/actions/masterKey';
import { useNavigationParam } from 'react-navigation-hooks';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';

const MasterKeys = () => {
  const groupAccounts = useDebounceSelector(groupMasterKeys);
  const loading = useDebounceSelector(isLoadingAllMasterKeyAccountSelector);
  const handleSelectedAccount = useNavigationParam('handleSelectedAccount');
  const dispatch = useDispatch();
  const handleLoadAllMasterKeyAccounts = React.useCallback(() =>
    dispatch(loadAllMasterKeyAccounts()), []);
  const renderItem = React.useCallback((account) => (
    <AccountItem
      key={account?.ValidatorKey}
      accountName={account.AccountName}
      PaymentAddress={account.PaymentAddress}
      PrivateKey={account.PrivateKey}
      MasterKeyName={account.MasterKeyName}
      handleSelectedAccount={handleSelectedAccount}
    />
  ), []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={(
        <RefreshControl
          refreshing={loading}
          onRefresh={handleLoadAllMasterKeyAccounts}
        />
      )}
      contentContainerStyle={{ paddingHorizontal: 25 }}
    >
      {groupAccounts.map((item, index) => (
        <GroupItem
          name={item.name}
          key={item.name}
          isLast={index === groupAccounts.length - 1}
          child={item.child.map(renderItem)}
        />
      ))}
    </ScrollView>
  );
};

MasterKeys.propTypes = {};

export default memo(MasterKeys);
