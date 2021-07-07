import {
  Alert,
  Text,
  Toast,
  TouchableOpacity,
  View,
} from '@src/components/core';
import { removeAccount, actionSwitchAccount } from '@src/redux/actions/account';
import { accountSelector } from '@src/redux/selectors';
import ROUTE_NAMES from '@src/router/routeNames';
import { ExHandler } from '@src/services/exception';
import { COLORS } from '@src/styles';
import { onClickView } from '@src/utils/ViewUtil';
import PropTypes from 'prop-types';
import React from 'react';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import { BtnExport } from '@src/components/Button';
import Section, { sectionStyle } from '@screens/Setting/features/Section';
import { accountSection } from './AccountSection.styled';

const Item = React.memo((props) => {
  const {
    account,
    onSwitch,
    onExport,
    onDelete,
    isActive,
    lastChild = false,
    removeTitle = 'Remove',
  } = props;

  return (
    <Swipeout
      style={accountSection.swipeoutButton}
      right={[
        ...(onDelete
          ? [
            {
              text: removeTitle,
              backgroundColor: COLORS.red,
              onPress: () => onDelete(account),
            },
          ]
          : []),
      ]}
    >
      <View
        style={[
          sectionStyle.subItem,
          accountSection.subItem,
          lastChild && accountSection.lastSubItem,
        ]}
      >
        <TouchableOpacity
          style={accountSection.name}
          onPress={() => onSwitch(account)}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="middle"
            style={[
              sectionStyle.desc,
              { marginTop: 0 },
              isActive && accountSection.nameTextActive,
            ]}
          >
            {account?.name}
          </Text>
        </TouchableOpacity>
        <BtnExport onPress={() => onExport(account)} />
      </View>
    </Swipeout>
  );
});

const AccountSection = ({
  defaultAccount,
  listAccount,
  removeAccount,
  switchAccount,
  label,
}) => {
  const navigation = useNavigation();
  const [removing, setRemove] = React.useState(false);
  const onHandleSwitchAccount = onClickView(async (account) => {
    try {
      if (defaultAccount?.name === account?.name) {
        Toast.showInfo(`Your current keychain is "${account?.name}"`);
        return;
      }
      await switchAccount(account?.name);
    } catch (e) {
      new ExHandler(
        e,
        `Can not switch to keychain "${account?.name}", please try again.`,
      ).showErrorToast();
    }
  });

  const handleExportKey = (account) => {
    navigation.navigate(ROUTE_NAMES.ExportAccount, { account });
  };

  const handleDelete = async (account) => {
    Alert.alert(
      `Delete keychain "${account?.name}"?`,
      'Add it again using its private key or associated master key.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK, delete it',
          onPress: async () => {
            try {
              await setRemove(true);
              await removeAccount(account);
              Toast.showSuccess('Keychain removed.');
            } catch (e) {
              new ExHandler(
                e,
                `Can not delete keychain ${account?.name}, please try again.`,
              ).showErrorToast();
            } finally {
              await setRemove(false);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const isDeletable = listAccount.length > 1;

  return (
    <Section
      label={label}
      labelStyle={accountSection.labelStyle}
      customItems={listAccount?.map((account, index) => (
        <View key={account?.PaymentAddress} style={accountSection.itemWrapper}>
          {account?.name && (
            <Item
              {...{
                account,
                onSwitch: onHandleSwitchAccount,
                onExport: handleExportKey,
                onDelete: isDeletable && handleDelete,
                isActive: account?.name === defaultAccount?.name,
                lastChild: listAccount?.length - 1 === index,
                removeTitle: `Remove${removing ? '...' : ''}`,
              }}
            />
          )}
        </View>
      ))}
    />
  );
};

AccountSection.propTypes = {
  defaultAccount: PropTypes.object.isRequired,
  listAccount: PropTypes.arrayOf(PropTypes.object).isRequired,
  switchAccount: PropTypes.func.isRequired,
  removeAccount: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

const mapState = (state) => ({
  defaultAccount: accountSelector.defaultAccount(state),
  listAccount: accountSelector.listAccount(state),
});

const mapDispatch = { removeAccount, switchAccount: actionSwitchAccount };

export default connect(
  mapState,
  mapDispatch,
)(AccountSection);
