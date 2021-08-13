import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounceInput } from '@src/components/UseEffect/useDebounceInput';
import { useKeyboard } from '@src/components/UseEffect/useKeyboard';
import debounce from 'lodash/debounce';
import { actionSetSellToken, actionSetBuyToken } from './Swap.actions';
import {
  defaultPairSelector,
  feeSelectedSelector,
  inputAmountSelector,
} from './Swap.selector';
import { formConfigs } from './Swap.constant';

const enhance = (WrappedComp) => (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const defaultPair = useSelector(defaultPairSelector);
  const inputAmount = useSelector(inputAmountSelector);
  const input1Amount = inputAmount(formConfigs.selltoken);
  const input2Amount = inputAmount(formConfigs.buytoken);
  const feetoken = useSelector(feeSelectedSelector);
  const dependencies = {
    input1Amount,
    input2Amount,
    feetoken,
  };
  const handleEstimateTrade = (dependencies) => {
    console.log('dependencies', dependencies);
  };
  // useDebounceInput({
  //   callback: handleEstimateTrade,
  //   dependencies: {
  //     input1Amount,
  //     input2Amount,
  //     // feetoken,
  //   },
  // });
  const [isKeyboardVisible] = useKeyboard();
  const handleChangeDependencies = (dependencies) => {
    console.log('dependencies', dependencies);
  };
  const _handleChangeDependencies = React.useRef(
    debounce(handleChangeDependencies, 5000),
  );

  React.useEffect(() => {
    if (_handleChangeDependencies && _handleChangeDependencies.current) {
      _handleChangeDependencies.current(dependencies);
    }
  }, [input1Amount, input2Amount, feetoken]);

  React.useEffect(() => {
    if (
      !isKeyboardVisible &&
      _handleChangeDependencies &&
      _handleChangeDependencies.current
    ) {
      _handleChangeDependencies.current(dependencies);
    }
  }, [isKeyboardVisible]);

  const handleReviewOrder = () => {
    navigation.navigate(routeNames.ReviewOrderSwap);
  };
  const initDefaultPairSwap = () => {
    if (defaultPair && defaultPair?.token1IdStr && defaultPair?.token2IdStr) {
      dispatch(actionSetSellToken(defaultPair.token1IdStr));
      dispatch(actionSetBuyToken(defaultPair.token2IdStr));
      // dispatch(actionEstimateTrade());
    }
  };
  React.useEffect(() => {
    initDefaultPairSwap();
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleReviewOrder }} />
    </ErrorBoundary>
  );
};

export default enhance;
