import { ButtonTrade } from '@src/components/Button';
import { SwapButton } from '@src/components/core';
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Tabs1 } from '@src/components/core/Tabs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import {
  createForm,
  ReduxFormTradeInputAmount as TradeInputAmount,
} from '@components/core/reduxForm';
import { Field, change, focus } from 'redux-form';
import convert from '@src/utils/convert';
import BigNumber from 'bignumber.js';
import { styled, tabsStyled } from './Swap.styled';
import {
  ROOT_TAB_ID,
  TAB_SIMPLE_ID,
  TAB_PRO_ID,
  formConfigs,
} from './Swap.constant';
import TabSimple from './Swap.simpleTab';
import TabPro from './Swap.proTab';
import withSwap from './Swap.enhance';
import {
  sellTokenPairsSwapSelector,
  buyTokenPairsSwapSelector,
  selltokenSelector,
  buytokenSelector,
  swapInputsAmountSelector,
  swapInfoSelector,
} from './Swap.selector';

const initialFormValues = {
  selltoken: '',
  buytoken: '',
  slippageTolerance: '',
};

const Form = createForm(formConfigs.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const SwapInputsGroup = React.memo(() => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const pairsSell = useSelector(sellTokenPairsSwapSelector);
  const pairsBuy = useSelector(buyTokenPairsSwapSelector);
  const selltoken = useSelector(selltokenSelector);
  const buytoken = useSelector(buytokenSelector);
  const { rate } = useSelector(swapInfoSelector);
  const onSelectSellToken = () => {
    navigation.navigate(routeNames.SelectTokenTrade, { data: pairsSell });
  };
  const onSelectBuyToken = () => {
    navigation.navigate(routeNames.SelectTokenTrade, { data: pairsBuy });
  };
  const onChangeAmount = ({ amount, field }) => {
    switch (field) {
    case formConfigs.selltoken: {
      try {
        const originalAmountSell = convert.toOriginalAmount(
          amount,
          selltoken.pDecimals,
        );
        console.log('originalAmountSell', originalAmountSell);
        const buyAmount = convert.toHumanAmount(
          new BigNumber(originalAmountSell).multipliedBy(rate).toString(),
          buytoken.pDecimals,
        );
        console.log('rate', rate);
        console.log('buyAmount', buyAmount);
        dispatch(
          change(formConfigs.FORM_NAME, formConfigs.buytoken, buyAmount),
        );
      } catch (error) {
        console.log(error);
      }
      break;
    }
    case formConfigs.buytoken: {
      break;
    }
    default:
      break;
    }
    dispatch(change(formConfigs.FORM_NAME, field, amount));
    dispatch(focus(formConfigs.FORM_NAME, field));
  };
  console.log('RE-RENDER SwapInputsGroup');
  return (
    <View>
      <Field
        component={TradeInputAmount}
        name={formConfigs.selltoken}
        hasInfinityIcon
        canSelectSymbol
        symbol={selltoken?.symbol}
        onPressSymbol={onSelectSellToken}
        onChange={(amount) =>
          onChangeAmount({ amount, field: formConfigs.selltoken })
        }
      />
      <SwapButton />
      <Field
        component={TradeInputAmount}
        name={formConfigs.buytoken}
        canSelectSymbol
        symbol={buytoken?.symbol}
        onPressSymbol={onSelectBuyToken}
        onChange={(amount) =>
          onChangeAmount({ amount, field: formConfigs.buytoken })
        }
      />
    </View>
  );
});

const Swap = (props) => {
  const { handleReviewOrder } = props;
  const tabsFactories = [
    {
      tabID: TAB_SIMPLE_ID,
      label: 'Simple',
      onChangeTab: () => null,
      tabStyled: tabsStyled.tabBtn,
      tabStyledDisabled: tabsStyled.tabBtnDisabled,
      titleStyled: tabsStyled.tabTitleStyled,
      titleDisabledStyled: tabsStyled.tabTitleDisabledStyled,
      tab: <TabSimple />,
    },
    {
      tabID: TAB_PRO_ID,
      label: 'Pro',
      onChangeTab: () => null,
      tabStyled: tabsStyled.tabBtn,
      tabStyledDisabled: tabsStyled.tabBtnDisabled,
      titleStyled: tabsStyled.tabTitleStyled,
      titleDisabledStyled: tabsStyled.tabTitleDisabledStyled,
      tab: <TabPro />,
    },
  ];
  console.log('RE-RENDER SWAP');
  return (
    <View style={styled.container}>
      <Form>
        {({ handleSubmit }) => (
          <>
            <SwapInputsGroup />
            <ButtonTrade
              btnStyle={styled.btnTrade}
              onPress={handleReviewOrder}
              title="Preview your order"
            />
            <Tabs1
              rootTabID={ROOT_TAB_ID}
              styledTabList={tabsStyled.styledTabList}
            >
              {tabsFactories.map(({ tab, ...rest }) => (
                <View key={rest.tabID} {...rest}>
                  {tab}
                </View>
              ))}
            </Tabs1>
          </>
        )}
      </Form>
    </View>
  );
};

Swap.propTypes = {
  handleReviewOrder: PropTypes.func.isRequired,
};

export default withSwap(React.memo(Swap));
