/* eslint-disable import/no-cycle */
import toLower from 'lodash/toLower';
import { Validator } from 'incognito-chain-web-js/build/wallet';
import LocalDatabase from '@utils/LocalDatabase';
import types from '@src/redux/types/masterKey';
import MasterKeyModel from '@models/masterKey';
import storage from '@src/services/storage';
import {
  importWallet,
  saveWallet,
  storeWalletAccountIdsOnAPI,
  configsWallet,
  loadWallet,
} from '@services/wallet/WalletService';
import {
  actionSubmitOTAKeyForListAccount,
  reloadWallet,
} from '@src/redux/actions/wallet';
import { getWalletAccounts } from '@services/api/masterKey';
import { defaultPTokensIDsSelector } from '@src/redux/selectors/token';
import {
  currentMasterKeySelector,
  masterKeysSelector,
  masterlessKeyChainSelector,
  noMasterLessSelector,
} from '@src/redux/selectors/masterKey';
import _ from 'lodash';
import { clearWalletCaches } from '@services/cache';
import accountService from '@services/wallet/accountService';
import uniqBy from 'lodash/uniqBy';
import { actionLogEvent } from '@src/screens/Performance';
import { performance } from '@src/screens/Performance/Performance.utils';
import { getPassphrase } from '@src/services/wallet/passwordService';
import { accountServices } from '@src/services/wallet';

const DEFAULT_MASTER_KEY = new MasterKeyModel({
  name: 'Wallet',
  isActive: true,
});

const MASTERLESS = new MasterKeyModel({
  name: 'Masterless',
  isActive: false,
});

const updateNetwork = async () => {
  const serverJSONString = await storage.getItem('$servers');
  const servers = JSON.parse(serverJSONString || '[]');
  const currentServer = servers.find((item) => item.default) || {
    id: 'mainnet',
  };
  const isMainnet = currentServer.id === 'mainnet';
  MasterKeyModel.network = isMainnet
    ? 'mainnet'
    : currentServer?.id || 'testnet';
};

const migrateData = async () => {
  let isMigratedData = false;
  const data = await storage.getItem('Wallet');

  if (data) {
    await storage.setItem(`$${MasterKeyModel.network}-master-masterless`, data);
    // await storage.removeItem('Wallet');
    isMigratedData = true;
  }

  const dexHistories = await LocalDatabase.getOldDexHistory();
  if (dexHistories.length > 0) {
    await storage.setItem(
      `$${MasterKeyModel.network}-master-masterless-dex-histories`,
      JSON.stringify(dexHistories),
    );
    isMigratedData = true;
  }

  return isMigratedData;
};

const initMasterKeySuccess = (data) => ({
  type: types.INIT,
  payload: data,
});

export const initMasterKey = (masterKeyName, mnemonic) => async (dispatch) => {
  try {
    await updateNetwork();
    const isMigrated = await migrateData();
    const defaultMasterKey = new MasterKeyModel(DEFAULT_MASTER_KEY);
    const masterlessMasterKey = new MasterKeyModel(MASTERLESS);
    const masterlessWallet = await masterlessMasterKey.loadWallet();
    if (!isMigrated) {
      masterlessWallet.MasterAccount.child = [];
    }
    defaultMasterKey.name = masterKeyName;
    let wallet = await importWallet(
      mnemonic,
      defaultMasterKey.getStorageName(),
    );
    defaultMasterKey.mnemonic = wallet.Mnemonic;
    defaultMasterKey.wallet = wallet;
    wallet.RootName = masterKeyName;
    const masterKeys = [defaultMasterKey, masterlessMasterKey];
    await saveWallet(wallet);
    await Promise.all([
      storeWalletAccountIdsOnAPI(wallet),
      dispatch(initMasterKeySuccess(masterKeys)),
      saveWallet(masterlessWallet),
    ]);
    dispatch(switchMasterKey(defaultMasterKey.name));
  } catch (error) {
    throw error;
  }
};

const loadAllMasterKeysSuccess = (data) => ({
  type: types.LOAD_ALL,
  payload: data,
});

export const loadAllMasterKeys = () => async (dispatch) => {
  try {
    await updateNetwork();
    let masterKeyList = _.uniqBy(
      await LocalDatabase.getMasterKeyList(),
      (item) => item.name,
    ).map((item) => new MasterKeyModel(item));
    for (let masterKey of masterKeyList) {
      try {
        console.time(`TIME_LOAD_WALLET_${masterKey.name}_FROM_STORAGE`);
        await masterKey.loadWallet();
        console.timeEnd(`TIME_LOAD_WALLET_${masterKey.name}_FROM_STORAGE`);
        if (masterKey.isMasterless) {
          continue;
        }
      } catch (error) {
        console.log('LOAD WALLET ERROR', masterKey?.name);
      }
    }
    await dispatch(loadAllMasterKeysSuccess(masterKeyList));
  } catch (error) {
    console.log('loadAllMasterKeys error', error);
    throw error;
  }
};

const switchMasterKeySuccess = (data) => ({
  type: types.SWITCH,
  payload: data,
});

export const switchhingMasterKey = (payload) => ({
  type: types.SWITCHING,
  payload,
});

export const switchMasterKey = (masterKeyName, accountName) => async (
  dispatch,
) => {
  try {
    new Validator('switchMasterKey-masterKeyName', masterKeyName)
      .required()
      .string();
    new Validator('switchMasterKey-accountName', accountName).string();
    clearWalletCaches();
    dispatch(switchhingMasterKey(true));
    dispatch(switchMasterKeySuccess(masterKeyName));
    dispatch(reloadWallet(accountName));
  } catch (error) {
    throw error;
  } finally {
    dispatch(switchhingMasterKey(false));
  }
};

const createMasterKeySuccess = (newMasterKey) => ({
  type: types.CREATE,
  payload: newMasterKey,
});

export const createMasterKey = (data) => async (dispatch) => {
  try {
    const newMasterKey = new MasterKeyModel({
      ...data,
    });
    let wallet = await importWallet(
      data.mnemonic,
      newMasterKey.getStorageName(),
    );
    newMasterKey.wallet = wallet;
    newMasterKey.mnemonic = wallet.Mnemonic;
    wallet.RootName = newMasterKey.name;
    await dispatch(createMasterKeySuccess(newMasterKey));
    await dispatch(switchMasterKey(data.name));
    await saveWallet(wallet);
    await storeWalletAccountIdsOnAPI(wallet);
    const listAccount = await wallet.listAccount();
    await dispatch(reloadWallet(listAccount[0]?.accountName));
  } catch (error) {
    throw error;
  }
};

const importMasterKeySuccess = (newMasterKey) => ({
  type: types.IMPORT,
  payload: newMasterKey,
});

export const syncServerAccounts = async (wallet, dispatch) => {
  try {
    const masterAccountInfo = await wallet.MasterAccount.getDeserializeInformation();
    const accounts = await getWalletAccounts(
      masterAccountInfo.PublicKeyCheckEncode,
      dispatch,
    );
    if (accounts.length > 0) {
      wallet.MasterAccount.child = [];
      for (const account of accounts) {
        try {
          await wallet.importAccountWithId(account.id, account.name);
        } catch (error) {
          console.log('IMPORT ACCOUNT WITH ID FAILED', error);
        }
      }
    }
  } catch (error) {
    console.log('syncServerAccounts error', error);
  }
};

const syncUnlinkWithNewMasterKey = (newMasterKey) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const masterless = masterlessKeyChainSelector(state);
  const accounts = await masterless.getAccounts();
  const masterLessWallet = masterless.wallet;
  const wallet = newMasterKey.wallet;
  for (const account of accounts) {
    const findItemWithKey = (item) =>
      item.getPrivateKey() === account.PrivateKey;
    const isCreated = await wallet.hasCreatedAccount(account.PrivateKey);
    if (isCreated) {
      const masterAccountIndex = wallet.MasterAccount.child.findIndex(
        findItemWithKey,
      );
      const masterlessAccount = masterLessWallet.MasterAccount.child.find(
        findItemWithKey,
      );

      masterLessWallet.MasterAccount.child = masterLessWallet.MasterAccount.child.filter(
        (item) => !findItemWithKey(item),
      );
      if (masterAccountIndex > -1) {
        const masterAccount = wallet.MasterAccount.child[masterAccountIndex];
        masterlessAccount.name = masterAccount.name;
        wallet.MasterAccount.child[masterAccountIndex] = masterlessAccount;
      } else {
        wallet.MasterAccount.child.push(masterlessAccount);
      }
      // Found duplicate account name
      if (wallet.MasterAccount.child.filter(findItemWithKey).length > 1) {
        const isDuplicatedNameAccount = wallet.MasterAccount.child.find(
          findItemWithKey,
        );
        if (isDuplicatedNameAccount) {
          let index = 1;
          let newName = isDuplicatedNameAccount.name + index;
          while (
            wallet.MasterAccount.child.find((item) => item.name === newName)
          ) {
            index++;
            newName = isDuplicatedNameAccount.name + index;
          }
          isDuplicatedNameAccount.name = newName;
        }
      }
    }
  }
  await saveWallet(masterLessWallet);
  await dispatch(updateMasterKey(masterless));
};

export const importMasterKey = (data) => async (dispatch, getState) => {
  try {
    const newMasterKey = new MasterKeyModel({
      ...data,
    });
    const wallet = await importWallet(
      data.mnemonic,
      newMasterKey.getStorageName(),
    );
    await syncServerAccounts(wallet, dispatch);
    newMasterKey.wallet = wallet;
    newMasterKey.mnemonic = wallet.Mnemonic;
    wallet.RootName = newMasterKey.name;
    await dispatch(importMasterKeySuccess(newMasterKey));
    await dispatch(switchMasterKey(data.name));
    await dispatch(syncUnlinkWithNewMasterKey(newMasterKey));
    await saveWallet(wallet);
    const listAccount = await wallet.listAccount();
    await dispatch(actionSubmitOTAKeyForListAccount(wallet));
    await dispatch(reloadWallet(listAccount[0]?.name));
  } catch (error) {
    console.log('importMasterKey error', error);
    throw error;
  }
};

const updateMasterKeySuccess = (masterKey) => ({
  type: types.UPDATE,
  payload: masterKey,
});

export const updateMasterKey = (masterKey) => async (dispatch) => {
  dispatch(updateMasterKeySuccess(masterKey));
};

const removeMasterKeySuccess = (history) => ({
  type: types.REMOVE,
  payload: history,
});

export const removeMasterKey = (name) => async (dispatch, getState) => {
  const state = getState();
  const list = masterKeysSelector(state);
  const newList = _.remove([...list], (item) => item.name !== name);
  const activeItem = newList.find((item) => item.isActive);
  if (!activeItem) {
    const firstItem = newList.filter(
      (item) => item.name.toLowerCase() !== 'masterless',
    )[0];
    await dispatch(switchMasterKey(firstItem.name));
  }
  await dispatch(removeMasterKeySuccess(name));
};

const loadAllMasterKeyAccountsSuccess = (accounts) => ({
  type: types.LOAD_ALL_ACCOUNTS,
  payload: accounts,
});

export const loadAllMasterKeyAccounts = () => async (dispatch, getState) => {
  const state = getState();
  const masterKeys = [
    ...noMasterLessSelector(state),
    masterlessKeyChainSelector(state),
  ];
  let accounts = [];
  for (const masterKey of masterKeys) {
    try {
      await dispatch(actionSyncAccountMasterKey(masterKey));
      const masterKeyAccounts = await masterKey.getAccounts(true);
      accounts = [...accounts, ...masterKeyAccounts];
    } catch (error) {
      console.log('ERROR LOAD ACCOUNTS OF MASTER KEYS', error);
    }
  }
  await dispatch(loadAllMasterKeyAccountsSuccess(accounts));
};

export const actionLoadInitial = () => async (dispatch, getState) => {
  let list = [];
  try {
    list = uniqBy(await LocalDatabase.getMasterKeyList(), (item) => item.name);
  } catch (error) {
    console.log('error-actionLoadInitial', error);
  } finally {
    dispatch({
      type: types.LOADING_INITIAL,
      payload: {
        loading: false,
        masterKeyList: list,
      },
    });
  }
};

export const actionSyncAccountMasterKey = (defaultMasterKey) => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    let masterKey: MasterKeyModel =
      defaultMasterKey || currentMasterKeySelector(state);
    if (masterKey.isMasterless) {
      return;
    }
    let wallet = masterKey.wallet;
    await configsWallet(wallet);
    let masterAccountInfo = await wallet.MasterAccount.getDeserializeInformation();
    const serverAccounts = await getWalletAccounts(
      masterAccountInfo.PublicKeyCheckEncode,
      dispatch,
    );
    const accountIds = [];
    for (const account of wallet.MasterAccount.child) {
      const accountInfo = await account.getDeserializeInformation();
      accountIds.push(accountInfo.ID);
    }
    const newAccounts = serverAccounts.filter(
      (item) =>
        !accountIds.includes(item.id) &&
        !(masterKey.deletedAccountIds || []).includes(item.id),
    );
    if (newAccounts.length > 0) {
      let accounts = [];
      for (const account of newAccounts) {
        try {
          const newAccount = await wallet.importAccountWithId(
            account.id,
            account.name,
          );
          if (account?.name) {
            accounts.push(newAccount);
          }
        } catch (error) {
          console.log('IMPORT ACCOUNT WITH ID FAILED', error);
        }
      }
      await wallet.save();
    }
  } catch (error) {
    throw error;
  }
};

export const actionLoadDefaultWallet = () => async (dispatch, getState) => {
  console.time('LOAD_WALLET');
  try {
    console.time('LOAD_ALL_MASTER_KEYS');
    await dispatch(loadAllMasterKeys());
    console.timeEnd('LOAD_ALL_MASTER_KEYS');
    console.time('SYNC_ACCOUNT_DEFAUL_WALLET');
    await dispatch(actionSyncAccountMasterKey());
    console.timeEnd('SYNC_ACCOUNT_DEFAUL_WALLET');
    console.time('RELOAD_WALLET');
    const defaultAccountName = await accountServices.getDefaultAccountName();
    await dispatch(reloadWallet(defaultAccountName));
    console.timeEnd('RELOAD_WALLET');
  } catch (error) {
    throw error;
  }
  console.timeEnd('LOAD_WALLET');
};
