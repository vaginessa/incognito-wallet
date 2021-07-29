import axios from 'axios';
import {FormatPoolItem} from '@screens/Liquidity3/Liquidity3.utils';
import isEmpty from 'lodash/isEmpty';

export const apiSearchPools = async (searchText) => {
  if (!searchText) return [];
  const url = 'https://54ed4c3d-993b-4fc1-accd-7e7e72122248.mock.pstmn.io/pdex/v3/listpools?pair=bt';
  const data = (await axios.get(url)).data?.Result || [];
  return FormatPoolItem(data);
};

export const apiGetFavoritePool = async (poolIDs) => {
  if (isEmpty(poolIDs)) return [];
  const url = 'https://54ed4c3d-993b-4fc1-accd-7e7e72122248.mock.pstmn.io/pdex/v3/poolsdetail';
  const data = (await axios.post(url, {
    'PoolIDs': poolIDs
  })).data?.Result || [];
  return FormatPoolItem(data);
};

