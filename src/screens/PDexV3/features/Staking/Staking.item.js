import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, FONT} from '@src/styles';
import PropTypes from 'prop-types';
import {Row} from '@src/components';

export const PoolItem = React.memo(({ item }) => {
  if (!item) return;
  const { token } = item;
  return (
    <TouchableOpacity style={styled.wrapper}>
      <Row>
        <View style={styled.wrapImage}>
          <Image source={{uri: token.iconUrl}} style={styled.image} />
        </View>
        <View>
          <Text style={styled.title}>{token.symbol}</Text>
          <Text style={styled.subTitle}>{token.name || token.symbol}</Text>
        </View>
      </Row>
      <Text style={styled.title}>60%</Text>
    </TouchableOpacity>
  );
});

export const PortfolioItem = React.memo(({ item }) => {
  if (!item) return;
  const { token, reward, staking } = item;
  console.log('item: ', staking);
  return (
    <TouchableOpacity style={styled.wrapper}>
      <Row>
        <View style={styled.wrapImage}>
          <Image source={{uri: token.iconUrl}} style={styled.image} />
        </View>
        <View>
          <Text style={styled.title}>{token.symbol}</Text>
          <Text style={styled.subTitle}>{token.name || token.symbol}</Text>
        </View>
      </Row>
      <View>
        <Text style={[styled.title, styled.rightText]}>{staking.stakingAmountSymbolStr}</Text>
        <TouchableOpacity>
          <Text style={[styled.subTitle, styled.rightText, reward.totalRewardUSD && styled.greenText]}>{`+ ${reward.totalRewardUSDStr}`}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

const styled = StyleSheet.create({
  wrapper: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  image: {
    width: 20,
    height: 20,
  },
  wrapImage: {
    justifyContent: 'center',
    marginRight: 12,
    height: FONT.SIZE.medium + 9,
  },
  title: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 9
  },
  subTitle: {
    ...FONT.STYLE.normal,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 7,
    color: COLORS.lightGrey33,
  },
  greenText: {
    color: COLORS.green2,
  },
  rightText: {
    textAlign: 'right'
  }
});

PoolItem.propTypes = {
  item: PropTypes.object.isRequired,
};

PortfolioItem.propTypes = {
  item: PropTypes.object.isRequired,
};
