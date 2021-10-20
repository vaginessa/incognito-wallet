import { createSelector } from 'reselect';

const masterKeyReducerSelector = createSelector(
  (state) => state.masterKey,
  (masterKey) => masterKey,
);
export const masterlessKeyChainSelector = createSelector(
  masterKeyReducerSelector,
  (masterKey) => masterKey.list.find((item) => !!item?.isMasterless),
);

export const masterlessWalletSelector = createSelector(
  masterlessKeyChainSelector,
  (masterless) => {
    return masterless?.wallet;
  },
);

export const noMasterLessSelector = createSelector(
  masterKeyReducerSelector,
  (masterKey) => masterKey.list.filter((item) => !item?.isMasterless),
);

export const masterKeysSelector = createSelector(
  masterKeyReducerSelector,
  (masterKey) => masterKey.list,
);

export const currentMasterKeySelector = createSelector(
  masterKeysSelector,
  (list) => list.find((item) => item.isActive) || list[0],
);

export const currentMasterKeyNameSelector = createSelector(
  currentMasterKeySelector,
  (masterKey) => masterKey?.wallet?.Name,
);

export const listAllMasterKeyAccounts = createSelector(
  masterKeyReducerSelector,
  (state) => state.accounts || [],
);

export const switchingMasterKeySelector = createSelector(
  masterKeyReducerSelector,
  (masterKey) => masterKey.switching,
);

export const initialMasterKeySelector = createSelector(
  masterKeyReducerSelector,
  ({ initial }) => initial,
);
