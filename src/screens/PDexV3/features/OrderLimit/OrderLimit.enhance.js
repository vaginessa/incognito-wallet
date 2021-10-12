import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { COLORS, FONT } from '@src/styles';
import { actionToggleModal } from '@src/components/Modal';
import { TradeSuccessModal } from '@screens/PDexV3/features/Trade';
import { orderLimitDataSelector } from './OrderLimit.selector';
import {
  actionInit,
  actionReset,
  actionSetDefaultPool,
  actionBookOrder,
} from './OrderLimit.actions';
import { TAB_BUY_ID, TAB_SELL_ID } from './OrderLimit.constant';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const handleUnmount = async () => {
    await dispatch(actionSetDefaultPool());
    dispatch(actionReset());
  };
  const actionChangeTab = () => dispatch(actionInit());
  const { sellColor, buyColor, disabledBtn, cfmTitle } = useSelector(
    orderLimitDataSelector,
  );
  const tabsFactories = [
    {
      tabID: TAB_BUY_ID,
      label: 'Buy',
      onChangeTab: actionChangeTab,
      titleStyled: {
        color: COLORS.white,
        fontSize: FONT.SIZE.medium,
        fontFamily: FONT.NAME.medium,
      },
      titleDisabledStyled: { color: COLORS.colorGrey3 },
      tabStyled: {
        backgroundColor: buyColor,
        flex: 1,
      },
      tabStyledDisabled: {
        backgroundColor: 'transparent',
      },
    },
    {
      tabID: TAB_SELL_ID,
      label: 'Sell',
      onChangeTab: actionChangeTab,
      titleStyled: {
        color: COLORS.white,
        fontSize: FONT.SIZE.medium,
        fontFamily: FONT.NAME.medium,
      },
      titleDisabledStyled: { color: COLORS.colorGrey3 },
      tabStyled: {
        backgroundColor: sellColor,
        flex: 1,
      },
      tabStyledDisabled: {
        backgroundColor: 'transparent',
      },
    },
  ];
  const handleConfirm = async () => {
    try {
      const tx = await dispatch(actionBookOrder());
      if (tx) {
        dispatch(
          actionToggleModal({
            data: (
              <TradeSuccessModal
                title="Order initiated!"
                desc={cfmTitle}
                sub={
                  'Your balance will update in a couple of\nminutes after the trade is finalized.'
                }
                handleTradeSucesss={() => dispatch(actionInit())}
              />
            ),
            visible: true,
          }),
        );
      }
    } catch {
      //
    }
  };
  React.useEffect(() => {
    dispatch(actionInit());
    return () => {
      handleUnmount();
    };
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleConfirm, tabsFactories }} />
    </ErrorBoundary>
  );
};

export default compose(enhance);
