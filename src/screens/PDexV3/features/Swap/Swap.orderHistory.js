import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Divider,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
} from '@src/components/core';
import { useDispatch, useSelector } from 'react-redux';
import { Header, Row } from '@src/components';
import { COLORS, FONT } from '@src/styles';
import { ArrowRightGreyIcon } from '@src/components/Icons';
import { useFocusEffect, useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { actionFetchHistory, actionFetchedOrderDetail } from './Swap.actions';
import { swapHistorySelector } from './Swap.selector';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlist: {
    paddingTop: 41,
  },
  order: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderTitle: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 5,
    color: COLORS.black,
    marginRight: 15,
  },
  orderId: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
    color: COLORS.colorGreyBold,
    maxWidth: 200,
  },
  swap: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
    color: COLORS.colorGreyBold,
    marginRight: 15,
  },
  statusStr: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
    color: COLORS.colorGreyBold,
  },
  orderWrapper: {
    flex: 1,
    marginRight: 15,
  },
});

const Order = React.memo(({ data, visibleDivider }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  if (!data?.requestTx) {
    return null;
  }
  const { rateStr, statusStr, swapStr, requestTx } = data;
  const handleNavOrderDetail = async () => {
    await dispatch(actionFetchedOrderDetail(data));
    navigation.navigate(routeNames.OrdeSwapDetail);
  };
  return (
    <>
      <TouchableOpacity style={styled.order} onPress={handleNavOrderDetail}>
        <View style={styled.orderWrapper}>
          <Row>
            <Text style={styled.orderTitle}>Swap</Text>
            <Text
              style={styled.orderId}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {requestTx}
            </Text>
          </Row>
          <Row>
            <Text style={styled.swap}>{swapStr}</Text>
            <Text style={styled.statusStr}>{statusStr}</Text>
          </Row>
        </View>
        <ArrowRightGreyIcon />
      </TouchableOpacity>
      {visibleDivider && <Divider />}
    </>
  );
});

const OrderHistory = () => {
  const dispatch = useDispatch();
  const onRefresh = () => dispatch(actionFetchHistory());
  const { isFetching, history = [] } = useSelector(swapHistorySelector);
  useFocusEffect(
    React.useCallback(() => {
      dispatch(actionFetchHistory());
    }, []),
  );
  return (
    <View style={styled.container}>
      <Header title="Order history" />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
        }
        data={history}
        keyExtractor={(item) => item?.requestTx}
        renderItem={({ item, index }) => (
          <Order data={item} visibleDivider={index !== history.length - 1} />
        )}
        style={styled.flatlist}
      />
    </View>
  );
};

OrderHistory.propTypes = {};

export default React.memo(OrderHistory);
