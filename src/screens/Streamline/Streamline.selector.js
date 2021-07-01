import { selectedPrivacySelector } from '@src/redux/selectors';
import { createSelector } from 'reselect';
import { MAX_FEE_PER_TX } from '@src/components/EstimateFee/EstimateFee.utils';
import { defaultAccountSelector } from '@src/redux/selectors/account';
import { MAX_NO_INPUT_DEFRAGMENT } from '@screens/Streamline/Streamline.constant';


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

export const streamlineConsolidateSelector = createSelector(
  defaultAccountSelector,
  streamlineUTXOSSelector,
  (account, UTXOS) => {
    const address = account.PaymentAddress;
    const UTXOSFiltered = UTXOS.filter(item => item?.address === address) || [];
    const hasExceededMaxInputPRV = UTXOSFiltered.some(({ unspentCoins }) => unspentCoins.length > MAX_NO_INPUT_DEFRAGMENT);
    return {
      hasExceededMaxInputPRV,
      UTXOSFiltered,
    };
  },
);

export const streamlineDataSelector = createSelector(
  selectedPrivacySelector.selectedPrivacy,
  streamlineSelector,
  streamlineConsolidateSelector,
  ({ tokenId, id }, streamline, { UTXOSFiltered }) => {
    const tokenID = tokenId || id;
    const { consolidated } = streamline;

    const currToken = UTXOSFiltered.find(item => item.tokenID === tokenID);

    let noUTXOS = 0;
    if (currToken) {
      noUTXOS = currToken.unspentCoins.length;
    }
    const times = Math.ceil(noUTXOS / MAX_NO_INPUT_DEFRAGMENT);
    const totalFee = MAX_FEE_PER_TX * times;
    return {
      totalFee,
      times,
      consolidated,
      noUTXOS,
    };
  },
);
