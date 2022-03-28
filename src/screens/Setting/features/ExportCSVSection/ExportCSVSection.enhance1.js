/* eslint-disable no-empty */
import withDefaultAccount from '@components/Hoc/withDefaultAccount';
import { Toast } from '@src/components/core';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { COINS } from '@src/constants';
import { selectedPrivacySelector } from '@src/redux/selectors';
import { renderAmount } from '@src/redux/selectors/history';
import { getDefaultAccountWalletSelector } from '@src/redux/selectors/shared';
import {
  checkWriteStoragePermission,
  exportAndSaveCSVFile,
} from '@src/screens/Setting/features/ExportCSVSection/ExportCSVSection.utils';
import formatUtil from '@src/utils/format';
import BigNumber from 'bignumber.js';
import { PrivacyVersion } from 'incognito-chain-web-js/build/wallet';
import flatten from 'lodash/flatten';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';
import { compose } from 'recompose';
import withExportCSVVer1 from '@screens/Setting/features/ExportCSVSection/ExportCSVSection.withCoinsV1';

const enhance = (WrappedComp) => (props) => {
  const {
    counterSuccess,
    getTxsHistoryCoinsVer1,
    tokenIDsVer1,
    tokenIDsVer2,
    loading,
    setLoading,
    forcePercent,
    setForcePercent,
  } = props;

  const accountWallet = useSelector(getDefaultAccountWalletSelector);

  const selectedPrivacyWithTokenIDFn = useSelector(
    selectedPrivacySelector.getPrivacyDataByTokenID,
  );

  const formatSendItems = (items) => {
    const results =
      (items &&
        items.length > 0 &&
        items.reduce((currentResult, item) => {
          const { amount = 0, time = 0, fee = 0 } = item;
          if (item.statusStr === 'Success') {
            const data = {
              Date: formatUtil.formatDateTime(time, 'MM/DD/YYYY HH:mm:ss'),
              'Received Quantity': '',
              'Received Currency': '',
              'Send Quantity': `${renderAmount({
                amount: amount || 0,
                pDecimals: COINS.PRV.pDecimals || 9,
                decimalDigits: false,
              })}`,
              'Send Currency': COINS.PRV.symbol || '',
              'Fee Amount': `${
                new BigNumber(fee || 0)
                  .dividedBy(Math.pow(10, COINS.PRV.pDecimals || 9))
                  .toFixed() || ''
              }`,
              'Fee Currency': COINS.PRV.symbol || '',
              Tag: 'Send',
            };
            currentResult.push(data);
          }
          return currentResult;
        }, [])) ||
      [];
    return results;
  };

  const formatReceiveItems = (items) => {
    const results =
      (items &&
        items.length > 0 &&
        items.reduce((currentResult, item) => {
          const { amount = 0, time = 0 } = item;
          if (item.statusStr === 'Success') {
            const data = {
              Date: formatUtil.formatDateTime(time, 'MM/DD/YYYY HH:mm:ss'),
              'Received Quantity': `${renderAmount({
                amount: amount || 0,
                pDecimals: COINS.PRV.pDecimals || 9,
                decimalDigits: true,
              })}`,
              'Received Currency': COINS.PRV.symbol || '',
              'Send Quantity': '',
              'Send Currency': '',
              'Fee Amount': '',
              'Fee Currency': '',
              Tag: 'Receive',
            };
            currentResult.push(data);
          }
          return currentResult;
        }, [])) ||
      [];
    return results;
  };

  const formatShieldAndUnShieldItems = (items, token) => {
    const results =
      (items &&
        items.length > 0 &&
        items.reduce((currentResult, item) => {
          const {
            statusMessage = '',
            time = 0,
            txTypeStr = '',
            incognitoAmount = 0,
            outchainFee = 0,
          } = item;
          if (statusMessage === 'Complete') {
            if (txTypeStr === 'Shield') {
              const data = {
                Date: formatUtil.formatDateTime(time, 'MM/DD/YYYY HH:mm:ss'),
                'Received Quantity': `${renderAmount({
                  amount: incognitoAmount || 0,
                  pDecimals: COINS.PRV.pDecimals || 9,
                  decimalDigits: true,
                })}`,
                'Received Currency': token?.externalSymbol || token?.symbol,
                'Send Quantity': '',
                'Send Currency': '',
                'Fee Amount': '',
                'Fee Currency': '',
                Tag: 'Shield',
              };
              currentResult.push(data);
            }

            if (txTypeStr === 'Unshield') {
              const data = {
                Date: formatUtil.formatDateTime(time, 'MM/DD/YYYY HH:mm:ss'),
                'Received Quantity': '',
                'Received Currency': '',
                'Send Quantity': `${renderAmount({
                  amount: incognitoAmount || 0,
                  pDecimals: COINS.PRV.pDecimals || 9,
                  decimalDigits: true,
                })}`,
                'Send Currency': token?.externalSymbol || token?.symbol,
                'Fee Amount': `${
                  new BigNumber(outchainFee || 0)
                    .dividedBy(Math.pow(10, COINS.PRV.pDecimals || 9))
                    .toFixed() || ''
                }`,
                'Fee Currency': COINS.PRV.symbol || '',
                Tag: 'Unshield',
              };
              currentResult.push(data);
            }
          }
          return currentResult;
        }, [])) ||
      [];
    return results;
  };

  const formatPortalItems = (items, token) => {
    const results =
      (items &&
        items.length > 0 &&
        items.reduce((currentResult, item) => {
          const {
            statusStr = 0,
            amount = 0,
            // fee = 0,
            time = 0,
            externalFee = 0,
            txTypeStr = '',
          } = item;
          if (statusStr === 'Complete') {
            if (txTypeStr === 'Shield') {
              const data = {
                Date: formatUtil.formatDateTime(time, 'MM/DD/YYYY HH:mm:ss'),
                'Received Quantity': `${renderAmount({
                  amount: amount || 0,
                  pDecimals: COINS.PRV.pDecimals || 9,
                  decimalDigits: true,
                })}`,
                'Received Currency': token?.externalSymbol || token?.symbol,
                'Send Quantity': '',
                'Send Currency': '',
                'Fee Amount': '',
                'Fee Currency': '',
                Tag: 'Shield',
              };
              currentResult.push(data);
            }

            if (txTypeStr === 'Unshield') {
              const data = {
                Date: formatUtil.formatDateTime(time, 'MM/DD/YYYY HH:mm:ss'),
                'Received Quantity': '',
                'Received Currency': '',
                'Send Quantity': `${renderAmount({
                  amount: amount || 0,
                  pDecimals: COINS.PRV.pDecimals || 9,
                  decimalDigits: true,
                })}`,
                'Send Currency': token?.externalSymbol || token?.symbol,
                'Fee Amount': `${
                  new BigNumber(externalFee || 0)
                    .dividedBy(Math.pow(10, COINS.PRV.pDecimals || 9))
                    .toFixed() || ''
                }`,
                'Fee Currency': token?.externalSymbol || token?.symbol || '',
                Tag: 'Unshield',
              };
              currentResult.push(data);
            }
          }
          return currentResult;
        }, [])) ||
      [];
    return results;
  };

  const getHistoryWithToken = async (tokenID) => {
    const token = selectedPrivacyWithTokenIDFn(tokenID);
    const data =
      (await accountWallet.getTxsHistory({
        tokenID: token.tokenId || tokenID,
        isPToken: token.isPToken,
        version: 2,
      })) || {};
    const {
      txsPToken = [],
      txsPortal = [],
      txsReceiver = [],
      txsTransactor = [],
    } = data;

    const sendFormated = formatSendItems(txsTransactor, token);
    const receiveFormated = formatReceiveItems(txsReceiver, token);
    const shieldAndUnShieldFormated = formatShieldAndUnShieldItems(
      txsPToken,
      token,
    );
    const portalFomated = formatPortalItems(txsPortal, token);

    //Update percent when format data succesful
    counterSuccess.current = counterSuccess.current + 1;
    setForcePercent(() =>
      Math.round(
        (counterSuccess.current /
          (tokenIDsVer2.current.length + tokenIDsVer1.current.length)) *
          100,
      ),
    );
    return [
      ...sendFormated,
      ...receiveFormated,
      ...shieldAndUnShieldFormated,
      ...portalFomated,
    ];
  };

  const exportCSV = async () => {
    try {
      const canWrite = await checkWriteStoragePermission();
      if (canWrite) {
        setLoading(true);
        const mergedDataCSV = await getAllHistory();
        if (mergedDataCSV && mergedDataCSV.length > 0) {
          const path = await exportAndSaveCSVFile(mergedDataCSV);
          setTimeout(() => {
            Share.open({
              url: path,
              title: 'Export balance changes of the current keychain',
            });
          }, 300);
        } else {
          Toast.showWarning(
            'Your account does not have any transaction history.',
          );
        }
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const getAllHistory = async () => {
    let historyVer1 = [];
    if (typeof getTxsHistoryCoinsVer1 === 'function') {
      historyVer1 = await getTxsHistoryCoinsVer1();
    }
    const historyVer2 = await Promise.all(
      tokenIDsVer2.current.map(
        async (tokenId) => await getHistoryWithToken(tokenId),
      ),
    );
    setForcePercent(0);
    counterSuccess.current = 0;
    return [...historyVer1, ...flatten(historyVer2)].sort(
      (a, b) =>
        moment(b.Date, [
          'MM/DD/YYYY hh:mm:ss',
          'MM/DD/YYYY HH:mm:SS',
          'MM/DD/YYYY HH:MM:SS',
        ]).unix() -
        moment(a.Date, [
          'MM/DD/YYYY hh:mm:ss',
          'MM/DD/YYYY HH:mm:SS',
          'MM/DD/YYYY HH:MM:SS',
        ]).unix(),
    );
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          loadingExportCSV: loading,
          forcePercent: forcePercent,
          exportCSV,
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(withDefaultAccount, withExportCSVVer1, enhance);
