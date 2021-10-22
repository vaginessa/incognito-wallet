import React from 'react';
import { compose } from 'recompose';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch } from 'react-redux';
import { login } from '@src/services/auth';
import routeNames from '@src/router/routeNames';
import { ExHandler } from '@src/services/exception';
import serverService from '@src/services/wallet/Server';
import { useNavigation } from 'react-navigation-hooks';
import { actionFetch as actionFetchProfile } from '@screens/Profile';
import withPin from '@components/pin.enhance';
import KeepAwake from 'react-native-keep-awake';
import { getInternalTokenList, getPTokenList } from '@src/redux/actions/token';
import { actionLoadDefaultWallet } from '@src/redux/actions/masterKey';
import withDetectStatusNetwork from './GetStarted.enhanceNetwork';
import withWizard from './GetStarted.enhanceWizard';
import withWelcome from './GetStarted.enhanceWelcome';

const enhance = (WrappedComp) => (props) => {
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
    console.time('CONFIGS_APP');
    try {
      await setLoading(true);
      await login();
      const [servers] = await new Promise.all([
        serverService.get(),
        dispatch(actionFetchProfile()),
        dispatch(getPTokenList()),
        dispatch(getInternalTokenList()),
        dispatch(actionLoadDefaultWallet()),
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
    console.timeEnd('CONFIGS_APP');
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

  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, errorMsg, loading, onRetry }} />
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
