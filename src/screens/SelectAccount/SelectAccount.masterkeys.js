import React, {memo} from 'react';
import {ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {groupMasterKeys} from '@src/redux/selectors/masterKey';
import GroupItem from '@screens/SelectAccount/SelectAccount.groupItem';
import AccountItem from '@screens/SelectAccount/SelectAccount.item';
import {useNavigationParam} from 'react-navigation-hooks';

const MasterKeys = () => {
  const groupAccounts = useSelector(groupMasterKeys);
  const handleSelectedAccount = useNavigationParam('handleSelectedAccount');
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 25 }}>
      {groupAccounts.map((item) => (
        <GroupItem
          name={item.name}
          key={item.name}
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
