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
  const { mainColor, btnActionTitle, disabledBtn } = useSelector(
    orderLimitDataSelector,
  );
  const dispatch = useDispatch();
  const onPressRefresh = () => dispatch(actionInit());
  return (
    <View style={styled.container}>
      <ButtonBasic
        btnStyle={{ backgroundColor: mainColor }}
        title={btnActionTitle}
        disabled={disabledBtn}
      />
      <Row style={styled.subActions}>
        <ButtonRefresh style={styled.refreshBtn} onPress={onPressRefresh} />
        <ButtonChart />
      </Row>
    </View>
  );
};

GroupActions.propTypes = {};

export default React.memo(GroupActions);
