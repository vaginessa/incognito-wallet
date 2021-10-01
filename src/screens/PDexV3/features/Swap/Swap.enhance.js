import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import { TradeSuccessModal } from '@src/screens/PDexV3/features/Trade';
import {
  actionInitSwapForm,
  actionReset,
  actionFetchSwap,
} from './Swap.actions';
import { swapInfoSelector } from './Swap.selector';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const swapInfo = useSelector(swapInfoSelector);
  const initSwapForm = React.useCallback(() => {
    dispatch(actionInitSwapForm());
  }, []);
  const handleConfirm = async () => {
    try {
      const tx = await dispatch(actionFetchSwap());
      if (tx) {
        dispatch(
          actionToggleModal({
            data: (
              <TradeSuccessModal
                title="Trade inited"
                desc={`You placed an order to sell ${swapInfo?.sellInputAmountStr ||
                  ''} for ${swapInfo?.buyInputAmountStr || ''}.`}
                handleTradeSucesss={initSwapForm}
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
    initSwapForm();
    return () => {
      dispatch(actionReset());
    };
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleConfirm }} />
    </ErrorBoundary>
  );
};

export default enhance;
