import { Header } from '@src/components';
import { KeyboardAwareScrollView } from '@src/components/core';
import Tabs from '@src/components/core/Tabs';
import React from 'react';
import { View, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONT } from '@src/styles';
import { createForm } from '@src/components/core/reduxForm';
import { NFTTokenBottomBar } from '@screens/PDexV3/features/NFTToken';
import { RightHeader } from '@screens/PDexV3/features/Trade/Trade';
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
  const { sellColor, buyColor, mainColor, refreshing } = useSelector(
    orderLimitDataSelector,
  );
  const onRefresh = () => dispatch(actionInit(true));
  const tabsFactories = [
    {
      tabID: TAB_BUY_ID,
      label: 'Buy',
      onChangeTab: actionChangeTab,
      titleStyled: {
        color: COLORS.white,
        fontSize: FONT.SIZE.medium,
        fontFamily: FONT.NAME.medium,
      },
      titleDisabledStyled: { color: COLORS.colorGrey3 },
      tabStyled: {
        backgroundColor: buyColor,
        flex: 1,
      },
      tabStyledDisabled: {
        backgroundColor: 'transparent',
      },
    },
    {
      tabID: TAB_SELL_ID,
      label: 'Sell',
      onChangeTab: actionChangeTab,
      titleStyled: {
        color: COLORS.white,
        fontSize: FONT.SIZE.medium,
        fontFamily: FONT.NAME.medium,
      },
      titleDisabledStyled: { color: COLORS.colorGrey3 },
      tabStyled: {
        backgroundColor: sellColor,
        flex: 1,
      },
      tabStyledDisabled: {
        backgroundColor: 'transparent',
      },
    },
  ];
  return (
    <View style={styled.container}>
      <Form>
        {() => (
          <View>
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
          </View>
        )}
      </Form>
      <NFTTokenBottomBar />
    </View>
  );
};

OrderLimit.propTypes = {};

export default withOrderLimit(React.memo(OrderLimit));
