import { activedTabSelector } from '@src/components/core/Tabs/Tabs.selector';
import { COLORS } from '@src/styles';
import { createSelector } from 'reselect';
import {
  ROOT_TAB_ORDER_LIMIT,
  TAB_BUY_ID,
  TAB_SELL_ID,
} from './OrderLimit.constant';

export const orderLimitSelector = createSelector(
  (state) => state.orderLimit,
  (orderLimit) => orderLimit,
);

export const orderLimitDataSelector = createSelector(
  orderLimitSelector,
  activedTabSelector,
  (orderLimit, getActivedTab) => {
    const activedTab = getActivedTab(ROOT_TAB_ORDER_LIMIT);
    console.log('acitvedTab', activedTab);
    let btnActionTitle;
    const buyColor = COLORS.green;
    const sellColor = COLORS.red;
    let mainColor;
    switch (activedTab) {
    case TAB_SELL_ID: {
      mainColor = sellColor;
      btnActionTitle = 'Sell PRV';
      break;
    }
    case TAB_BUY_ID: {
      mainColor = buyColor;
      btnActionTitle = 'Buy PRV';
      break;
    }
    default:
      break;
    }
    return {
      mainColor,
      buyColor,
      sellColor,
      btnActionTitle,
    };
  },
);
