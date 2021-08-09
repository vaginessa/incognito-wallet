import includes from 'lodash/includes';
import toLower from 'lodash/toLower';

const searchByToken = (token, keySearch) =>
  includes(toLower(token?.displayName), keySearch) ||
  includes(toLower(token?.name), keySearch) ||
  includes(toLower(token?.symbol), keySearch) ||
  includes(toLower(token?.pSymbol), keySearch) ||
  includes(toLower(token?.networkName), keySearch) ||
  includes(toLower(token?.contractId), keySearch) ||
  includes(toLower(token?.tokenId), keySearch);

export const handleFilterPoolByKeySeach = ({ data, keySearch }) =>
  data.filter(
    (pool) =>
      searchByToken(pool?.token1, keySearch) ||
      searchByToken(pool?.token2, keySearch),
  );
