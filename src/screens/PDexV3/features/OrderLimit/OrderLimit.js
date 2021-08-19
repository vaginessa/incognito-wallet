import { Header } from '@src/components';
import { KeyboardAwareScrollView } from '@src/components/core';
import Tabs from '@src/components/core/Tabs';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '@src/styles';
import { createForm } from '@src/components/core/reduxForm';
import GroupActions from './OrderLimit.groupActions';
import GroupRate from './OrderLimit.groupRate';
import {
  formConfigs,
  ROOT_TAB_ORDER_LIMIT,
  TAB_BUY_ID,
  TAB_SELL_ID,
} from './OrderLimit.constant';
import { styled } from './OrderLimit.styled';
import { orderLimitDataSelector } from './OrderLimit.selector';
import SubInfo from './OrderLimit.subInfo';
import OpenOrders from './OrderLimit.openOrders';
import withOrderLimit from './OrderLimit.enhance';
import OrderLimitInputsGroup from './OrderLimit.inputsGroup';

const initialFormValues = {
  selltoken: '',
  buytoken: '',
  feetoken: '',
  rate: '',
};

const Form = createForm(formConfigs.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const OrderLimit = (props) => {
  const { mainColor, sellColor, buyColor } = useSelector(
    orderLimitDataSelector,
  );
  const tabsFactories = [
    {
      tabID: TAB_BUY_ID,
      label: 'Buy',
      onChangeTab: () => null,
      titleStyled: { color: buyColor },
      titleDisabledStyled: { color: COLORS.colorGreyMedium },
    },
    {
      tabID: TAB_SELL_ID,
      label: 'Sell',
      onChangeTab: () => null,
      titleStyled: { color: sellColor },
      titleDisabledStyled: { color: COLORS.colorGreyMedium },
    },
  ];
  const handleSelectPercent = (percent) => {
    console.log('percent', percent);
  };
  return (
    <View style={styled.container}>
      <Header title="PRV/XMR" />
      <KeyboardAwareScrollView contentContainerStyle={styled.scrollview}>
        <Form>
          {({ handleSubmit }) => (
            <>
              <Tabs rootTabID={ROOT_TAB_ORDER_LIMIT}>
                {tabsFactories.map((tab) => (
                  <View key={tab.tabID} {...tab} />
                ))}
              </Tabs>
              <OrderLimitInputsGroup />
              <GroupRate />
              <GroupActions />
              <SubInfo />
              <OpenOrders />
            </>
          )}
        </Form>
      </KeyboardAwareScrollView>
    </View>
  );
};

OrderLimit.propTypes = {};

export default withOrderLimit(React.memo(OrderLimit));
