import React, {memo} from 'react';
import {ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {groupMasterless} from '@src/redux/selectors/masterKey';
import GroupItem from '@screens/SelectAccount/SelectAccount.groupItem';
import AccountItem from '@screens/SelectAccount/SelectAccount.item';
import {useNavigationParam} from 'react-navigation-hooks';
import {EmptyBookIcon} from '@components/Icons';

const Masterless = () => {
  const groupAccounts = useSelector(groupMasterless);
  const handleSelectedAccount = useNavigationParam('handleSelectedAccount');
  if (!groupAccounts || groupAccounts.length === 0) return <EmptyBookIcon message="Your masterless is empty" />;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 25 }}>
      {groupAccounts.map((item, index) => (
        <GroupItem
          name={item.name}
          key={item.name}
          isLast={index === (groupAccounts.length - 1)}
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

Masterless.propTypes = {};

export default memo(Masterless);
