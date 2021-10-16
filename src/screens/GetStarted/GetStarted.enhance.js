import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { compose } from 'recompose';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '@src/services/auth';
import { ANALYTICS } from '@src/constants';
import { reloadWallet } from '@src/redux/actions/wallet';
import { getPTokenList, getInternalTokenList } from '@src/redux/actions/token';
import routeNames from '@src/router/routeNames';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import serverService from '@src/services/wallet/Server';
import { actionInit as initNotification } from '@src/screens/Notification';
import { actionFetch as actionFetchHomeConfigs } from '@screens/Home/Home.actions';
import { useNavigation } from 'react-navigation-hooks';
import { LoadingContainer, Text, View } from '@src/components/core';
import { actionFetch as actionFetchProfile } from '@screens/Profile';
import { getFunctionConfigs } from '@services/api/misc';
import {
  loadAllMasterKeyAccounts,
  loadAllMasterKeys,
} from '@src/redux/actions/masterKey';
import withPin from '@components/pin.enhance';
import KeepAwake from 'react-native-keep-awake';
import { COLORS, FONT } from '@src/styles';
import { accountServices } from '@src/services/wallet';
import { actionLogEvent } from '@src/screens/Performance';
import { requestUpdateMetrics } from '@src/redux/actions/app';
import { wizardSelector } from './GetStarted.selector';
import withDetectStatusNetwork from './GetStarted.enhanceNetwork';
import withWizard from './GetStarted.enhanceWizard';
import withWelcome from './GetStarted.enhanceWelcome';

const subStyled = StyleSheet.create({
  mainText: {
    color: COLORS.colorGreyBold,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 5,
    textAlign: 'center',
  },
  subText: {
    color: COLORS.colorGreyBold,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
    textAlign: 'center',
    marginTop: 5,
  },
});

const SubComponent = React.memo((props) => {
  const { statusConfigs } = props;
  const { isFetched } = useSelector(wizardSelector);
  return (
    <LoadingContainer
      size="large"
      custom={
        isFetched && (
          <View>
            <Text style={{ ...subStyled.mainText, marginTop: 30 }}>
              This may take a couple of minutes.
            </Text>
            {statusConfigs === 'loading all master keys' && (
              <Text style={subStyled.mainText}>
                Please do not navigate away from the app.
              </Text>
            )}
            <Text style={subStyled.subText}>{`(${statusConfigs}...)`}</Text>
          </View>
        )
      }
    />
  );
});

const enhance = (WrappedComp) => (props) => {
  const [statusConfigs, setStatusConfigs] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setError] = React.useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const getErrorMsg = (error) => {
    const errorMessage = new ExHandler(
      error,
      'Something\'s not quite right. Please make sure you\'re connected to the internet.\n' +
        '\n' +
        'If your connection is strong but the app still won\'t load, please contact us at go@incognito.org.\n',
    )?.writeLog()?.message;
    return errorMessage;
  };
  const configsApp = async () => {
    try {
      await setLoading(true);
      await setStatusConfigs('loading');
      await login();
      await setStatusConfigs('getting configs');
      const [servers] = await new Promise.all([
        serverService.get(),
        dispatch(actionFetchProfile()),
      ]);
      if (!servers || servers?.length === 0) {
        await serverService.setDefaultList();
      }
      navigation.navigate(routeNames.Home);
    } catch (error) {
      console.log('CONFIGS APP ERROR', error);
      await setError(getErrorMsg(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onRetry = async () => {
    try {
      await configsApp();
    } catch {
      //
    }
  };

  React.useEffect(() => {
    onRetry();
  }, []);

  const renderMain = () => {
    if (loading) {
      return <SubComponent {...{ statusConfigs }} />;
    }
    return <WrappedComp {...{ ...props, errorMsg, loading, onRetry }} />;
  };

  return (
    <ErrorBoundary>
      {renderMain()}
      <KeepAwake />
    </ErrorBoundary>
  );
};

export default compose(
  withDetectStatusNetwork,
  withWizard,
  withPin,
  withWelcome,
  enhance,
);
