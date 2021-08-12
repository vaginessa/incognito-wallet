import Server from '@src/services/wallet/Server';
import storage from '@src/services/storage';
import { PDexV3, Validator } from 'incognito-chain-web-js/build/wallet';
import BigNumber from 'bignumber.js';
import format from '@src/utils/format';

export const getPDexV3Instance = async ({ otaKey }) => {
  const server = await Server.getDefault();
  new Validator('getPDexV3Instance-otaKey', otaKey).required().string();
  let pDexV3Inst = new PDexV3();
  pDexV3Inst.setRPCTradeService(server.tradeServices);
  pDexV3Inst.setStorageServices(storage);
  pDexV3Inst.setOTAKey(otaKey);

  return pDexV3Inst;
};

export const getPairRate = ({ token1, token2, token1Value, token2Value }) => {
  const rawRate = new BigNumber(token2Value)
    .dividedBy(
      new BigNumber(token1Value).dividedBy(Math.pow(10, token1.pDecimals || 0)),
    )
    .toFixed()
    .toString();
  return rawRate;
};

export const getExchangeRate = (token1, token2, token1Value, token2Value) => {
  const rawRate = getPairRate({ token1, token2, token1Value, token2Value });
  return `1 ${token1.symbol} = ${format.amount(rawRate, token2.pDecimals)} ${
    token2?.symbol
  }`;
};

export const getPrincipal = (token1, token2, token1Value, token2Value) => {
  const token1Str = `${format.amount(token1Value, token1.pDecimals)} ${
    token1.symbol
  }`;
  const token2Str = `${format.amount(token2Value, token2.pDecimals)} ${
    token2.symbol
  }`;
  return `${token1Str} + ${token2Str}`;
};

export const getShareStr = (share, totalShare) => {
  const percent = format.toFixed(
    new BigNumber(share)
      .dividedBy(totalShare || 1)
      .multipliedBy(100)
      .toString(),
    7,
  );
  return `${share} (${percent}%)`;
};

export const getReward = (token1, token2, token1Value, token2Value) => {
  const token1Str = `${format.amount(token1Value, token1.pDecimals)} ${
    token1.symbol
  }`;
  const token2Str = `${format.amount(token2Value, token2.pDecimals)} ${
    token2.symbol
  }`;
  return `${token1Str} + ${token2Str}`;
};
