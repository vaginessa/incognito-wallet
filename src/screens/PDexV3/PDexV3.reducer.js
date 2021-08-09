import { combineReducers } from 'redux';
import { homeReducer as home } from './features/Home';
import { portfolioReducer as portfolio } from './features/Portfolio';
import { poolsReducer as pools } from './features/Pools';

const pDexV3Reducer = combineReducers({
  home,
  portfolio,
  pools,
});

export default pDexV3Reducer;
