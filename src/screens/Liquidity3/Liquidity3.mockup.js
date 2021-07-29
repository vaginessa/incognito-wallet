import { FormatPoolItem } from '@screens/Liquidity3/Liquidity3.utils';

export const MOCKUP_FAVORITE_POOLS = FormatPoolItem([
  {
    'PoolID': '111',
    'Token1Value': 100000,
    'Token2Value': 10000,
    'Token1ID': '4584d5e9b2fc0337dfb17f4b5bb025e5b82c38cfa4f54e8a3d4fcdd03954ff82',
    'Token2ID': '0000000000000000000000000000000000000000000000000000000000000004',
    'Share': 152323,
    'Volume': 132130,
    '24h': 5,
    'Price': 10,
    'AMP': 2,
    'APY': 60,
    'Verified': true,
    'PriceChange': 12123
  },
  {
    'PoolID': '222',
    'Token1Value': 100000,
    'Token2Value': 10000,
    'Token1ID': '4584d5e9b2fc0337dfb17f4b5bb025e5b82c38cfa4f54e8a3d4fcdd03954ff82',
    'Token2ID': '0000000000000000000000000000000000000000000000000000000000000004',
    'Share': 152323,
    'Volume': 2233,
    '24h': -10,
    'Price': 10,
    'AMP': 2,
    'APY': 40,
    'Verified': false,
    'PriceChange': 24424
  },
]);
