import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchBox } from '@src/components/Header';
import { useNavigationParam } from 'react-navigation-hooks';
import { flatMap, groupBy } from 'lodash';
import includes from 'lodash/includes';
import { listAllMasterKeyAccounts } from '@src/redux/selectors/masterKey';
import accountService from '@services/wallet/accountService';
import GroupItem from '@screens/SelectAccount/GroupItem';
import AccountItem from '@screens/SelectAccount/AccountItem';
import MainLayout from '@components/MainLayout';
import { ExHandler } from '@src/services/exception';
import { loadAllMasterKeyAccounts } from '@src/redux/actions/masterKey';

const SelectAccount = () => {
  const ignoredAccounts = useNavigationParam('ignoredAccounts') || [];
  const handleSelectedAccount = useNavigationParam('handleSelectedAccount');
  const listAccount = useSelector(listAllMasterKeyAccounts);
  const dispatch = useDispatch();
  const [result, keySearch] = useSearchBox({
    data: listAccount,
    handleFilter: () => [
      ...listAccount.filter(
        (account) =>
          !ignoredAccounts.includes(
            accountService.getAccountName(account).toLowerCase(),
          ) &&
          includes(
            accountService.getAccountName(account).toLowerCase(),
            keySearch,
          ),
      ),
    ],
  });

  const groupAccounts = useMemo(() => {
    if (result && result.length > 0) {
      const groupedMasterKeys = groupBy(result, (item) => item.MasterKeyName);
      return flatMap(groupedMasterKeys, (child, key) => ({
        name: key,
        child,
      }));
    }
    return [];
  }, [result, result.length]);

  const handleLoadAllMasterKeyAccounts = () => {
    try {
      dispatch(loadAllMasterKeyAccounts());
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  React.useEffect(() => {
    handleLoadAllMasterKeyAccounts();
  }, []);

  return (
    <MainLayout header="Search keychains" canSearch scrollable>
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
              handleSelectedAccount={handleSelectedAccount}
            />
          ))}
        />
      ))}
    </MainLayout>
  );
};

export default SelectAccount;
