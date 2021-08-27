import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from '@src/components';
import { Divider, Text } from '@src/components/core';
import { COLORS, FONT } from '@src/styles';
import { ButtonBasic } from '@src/components/Button';
import {
  actionFetchCancelingOrderTxs,
  actionCancelOrder,
  actionFetchOpenOrders,
} from './OrderLimit.actions';
import Extra, { Hook } from '../Extra';
import { openOrdersSelector } from './OrderLimit.selector';

const styled = StyleSheet.create({
  container: {},
  orderWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderValue: {
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    fontFamily: FONT.NAME.medium,
  },
  dividerStyled: {
    marginVertical: 15,
  },
  orderItem: {
    flex: 1,
    maxWidth: '30%',
  },
  btnCancel: {
    width: 80,
    height: 20,
    backgroundColor: COLORS.lightGrey19,
    marginTop: 10,
  },
  btnTitleCancel: {
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    fontFamily: FONT.NAME.medium,
    color: COLORS.lightGrey31,
  },
});

const OrderValue = React.memo(({ style, value }) => {
  return <Text style={style}>{value}</Text>;
});

const Order = React.memo(({ data }) => {
  const dispatch = useDispatch();
  if (!data) {
    return null;
  }
  const {
    infoStr,
    percentStr,
    timeStr,
    mainColor,
    visibleBtnCancel,
    visibleBtnCanceling,
    btnCancel,
    requesttx,
  } = data;
  const onCancelOrder = () => dispatch(actionCancelOrder(requesttx));
  const renderHook = () => {
    let comp = null;
    if (visibleBtnCanceling) {
      comp = <ActivityIndicator size="small" style={{ marginTop: 10 }} />;
    } else if (visibleBtnCancel) {
      comp = (
        <ButtonBasic
          btnStyle={styled.btnCancel}
          titleStyle={styled.btnTitleCancel}
          title="Cancel"
          onPress={onCancelOrder}
        />
      );
    } else if (btnCancel) {
      comp = (
        <OrderValue
          style={{ ...styled.orderValue, color: mainColor }}
          value={btnCancel}
        />
      );
    } else {
      return null;
    }
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {comp}
      </View>
    );
  };
  const factories = [
    {
      id: 'info',
      value: infoStr,
      style: {
        textAlign: 'left',
      },
    },
    {
      id: 'percent',
      value: percentStr,
      style: {
        textAlign: 'center',
      },
    },
    {
      id: 'time',
      value: timeStr,
      style: {
        textAlign: 'right',
      },
      hook: renderHook(),
    },
  ];
  return (
    <Row style={styled.orderWrapper}>
      {factories.map((item) => (
        <View style={styled.orderItem}>
          <OrderValue
            style={{ ...styled.orderValue, ...item.style, color: mainColor }}
            value={item?.value}
          />

          {item?.hook && item.hook}
        </View>
      ))}
    </Row>
  );
});

const OpenOrders = (props) => {
  const orders = useSelector(openOrdersSelector);
  const dispatch = useDispatch();
  const handleFetch = async () => {
    await Promise.all(
      dispatch(actionFetchOpenOrders()),
      dispatch(actionFetchCancelingOrderTxs()),
    );
  };
  React.useEffect(() => {
    handleFetch();
  }, []);
  return (
    <View style={styled.container}>
      <Extra title="Open orders" />
      {orders.map((order, index, arr) => (
        <>
          <Order key={order?.txhash} data={order} />
          {index !== arr.length - 1 && (
            <Divider dividerStyled={styled.dividerStyled} />
          )}
        </>
      ))}
    </View>
  );
};

OpenOrders.propTypes = {};

export default React.memo(OpenOrders);
