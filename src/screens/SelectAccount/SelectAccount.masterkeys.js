import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshControl } from '@src/components/core';
import {
  groupMasterKeys,
  isLoadingAllMasterKeyAccountSelector,
} from '@src/redux/selectors/masterKey';
import GroupItem from '@screens/SelectAccount/SelectAccount.groupItem';
import AccountItem from '@screens/SelectAccount/SelectAccount.item';
import { loadAllMasterKeyAccounts } from '@src/redux/actions/masterKey';
import { useNavigationParam } from 'react-navigation-hooks';

const MasterKeys = () => {
  const groupAccounts = useSelector(groupMasterKeys);
  const loading = useSelector(isLoadingAllMasterKeyAccountSelector);
  const handleSelectedAccount = useNavigationParam('handleSelectedAccount');
  const dispatch = useDispatch();
  const handleLoadAllMasterKeyAccounts = () =>
    dispatch(loadAllMasterKeyAccounts());
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
      {groupAccounts.map((item, index) => (
        <GroupItem
          name={item.name}
          key={item.name}
          isLast={index === groupAccounts.length - 1}
          child={item.child.map((account) => (
            <AccountItem
              key={account?.ValidatorKey}
              accountName={account.AccountName}
              PaymentAddress={account.PaymentAddress}
              PrivateKey={account.PrivateKey}
              MasterKeyName={account.MasterKeyName}
              handleSelectedAccount={handleSelectedAccount}
            />
          ))}
        />
      ))}
    </ScrollView>
  );
};

MasterKeys.propTypes = {};

export default memo(MasterKeys);
