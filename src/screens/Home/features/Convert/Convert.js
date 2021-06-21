import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import {Header, LoadingContainer} from '@src/components';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout';
import withData from '@screens/Home/features/Convert/Convert.enhanceData';
import withConvert from '@screens/Home/features/Convert/Convert.enhance';
import ConvertStep from '@screens/Home/features/Convert/Components/Step';

const Convert = (props) => {
  const {
    steps,
    appLoading,
    currentStep
  } = props;

  const renderContent = () => (
    <ConvertStep steps={steps} currentStep={currentStep} />
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title="Convert Transaction" />
      {appLoading ? <LoadingContainer /> : renderContent()}
    </View>
  );
};

Convert.propTypes = {
  steps: PropTypes.array,
  appLoading: PropTypes.bool.isRequired,
  currentStep: PropTypes.string.isRequired,
};

Convert.defaultProps = {
  steps: []
};

export default compose(
  withLayout_2,
  withData,
  withConvert,
)(React.memo(Convert));
