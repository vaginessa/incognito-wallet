import React from 'react';
import { switchAccountSelector } from '@src/redux/selectors/account';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from 'react-navigation-hooks';
import { CONSTANT_COMMONS, CONSTANT_KEYS } from '@src/constants';
import routeNames from '@src/router/routeNames';
import { accountSelector, selectedPrivacySelector } from '@src/redux/selectors';
import format from '@src/utils/format';
import memmoize from 'memoize-one';
import debounce from 'lodash/debounce';
import { actionFetch, actionConditionConsolidate } from './Streamline.actions';
import {
  streamlineStorageSelector,
  streamlineDataSelector,
  streamlineSelector,
  streamlineIsConsolidateSelector,
} from './Streamline.selector';

export const useStreamLine = ({ fetchUTXO = false } = {}) => {
  const keySave = CONSTANT_KEYS.UTXOS_DATA;
  const navigation = useNavigation();
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const tokenID = selectedPrivacy?.tokenId;
  const dispatch = useDispatch();
  const accountBalance = useSelector(
    accountSelector.defaultAccountBalanceSelector,
  );
  const streamline = useSelector(streamlineSelector);
  const { isFetching, isFetched, isPending, isFetchingUTXOS } = streamline;
  const streamlineStorage = useSelector(streamlineStorageSelector);
  const { data } = streamlineStorage[keySave];
  const { totalFee, times, consolidated } = useSelector(
    streamlineDataSelector,
  );
  const switchingAccount = useSelector(switchAccountSelector);

  const { isConsolidate: hasExceededMaxInputPRV, noUTXOS } = useSelector(streamlineIsConsolidateSelector);
  const onNavigateStreamLine = () => {
    navigation.navigate(routeNames.Streamline);
  };
  const handleNavigateWhyStreamline = () =>
    navigation.navigate(routeNames.WhyStreamline);

  const hookFactories = [
    {
      title: 'Balance',
      desc: `${format.amount(
        accountBalance,
        CONSTANT_COMMONS.PRV.pDecimals,
        true,
      )} ${CONSTANT_COMMONS.PRV.symbol}`,
    },
    {
      title: 'Network fee',
      desc: `${format.amount(totalFee, CONSTANT_COMMONS.PRV.pDecimals, true)} ${
        CONSTANT_COMMONS.PRV.symbol
      }`,
    },
    {
      title: 'UTXO count',
      desc: noUTXOS,
    },
  ];

  const handleDefragmentNativeCoin = async () => {
    if (shouldDisabledForm || !hasExceededMaxInputPRV) {
      return;
    }
    await dispatch(actionFetch());
  };

  const checkConditionConsolidate = React.useCallback(debounce(({ tokenID }) => {
    dispatch(actionConditionConsolidate({ tokenID }));
  }, 500), []);

  const shouldDisabledForm = React.useMemo(memmoize(() => {
    return accountBalance && accountBalance < totalFee;
  }), [accountBalance, totalFee]);

  useFocusEffect(React.useCallback(() => {
    if (!switchingAccount && !fetchUTXO) return;
    checkConditionConsolidate({ tokenID });
  }, [switchingAccount]));

  return {
    hasExceededMaxInputPRV,
    onNavigateStreamLine,
    handleNavigateWhyStreamline,
    handleDefragmentNativeCoin,
    accountBalance,
    hookFactories,
    shouldDisabledForm,
    isFetched,
    isFetching,
    data,
    times,
    isPending,
    totalTimes: times,
    currentTime: consolidated,
    noUTXOS,
    isFetchingUTXOS,
  };
};
