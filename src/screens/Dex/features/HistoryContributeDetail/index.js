import React from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import withHistory from '@screens/Dex/features/HistoryContributeDetail/enhance';
import { Header } from '@src/components';
import { Hook } from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { selectedPrivacySelector } from '@src/redux/selectors';
import formatUtil from '@utils/format';
import PropTypes from 'prop-types';
import { styledForm as styled } from '@screens/Send/features/Form/Form.styled';
import { ButtonBasic } from '@components/Button';
import { LIQUIDITY_STATUS_MESSAGE } from '@screens/Dex/Liquidity.constants';
import withValidate from '@screens/Dex/features/HistoryContributeDetail/enhanceValidator';
import {compose} from 'recompose';

const HistoryContributeDetail = React.memo(({
  history,
  canRetry,
  loading,
  showRetry,
  navigateToRetry,
}) => {
  const getPrivacyDataByTokenID = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID);
  const { pairId, statusText } = history;
  const historyFactory = [
    {
      label: 'PairID',
      valueText: pairId,
      copyable: true,
    },
    {
      label: 'Status',
      valueText: statusText,
    },
  ];

  const renderSection = (data, index) => {
    index += 1;
    const { requestTx, returnAmount, respondTx, amount, tokenId, status } = data;
    const token = getPrivacyDataByTokenID(tokenId);
    const sectionFactor = [
      {
        label: `TxID${index}`,
        valueText: requestTx,
        copyable: true,
        openUrl: true,
      },
      {
        label: `Status${index}`,
        valueText: status ? status.charAt(0).toUpperCase() + status.slice(1) : '',
        disabled: isEmpty(status) || (statusText !== LIQUIDITY_STATUS_MESSAGE.WAITING),
      },
      {
        label: `RespondTxID${index}`,
        valueText: respondTx,
        copyable: true,
        disabled: isEmpty(respondTx),
        openUrl: true,
      },
      {
        label: `Amount${index}`,
        valueText: `${formatUtil.amountFull(amount, token.pDecimals)} ${token.symbol}`,
        disabled: !amount
      },
      {
        label: `ReturnAmount${index}`,
        valueText: `${formatUtil.amountFull(returnAmount, token.pDecimals)} ${token.symbol}`,
        disabled: !returnAmount
      }
    ];
    return sectionFactor.map(data => <Hook key={data?.label} {...data} />);
  };

  return (
    <View style={{ marginHorizontal: 25, flex: 1 }}>
      <Header title="Liquidity" />
      <ScrollView>
        {historyFactory.map(data => <Hook key={data?.label} {...data} />)}
        {history?.contributes.map(renderSection)}
        {canRetry && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <ButtonBasic
              title="Refund"
              btnStyle={[
                styled.submitBtn,
                showRetry ? { width: '48%' } : { flex: 1 }
              ]}
              disabled={loading}
              loading={loading}
              onPress={() => navigateToRetry(false)}
            />
            {!!showRetry && (
              <ButtonBasic
                title="Retry"
                btnStyle={[
                  styled.submitBtn,
                  { width: '48%' }
                ]}
                disabled={loading}
                loading={loading}
                onPress={() => navigateToRetry(true)}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
});

HistoryContributeDetail.propTypes = {
  history: PropTypes.object.isRequired,
  canRetry: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  prvBalance: PropTypes.number.isRequired,
  pTokenBalance: PropTypes.number.isRequired,
  retryTokenId: PropTypes.string.isRequired,
  retryAmount: PropTypes.number.isRequired,
  isRetryPRV: PropTypes.bool.isRequired,
  showRetry: PropTypes.bool.isRequired,
  navigateToRetry: PropTypes.func.isRequired,
};


export default compose(
  withHistory,
  withValidate
)(HistoryContributeDetail);
