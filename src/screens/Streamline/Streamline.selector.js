import {accountSelector, selectedPrivacySelector} from '@src/redux/selectors';
import { walletSelector } from '@src/redux/selectors/wallet';
import { createSelector } from 'reselect';
import { MAX_FEE_PER_TX } from '@src/components/EstimateFee/EstimateFee.utils';
import { ACCOUNT_CONSTANT } from 'incognito-chain-web-js/build/wallet';

export const { MaxInputNumberForDefragment } = ACCOUNT_CONSTANT;

export const streamlineSelector = createSelector(
  (state) => state.streamline,
  (streamline) => streamline,
);

export const streamlineStorageSelector = createSelector(
  streamlineSelector,
  (streamline) => streamline?.storage,
);

export const streamlineUTXOSSelector = createSelector(
  streamlineSelector,
  (streamline) => streamline?.UTXOS,
);

export const streamlineIsConsolidateSelector = createSelector(
  selectedPrivacySelector.selectedPrivacy,
  streamlineUTXOSSelector,
  ({ tokenId, id }, UTXOS) => {
    const tokenID = tokenId || id;
    let isConsolidate = false;
    let noUTXOS = 0;
    if (!!UTXOS && UTXOS?.tokenID === tokenID)  {
      const { unspentCoins } = UTXOS;
      isConsolidate = (unspentCoins || []).length > MaxInputNumberForDefragment;
      noUTXOS = (unspentCoins || []).length;
    }
    return {
      isConsolidate,
      noUTXOS
    };
  },
);

export const streamlineDataSelector = createSelector(
  walletSelector,
  accountSelector.defaultAccountSelector,
  streamlineSelector,
  streamlineIsConsolidateSelector,
  (wallet, account, streamline, { noUTXOS }) => {
    const { consolidated } = streamline;
    const times = Math.ceil(noUTXOS / MaxInputNumberForDefragment);
    const totalFee = MAX_FEE_PER_TX * times;
    return {
      totalFee,
      times,
      consolidated,
      noUTXOS,
    };
  },
);
