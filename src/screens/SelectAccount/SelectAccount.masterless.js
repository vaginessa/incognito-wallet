import React, {memo} from 'react';
import {ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {groupMasterless} from '@src/redux/selectors/masterKey';
import GroupItem from '@screens/SelectAccount/GroupItem';
import AccountItem from '@screens/SelectAccount/SelectAccount.item';

const Masterless = () => {
  const groupAccounts = useSelector(groupMasterless);
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

Masterless.propTypes = {};

export default memo(Masterless);
