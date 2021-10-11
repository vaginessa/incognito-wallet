import Tabs from '@src/components/core/Tabs';
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { createForm } from '@src/components/core/reduxForm';
import { NFTTokenBottomBar } from '@screens/PDexV3/features/NFTToken';
import { ButtonBasic } from '@src/components/Button';
import GroupActions from './OrderLimit.groupActions';
import GroupRate from './OrderLimit.groupRate';
import { formConfigs, ROOT_TAB_ORDER_LIMIT } from './OrderLimit.constant';
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
  const { mainColor, btnActionTitle, disabledBtn } = useSelector(
    orderLimitDataSelector,
  );
  const { tabsFactories, handleConfirm } = props;
  return (
    <View style={styled.container}>
      <Form>
        {() => (
          <View>
            <GroupActions />
            <Tabs rootTabID={ROOT_TAB_ORDER_LIMIT}>
              {tabsFactories.map((tab) => (
                <View key={tab.tabID} {...tab} />
              ))}
            </Tabs>
            <OrderLimitInputsGroup />
            <ButtonBasic
              btnStyle={{ backgroundColor: mainColor }}
              title={btnActionTitle}
              disabled={disabledBtn}
              onPress={handleConfirm}
            />
            <GroupRate />
            <SubInfo />
            <OpenOrders />
          </View>
        )}
      </Form>
      <NFTTokenBottomBar />
    </View>
  );
};

OrderLimit.propTypes = {
  tabsFactories: PropTypes.array.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

export default withOrderLimit(React.memo(OrderLimit));
