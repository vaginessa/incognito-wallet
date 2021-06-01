import React, {useState} from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { debounce, isEmpty } from 'lodash';
import accountService from '@services/wallet/accountService';
import { PRV_ID } from '@screens/Dex/constants';

export const AIR_DROP = 'air-drop';

const enhance = WrappedComp => props => {
  const { account, wallet, pTokens } = props;
  const [steps, setSteps] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(null);

  const sleep = () => (new Promise((resolve) => setTimeout(resolve, 4000)));

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

  const handleRequestAirdrop = async () => {
    setCurrentStep(AIR_DROP);
    await sleep();
    editStep(AIR_DROP, true);
  };

  const handleConvertPRV = async ({
    accountWallet,
    unspentCoins
  }) => {
    setCurrentStep(PRV_ID);
    const { errors } = await accountWallet.createAndSendConvertNativeToken(unspentCoins);
    editStep(PRV_ID, errors.length === 0);
  };

  const handleConvertPToken = async ({
    accountWallet,
    unspentCoins
  }) =>{
    let errorsList = [];
    for (const unspentCoin of unspentCoins) {
      try {
        const { tokenId: tokenID, balance } = unspentCoin;
        setCurrentStep(tokenID);
        await accountWallet.createAndSendConvertPToken({ tokenID, balance });
      } catch (errors) {
        errorsList = errorsList.concat(errors);
      }
      editStep(unspentCoin?.tokenId, true);
    }
  };

  const handleLoadUnspentCoins = async () => {
    const {
      unspentCoins,
      accountWallet,
    } = await accountService.getUnspentCoinsV1({
      account,
      wallet,
    });

    const prvUnspent = unspentCoins.find((coin) => coin.tokenId === PRV_ID);
    const pTokenUnspent = unspentCoins.filter((coin) => coin.tokenId !== PRV_ID && coin.balance > 0);
    return {
      accountWallet,
      prvUnspent,
      pTokenUnspent
    };
  };

  const getConvertSteps = (coins) => {
    // const airdropStep = [{ name: 'Requesting airdrop', key: AIR_DROP }];
    const convertSteps = coins.reduce((prev, coin) => {
      let steps = prev;
      const { tokenId, balance } = coin;
      if (tokenId === PRV_ID && balance > 100) {
        steps.push({ name: 'Convert PRV', key: tokenId, tokenName: 'PRV' });
      }
      if (tokenId !== PRV_ID && balance > 0) {
        const token = pTokens.find(token => token.tokenId === tokenId);
        steps.push({ name: `Convert ${token?.name}`, key: tokenId, tokenName: token?.name });
      }
      return steps;
    }, []);

    return convertSteps;
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

    setSteps(getConvertSteps([prvUnspent].concat(pTokenUnspent)));

    setAppLoading(false);

    if (!isEmpty(prvUnspent) && prvUnspent.balance > 100) {
      await handleConvertPRV({
        accountWallet,
        unspentCoins: prvUnspent
      });
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
