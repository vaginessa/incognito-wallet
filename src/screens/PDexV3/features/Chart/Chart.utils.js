import BigNumber from 'bignumber.js';
import convert from '@src/utils/convert';
import format from '@src/utils/format';
import { getPairRate } from '@screens/PDexV3';

export const mappingOrderBook = (params) => {
  let result = [];
  try {
    const { data = [], token1, token2, isBuy = false, isSell = false } = params;
    result = data.map(
      ({
        token1Amount: token1Value,
        token2Amount: token2Value,
        token1Balance,
        token2Balance,
      }) => {
        const priceStr = getPairRate({
          token1,
          token2,
          token1Value,
          token2Value,
        });
        const price = convert.toNumber(priceStr, true);
        let volumeOriginalAmount = 0,
          volume,
          volumeStr;
        if (isBuy) {
          volumeOriginalAmount = token2Balance;
          volume = convert.toHumanAmount(
            volumeOriginalAmount,
            token2?.pDecimals,
          );
          volume = new BigNumber(volume)
            .dividedBy(new BigNumber(price))
            .toNumber();
          volumeOriginalAmount = convert.toOriginalAmount(
            volume,
            token2.pDecimals,
          );
          volumeStr = format.amountFull(volumeOriginalAmount, token2?.pDecimals, true);
        } else if (isSell) {
          volumeOriginalAmount = token1Balance;
          volume = convert.toHumanAmount(
            volumeOriginalAmount,
            token1?.pDecimals,
          );
          volumeStr = format.amountFull(
            volumeOriginalAmount,
            token1?.pDecimals,
            true,
          );
        }
        const res = {
          price,
          priceStr,
          volume,
          volumeStr,
        };
        return res;
      },
    );
  } catch (error) {
    console.log('mappingOrderBook-error', error);
  }
  return result;
};
