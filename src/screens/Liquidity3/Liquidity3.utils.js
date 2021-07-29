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
