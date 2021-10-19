import { createSelector } from 'reselect';
import groupBy from 'lodash/groupBy';
import {flatMap} from 'lodash';

const masterKeyReducerSelector = (state) => state.masterKey;

export const masterlessKeyChainSelector = createSelector(
  masterKeyReducerSelector,
  (masterKey) =>
    masterKey.list.find(
      (item) =>
        item.name.toLowerCase() === 'unlinked' ||
        item.name.toLowerCase() === 'masterless',
    ),
);

export const masterlessWalletSelector = createSelector(
  masterlessKeyChainSelector,
  (masterless) => {
    return masterless?.wallet;
  },
);

export const noMasterLessSelector = createSelector(
  masterKeyReducerSelector,
  (masterKey) =>
    masterKey.list.filter((item) => item.name.toLowerCase() !== 'masterless'),
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

export const groupMasterKeys = createSelector(
  listAllMasterKeyAccounts,
  (listAccount) => {
    if (listAccount && listAccount.length > 0) {
      const groupedMasterKeys = groupBy(listAccount, (item) => item.MasterKeyName);
      const groupAccounts = flatMap(groupedMasterKeys, (child, key) => ({
        name: key,
        child,
      }));
      return groupAccounts.filter(({ name }) => name !== 'Masterless');
    }
    return [];
  },
);

export const groupMasterless = createSelector(
  listAllMasterKeyAccounts,
  (listAccount) => {
    if (listAccount && listAccount.length > 0) {
      const groupedMasterKeys = groupBy(listAccount, (item) => item.MasterKeyName);
      const groupAccounts = flatMap(groupedMasterKeys, (child, key) => ({
        name: key,
        child,
      }));
      return groupAccounts.filter(({ name }) => name === 'Masterless');
    }
    return [];
  },
);
