import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import Modal from '@components/Modal';
import useFeatureConfig from '@src/shared/hooks/featureConfig';
import appConstant from '@src/constants/app';
import AppMaintain from '@components/AppMaintain';

const withTab = (WrappedComp) => (props) => {
  const [_, isDisabled] = useFeatureConfig(appConstant.DISABLED.TRADE);
  if (isDisabled) {
    return <AppMaintain />;
  }
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
      <Modal />
    </ErrorBoundary>
  );
};

export default withTab;
