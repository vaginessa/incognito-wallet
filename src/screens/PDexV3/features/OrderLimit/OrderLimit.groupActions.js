import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  ButtonBasic,
  ButtonRefresh,
  ButtonChart,
} from '@src/components/Button';
import { Row } from '@src/components';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { Text } from '@src/components/core';
import { Hook, styled as extraStyled } from '@screens/PDexV3/features/Extra';
import { TradeSuccessModal } from '@screens/PDexV3/features/Trade';
import { actionToggleModal } from '@src/components/Modal';
import { orderLimitDataSelector } from './OrderLimit.selector';
import { actionInit } from './OrderLimit.actions';

const styled = StyleSheet.create({
  container: {},
  subActions: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  refreshBtn: {
    marginRight: 10,
  },
});

const GroupActions = (props) => {
  const navigation = useNavigation();
  const {
    mainColor,
    btnActionTitle,
    disabledBtn,
    tradingFeeStr,
    networkfeeAmountStr,
    rateStr,
    reviewOrderTitle,
    reviewOrderDesc,
    reviewOrderDescValue,
    cfmTitle,
  } = useSelector(orderLimitDataSelector);
  const dispatch = useDispatch();
  const onPressRefresh = () => dispatch(actionInit());
  const hooksFactories = [
    {
      label: reviewOrderDesc,
      value: reviewOrderDescValue || '',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
      boldLabel: true,
      boldValue: true,
    },
    {
      label: 'Rate',
      value: rateStr || '',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
    },
    {
      label: 'Trading fee',
      value: tradingFeeStr || '',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
    },
    {
      label: 'Network fee',
      value: networkfeeAmountStr || '',
    },
  ];
  const handleConfirm = () => {
    try {
      //   const tradeSuccess = await dispatch(actionFetch());
      dispatch(
        actionToggleModal({
          data: <TradeSuccessModal desc={cfmTitle} btnColor={mainColor} />,
          visible: true,
        }),
      );
    } catch {
      //
    }
  };
  const handleReviewOrder = () => {
    !disabledBtn &&
      navigation.navigate(routeNames.ReviewOrder, {
        data: {
          extra: (
            <>
              <Text style={{ ...extraStyled.specialTitle, color: mainColor }}>
                {reviewOrderTitle}
              </Text>
              {hooksFactories.map((hook) => (
                <Hook key={hook.label} {...hook} />
              ))}
            </>
          ),
          handleConfirm,
          btnColor: mainColor,
        },
      });
  };
  const onPressChart = () => {
    navigation.navigate(routeNames.Chart);
  };
  return (
    <View style={styled.container}>
      <ButtonBasic
        btnStyle={{ backgroundColor: mainColor }}
        title={btnActionTitle}
        disabled={disabledBtn}
        onPress={handleReviewOrder}
      />
      <Row style={styled.subActions}>
        <ButtonRefresh style={styled.refreshBtn} onPress={onPressRefresh} />
        <ButtonChart onPress={onPressChart} />
      </Row>
    </View>
  );
};

GroupActions.propTypes = {};

export default React.memo(GroupActions);
