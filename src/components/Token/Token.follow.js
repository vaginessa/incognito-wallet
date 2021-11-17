import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {ImageCached, Row} from '@src/components';
import {formatPrice} from '@components/Token';
import replace from 'lodash/replace';
import round from 'lodash/round';
import {COLORS, FONT} from '@src/styles';
import {NormalText} from '@components/Token/Token';
import incognito from '@assets/images/new-icons/incognito.png';
import {BtnStar} from '@components/Button';

const TokenFollow = ({ item, hideStar, handleToggleFollowToken }) => {
  const { symbol, priceUsd, change, tokenId, isFollowed } = item;
  const balance = React.useMemo(() => {
    const price = priceUsd;
    const isTokenDecrease = change && change[0] === '-';
    const changeToNumber = Number(replace(change, '-', ''));
    const changeStr = changeToNumber === 0 ? '' : `${isTokenDecrease ? '-' : '+'}${round(changeToNumber, 2)}%`;
    const changeColor = isTokenDecrease ? COLORS.red2 : COLORS.green;
    return {
      price: formatPrice(price),
      changeStr,
      changeColor
    };
  }, [priceUsd]);
  return (
    <TouchableOpacity key={tokenId}>
      <Row centerVertical style={styled.wrapItem}>
        <Row centerVertical style={styled.sectionFirst}>
          <ImageCached uri={item.iconUrl} style={styled.icon} defaultImage={incognito} />
          <Text numberOfLines={1} style={styled.blackLabel}>{symbol}</Text>
        </Row>
        <View style={styled.sectionSecond}>
          <NormalText
            text={balance.price}
            hasPSymbol
            style={styled.blackLabel}
            stylePSymbol={[
              styled.blackLabel,
              { fontFamily: FONT.NAME.specialRegular }
            ]}
          />
        </View>
        <View style={styled.sectionThird}>
          <NormalText
            text={balance.changeStr}
            style={styled.blackLabel}
          />
        </View>
        {!hideStar && <BtnStar onPress={() => handleToggleFollowToken(item)} isBlue={isFollowed} />}
      </Row>
    </TouchableOpacity>
  );
};

export const styled = StyleSheet.create({
  wrapItem: {
    paddingBottom: 30,
  },
  blackLabel: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small + 1,
    textAlign: 'left',
    color: COLORS.black
  },
  icon: {
    marginRight: 16,
    width: 20,
    height: 20
  },
  sectionFirst: {
    flex: 0.6,
    paddingRight: 10
  },
  sectionSecond: {
    flex: 0.4,
    paddingRight: 10
  },
  sectionThird: {
    width: 80,
    paddingRight: 10
  }
});

TokenFollow.propTypes = {
  item: PropTypes.shape({
    iconUrl: PropTypes.string,
    symbol: PropTypes.string.isRequired,
    priceUsd: PropTypes.number.isRequired,
    change: PropTypes.string,
    tokenId: PropTypes.string.isRequired,
    isFollowed: PropTypes.bool.isRequired
  }).isRequired,
  hideStar: PropTypes.bool.isRequired,
  handleToggleFollowToken: PropTypes.func.isRequired,
};

export default memo(TokenFollow);
