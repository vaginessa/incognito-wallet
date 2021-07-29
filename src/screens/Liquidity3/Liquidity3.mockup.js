import { FormatPoolItem, FormatPortfolioItem } from '@screens/Liquidity3/Liquidity3.utils';

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

export const MOCKUP_PORTFOLIO = FormatPortfolioItem({
  'pdepool-2792627-0000000000000000000000000000000000000000000000000000000000000004-5f7d18482004c729d2ee5c735841a29a7eb4f880e6dbd5c9ee7cf1d43e674969': {
    'Token1IDStr': '0000000000000000000000000000000000000000000000000000000000000004',
    'Token1PoolValue': 10000000000,
    'Token2IDStr': '4584d5e9b2fc0337dfb17f4b5bb025e5b82c38cfa4f54e8a3d4fcdd03954ff82',
    'Token2PoolValue': 30000000000000,
    'APY': 4,
    'AMP': 2,
    'Share': 10000,
    'TotalShare': 4000000,
    'Token1Reward': 10000000,
    'Token2Reward': 1000000
  },
  'pdepool-2792627-0000000000000000000000000000000000000000000000000000000000000004-5fc0ddbca719a08947ab404f748e7acb425ff2c7bdda9854bc7d8b6420b106dd': {
    'Token1IDStr': '0000000000000000000000000000000000000000000000000000000000000004',
    'Token1PoolValue': 1500000000000,
    'Token2IDStr': 'cd57197b44be6a7846c51a5ca5881f91f82afe33b47c2a7c6042fa4e4c646b81',
    'Token2PoolValue': 2000000000000,
    'APY': 4,
    'AMP': 2,
    'Share': 10000,
    'TotalShare': 4000000,
    'Token1Reward': 10000000,
    'Token2Reward': 1000000
  }
});
