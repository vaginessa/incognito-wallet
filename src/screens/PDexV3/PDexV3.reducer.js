import { combineReducers } from 'redux';
import { homeReducer as home } from './features/Home';
import { portfolioReducer as portfolio } from './features/Portfolio';
import { poolsReducer as pools } from './features/Pools';
import { swapReducer as swap } from './features/Swap';
import { orderLimitReducer as orderLimit } from './features/OrderLimit';

const pDexV3Reducer = combineReducers({
  home,
  portfolio,
  pools,
  swap,
  orderLimit,
});

export default pDexV3Reducer;
