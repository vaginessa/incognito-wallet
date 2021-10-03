import {createSelector} from 'reselect';
import {selectedPrivacySelector as selectedPrivacy, sharedSelector} from '@src/redux/selectors';
import formatUtil from '@utils/format';
import {MESSAGES} from '@screens/Dex/constants';
import {formValueSelector} from 'redux-form';
import convert from '@utils/convert';
import {
  formConfigsInvest,
  formConfigsWithdrawInvest,
  formConfigsWithdrawReward
} from '@screens/PDexV3/features/Staking/Staking.constant';
import BigNumber from 'bignumber.js';
import {PRVIDSTR} from 'incognito-chain-web-js/build/wallet';
import {getHistoriesKey} from '@screens/PDexV3/features/Staking/Staking.utils';
import flatten from 'lodash/flatten';
import {PRV} from '@src/constants/common';
import uniq from 'lodash/uniq';
import {CONSTANT_COMMONS} from '@src/constants';

export const stakingSelector = createSelector(
  (state) => state.pDexV3,
  ({ staking }) => {
    return staking;
  },
);

export const isFetchingCoinsSelector = createSelector(
  stakingSelector,
  ({ isFetching }) => isFetching);

const mapperStakingCoins = createSelector(
  stakingSelector,
  ({ coins }) => {
    return coins.reduce((prev, curr) => {
      const index = prev.findIndex(item => item.tokenId === curr.tokenId);
      if (index !== -1) {
        // exist
        prev[index]?.coins.push(curr);
      } else {
        prev.push({
          tokenId: curr.tokenId,
          coins: [curr]
        });
      }
      return prev;
    }, []);
  }
);

export const stakingCoinsSelector = createSelector(
  mapperStakingCoins,
  selectedPrivacy.getPrivacyDataByTokenID,
  sharedSelector.isGettingBalance,
  (stakingCoins, getPrivacyDataByTokenID, isGettingBalance) => {
    return (stakingCoins || []).map(({ coins, tokenId }) => {
      const token = getPrivacyDataByTokenID(tokenId);
      const userBalance = token.amount;
      const userBalanceStr = formatUtil.amountFull(userBalance, token.pDecimals);
      const userBalanceSymbolStr = `${userBalanceStr} ${token.symbol}`;
      const user = { userBalance, userBalanceStr, userBalanceSymbolStr };
      /**---------------------------------------------------------*/
      const stakingAmount = coins.reduce((prev, curr) => new BigNumber(prev).plus(curr.amount).toNumber(), 0);
      const stakingAmountStr = formatUtil.amountFull(stakingAmount, token.pDecimals);
      const stakingAmountSymbolStr = `${stakingAmountStr} ${token.symbol}`;
      const staking = { stakingAmount, stakingAmountStr, stakingAmountSymbolStr };
      /**---------------------------------------------------------*/
      const rewardsCoins = coins.map(coin => coin.reward);
      const rewardTokenIds = uniq(flatten(rewardsCoins.map(reward => Object.keys(reward))));
      const rewardsMerged = rewardTokenIds.reduce((prev, curr) => {
        const tokenId = curr;
        const token = getPrivacyDataByTokenID(tokenId);
        const reward = rewardsCoins.reduce((_prev, _curr) => (_curr[tokenId] || 0) + _prev, 0);
        const rewardStr = formatUtil.amountFull(reward, token.pDecimals);
        const rewardUSD = convert.toHumanAmount(new BigNumber(reward).multipliedBy(token.priceUsd).toNumber(), token.pDecimals);
        prev.push({ tokenId, reward, rewardStr, token, rewardUSD });
        return prev;
      }, []);
      const totalRewardUSD = rewardsMerged.reduce((prev, curr) => new BigNumber(prev).plus(curr.rewardUSD).toNumber(), 0);
      const totalRewardAmount = Math.ceil(new BigNumber(totalRewardUSD).multipliedBy(Math.pow(10, token.pDecimals || 9)).toNumber());
      const totalRewardUSDStr = `${CONSTANT_COMMONS.USD_SPECIAL_SYMBOL}${formatUtil.amountFull(totalRewardAmount, token.pDecimals)}`;
      const reward = { rewardsCoins, rewardTokenIds, rewardsMerged, totalRewardUSD, totalRewardAmount, totalRewardUSDStr };
      return {
        coins,
        tokenId,
        token,
        user,
        staking,
        isLoadingBalance: isGettingBalance.includes(tokenId),
        reward,
      };
    });
  }
);

const stakingRewardSelector = createSelector(
  stakingCoinsSelector,
  selectedPrivacy.getPrivacyDataByTokenID,
  (coins, getPrivacyDataByTokenID) => {
    const prvToken = getPrivacyDataByTokenID(PRV.id);
    const rewardUSD = coins.reduce((prev, curr) => new BigNumber(prev).plus(curr.reward.totalRewardAmount), new BigNumber(0)).toNumber();
    const rewardUSDStr = `${formatUtil.amountFull(rewardUSD, prvToken.pDecimals)} $ `;
    const rewardPRV = Math.floor(new BigNumber(rewardUSD).dividedBy(prvToken.priceUsd).toNumber());
    const rewardPRVStr = `${formatUtil.amountFull(rewardPRV, prvToken.pDecimals)} ${prvToken.symbol}`;
    return { rewardUSDStr, rewardPRVStr };
  }
);

const isExistStakingSelector = createSelector(
  stakingCoinsSelector,
  (stakingCoins) => stakingCoins.some(({ coins }) => coins.some(item => item.amount)),
);

export const stakingCoinByTokenIDSelector = createSelector(
  stakingCoinsSelector,
  (coins) => (tokenID) => coins.find(coin => coin.tokenId === tokenID)
);

export const stakingFeeSelector = createSelector(
  stakingSelector,
  selectedPrivacy.getPrivacyDataByTokenID,
  (staking, getPrivacyDataByTokenID) => {
    const { fee, feeToken } = staking;
    const token = getPrivacyDataByTokenID(feeToken);
    const feeAmountStr = formatUtil.amountFull(fee, token.pDecimals);
    const feeAmountSymbolStr = `${feeAmountStr} ${token.symbol}`;
    const useFeeBalance = token.amount;
    const useFeeBalanceStr = formatUtil.amountFull(useFeeBalance, token.pDecimals);
    const useFeeBalanceSymbolStr = `${useFeeBalanceStr} ${token.symbol}`;
    return {
      feeAmount: fee,
      feeAmountStr,
      feeAmountSymbolStr,
      feeToken: token,
      useFeeBalance,
      useFeeBalanceStr,
      useFeeBalanceSymbolStr
    };
  },
);

/**
 * ================================================================
 * =======================STAKING POOLS==========================
 * ================================================================
 **/
export const isFetchingPoolSelector = createSelector(
  stakingSelector,
  (staking) => {
    return staking.isFetchingPool;
  },
);

export const stakingPoolSelector = createSelector(
  stakingSelector,
  selectedPrivacy.getPrivacyDataByTokenID,
  sharedSelector.isGettingBalance,
  (staking, getPrivacyDataByTokenID, isGettingBalance) => {
    const pools = staking.pools || [];
    return pools.map((item) => {
      const { tokenid: tokenId, amount: poolAmount, id } = item;
      const token = getPrivacyDataByTokenID(tokenId);
      const userBalance = token.amount;
      const userBalanceStr = formatUtil.amountFull(token.amount, token.pDecimals);
      const userBalanceSymbolStr = `${userBalanceStr} ${token.symbol}`;
      const poolAmountStr = formatUtil.amountFull(poolAmount, token.pDecimals);
      const isLoadingBalance = isGettingBalance.includes(tokenId);
      const disabled = isLoadingBalance || userBalance === 0;
      return {
        id,
        tokenId,
        poolAmount,
        poolAmountStr,
        isLoadingBalance,
        userBalance,
        userBalanceStr,
        userBalanceSymbolStr,
        token,
        disabled,
      };
    });
  },
);

export const getStakingPoolByTokenId = createSelector(
  stakingPoolSelector,
  (stakingPools) => (tokenId) => stakingPools.find(({ tokenId: _tokenId }) => _tokenId === tokenId),
);


/**
 * ================================================================
 * =======================STAKING INVEST==========================
 * ================================================================
 **/
export const stakingInvestSelector = createSelector(
  stakingSelector,
  (staking) => {
    return staking.invest;
  },
);

export const investCoinSelector = createSelector(
  stakingInvestSelector,
  getStakingPoolByTokenId,
  ({ tokenID }, getStakingPool) => getStakingPool(tokenID),
);

const investInputValue = createSelector(
  (state) => state,
  investCoinSelector,
  (state, coin) => {
    if (!coin) return 0;
    const selector = formValueSelector(formConfigsInvest.formName);
    const inputText = selector(state, formConfigsInvest.input);
    const inputNumber = convert.toNumber(inputText, true) || 0;
    return convert.toOriginalAmount(inputNumber, coin.token.pDecimals);
  }
);

export const investInputAmount = createSelector(
  investInputValue,
  investCoinSelector,
  stakingFeeSelector,
  (inputValue, coin, fee) => {
    if (!coin) return {
      inputValue: 0,
      maxDepositValue: 0,
    };
    const { tokenId, token, userBalance } = coin;
    const { feeAmount, feeToken } = fee;
    const inputText = formatUtil.amountFull(inputValue, token.pDecimals);
    let depositText = inputText;
    let maxDepositValue = userBalance;
    if (feeToken.tokenId === tokenId && tokenId === PRVIDSTR) {
      const depositValue = new BigNumber(inputValue).plus(feeAmount).toNumber();
      maxDepositValue = new BigNumber(userBalance).minus(feeAmount).toNumber();
      depositText = formatUtil.amountFull(depositValue, token.pDecimals);
    }
    const depositSymbolStr = `${depositText} ${token.symbol}`;
    const maxDepositHumanAmount = convert.toHumanAmount(maxDepositValue, token.pDecimals);
    const maxDepositText = formatUtil.toFixed(maxDepositHumanAmount, token.pDecimals);
    return {
      token,
      inputText,
      inputValue,
      depositText,
      depositSymbolStr,
      maxDepositValue,
      maxDepositText,
    };
  }
);

export const investInputValidate = createSelector(
  stakingFeeSelector,
  investInputAmount,
  investCoinSelector,
  (fee, { inputValue, maxDepositValue }) => () => {
    try {
      const { feeAmount, feeToken } = fee;
      const { amount: userBalanceForFee } = feeToken;
      if (new BigNumber(feeAmount).gt(userBalanceForFee)) {
        return MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE;
      }
      if (new BigNumber(inputValue).gt(maxDepositValue)) {
        return MESSAGES.BALANCE_INSUFFICIENT;
      }
    } catch (error) {
      return error.message;
    }
  },
);

export const investDisable = createSelector(
  investInputValue,
  investInputValidate,
  investCoinSelector,
  (inputValue, validate, { disabled: loadingBalance }) => (inputValue <= 0 || !!validate() || loadingBalance)
);


/**
 * ================================================================
 * =======================WITHDRAW INVEST==========================
 * ================================================================
 **/
export const stakingWithdrawInvestSelector = createSelector(
  stakingSelector,
  (staking) => {
    return staking.withdrawInvest;
  },
);

export const withdrawInvestCoinSelector = createSelector(
  stakingWithdrawInvestSelector,
  stakingCoinByTokenIDSelector,
  ({ tokenID }, getStakingCoinByTokenID) => getStakingCoinByTokenID(tokenID),
);

const withdrawInvestInputValue = createSelector(
  (state) => state,
  withdrawInvestCoinSelector,
  (state, coin) => {
    const selector = formValueSelector(formConfigsWithdrawInvest.formName);
    const inputText = selector(state, formConfigsWithdrawInvest.input);
    const inputNumber = convert.toNumber(inputText, true) || 0;
    return convert.toOriginalAmount(inputNumber, coin.token.pDecimals);
  }
);

export const withdrawInvestValidate = createSelector(
  withdrawInvestCoinSelector,
  stakingFeeSelector,
  withdrawInvestInputValue,
  (coin, fee, inputValue) => () => {
    try {
      const { balance: balanceInvest } = coin;
      const { feeAmount, feeToken } = fee;
      const { amount: userBalanceFee } = feeToken;
      if (feeAmount > userBalanceFee) {
        return MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE;
      } else if (inputValue > balanceInvest) {
        return MESSAGES.BALANCE_INSUFFICIENT;
      }
    } catch (error) {
      return error.message;
    }
  },
);

export const withdrawInvestInputAmount = createSelector(
  withdrawInvestInputValue,
  withdrawInvestCoinSelector,
  (inputValue, coin) => {
    const { token, balance: stakingBalance } = coin;
    const maxDepositHumanAmount = convert.toHumanAmount(stakingBalance, token.pDecimals);
    const maxDepositText = formatUtil.toFixed(maxDepositHumanAmount, token.pDecimals);
    return {
      inputValue,
      maxDepositValue: stakingBalance,
      maxDepositText
    };
  }
);

export const withdrawInvestDisable = createSelector(
  withdrawInvestInputValue,
  withdrawInvestValidate,
  (inputValue, validate) => (inputValue <= 0 || !!validate()),
);

/**
 * ================================================================
 * =======================WITHDRAW REWARD==========================
 * ================================================================
 **/
export const stakingWithdrawRewardSelector = createSelector(
  stakingSelector,
  (staking) => staking.withdrawReward,
);

export const withdrawRewardCoinSelector = createSelector(
  stakingWithdrawRewardSelector,
  stakingCoinByTokenIDSelector,
  ({ tokenID }, getStakingCoinByTokenID) => getStakingCoinByTokenID(tokenID),
);

const withdrawRewardInputValue = createSelector(
  (state) => state,
  withdrawRewardCoinSelector,
  (state, coin) => {
    const selector = formValueSelector(formConfigsWithdrawReward.formName);
    const inputText = selector(state, formConfigsWithdrawReward.input);
    const inputNumber = convert.toNumber(inputText, true) || 0;
    return convert.toOriginalAmount(inputNumber, coin.token.pDecimals);
  }
);

export const withdrawRewardValidate = createSelector(
  withdrawRewardCoinSelector,
  stakingFeeSelector,
  withdrawRewardInputValue,
  (coin, fee, inputValue) => () => {
    try {
      const { rewardBalance } = coin;
      const { feeAmount, feeToken } = fee;
      const { amount: userBalanceForFee } = feeToken;
      if (feeAmount > userBalanceForFee) {
        return MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE;
      } else if (inputValue > rewardBalance) {
        return MESSAGES.BALANCE_INSUFFICIENT;
      }
    } catch (error) {
      return error.message;
    }
  },
);

export const withdrawRewardInputAmount = createSelector(
  withdrawRewardInputValue,
  withdrawRewardCoinSelector,
  stakingFeeSelector,
  (inputValue, coin) => {
    const { token, rewardBalance } = coin;
    const inputText = formatUtil.amountFull(inputValue, token.pDecimals);
    const maxDepositHumanAmount = convert.toHumanAmount(rewardBalance, token.pDecimals);
    const maxDepositText = formatUtil.toFixed(maxDepositHumanAmount, token.pDecimals);
    return {
      inputText,
      inputValue,
      maxDepositValue: rewardBalance,
      maxDepositText,
    };
  }
);

export const withdrawRewardDisable = createSelector(
  withdrawRewardInputValue,
  withdrawRewardValidate,
  (inputValue, validate) => (inputValue <= 0 || !!validate()),
);

/**
 * ================================================================
 * =======================HISTORIES==========================
 * ================================================================
 **/
export const stakingHistoriesKeySelector = createSelector(
  stakingSelector,
  (staking) => {
    const { tokenID, nftID } = staking.histories;
    const key = getHistoriesKey({ tokenID, nftID });
    return {
      tokenID,
      nftID,
      key
    };
  },
);

export const stakingHistoriesSelector = createSelector(
  stakingSelector,
  stakingHistoriesKeySelector,
  (staking, { key }) => staking.histories?.data[key],
);

export const stakingHistoriesStatus = createSelector(
  stakingSelector,
  (staking) => {
    const { isFetching: isLoading, isFetched: isLoaded } = staking.histories;
    const isFetching = isLoading && !isLoaded;
    const isLoadMore = isLoading && isLoaded;
    return {
      isFetching,
      isLoadMore,
    };
  },
);

export const stakingHistoriesMapperSelector = createSelector(
  stakingHistoriesSelector,
  selectedPrivacy.getPrivacyDataByTokenID,
  (histories, getPrivacyDataByTokenID) => {
    return (histories || []).map((history) => {
      const { tokenId, amount, requestTime } = history;
      const token = getPrivacyDataByTokenID(tokenId);
      const amountSymbolStr = `${formatUtil.amountFull(amount, token.pDecimals)} ${token.symbol}`;
      const timeStr = formatUtil.formatDateTime(requestTime);
      return {
        ...history,
        token,
        amountSymbolStr,
        timeStr
      };
    });
  },
);

export default ({
  stakingPoolSelector,
  isFetchingPoolSelector,

  mapperStakingCoins,
  stakingCoinsSelector,
  stakingRewardSelector,
  isFetchingCoinsSelector,
  isExistStakingSelector,

  stakingHistoriesKeySelector,
  stakingHistoriesStatus,

  stakingInvestSelector,
  investCoinSelector,
  investInputAmount,
  investInputValidate,
  investDisable,
});
