import { ButtonTrade } from '@src/components/Button';
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Tabs1 } from '@src/components/core/Tabs';
import { createForm } from '@components/core/reduxForm';
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
import SwapInputsGroup from './Swap.inputsGroup';

const initialFormValues = {
  selltoken: '',
  buytoken: '',
  slippagetolerance: '',
};

const Form = createForm(formConfigs.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
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
