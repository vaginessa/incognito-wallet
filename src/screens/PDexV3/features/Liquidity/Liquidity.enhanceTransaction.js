import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {actionGetPDexV3Inst} from '@screens/PDexV3';
import {useDispatch} from 'react-redux';
import {ExHandler} from '@services/exception';
import Loading from '@screens/Dex/components/Loading';

const withTransaction = WrappedComp => props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onCreateContributes = async ({ fee, tokenId1, tokenId2, amount1, amount2, poolPairID }) => {
    if (loading) return;
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
      });
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
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      await pDexV3Inst.createContributeTxs({
        fee,
        tokenId1,
        tokenId2,
        amount1,
        amount2,
        amp
      });
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
          loading,
          error,
        }}
      />
      <Loading open={loading} />
      {/*<SuccessModal />*/}
    </ErrorBoundary>
  );
};

export default withTransaction;
