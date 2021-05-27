import { Validator } from 'incognito-chain-web-js/build/wallet';

export const getAccountNameByAccount = (account) => {
  new Validator('account', account).object().required();
  if (account) {
    return account.name || account.AccountName || account.accountName;
  }
  return '';
};

export const getAccountWallet = (account, wallet) => {
  try {
    new Validator('account', account).object().required();
    new Validator('wallet', wallet).object().required();
    const indexAccount = wallet.getAccountIndexByName(
      getAccountNameByAccount(account),
    );
    let accountWallet = wallet.MasterAccount.child[indexAccount];
    if (!accountWallet) {
      return {};
    }
    new Validator('accountWallet', accountWallet).object();
    new Validator('wallet.RpcClient', wallet.RpcClient).string();
    new Validator('wallet.Storage', wallet.Storage).object();
    new Validator('wallet.RpcCoinService', wallet.RpcCoinService).string();
    new Validator('wallet.PrivacyVersion', wallet.PrivacyVersion).number();
    new Validator('wallet.PubsubService', wallet.PubsubService).string();
    accountWallet.setRPCClient(wallet.RpcClient);
    accountWallet.setStorageServices(wallet.Storage);
    accountWallet.setRPCCoinServices(wallet.RpcCoinService);
    accountWallet.setPrivacyVersion(wallet.PrivacyVersion);
    accountWallet.setRPCTxServices(wallet.PubsubService);
    // accountWallet.setUseLegacyEncoding(wallet.UseLegacyEncoding);
    return accountWallet;
  } catch (error) {
    throw error;
  }
};
