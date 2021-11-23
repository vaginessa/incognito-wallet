import React from 'react';
import { useSelector, useDispatch, batch } from 'react-redux';
import { getFormSyncErrors, focus } from 'redux-form';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { actionToggleModal } from '@src/components/Modal';
import { TradeSuccessModal } from '@screens/PDexV3/features/Trade';
import { actionSetNFTTokenData } from '@src/redux/actions/account';
import { NFTTokenModal } from '@screens/PDexV3/features/NFTToken';
import { LoadingContainer } from '@src/components/core';
import { actionCheckNeedFaucetPRV, getBalance } from '@src/redux/actions/token';
import { PRV } from '@src/constants/common';
import FaucetPRVModal from '@src/components/Modal/features/FaucetPRVModal';
import { formConfigs } from './OrderLimit.constant';
import {
  orderLimitDataSelector,
  orderLimitSelector,
  sellInputAmountSelector,
} from './OrderLimit.selector';
import {
  actionInit,
  actionBookOrder,
  actionSetPoolSelected,
  actionResetOrdersHistory,
} from './OrderLimit.actions';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const { cfmTitle, disabledBtn } = useSelector(orderLimitDataSelector);
  const { isFetching, isFetched } = useSelector(orderLimitSelector);
  const sellInputAmount = useSelector(sellInputAmountSelector);
  const formErrors = useSelector((state) =>
    getFormSyncErrors(formConfigs.formName)(state),
  );
  const handleConfirm = async () => {
    try {
      const fields = [
        formConfigs.selltoken,
        formConfigs.buytoken,
        formConfigs.rate,
      ];
      for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        if (formErrors[field]) {
          return dispatch(focus(formConfigs.formName, field));
        }
      }
      if (!sellInputAmount.isMainCrypto) {
        const needFaucet = await dispatch(
          actionCheckNeedFaucetPRV(<FaucetPRVModal />),
        );
        if (needFaucet) {
          return;
        }
      }
      const { nftTokenAvailable } = await dispatch(actionSetNFTTokenData());
      if (!nftTokenAvailable) {
        return dispatch(
          actionToggleModal({
            visible: true,
            shouldCloseModalWhenTapOverlay: true,
            data: <NFTTokenModal />,
          }),
        );
      }
      if (disabledBtn) {
        return;
      }
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
                handleTradeSucesss={() => {
                  batch(() => {
                    dispatch(actionInit());
                  });
                }}
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
  const onRefresh = () => {
    dispatch(actionInit());
  };
  const callback = async (poolId) => {
    dispatch(actionResetOrdersHistory());
    await dispatch(actionSetPoolSelected(poolId));
    dispatch(actionInit(true));
  };
  React.useEffect(() => {
    dispatch(actionInit(true));
  }, []);
  if (isFetching && !isFetched) {
    return <LoadingContainer />;
  }
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleConfirm, onRefresh, callback }} />
    </ErrorBoundary>
  );
};

export default compose(enhance);
