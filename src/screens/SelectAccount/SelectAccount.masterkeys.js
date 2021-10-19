import React, {memo} from 'react';
import {ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {groupMasterKeys} from '@src/redux/selectors/masterKey';
import GroupItem from '@screens/SelectAccount/GroupItem';
import AccountItem from '@screens/SelectAccount/SelectAccount.item';

const MasterKeys = () => {
  const groupAccounts = useSelector(groupMasterKeys);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 25 }}>
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
