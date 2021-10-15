import React, { useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
import AppUpdater from '@components/AppUpdater';
import { WithdrawHistory } from '@models/dexHistory';
import routeNames from '@src/router/routeNames';
import AddPin from '@screens/AddPIN';
import { loadPin } from '@src/redux/actions/pin';
import ErrorBoundary from './ErrorBoundary';

const withPin = (WrappedComp) => (props) => {
  const navigation = useNavigation();
  const pinState = useSelector((state) => state?.pin);
  const { pin, authen } = pinState;
  const [mounted, setMounted] = React.useState(false);
  const dispatch = useDispatch();
  const handleLoadPin = async () => dispatch(loadPin());
  const handleAppStateChange = useCallback(
    (nextAppState) => {
      if (mounted) {
        if (nextAppState === 'background') {
          AppUpdater.update();
          if (pin && !WithdrawHistory.withdrawing) {
            navigation?.navigate(routeNames.AddPin, { action: 'login' });
            AddPin.waiting = false;
          }
          if (WithdrawHistory.withdrawing) {
            AddPin.waiting = true;
          }
        }
      }
    },
    [pin, mounted],
  );
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    setMounted(true);
    return () => {
      setMounted(false);
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [pin]);
  useEffect(() => {
    handleLoadPin();
  }, []);
  if (pin && !authen) {
    return <AddPin action="login" />;
  }
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props }} />
    </ErrorBoundary>
  );
};

export default withPin;
