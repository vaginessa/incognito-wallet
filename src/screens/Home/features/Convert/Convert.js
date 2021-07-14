import React from 'react';
import { View } from 'react-native';
import { Header, LoadingContainer } from '@src/components';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout';
import ConvertStep from '@screens/Home/features/ConvertStep';
import { useSelector } from 'react-redux';
import { convertCoinsDataSelector } from '@screens/Home/features/Convert/Convert.selector';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { Toast } from '@components/core';
import { MESSAGES } from '@screens/Dex/constants';
import KeepAwake from 'react-native-keep-awake';

const Convert = () => {
  const { isFetching, isConverting, isConverted } = useSelector(convertCoinsDataSelector);
  const fetchCoinsV1 = useNavigationParam('fetchCoinsV1');
  const navigation = useNavigation();
  const renderContent = () => (
    <ConvertStep />
  );

  return (
    <View style={{ flex: 1 }}>
      <Header
        title="Convert Transactions"
        onGoBack={() => {
          if (isConverting) {
            return Toast.showInfo(MESSAGES.CONVERT_PROCESS);
          }
          if (isConverted && typeof fetchCoinsV1 === 'function') {
            fetchCoinsV1();
          }
          navigation.goBack();
        }}
      />
      {isFetching ? <LoadingContainer /> : renderContent()}
      <KeepAwake />
    </View>
  );
};

export default compose(
  withLayout_2,
)(React.memo(Convert));
