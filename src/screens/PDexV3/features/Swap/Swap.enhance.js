import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import { TradeSuccessModal } from '@src/screens/PDexV3/features/Trade';
import { focus } from 'redux-form';
import { formConfigs } from './Swap.constant';
import {
  actionInitSwapForm,
  actionReset,
  actionFetchSwap,
  actionToggleProTab,
} from './Swap.actions';
import { swapInfoSelector, swapFormErrorSelector } from './Swap.selector';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const swapInfo = useSelector(swapInfoSelector);
  const formErrors = useSelector(swapFormErrorSelector);
  const unmountSwap = () => {
    dispatch(actionReset());
  };
  const initSwapForm = (refresh = false) =>
    dispatch(
      actionInitSwapForm({ defaultPair: swapInfo?.defaultPair, refresh }),
    );
  const handleConfirm = async () => {
    try {
      if (formErrors[formConfigs.selltoken]) {
        return dispatch(focus(formConfigs.formName, formConfigs.selltoken));
      }
      if (formErrors[formConfigs.buytoken]) {
        return dispatch(focus(formConfigs.formName, formConfigs.buytoken));
      }
      if (
        swapInfo?.disabledBtnSwap &&
        !formErrors[formConfigs.selltoken] &&
        !formErrors[formConfigs.buytoken] &&
        (!!formErrors[formConfigs.slippagetolerance] ||
          !!formErrors[formConfigs.feetoken])
      ) {
        dispatch(actionToggleProTab(true));
        return;
      }
      const tx = await dispatch(actionFetchSwap());
      if (tx) {
        dispatch(
          actionToggleModal({
            data: (
              <TradeSuccessModal
                title="Order initiated!"
                desc={`You placed an order to sell\n${swapInfo?.sellInputAmountStr ||
                  ''} for ${swapInfo?.buyInputAmountStr || ''}.`}
                handleTradeSucesss={() => initSwapForm()}
                sub={
                  'Your balance will update in a couple of\nminutes after the trade is finalized.'
                }
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
    initSwapForm(true);
    return () => {
      unmountSwap();
    };
  }, []);

  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleConfirm, initSwapForm }} />
    </ErrorBoundary>
  );
};

export default enhance;
