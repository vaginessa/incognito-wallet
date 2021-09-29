import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { ACCOUNT_CONSTANT , PrivacyVersion } from 'incognito-chain-web-js/build/wallet';
import { ExHandler } from '@services/exception';
import accountService from '@services/wallet/accountService';
import { submitProvideRawTx, checkPreviousProvision } from '@services/api/pool';
import { useSelector } from 'react-redux';
import { accountSelector } from '@src/redux/selectors';
import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';
import appConstant from '@src/constants/app';
import { PRV_ID } from '@src/constants/common';
import {MESSAGES} from '@screens/Dex/constants';
import {useError} from '@components/UseEffect/useError';


const withConfirm = (WrappedComp) => (props) => {
  const signPublicKeyEncode = useSelector(
    accountSelector.signPublicKeyEncodeSelector,
  );
  const [error, setError] = React.useState('');
  const errorMessage = useError(error);
  const [providing, setProviding] = React.useState(false);
  const [readyToRequest, setReadyToRequest] = React.useState(false);
  const [disable, setDisable] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const captchaRef = React.useRef(null);
  const {
    value,
    coin,
    onSuccess,
    account,
  } = props;

  const handleProvideApi = async (captchaCode) => {
    try {
      setDisable(false);
      if (!readyToRequest) return;
      // todo: open comment when api ready
      // await migratePRVProvide({
      //   paymentAddress: account.PaymentAddress,
      //   signPublicKeyEncode,
      //   amount: value,
      //   captchaCode,
      //   tokenId: coin.id,
      // });
      onSuccess(true);
    } catch (error) {
      setReadyToRequest(false);
      setError(new ExHandler(error).getMessage(error?.message || MESSAGES.REQUEST_MIGRATE_TOKEN_ERROR));
    } finally {
      setProviding(false);
    }
  };

  const handleRequestMigrate = async () => {
    try {
      if (!readyToRequest || captchaRef.current) {
        setReadyToRequest(true);
        setTimeout(() => {
          captchaRef.current?.refreshToken();
        }, 1000);
      }
      return true;
    } catch (e) {
      setReadyToRequest(false);
      setProviding(false);
      setError(new ExHandler(e).getMessage());
    }
  };

  const onConfirmPress = async () => {
    try {
      if (providing || !captchaRef.current) return;
      setProviding(true);
      handleRequestMigrate().then();
    } catch (error) {
      handleRequestMigrate().then();
    }
  };

  const onRefresh = () => {
    if (disable) return;
    setRefreshing(true);
    setError('');
    setProviding(false);
    setReadyToRequest(false);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  return (
    <>
      <ReCaptchaV3
        ref={captchaRef}
        captchaDomain={appConstant.CAPTCHA_DOMAIN}
        siteKey={appConstant.CAPTCHA_KEY}
        onReceiveToken={handleProvideApi}
      />
      <WrappedComp
        {...{
          ...props,
          providing,
          error: errorMessage,
          disable,
          refreshing,

          onRefresh,
          onConfirm: onConfirmPress,
        }}
      />
    </>
  );
};

export default withConfirm;
