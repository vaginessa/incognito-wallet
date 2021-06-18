/* eslint-disable import/no-cycle */
import { PRVIDSTR } from 'incognito-chain-web-js/lib/wallet/constants';
import BigNumber from 'bignumber.js';
import AccountModel from '@models/account';
import { COINS, CONSTANT_KEYS } from '@src/constants';
import tokenModel from '@src/models/token';
import storage from '@src/services/storage';
import {
  AccountWallet,
  KeyWallet,
  Wallet,
  constants,
  Validator,
} from 'incognito-chain-web-js/build/wallet';
import _ from 'lodash';
import { STACK_TRACE } from '@services/exception/customError/code/webjsCode';
import Server from '@services/wallet/Server';
import { PRV_ID } from '@src/constants/common';
import {
  getAccountNameByAccount,
  getAccountWallet,
} from '@src/services/wallet/Wallet.shared';
import { cachePromise } from '@src/services/cache';
import { PDexHistoryPureModel } from '@models/pDefi';
import { CustomError, ErrorCode, ExHandler } from '../exception';
import { loadListAccountWithBLSPubKey, saveWallet } from './WalletService';

const TAG = 'Account';

export default class Account {
  static NO_OF_INPUT_PER_DEFRAGMENT_TX = 10;
  static MAX_DEFRAGMENT_TXS = 3;
  static NO_OF_INPUT_PER_DEFRAGMENT =
    Account.NO_OF_INPUT_PER_DEFRAGMENT_TX * Account.MAX_DEFRAGMENT_TXS;

  static async getDefaultAccountName() {
    try {
      return await storage.getItem(CONSTANT_KEYS.DEFAULT_ACCOUNT_NAME);
    } catch (e) {
      console.error(
        'Error while getting default account index, fallback index to 0',
      );
    }
    return null;
  }

  static saveDefaultAccountToStorage(accountName) {
    return storage.setItem(CONSTANT_KEYS.DEFAULT_ACCOUNT_NAME, accountName);
  }

  static async importAccount(privakeyStr, accountName, passPhrase, wallet) {
    new Validator('privakeyStr', privakeyStr).string().required();
    new Validator('accountName', accountName).string().required();
    new Validator('passPhrase', passPhrase).string();
    new Validator('wallet', wallet).required();
    let imported = false;
    try {
      const account = await wallet.importAccount(
        privakeyStr,
        accountName,
        passPhrase,
      );
      imported = !!account.isImport;
    } catch (e) {
      throw e;
    }
    return imported;
  }

  static async removeAccount(privateKeyStr, passPhrase, wallet) {
    return wallet.removeAccount(privateKeyStr, passPhrase);
  }

  static async createAndSendNativeToken({
    wallet,
    account,
    prvPayments,
    info,
    fee,
    metadata,
    isEncryptMessage = true,
    txType,
    txHandler,
    txHashHandler,
    version,
  } = {}) {
    try {
      new Validator('createAndSendNativeToken-wallet', wallet).required();
      new Validator('createAndSendNativeToken-account', account).required();
      new Validator('createAndSendNativeToken-prvPayments', prvPayments)
        .required()
        .paymentInfoList();
      new Validator('createAndSendNativeToken-fee', fee).required().amount();
      new Validator('createAndSendNativeToken-info', info).string();
      new Validator(
        'createAndSendNativeToken-isEncryptMessage',
        isEncryptMessage,
      ).boolean();
      new Validator('createAndSendNativeToken-metadata', metadata).object();
      new Validator('createAndSendNativeToken-txType', txType)
        .required()
        .number();
      new Validator('createAndSendNativeToken-version', version)
        .required()
        .number();
      const accountWallet = this.getAccount(account, wallet);
      await accountWallet.resetProgressTx();
      const infoStr = typeof info !== 'string' ? JSON.stringify(info) : info;
      const result = await accountWallet.createAndSendNativeToken({
        transfer: {
          info: infoStr,
          prvPayments,
          fee,
        },
        extra: {
          metadata,
          isEncryptMessage,
          txType,
          txHandler,
          txHashHandler,
          version,
        },
      });
      console.log('result', result);
      // save wallet
      await saveWallet(wallet);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async createAndSendPrivacyToken({
    wallet,
    account,
    prvPayments,
    tokenPayments,
    info,
    fee,
    tokenID,
    metadata,
    isEncryptMessage = true,
    isEncryptMessageToken = true,
    txType,
    txHandler,
    txHashHandler,
    version,
  } = {}) {
    new Validator('createAndSendPrivacyToken-wallet', wallet).required();
    new Validator('createAndSendPrivacyToken-account', account).required();
    new Validator(
      'createAndSendPrivacyToken-prvPayments',
      prvPayments,
    ).paymentInfoList();
    new Validator('createAndSendPrivacyToken-tokenPayments', tokenPayments)
      .required()
      .paymentInfoList();
    new Validator('createAndSendPrivacyToken-fee', fee).required().amount();
    new Validator('createAndSendPrivacyToken-info', info).string();
    new Validator('createAndSendPrivacyToken-tokenID', tokenID)
      .string()
      .required();
    new Validator('createAndSendPrivacyToken-metadata', metadata).object();
    new Validator(
      'createAndSendPrivacyToken-isEncryptMessage',
      isEncryptMessage,
    ).boolean();
    new Validator(
      'createAndSendPrivacyToken-isEncryptMessageToken',
      isEncryptMessageToken,
    ).boolean();
    new Validator('createAndSendPrivacyToken-txType', txType)
      .required()
      .number();
    new Validator('createAndSendPrivacyToken-version', version)
      .required()
      .number();

    let result;
    const accountWallet = this.getAccount(account, wallet);
    await accountWallet.resetProgressTx();
    const infoStr = typeof info !== 'string' ? JSON.stringify(info) : info;
    result = await accountWallet.createAndSendPrivacyToken({
      transfer: {
        info: infoStr,
        prvPayments,
        tokenPayments,
        fee,
        tokenID,
      },
      extra: {
        metadata,
        isEncryptMessage,
        isEncryptMessageToken,
        txType,
        txHandler,
        txHashHandler,
        version,
      },
    });
    console.log('result', result);
    await saveWallet(wallet);
    return result;
  }

  static async createAndSendTradeRequestTx({
    account,
    wallet,
    fee,
    tokenIDToBuy = PRVIDSTR,
    tokenIDToSell = PRVIDSTR,
    sellAmount,
    minAcceptableAmount,
    tradingFee,
  } = {}) {
    new Validator('wallet', wallet).required();
    new Validator('account', account).required();
    new Validator('tokenIDToBuy', tokenIDToBuy).required().string();
    new Validator('tokenIDToSell', tokenIDToSell).required().string();
    new Validator('sellAmount', sellAmount).required().amount();
    new Validator('minAcceptableAmount', minAcceptableAmount)
      .required()
      .amount();
    new Validator('tradingFee', tradingFee).required().amount();
    new Validator('fee', fee).required().amount();
    let result;
    const accountWallet = this.getAccount(account, wallet);
    await accountWallet.resetProgressTx();
    result = await accountWallet.createAndSendTradeRequestTx({
      transfer: {
        fee,
      },
      extra: {
        tokenIDToBuy,
        tokenIDToSell,
        sellAmount,
        minAcceptableAmount,
        tradingFee,
      },
    });
    console.log('result', result);
    await saveWallet(wallet);
    return result;
  }

  static async createAccount(accountName, wallet, initShardID) {
    new Validator('accountName', accountName).string().required();
    new Validator('wallet', wallet).required().object();
    new Validator('initShardID', initShardID).number();
    const server = await Server.getDefault();
    if (server.id === 'testnode') {
      let lastByte = null;
      let newAccount;
      while (lastByte !== 0) {
        newAccount = await wallet.createAccount(
          accountName,
          0,
          wallet.deletedAccountIds || [],
        );
        const childKey = newAccount.key;
        lastByte =
          childKey.KeySet.PaymentAddress.Pk[
            childKey.KeySet.PaymentAddress.Pk.length - 1
          ];
      }
      wallet.MasterAccount.child.push(newAccount);
      await saveWallet(wallet);
      return newAccount;
    }
    let shardID = _.isNumber(initShardID) ? initShardID : undefined;
    if (shardID && parseInt(shardID) < 0) {
      shardID = 0;
    }
    return await wallet.createNewAccount(
      accountName,
      shardID,
      wallet.deletedAccountIds || [],
    );
  }

  static async getProgressTx(defaultAccount, wallet) {
    new Validator('defaultAccount', defaultAccount).required();
    new Validator('wallet', wallet).required();
    const account = this.getAccount(defaultAccount, wallet);
    return account.getProgressTx();
  }

  static async getDebugMessage(defaultAccount, wallet) {
    new Validator('defaultAccount', defaultAccount).required();
    new Validator('wallet', wallet).required();
    const account = this.getAccount(defaultAccount, wallet);
    return account.getDebugMessage();
  }

  static checkPaymentAddress(paymentAddrStr) {
    try {
      const key = KeyWallet.base58CheckDeserialize(paymentAddrStr);
      const paymentAddressObj = key?.KeySet?.PaymentAddress || {};
      if (
        paymentAddressObj.Pk?.length === 32 &&
        paymentAddressObj.Tk?.length === 32
      ) {
        return true;
      }
    } catch (e) {
      return false;
    }

    return false;
  }

  static validatePrivateKey(privateKey) {
    try {
      const keyWallet = KeyWallet.base58CheckDeserialize(privateKey);
      return !!keyWallet;
    } catch (e) {
      return false;
    }
  }

  static async getBalance({ account, wallet, tokenID, version }) {
    new Validator('getBalance-account', account).required();
    new Validator('getBalance-wallet', wallet).required();
    new Validator('getBalance-tokenID', tokenID).required().string();
    new Validator('getBalance-version', version).required().number();
    const accountWallet = this.getAccount(account, wallet);
    let balance = 0;
    try {
      console.log('VERSION', version);
      const key = `CACHE-BALANCE-${
        wallet.Name
      }-${accountWallet.getOTAKey()}-${tokenID}`;
      balance = await cachePromise(key, () =>
        accountWallet.getBalance({
          tokenID,
          version,
        }),
      );
      balance = new BigNumber(balance).toNumber();
      console.log('BALANCE', balance);
    } catch (error) {
      throw error;
    }
    return balance;
  }

  static parseShard(account) {
    const bytes = account.PublicKeyBytes;
    const arr = bytes.split(',');
    const lastByte = arr[arr.length - 1];
    return lastByte % 8;
  }

  static getFollowingTokens(account, wallet) {
    new Validator('account', account).object().required();
    new Validator('wallet', wallet).object().required();
    const accountWallet = this.getAccount(account, wallet);
    const followedTokens = accountWallet
      .listFollowingTokens()
      ?.map(tokenModel.fromJson);
    if (followedTokens && followedTokens.find((item) => item?.id === PRV_ID)) {
      this.removeFollowingToken(PRV_ID, account, wallet);
      return followedTokens.filter((item) => item?.id !== PRV_ID);
    }
    return followedTokens;
  }

  static async addFollowingTokens(tokens, account, wallet) {
    new Validator('account', account).required();
    new Validator('wallet', wallet).required();
    new Validator('tokens', tokens).required();
    const accountWallet = this.getAccount(account, wallet);
    await accountWallet.addFollowingToken(...tokens);
    await saveWallet(wallet);
    return wallet;
  }

  static async removeFollowingToken(tokenId, account, wallet) {
    new Validator('account', account).required();
    new Validator('wallet', wallet).required();
    new Validator('tokenId', tokenId).required().string();
    const accountWallet = this.getAccount(account, wallet);
    await accountWallet.removeFollowingToken(tokenId);
    await saveWallet(wallet);
    return wallet;
  }

  /**
   *
   * @param {string} tokenID
   * @param paymentAddrStr
   * @param {bool} isGetAll
   * @returns {object}
   */
  static async getRewardAmount(tokenID, paymentAddrStr, isGetAll = false) {
    if (_.isEmpty(paymentAddrStr))
      throw new CustomError(ErrorCode.payment_address_empty, {
        name: 'payment address is empty',
      });
    return await AccountWallet?.getRewardAmount(
      paymentAddrStr,
      isGetAll,
      tokenID,
    );
  }

  /**
   *
   * @param {object} accountWallet
   */
  static toSerializedAccountObj(accountWallet) {
    return accountWallet.toSerializedAccountObj();
  }

  /**
   *
   * @param {object} account
   * @param {object} wallet
   */
  // stakerStatus returns -1 if account haven't staked,
  // returns 0 if account is a candidator and
  // returns 1 if account is a validator
  static stakerStatus(account, wallet) {
    const accountWallet = wallet.getAccountByName(account?.name);
    return accountWallet.stakerStatus();
  }

  /**
   *
   * @param {string} blsKey
   * @param {object} wallet
   * @returns :AccountModel: template
   */
  static async getAccountWithBLSPubKey(blsKey, wallet) {
    try {
      let accountWallet = null;
      if (!_.isEmpty(blsKey)) {
        console.log(TAG, 'getAccountWithBLSPubKey begin');
        const listAccounts = (await loadListAccountWithBLSPubKey(wallet)) || [];
        console.log(TAG, 'getAccountWithBLSPubKey listAccount ', listAccounts);
        let account = listAccounts.find((item) =>
          _.isEqual(item.BLSPublicKey, blsKey),
        );

        account = account
          ? await wallet.getAccountByName(account.AccountName)
          : null;
        console.log(TAG, 'getAccountWithBLSPubKey end ---- ', account);
        // accountWallet = account? new AccountModel(account):null;
        accountWallet = account;
      }
      return accountWallet;
    } catch (e) {
      console.warn(TAG, 'getAccountWithBLSPubKey error =', e);
    }
    return null;
  }

  /**
   *
   * @param {string} blsKey
   * @param {object} wallet
   * @returns :AccountModel: template
   */
  static async getFullDataOfAccount(accountName, wallet) {
    try {
      let accountWallet = null;
      if (!_.isEmpty(accountName)) {
        console.log(TAG, 'getFullDataOfAccount begin');
        const listAccounts = (await loadListAccountWithBLSPubKey(wallet)) || [];
        console.log(TAG, 'getFullDataOfAccount listAccount ', listAccounts);
        let account = listAccounts.find((item) =>
          _.isEqual(item.AccountName, accountName),
        );

        let accountTemp = account
          ? await wallet.getAccountByName(account.AccountName)
          : null;
        console.log(TAG, 'getFullDataOfAccount end ---- ', account);
        // accountWallet = account? new AccountModel(account):null;
        accountWallet = accountTemp
          ? new AccountModel({ ...accountTemp, ...account })
          : null;
      }
      return accountWallet;
    } catch (e) {
      console.warn(TAG, 'getFullDataOfAccount error =', e);
    }
    return null;
  }

  static async createAndSendTxWithNativeTokenContribution(
    wallet,
    account,
    fee,
    pdeContributionPairID,
    contributedAmount,
    info = '',
  ) {
    let result;
    const accountWallet = this.getAccount(account, wallet);
    try {
      result = await accountWallet.createAndSendTxWithNativeTokenContribution(
        fee,
        pdeContributionPairID,
        contributedAmount,
        info,
      );
    } catch (e) {
      throw e;
    }
    return result;
  }

  static async createAndSendPTokenContributionTx(
    wallet,
    account,
    tokenParam,
    feeNativeToken,
    feePToken,
    pdeContributionPairID,
    contributedAmount,
  ) {
    let result;
    const accountWallet = this.getAccount(account, wallet);
    try {
      result = await accountWallet.createAndSendPTokenContributionTx(
        tokenParam,
        feeNativeToken,
        feePToken,
        pdeContributionPairID,
        contributedAmount,
      );
    } catch (e) {
      throw e;
    }
    return result;
  }

  static async createAndSendWithdrawDexTx(
    wallet,
    account,
    fee,
    withdrawalToken1IDStr,
    withdrawalToken2IDStr,
    withdrawalShareAmt,
    info = '',
  ) {
    let result;
    const accountWallet = this.getAccount(account, wallet);
    try {
      result = await accountWallet.createAndSendWithdrawDexTx(
        fee,
        withdrawalToken1IDStr,
        withdrawalToken2IDStr,
        withdrawalShareAmt,
        info,
      );
    } catch (e) {
      throw e;
    }
    return result;
  }

  static isNotEnoughCoinErrorCode(error) {
    return error.code === 'WEB_JS_ERROR(-5)';
  }

  static isPendingTx(error) {
    return error.stackTrace.includes(STACK_TRACE.REPLACEMENT);
  }

  static getAccountName(account) {
    new Validator('account', account).object().required();
    return getAccountNameByAccount(account);
  }

  static getPaymentAddress(account) {
    if (account) {
      return account.PaymentAddress || account.paymentAddress;
    }

    return '';
  }

  static async getUTXOs(wallet, account, coinId) {
    if (!wallet || !account) {
      return 0;
    }
    const accountWallet = this.getAccount(account, wallet);
    return (
      (accountWallet?.coinUTXOs &&
        accountWallet?.coinUTXOs[coinId || COINS.PRV_ID]) ||
      0
    );
  }

  static getMaxInputPerTx() {
    return constants.MAX_INPUT_PER_TX;
  }

  static hasExceededMaxInput(wallet, account, coinId) {
    const noOfUTXOs = this.getUTXOs(wallet, account, coinId);
    return noOfUTXOs > this.getMaxInputPerTx();
  }

  /**
   * Create multiple tx to defragment all utxo in account
   * @param {number} fee
   * @param {boolean} isPrivacy
   * @param {object} account
   * @param {object} wallet
   * @param {number} noOfTxs
   * @returns {Promise<*>}
   */
  static async defragmentNativeCoin(
    fee,
    isPrivacy,
    account,
    wallet,
    noOfTxs = this.MAX_DEFRAGMENT_TXS,
  ) {
    if (!wallet) {
      throw new Error('Missing wallet');
    }
    if (!account) {
      throw new Error('Missing account');
    }
    const accountWallet = this.getAccount(account, wallet);
    const result = await accountWallet.defragmentNativeCoin(
      fee,
      isPrivacy,
      this.NO_OF_INPUT_PER_DEFRAGMENT_TX,
      noOfTxs,
    );
    // save wallet
    await saveWallet(wallet);
    await Wallet.resetProgressTx();
    return result;
  }

  static getAccount(defaultAccount, wallet) {
    try {
      new Validator('defaultAccount', defaultAccount).required();
      new Validator('wallet', wallet).required();
      return getAccountWallet(defaultAccount, wallet);
    } catch (error) {
      throw error;
    }
  }

 

  static async getListAccountSpentCoins(defaultAccount, wallet, tokenID) {
    try {
      if (!wallet) {
        throw new Error('Missing wallet');
      }
      if (!defaultAccount) {
        throw new Error('Missing account');
      }
      let tokenId = tokenID || PRV_ID;
      const account = this.getAccount(defaultAccount, wallet);
      const spentCoins = await account.getListSpentCoinsStorage(tokenId);
      return spentCoins || [];
    } catch (error) {
      throw error;
    }
  }

  static async removeCacheBalance(defaultAccount, wallet) {
    try {
      new Validator('wallet', wallet).object();
      new Validator('defaultAccount', defaultAccount).object();
      const account = this.getAccount(defaultAccount, wallet);
      const keyInfo = (await account.getKeyInfo(PRVIDSTR)) || {};
      if (keyInfo?.coinindex) {
        let task = Object.keys(keyInfo.coinindex).map((tokenID) => {
          return account.clearCacheStorage({ tokenID });
        });
        await Promise.all(task);
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  }

  static async getStakingAmount(defaultAccount, wallet, type) {
    try {
      new Validator('defaultAccount', defaultAccount).required();
      new Validator('wallet', wallet).required();
      new Validator('type', type).required().number();
      const account = this.getAccount(defaultAccount, wallet);
      return account.rpc.getStakingAmount(type);
    } catch (error) {
      throw error;
    }
  }

  /**
   * createAndSendStakingTx
   * @param {object} defaultAccount
   * @param {object} wallet
   * @param {number} fee
   */
  static async createAndSendStakingTx({ defaultAccount, wallet, fee }) {
    try {
      new Validator('defaultAccount', defaultAccount).required();
      new Validator('wallet', wallet).required();
      new Validator('fee', fee).required().amount();
      const account = this.getAccount(defaultAccount, wallet);
      return account.createAndSendStakingTx({ transfer: { fee } });
    } catch (error) {
      throw error;
    }
  }

  /**
   * createAndSendStopAutoStakingTx
   * @param {object} defaultAccount
   * @param {object} wallet
   * @param {number} fee
   */
  static async createAndSendStopAutoStakingTx({ defaultAccount, wallet, fee }) {
    try {
      new Validator('defaultAccount', defaultAccount).required();
      new Validator('wallet', wallet).required();
      new Validator('fee', fee).required().amount();
      const account = this.getAccount(defaultAccount, wallet);
      return account.createAndSendStopAutoStakingTx({ transfer: { fee } });
    } catch (error) {
      throw error;
    }
  }

  /**
   * createAndSendWithdrawRewardTx
   * @param {string} tokenID
   * @param {object} defaultAccount
   * @param {object} wallet
   * @param {number} fee
   */
  static async createAndSendWithdrawRewardTx({
    defaultAccount,
    wallet,
    fee,
    tokenID = PRVIDSTR,
  } = {}) {
    new Validator('defaultAccount', defaultAccount).required();
    new Validator('wallet', wallet).required();
    new Validator('fee', fee).required().amount();
    new Validator('tokenID', tokenID).required().string();
    const account = this.getAccount(defaultAccount, wallet);
    return account.createAndSendWithdrawRewardTx({
      transfer: { fee, tokenID },
    });
  }

  static async getUnspentCoinsV1({ account, wallet, fromApi }) {
    fromApi = !!fromApi;
    new Validator('wallet', wallet).required();
    new Validator('account', account).required();
    new Validator('fromApi', fromApi).required().boolean();
    let accountWallet = this.getAccount(account, wallet);
    const unspentCoins = await accountWallet.getUnspentCoinsV1({
      fromApi,
    });
    return {
      unspentCoins,
      accountWallet,
    };
  }

  static async getPDexHistories({ account, wallet, offset, limit }) {
    new Validator('wallet', wallet).required();
    new Validator('account', account).required();
    new Validator('offset', offset).required().number();
    new Validator('limit', limit).required().number();

    let histories = [];
    try {
      const accountWallet = await this.getAccount(account, wallet);
      histories = await accountWallet.getPDexHistories({
        offset,
        limit,
      });
    } catch (error) {
      console.debug('GET PDEX HISTORIES ERROR: ', error);
    }
    return histories.map(
      (history) =>
        new PDexHistoryPureModel({ history, accountName: account.name }),
    );
  }

  static async getPDexStorageHistories({ account, wallet }) {
    new Validator('wallet', wallet).required();
    new Validator('account', account).required();
    let histories = [];
    try {
      const accountWallet = await this.getAccount(account, wallet);
      histories = (await accountWallet.getTxPdexStorageHistories()) || [];
    } catch (error) {
      console.debug('GET PDEX STORAGE HISTORIES ERROR: ', error);
    }
    return histories;
  }
  /**
   * Sign staking pool withdraw
   * @param {object} account
   * @param {object} wallet
   * @param {number} amount
   * @returns {Promise<string>} signatureEncode
   */
  static async signPoolWithdraw({ account, wallet, amount }) {
    new Validator('account', account).required();
    new Validator('wallet', wallet).required();
    new Validator('amount', amount).required();
    const accountWallet = await this.getAccount(account, wallet);
    return await accountWallet.signPoolWithdraw({ amount: amount.toString() });
  }

  static async createSendInitPToken({
    wallet,
    account,
    fee,
    info,
    tokenName,
    tokenSymbol,
    tokenAmount,
  }) {
    new Validator('account', account).required();
    new Validator('wallet', wallet).required();
    new Validator('fee', fee).required().number();
    new Validator('info', info).string();
    new Validator('tokenName', tokenName).required().string();
    new Validator('tokenSymbol', tokenSymbol).required().string();
    new Validator('tokenAmount', tokenAmount).required().string();
    let response;
    try {
      const accountWallet = getAccountWallet(account, wallet);
      response = await accountWallet.createAndSendInitTokenTx({
        transfer: {
          fee,
          info,
          tokenPayments: [
            { Amount: tokenAmount, PaymentAddress: account.PaymentAddress },
          ],
        },
        extra: {
          tokenName,
          tokenSymbol,
        },
      });
    } catch (e) {
      throw e;
    }
    return response;
  }

  static async setSubmitedOTAKey({ wallet, account }) {
    new Validator('account', account).required();
    new Validator('wallet', wallet).required();
    const accountWallet = getAccountWallet(account, wallet);
    const otaKey = accountWallet.getOTAKey();
    return accountWallet.setAccountStorage(otaKey, true);
  }

  static async getTxsTransactor({ wallet, account, tokenID } = {}) {
    new Validator('account', account).required().object();
    new Validator('wallet', wallet).required().object();
    new Validator('tokenID', tokenID).required().string();
    const accountWallet = getAccountWallet(account, wallet);
    return accountWallet.getTxsTransactor({ tokenID });
  }

  static async getTxsTransactorFromStorage({ wallet, account, tokenID } = {}) {
    new Validator('account', account).required().object();
    new Validator('wallet', wallet).required().object();
    new Validator('tokenID', tokenID).required().string();
    const accountWallet = getAccountWallet(account, wallet);
    return accountWallet.getTxsTransactorFromStorage({ tokenID });
  }

  static async createBurningRequest({
    wallet,
    account,
    fee,
    tokenId,
    burnAmount,
    prvPayments,
    info,
    remoteAddress,
    txHashHandler,
    burningType,
  } = {}) {
    new Validator('account', account).required();
    new Validator('wallet', wallet).required();
    new Validator('fee', fee).required().amount();
    new Validator('tokenId', tokenId).required().string();
    new Validator('burnAmount', burnAmount).required().amount();
    new Validator('prvPayments', prvPayments).required().array();
    new Validator('remoteAddress', remoteAddress).required().string();
    new Validator('info', info).string();
    new Validator('burningType', burningType).required().number();

    const accountWallet = getAccountWallet(account, wallet);
    return accountWallet.createAndSendBurningRequestTx({
      transfer: {
        fee,
        tokenID: tokenId,
        prvPayments,
        info,
      },
      extra: {
        remoteAddress,
        burnAmount,
        txHashHandler,
        burningType,
      },
    });
  }

  static async retryExpiredShield({ account, wallet, history }) {
    new Validator('retryExpiredShield-account', account).required();
    new Validator('retryExpiredShield-wallet', wallet).required();
    new Validator('retryExpiredShield-history', history).required().object();
    const accountWallet = getAccountWallet(account, wallet);
    return accountWallet.handleRetryExpiredShield({ history });
  }

  static async getSignPublicKeyEncode({ account, wallet }) {
    try {
      new Validator('getSignPublicKeyEncode-account', account).required();
      new Validator('getSignPublicKeyEncode-wallet', wallet).required();
      const accountWallet = getAccountWallet(account, wallet);
      return accountWallet.getSignPublicKeyEncode();
    } catch (error) {
      throw error;
    }
  }
}
