import React from 'react';
import isEmpty from 'lodash/isEmpty';
import ButtonBasic from '@src/components/Button/ButtonBasic';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ACCOUNT_CONSTANT } from 'incognito-chain-web-js/build/wallet';
import { Row } from '@src/components';
import { Divider, LoadingContainer, Text } from '@src/components/core';
import { COLORS, FONT } from '@src/styles';
import LoadingTx from '@src/components/LoadingTx';
import Extra from '@screens/PDexV3/features/Extra';
import RemoveSuccessDialog from '@src/screens/Setting/features/RemoveStorage/RemoveStorage.Dialog';
import { actionWithdrawOrder, actionInit } from './OrderLimit.actions';
import { orderHistorySelector } from './OrderLimit.selector';

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
  btnWithdraw: {
    width: 80,
    height: 20,
    backgroundColor: COLORS.lightGrey19,
    marginTop: 10,
  },
  btnTitleWithdraw: {
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
  const [visible, setVisible] = React.useState(false);
  const [withdrawData, setWithdrawData] = React.useState({});
  const onPressWithdrawOrder = async (data) => {
    await setWithdrawData(data);
    await setVisible(true);
  };
  const onWithdrawOrder = async (data) => {
    const isCancelOrder = !isEmpty(withdrawData);
    let task = [dispatch(actionWithdrawOrder(data || withdrawData))];
    if (isCancelOrder) {
      task.push(setVisible(false));
    }
    await Promise.all(task);
    await dispatch(actionInit(true));
  };
  if (!data) {
    return null;
  }
  const {
    infoStr,
    percentStr,
    timeStr,
    mainColor,
    visibleBtnCancel,
    statusStr,
    btnTitleCancel,
    requestTx,
    btnClaim,
    visibleBtnClaim,
    btnTitleClaim,
    btnCancel,
    withdrawing,
  } = data;
  const renderHook = () => {
    let comp = null;
    if (visibleBtnCancel) {
      comp = (
        <ButtonBasic
          btnStyle={styled.btnWithdraw}
          title={btnTitleCancel}
          titleStyle={styled.btnTitleWithdraw}
          onPress={() =>
            onPressWithdrawOrder({
              requestTx,
              txType: ACCOUNT_CONSTANT.TX_TYPE.CANCEL_ORDER_LIMIT,
              subTitle:
                'This will cancel your order. Are your sure to continute?',
            })
          }
        />
      );
    } else if (visibleBtnClaim) {
      comp = (
        <ButtonBasic
          btnStyle={styled.btnWithdraw}
          titleStyle={styled.btnTitleWithdraw}
          title={btnTitleClaim}
          onPress={() =>
            onWithdrawOrder({
              requestTx,
              txType: ACCOUNT_CONSTANT.TX_TYPE.CLAIM_ORDER_LIMIT,
            })
          }
        />
      );
    } else if (btnCancel) {
      comp = (
        <OrderValue
          style={{ ...styled.orderValue, color: mainColor }}
          value={btnCancel}
        />
      );
    } else if (btnClaim) {
      comp = (
        <OrderValue
          style={{ ...styled.orderValue, color: mainColor }}
          value={btnClaim}
        />
      );
    } else {
      comp = (
        <OrderValue
          style={{ ...styled.orderValue, color: mainColor }}
          value={statusStr}
        />
      );
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
    <React.Fragment>
      <Row style={styled.orderWrapper}>
        <RemoveSuccessDialog
          visible={visible}
          onPressCancel={() => setVisible(false)}
          onPressAccept={onWithdrawOrder}
          title="Cancel order"
          subTitle={withdrawData?.subTitle || ''}
          acceptStr="OK"
        />
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
      {withdrawing && <LoadingTx />}
    </React.Fragment>
  );
});

const OpenOrders = () => {
  const { history = [], isFetching, isFetched } = useSelector(
    orderHistorySelector,
  );
  return (
    <View style={styled.container}>
      <Extra title="Open orders" />
      {isFetching && !isFetched ? (
        <LoadingContainer />
      ) : (
        history?.map((order, index, arr) => (
          <>
            <Order key={order?.requestTx} data={order} />
            {index !== arr.length - 1 && (
              <Divider dividerStyled={styled.dividerStyled} />
            )}
          </>
        ))
      )}
    </View>
  );
};

OpenOrders.propTypes = {};

export default React.memo(OpenOrders);
