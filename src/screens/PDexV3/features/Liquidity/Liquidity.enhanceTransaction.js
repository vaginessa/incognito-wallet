import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {actionGetPDexV3Inst} from '@screens/PDexV3';
import {batch, useDispatch} from 'react-redux';
import {ExHandler} from '@services/exception';
import Loading from '@screens/Dex/components/Loading';
import {liquidityHistoryActions} from '@screens/PDexV3/features/LiquidityHistories';
import {SUCCESS_MODAL} from '@screens/PDexV3/features/Liquidity/index';
import {useNavigationParam} from 'react-navigation-hooks';
import {SuccessModal} from '@src/components';

const withTransaction = WrappedComp => props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState('');
  const [successData, setSuccessData] = React.useState('');
  const onSuccess = useNavigationParam('onSuccess');
  console.log('onSuccess', onSuccess);
  const onShowSuccess = () => {
    setTimeout(() => { setVisible(true); }, 500);
  };
  const onClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (typeof onSuccess !== 'function') return;
      batch(() => {
        liquidityHistoryActions.actionGetHistories();
        onSuccess();
      });
    }, 500);
  };
  const onCreateContributes = async ({ fee, tokenId1, tokenId2, amount1, amount2, poolPairID, amp, nftId }) => {
    if (loading) return;
    setSuccessData(SUCCESS_MODAL.ADD_POOL);
    try {
      setLoading(true);
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      await pDexV3Inst.createContributeTxs({
        fee,
        tokenId1,
        tokenId2,
        amount1,
        amount2,
        poolPairID,
        amp,
        nftId,
      });
      onShowSuccess();
    } catch (error) {
      setError(new ExHandler(error).getMessage(error?.message));
    } finally {
      setLoading(false);
    }
  };
  const onCreateNewPool = async ({ fee, tokenId1, tokenId2, amount1, amount2, amp }) => {
    if (loading) return;
    try {
      setLoading(true);
      setSuccessData(SUCCESS_MODAL.CREATE_POOL);
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      await pDexV3Inst.createContributeTxs({
        fee,
        tokenId1,
        tokenId2,
        amount1,
        amount2,
        poolPairID: '',
        amp
      });
      onShowSuccess();
    } catch (error) {
      setError(new ExHandler(error).getMessage(error?.message));
    } finally {
      setLoading(false);
    }
  };
  const onRemoveContribute = async ({ fee, poolTokenIDs, poolPairID, shareAmount, nftID }) => {
    if (loading) return;
    try {
      setLoading(true);
      setSuccessData(SUCCESS_MODAL.REMOVE_POOL);
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      await pDexV3Inst.createAndSendWithdrawContributeRequestTx({
        fee, poolTokenIDs, poolPairID, shareAmount, nftID
      });
      onShowSuccess();
    } catch (error) {
      setError(new ExHandler(error).getMessage(error?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onCreateContributes,
          onCreateNewPool,
          onRemoveContribute,
          loading,
          error,
        }}
      />
      <Loading open={loading} />
      <SuccessModal
        closeSuccessDialog={onClose}
        title={successData.title}
        buttonTitle="Ok"
        description={successData.desc}
        extraInfo="Please wait for your balance to update."
        visible={visible}
      />
    </ErrorBoundary>
  );
};

export default withTransaction;
