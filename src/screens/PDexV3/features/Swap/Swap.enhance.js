import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import { TradeSuccessModal } from '@src/screens/PDexV3/features/Trade';
import { focus } from 'redux-form';
import { actionCheckNeedFaucetPRV } from '@src/redux/actions/token';
import FaucetPRVModal from '@src/components/Modal/features/FaucetPRVModal';
import { formConfigs } from './Swap.constant';
import {
  actionInitSwapForm,
  actionReset,
  actionFetchSwap,
  actionToggleProTab,
} from './Swap.actions';
import {
  swapInfoSelector,
  swapFormErrorSelector,
  sellInputTokenSeletor,
} from './Swap.selector';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const swapInfo = useSelector(swapInfoSelector);
  const formErrors = useSelector(swapFormErrorSelector);
  const sellInputToken = useSelector(sellInputTokenSeletor);
  const unmountSwap = () => {
    dispatch(actionReset());
  };
  const initSwapForm = (refresh = false) =>
    dispatch(
      actionInitSwapForm({
        defaultPair: swapInfo?.defaultPair,
        refresh,
        shouldFetchHistory: true,
      }),
    );
  const handleConfirm = async () => {
    try {
      const fields = [formConfigs.selltoken, formConfigs.buytoken];
      for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        if (formErrors[field]) {
          return dispatch(focus(formConfigs.formName, field));
        }
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
      if (!sellInputToken.isMainCrypto) {
        const needFaucet = await dispatch(
          actionCheckNeedFaucetPRV(<FaucetPRVModal />),
        );
        if (needFaucet) {
          return;
        }
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
