import { Row } from '@src/components';
import { Text } from '@src/components/core';
import { COLORS, FONT } from '@src/styles';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { orderBookSelector } from './Chart.selector';

const styled = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    color: COLORS.black,
    flex: 1,
    marginRight: 10,
  },
  volume: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    flex: 1,
  },
  wrapperOrder: {
    flex: 1,
    maxWidth: '48%',
  },
  wrapperItem: { justifyContent: 'space-between', marginBottom: 15 },
  title: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.black,
    marginBottom: 30,
  },
});

const Item = React.memo((props) => {
  const { priceStr, volumeStr, color } = props;
  return (
    <Row style={styled.wrapperItem}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styled.price}>
        {priceStr}
      </Text>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{ ...styled.volume, color }}
      >
        {volumeStr}
      </Text>
    </Row>
  );
});

const OrderBook = (props) => {
  const orderBook = useSelector(orderBookSelector);
  const { buy, sell } = orderBook;
  console.log('buy', buy[0]);
  return (
    <View style={styled.container}>
      <Text style={styled.title}>Order Book</Text>
      <View style={styled.wrapper}>
        <View style={styled.wrapperOrder}>
          {buy.map((o) => (
            <Item {...o} key={o?.volume} />
          ))}
        </View>
        <View style={styled.wrapperOrder}>
          {sell.map((o) => (
            <Item {...o} key={o?.volume} />
          ))}
        </View>
      </View>
    </View>
  );
};

OrderBook.propTypes = {};

export default React.memo(OrderBook);
