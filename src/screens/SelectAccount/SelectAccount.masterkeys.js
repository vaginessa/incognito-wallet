import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshControl } from '@src/components/core';
import {
  groupMasterKeys,
  isLoadingAllMasterKeyAccountSelector,
} from '@src/redux/selectors/masterKey';
import GroupItem from '@screens/SelectAccount/GroupItem';
import AccountItem from '@screens/SelectAccount/SelectAccount.item';
import { loadAllMasterKeyAccounts } from '@src/redux/actions/masterKey';

const MasterKeys = () => {
  const groupAccounts = useSelector(groupMasterKeys);
  const loading = useSelector(isLoadingAllMasterKeyAccountSelector);
  const dispatch = useDispatch();
  const handleLoadAllMasterKeyAccounts = () =>
    dispatch(loadAllMasterKeyAccounts());
  React.useEffect(() => {
    handleLoadAllMasterKeyAccounts();
  }, []);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={handleLoadAllMasterKeyAccounts}
        />
      }
      contentContainerStyle={{ paddingHorizontal: 25 }}
    >
      {groupAccounts.map((item) => (
        <GroupItem
          name={item.name}
          key={item.name}
          child={item.child.map((account) => (
            <AccountItem
              key={account?.FullName}
              accountName={account.AccountName}
              PaymentAddress={account.PaymentAddress}
              PrivateKey={account.PrivateKey}
              MasterKeyName={account.MasterKeyName}
            />
          ))}
        />
      ))}
    </ScrollView>
  );
};

MasterKeys.propTypes = {};

export default memo(MasterKeys);
