import { Header } from '@src/components';
import { KeyboardAwareScrollView } from '@src/components/core';
import Tabs from '@src/components/core/Tabs';
import React from 'react';
import { View, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '@src/styles';
import { createForm } from '@src/components/core/reduxForm';
import { NFTTokenBottomBar } from '@screens/PDexV3/features/NFTToken';
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
import { actionInit } from './OrderLimit.actions';

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

const OrderLimit = () => {
  const dispatch = useDispatch();
  const actionChangeTab = () => dispatch(actionInit());
  const { sellColor, buyColor, poolTitle } = useSelector(
    orderLimitDataSelector,
  );
  const onRefresh = () => dispatch(actionInit());
  const tabsFactories = [
    {
      tabID: TAB_BUY_ID,
      label: 'Buy',
      onChangeTab: actionChangeTab,
      titleStyled: { color: buyColor },
      titleDisabledStyled: { color: COLORS.colorGreyMedium },
    },
    {
      tabID: TAB_SELL_ID,
      label: 'Sell',
      onChangeTab: actionChangeTab,
      titleStyled: { color: sellColor },
      titleDisabledStyled: { color: COLORS.colorGreyMedium },
    },
  ];
  return (
    <View style={styled.container}>
      <Header title={poolTitle} />
      <KeyboardAwareScrollView
        contentContainerStyle={styled.scrollview}
        refreshControl={<RefreshControl onRefresh={onRefresh} />}
      >
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
      <NFTTokenBottomBar />
    </View>
  );
};

OrderLimit.propTypes = {};

export default withOrderLimit(React.memo(OrderLimit));
