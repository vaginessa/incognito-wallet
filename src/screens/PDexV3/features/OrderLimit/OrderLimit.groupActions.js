import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  ButtonBasic,
  ButtonRefresh,
  ButtonChart,
} from '@src/components/Button';
import { Row } from '@src/components';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
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

const GroupActions = () => {
  const navigation = useNavigation();
  const { mainColor, btnActionTitle, disabledBtn, poolId } = useSelector(
    orderLimitDataSelector,
  );
  const dispatch = useDispatch();
  const onPressRefresh = () => dispatch(actionInit());
  const handleReviewOrder = () => {
    !disabledBtn && navigation.navigate(routeNames.ReviewOrderLimit);
  };
  const onPressChart = () => {
    navigation.navigate(routeNames.Chart, {
      poolId,
    });
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
