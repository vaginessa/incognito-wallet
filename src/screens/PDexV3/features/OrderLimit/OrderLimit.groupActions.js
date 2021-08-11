import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  ButtonBasic,
  ButtonRefresh,
  ButtonChart,
} from '@src/components/Button';
import { Row } from '@src/components';
import { orderLimitDataSelector } from './OrderLimit.selector';

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
  const { mainColor, btnActionTitle } = useSelector(orderLimitDataSelector);
  return (
    <View style={styled.container}>
      <ButtonBasic
        btnStyle={{ backgroundColor: mainColor }}
        title={btnActionTitle}
      />
      <Row style={styled.subActions}>
        <ButtonRefresh style={styled.refreshBtn} />
        <ButtonChart />
      </Row>
    </View>
  );
};

GroupActions.propTypes = {};

export default React.memo(GroupActions);
