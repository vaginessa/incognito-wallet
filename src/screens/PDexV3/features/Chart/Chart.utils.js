import format from '@src/utils/format';
import orderBy from 'lodash/orderBy';

export const mappingOrderBook = ({ data = [], token1 } = {}) => {
  try {
    return orderBy(
      data.map(({ price, volume }) => ({
        price,
        volume,
        priceStr: format.amountFull(price, token1?.pDecimals, true),
        volumeStr: format.amountFull(volume, token1?.pDecimals, true),
      })),
      (o) => o?.price,
      'desc',
    );
  } catch (error) {
    console.log(error);
  }
  return data;
};
