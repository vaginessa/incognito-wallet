import { View, Text, Clipboard } from 'react-native';
import { compose } from 'recompose';
import { ButtonBasic } from '@src/components/Button';
import {
  ScrollView,
  Toast,
  RefreshControl,
  TouchableOpacity,
} from '@src/components/core';
import { ACCOUNT_CONSTANT } from 'incognito-chain-web-js/build/wallet';
import { actionFetchTx } from '@src/redux/actions/history';
import { historyDetailSelector } from '@src/redux/selectors/history';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { devSelector } from '@src/screens/Dev';
import { CONSTANT_CONFIGS, CONSTANT_KEYS } from '@src/constants';
import { CopyIcon, OpenUrlIcon } from '@src/components/Icons';
import { selectedPrivacySelector } from '@src/redux/selectors';
import { Header } from '@src/components';
import { withLayout_2 } from '@src/components/Layout';
import LinkingService from '@src/services/linking';
import { TX_STATUS_COLOR } from '@src/redux/utils/history';
import { PRV } from '@src/constants/common';
import { styled } from './History.styled';

const Hook = React.memo((props) => {
  const {
    label,
    value,
    valueTextStyle,
    handleOpenUrl,
    openUrl,
    copyable,
    disabled,
    fullText = false,
  } = props || {};
  const handleCopyText = () => {
    Clipboard.setString(value);
    Toast.showInfo('Copied');
  };
  if (disabled) {
    return null;
  }
  return (
    <View style={[styled.rowText, fullText && styled.rowFullText]}>
      <Text style={[styled.labelText]} numberOfLines={1} ellipsizeMode="middle">
        {`${label}:`}
      </Text>
      <View style={[styled.extra]}>
        <Text
          style={[styled.valueText, valueTextStyle]}
          numberOfLines={fullText ? 0 : 1}
          ellipsizeMode="middle"
        >
          {value}
        </Text>
        {copyable && (
          <TouchableOpacity
            style={styled.rowTextTouchable}
            onPress={handleCopyText}
          >
            <CopyIcon style={styled.copyIcon} />
          </TouchableOpacity>
        )}
        {openUrl && (
          <TouchableOpacity
            style={styled.rowTextTouchable}
            onPress={handleOpenUrl}
          >
            <OpenUrlIcon style={styled.linkingIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

const History = (props) => {
  const { tx, fetching } = useSelector(historyDetailSelector);
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const dev = useSelector(devSelector);
  const dispatch = useDispatch();
  const keySave = CONSTANT_KEYS.DEV_TEST_TOGGLE_HISTORY_DETAIL;
  const toggleTxHistoryDetail = global.isDebug() && dev[keySave];
  if (!tx.txId) {
    return null;
  }
  const handleRefresh = () => dispatch(actionFetchTx());
  const onCopyData = () => {
    Clipboard.setString(JSON.stringify(tx));
    Toast.showSuccess('Copied');
  };
  const getFactories = () => {
    const {
      txType,
      txId,
      statusColor,
      amount,
      time,
      timeStr,
      status,
      statusStr,
      txTypeStr
    } = tx;
    switch (txType) {
    case ACCOUNT_CONSTANT.TX_TYPE.RECEIVE: {
      return [
        {
          label: 'TxID',
          value: `#${txId}`,
          copyable: true,
          openUrl: !!txId,
          handleOpenUrl: () =>
            LinkingService.openUrl(
              `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txId}`,
            ),
          disabled: !txId,
        },
        {
          label: 'Receive',
          value: `${tx?.amountStr} ${selectedPrivacy.symbol}`,
          disabled: !amount,
        },
        {
          label: 'Status',
          value: statusStr,
          valueTextStyle: { color: statusColor },
          disabled: !status,
        },
        {
          label: 'Time',
          value: timeStr,
          disabled: !time,
        },
        {
          label: 'Type',
          value: txTypeStr,
          disabled: !txTypeStr,
        },
      ];
    }
    default: {
      const { fee, receiverAddress, memo, txTypeStr } = tx;
      return [
        {
          label: 'TxID',
          value: `#${txId}`,
          copyable: true,
          openUrl: !!txId,
          handleOpenUrl: () =>
            LinkingService.openUrl(
              `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txId}`,
            ),
          disabled: !txId,
        },
        {
          label: 'Send',
          value: `${tx?.amountStr} ${selectedPrivacy.symbol}`,
          disabled: !amount,
        },
        {
          label: 'Fee',
          value: `${tx?.feeStr} ${PRV.symbol}`,
          disabled: !fee,
        },
        {
          label: 'Status',
          value: statusStr,
          valueTextStyle: { color: statusColor },
          disabled: !status,
        },
        {
          label: 'Time',
          value: timeStr,
          disabled: !time,
        },
        {
          label: 'To address',
          value: receiverAddress,
          disabled: !receiverAddress,
          copyable: true,
        },
        {
          label: 'Memo',
          value: memo,
          disabled: !memo,
          copyable: true,
          fullText: true,
        },
        {
          label: 'Type',
          value: txTypeStr,
          disabled: !txTypeStr,
        },
      ];
    }
    }
  };
  let factories = getFactories();
  return (
    <View style={styled.container}>
      <Header title="Transaction detail" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={fetching} onRefresh={handleRefresh} />
        }
      >
        {factories.map((hook, index) => (
          <Hook key={index} {...hook} />
        ))}
        {toggleTxHistoryDetail && (
          <ButtonBasic
            title="Copy"
            btnStyle={{ marginTop: 30 }}
            onPress={onCopyData}
          />
        )}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

History.propTypes = {};

export default compose(withLayout_2)(React.memo(History));
