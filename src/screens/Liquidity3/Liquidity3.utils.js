import BigNumber from 'bignumber.js';
import formatUtil from '@utils/format';

export const FormatPoolItem = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(item => ({
      poolID: item?.PoolID,
      token1Value: item?.Token1Value,
      token2Value: item?.Token2Value,
      token1ID: item?.Token1ID,
      token2ID: item?.Token2ID,
      share: item?.Share,
      volume: item?.Volume,
      dayPercent: item['24h'],
      price: item?.Price,
      AMP: item?.AMP,
      APY: item?.APY,
      verified: item?.Verified,
      priceChange: item?.PriceChange
    }));
  }
  return {
    poolID: obj?.PoolID,
    token1Value: obj?.Token1Value,
    token2Value: obj?.Token2Value,
    token1ID: obj?.Token1ID,
    token2ID: obj?.Token2ID,
    share: obj?.Share,
    volume: obj?.Volume,
    dayPercent: obj['24h'],
    price: obj?.Price,
    AMP: obj?.AMP,
    APY: obj?.APY,
    verified: obj?.Verified,
    priceChange: obj?.PriceChange
  };
};

export const FormatPortfolioItem = (obj) => {
  const keys = Object.keys(obj);
  return keys.map((key) => {
    const item = obj[key];
    return {
      poolID: key,
      token1ID: item?.Token1IDStr,
      token2ID: item?.Token2IDStr,
      token1PoolValue: item?.Token1PoolValue,
      token2PoolValue: item?.Token2PoolValue,
      APY: item?.APY,
      AMP: item?.AMP,
      share: item?.Share,
      totalShare: item?.TotalShare,
      token1Reward: item?.Token1Reward,
      token2Reward: item?.Token2Reward,
      tokenIDs: [item?.Token1IDStr, item?.Token2IDStr]
    };
  });
};

export const getExchangeRate = (token1, token2, token1Value, token2Value) => {
  const rawRate = Math.floor(new BigNumber(token2Value).dividedBy(token1Value / Math.pow(10, token1.pDecimals || 0)).toNumber());
  return `1 ${token1.symbol} = ${formatUtil.amount(rawRate, token2.pDecimals)} ${token2?.symbol}`;
};

export const getPrincipal = (token1, token2, token1Value, token2Value) => {
  const token1Str = `${formatUtil.amount(token1Value, token1.pDecimals)} ${token1.symbol}`;
  const token2Str = `${formatUtil.amount(token2Value, token2.pDecimals)} ${token2.symbol}`;
  return `${token1Str} + ${token2Str}`;
};

export const getShareStr = (share, totalShare) => {
  const percent = formatUtil.toFixed(new BigNumber(share).dividedBy(totalShare || 1).multipliedBy(100).toNumber(), 7);
  return `${share} (${percent}%)`;
};

export const getReward = (token1, token2, token1Value, token2Value) => {
  const token1Str = `${formatUtil.amount(token1Value, token1.pDecimals)} ${token1.symbol}`;
  const token2Str = `${formatUtil.amount(token2Value, token2.pDecimals)} ${token2.symbol}`;
  return `${token1Str} + ${token2Str}`;
};
