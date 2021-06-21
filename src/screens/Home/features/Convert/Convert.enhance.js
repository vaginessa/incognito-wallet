import React, { useState } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { debounce, isEmpty } from 'lodash';
import accountService from '@services/wallet/accountService';
import { PRV_ID } from '@screens/Dex/constants';
import { MAX_FEE_PER_TX } from '@components/EstimateFee/EstimateFee.utils';
import Exception from '@services/exception/ex';
import {ExHandler} from '@services/exception';

const enhance = WrappedComp => props => {
  const { account, wallet, pTokens } = props;
  const [steps, setSteps] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(null);

  const editStep = (key, isSuccess) => {
    setSteps(steps => {
      const stepIndex = steps.findIndex(step => step.key === key);
      steps[stepIndex] = {
        ...steps[stepIndex],
        success: isSuccess
      };
      return steps;
    });
  };

  const handleConvertPRV = async ({
    accountWallet,
    unspentCoins
  }) => {
    setCurrentStep(PRV_ID);
    try {
      const {
        tokenID,
        balance
      } = unspentCoins;
      await accountWallet.createAndSendConvertNativeToken({
        tokenID,
        balance
      });
      editStep(PRV_ID, true);
    } catch (error) {
      editStep(PRV_ID, false);
      new ExHandler(error).showErrorToast();
    }
  };

  const handleConvertPToken = async ({
    accountWallet,
    unspentCoins
  }) =>{
    for (const unspentCoin of unspentCoins) {
      try {
        const { tokenID, balance } = unspentCoin;
        setCurrentStep(tokenID);
        await accountWallet.createAndSendConvertPToken({ tokenID, balance });
        editStep(unspentCoin?.tokenID, true);
      } catch (error) {
        editStep(unspentCoin?.tokenID, false);
      }
    }
  };

  const handleLoadUnspentCoins = async () => {
    const {
      unspentCoins,
      accountWallet,
    } = await accountService.getUnspentCoinsV1({
      account,
      wallet,
      fromApi: false
    });

    const prvUnspent = unspentCoins.find((coin) => coin.tokenID === PRV_ID && coin.balance > MAX_FEE_PER_TX);
    const pTokenUnspent = unspentCoins.filter((coin) => coin.tokenID !== PRV_ID && coin.balance > 0);
    return {
      accountWallet,
      prvUnspent,
      pTokenUnspent
    };
  };

  const getConvertSteps = (coins) => {
    return coins.reduce((prev, coin) => {
      let steps = prev;
      const { tokenID, balance } = coin;
      if (tokenID === PRV_ID && balance > 100) {
        steps.push({ name: 'Convert PRV', key: tokenID, tokenName: 'PRV' });
      }
      if (tokenID !== PRV_ID && balance > 0) {
        const token = pTokens.find(token => token.tokenId === tokenID);
        steps.push({ name: `Convert ${token?.name}`, key: tokenID, tokenName: token?.name });
      }
      return steps;
    }, []);
  };

  const handleConvert = debounce(async () => {
    setAppLoading(true);
    /** get unspent coins */
    let {
      accountWallet,
      prvUnspent,
      pTokenUnspent
    } = await handleLoadUnspentCoins();

    /** load unspent coins success */

    const allToken = [prvUnspent].concat(pTokenUnspent).filter(token => !!token);

    setSteps(getConvertSteps(allToken));

    setAppLoading(false);

    if (!isEmpty(prvUnspent)) {
      try {
        await handleConvertPRV({
          accountWallet,
          unspentCoins: prvUnspent
        });
      } catch (error) {
        console.log('Convert PRV Error ', error);
      }
    }

    await handleConvertPToken({
      accountWallet,
      unspentCoins: pTokenUnspent
    });

    setCurrentStep(null);
  }, 500);

  React.useEffect(() => {
    handleConvert();
  }, []);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          steps,
          appLoading,
          currentStep
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
