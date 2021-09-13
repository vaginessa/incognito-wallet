import React, {memo} from 'react';
import {ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {useNavigationParam} from 'react-navigation-hooks';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header} from '@src/components';
import {STAKING_MESSAGES} from '@screens/PDexV3/features/Staking/Staking.constant';
import linkingService from '@services/linking';
import {CONSTANT_CONFIGS} from '@src/constants';
import {Hook} from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail';
import styles from '@screens/PoolV2/History/HistoryDetail/style';
import {Text} from '@components/core';

const HistoryDetail = () => {
  const { requestTx, respondTx, typeStr, amountSymbolStr, statusStr, nftId, timeStr } = useNavigationParam('data');
  const test = useNavigationParam('data');
  console.log('test', test);
  const handleOpenLink = (txID) => {
    if (!txID) return;
    linkingService.openUrl(`${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txID}`,);
  };
  const historyFactories = [
    {
      label: 'TxID',
      valueText: requestTx,
      copyable: true,
      openUrl: true,
      handleOpenLink: () => {
        handleOpenLink(requestTx);
      }
    },
    {
      label: 'RespondTx',
      valueText: respondTx,
      copyable: true,
      openUrl: true,
      disabled: !respondTx,
      handleOpenLink: () => {
        handleOpenLink(respondTx);
      }
    },
    {
      label: 'Status',
      valueText: statusStr,
    },
    {
      label: 'NFTID',
      valueText: nftId,
    },
    {
      label: 'NFTID',
      valueText: nftId,
    },
    {
      label: 'Time',
      valueText: timeStr,
    },
  ];
  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.history} />
      <View style={styles.historyItem}>
        <Text style={styles.buttonTitle}>{typeStr}</Text>
        <Text style={styles.content}>{amountSymbolStr}</Text>
      </View>
      {historyFactories.map(data => <Hook key={data?.label} {...data} />)}
    </View>
  );
};

HistoryDetail.propTypes = {};


export default memo(HistoryDetail);
