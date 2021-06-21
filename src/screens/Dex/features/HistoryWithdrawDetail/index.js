import React from 'react';
import { ScrollView, View } from 'react-native';
import PropTypes from 'prop-types';
import withHistory from '@screens/Dex/features/HistoryContributeDetail/enhance';
import {Header} from '@src/components';
import { Hook } from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail';
import { HEADER_TABS } from '@screens/Dex/Liquidity.constants';
import { useSelector } from 'react-redux';
import { selectedPrivacySelector } from '@src/redux/selectors';
import formatUtil from '@utils/format';

const HistoryWithdrawDetail = React.memo(({ history, historyTab }) => {
  const getPrivacyDataByTokenID = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID);
  const renderWithdrawHistories = () => {
    const { tokenId1, tokenId2, amount1, amount2, responseTx1, responseTx2, statusText, requestTx } = history;
    const token1 = getPrivacyDataByTokenID(tokenId1);
    const token2 = getPrivacyDataByTokenID(tokenId2);
    const historyFactories = [
      {
        label: 'TxID',
        valueText: requestTx,
        copyable: true,
        openUrl: true,
      },
      {
        label: 'ResponseTx1',
        valueText: responseTx1,
        copyable: true,
        openUrl: true,
        disabled: !responseTx1
      },
      {
        label: 'Amount1',
        valueText: `${formatUtil.amountFull(amount1, token1.pDecimals)} ${token1.symbol}`,
        disabled: !amount1
      },
      {
        label: 'Status',
        valueText: statusText,
      },
      {
        label: 'ResponseTx2',
        valueText: responseTx2,
        copyable: true,
        openUrl: true,
        disabled: !responseTx2
      },
      {
        label: 'Amount2',
        valueText: `${formatUtil.amountFull(amount2, token2.pDecimals)} ${token2.symbol}`,
        disabled: !amount2
      }
    ];
    return historyFactories.map(data => <Hook key={data?.label} {...data} />);
  };

  const renderWithdrawFeeHistories = () => {
    const { requestTx, amount, tokenId1, tokenId2, respondTx, statusText } = history;
    const token1 = getPrivacyDataByTokenID(tokenId1);
    const token2 = getPrivacyDataByTokenID(tokenId2);
    const historyFactories = [
      {
        label: 'TxID',
        valueText: requestTx,
        copyable: true,
        openUrl: true,
      },
      {
        label: 'RespondTx',
        valueText: respondTx,
        copyable: true,
        openUrl: true,
        disabled: !respondTx
      },
      {
        label: 'Amount',
        valueText: `${formatUtil.amountFull(amount, token1.pDecimals)} ${token1.symbol}`,
        disabled: !amount
      },
      {
        label: 'Status',
        valueText: statusText,
      },
      {
        label: 'Pair',
        valueText: `${token1.symbol}-${token2.symbol}`,
        disabled: !token1 || !token2
      },
    ];
    return historyFactories.map(data => <Hook key={data?.label} {...data} />);
  };
  return (
    <View style={{ marginHorizontal: 25, flex: 1 }}>
      <Header title="Liquidity" />
      <ScrollView>
        {historyTab === HEADER_TABS.Remove ? renderWithdrawHistories() : renderWithdrawFeeHistories()}
      </ScrollView>
    </View>
  );
});

HistoryWithdrawDetail.propTypes = {
  history: PropTypes.object.isRequired,
  historyTab: PropTypes.string.isRequired
};


export default withHistory(HistoryWithdrawDetail);
