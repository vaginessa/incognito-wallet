import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  ButtonRefresh,
  ButtonChart,
  BtnOrderHistory,
} from '@src/components/Button';
import { Text, TouchableOpacity } from '@src/components/core';
import { Row } from '@src/components';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { TradeSuccessModal } from '@screens/PDexV3/features/Trade';
import { actionToggleModal } from '@src/components/Modal';
import { COLORS, FONT } from '@src/styles';
import { ArrowGreyDown } from '@src/components/Icons';
import {
  orderLimitDataSelector,
  rateDataSelector,
} from './OrderLimit.selector';
import { actionInit, actionBookOrder } from './OrderLimit.actions';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  top: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  block1: {
    marginRight: 15,
    flexDirection: 'row',
  },
  pool: {
    fontSize: FONT.SIZE.medium,
    fontFamily: FONT.NAME.medium,
    color: COLORS.black,
  },
  rate: {
    fontSize: FONT.SIZE.avgLarge,
    fontFamily: FONT.NAME.medium,
    color: COLORS.black,
    marginRight: 8,
    maxWidth: '50%',
  },
  priceChange24hWrapper: {
    borderRadius: 4,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 30,
    maxWidth: 50,
  },
  priceChange24h: {
    fontSize: FONT.SIZE.superSmall,
    fontFamily: FONT.NAME.medium,
    color: COLORS.white,
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const GroupActions = () => {
  const navigation = useNavigation();
  const {
    disabledBtn,
    poolId,
    cfmTitle,
    poolStr,
    priceChange24hStr,
    colorPriceChange24h,
  } = useSelector(orderLimitDataSelector);
  const { rateStr } = useSelector(rateDataSelector);
  const dispatch = useDispatch();
  const onPressRefresh = React.useCallback(() => dispatch(actionInit()), []);
  const onPressChart = () => {
    navigation.navigate(routeNames.Chart, {
      poolId,
    });
  };
  console.log('poolStr', poolStr);
  return (
    <View style={styled.container}>
      <Row style={styled.top}>
        <TouchableOpacity style={styled.block1}>
          <Text style={styled.pool}>{poolStr}</Text>
          <ArrowGreyDown />
        </TouchableOpacity>
        <Row style={styled.block2}>
          <ButtonRefresh style={{ marginRight: 10 }} onPress={onPressRefresh} />
          <ButtonChart style={{ marginRight: 10 }} onPress={onPressChart} />
          <BtnOrderHistory
            onPress={() => navigation.navigate(routeNames.TradeOrderHistory)}
          />
        </Row>
      </Row>
      <Row style={styled.bottom}>
        <Text style={styled.rate} numberOfLines={1} ellipsizeMode="tail">
          {rateStr}
        </Text>
        <View
          style={{
            ...styled.priceChange24hWrapper,
            backgroundColor: colorPriceChange24h,
          }}
        >
          <Text
            style={{
              ...styled.priceChange24h,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {priceChange24hStr}
          </Text>
        </View>
      </Row>
    </View>
  );
};

GroupActions.propTypes = {};

export default React.memo(GroupActions);
