import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import {
  defaultAccountSelector,
  listAccountSelector,
} from '@src/redux/selectors/account';
import PropTypes from 'prop-types';
import Swipeout from 'react-native-swipeout';
import { Row } from '@src/components';
import { ArrowRightGreyIcon, CheckBoxIcon } from '@components/Icons';
import { isNodeAccount } from '@screens/Setting/features/Keychain/Keychain.ultil';
import { settingSelector } from '@screens/Setting';
import { DeleteFillIcon } from '@components/Icons/icon.delete';
import withKeychain from './Keychain.enhance';
import { itemStyled } from './keychain.styled';

const Item = React.memo(
  ({ account, handleDelete, handleSwitchAccount, handleExportKey }) => {
    const defaultAccount = useSelector(defaultAccountSelector);
    const isActive = React.useMemo(
      () => account?.paymentAddress === defaultAccount?.paymentAddress,
      [account?.paymentAddress, defaultAccount?.paymentAddress],
    );
    return (
      <Swipeout
        style={[itemStyled.wrap, itemStyled.shadow]}
        right={[
          ...(handleDelete
            ? [
              {
                component: (
                  <View style={itemStyled.wrapBin}>
                    <DeleteFillIcon />
                  </View>
                ),
                backgroundColor: 'transparent',
                onPress: () => handleDelete(account),
              },
            ]
            : []),
        ]}
      >
        <TouchableOpacity
          style={itemStyled.wrapContent}
          onPress={() => handleExportKey(account)}
        >
          <Row centerVertical spaceBetween>
            <Row centerVertical>
              <TouchableOpacity
                style={{ paddingRight: 16 }}
                onPress={() => handleSwitchAccount(account)}
              >
                <CheckBoxIcon active={isActive} />
              </TouchableOpacity>
              <Text style={itemStyled.mediumBlack}>{account.name}</Text>
            </Row>
            <ArrowRightGreyIcon style={itemStyled.arrow} />
          </Row>
          <Text
            style={itemStyled.mediumGrey}
            ellipsizeMode="middle"
            numberOfLines={1}
          >
            {account.paymentAddress}
          </Text>
        </TouchableOpacity>
      </Swipeout>
    );
  },
);

const Accounts = ({ handleDelete, handleSwitchAccount, handleExportKey }) => {
  const listAccount = useSelector(listAccountSelector);
  const { devices } = useSelector(settingSelector);
  const renderItem = (account) => {
    const isDeletable =
      listAccount.length > 1 && !isNodeAccount(account?.accountName, devices);
    return (
      <Item
        account={account}
        key={account.ValidatorKey}
        handleDelete={isDeletable && handleDelete}
        handleSwitchAccount={handleSwitchAccount}
        handleExportKey={handleExportKey}
      />
    );
  };
  return <>{listAccount.map(renderItem)}</>;
};

Item.propTypes = {
  account: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleSwitchAccount: PropTypes.func.isRequired,
  handleExportKey: PropTypes.func.isRequired,
};

Accounts.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  handleSwitchAccount: PropTypes.func.isRequired,
  handleExportKey: PropTypes.func.isRequired,
};

export default withKeychain(memo(Accounts));
