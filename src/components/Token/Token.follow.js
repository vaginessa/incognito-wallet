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
import {TokenVerifiedIcon} from '@components/Icons';

const TokenFollow = ({ item, hideStar, handleToggleFollowToken }) => {
  const { symbol, priceUsd, change, tokenId, isFollowed, name, isVerified } = item;
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
      <Row style={styled.wrapItem}>
        <View centerVertical style={styled.sectionFirst}>
          <Row centerVertical>
            <ImageCached uri={item.iconUrl} style={styled.icon} defaultImage={incognito} />
            <NormalText style={styled.blackLabel} text={symbol} />
            {isVerified && <TokenVerifiedIcon style={styled.verifyIcon} />}
          </Row>
          <NormalText style={[styled.blackLabel, styled.networkName]} text={name} />
        </View>
        <View style={styled.sectionSecond}>
          <NormalText
            text={balance.price}
            containerStyle={styled.containerStyle}
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
            containerStyle={styled.containerStyle}
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
    paddingBottom: 25,
  },
  blackLabel: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small + 1,
    textAlign: 'left',
    color: COLORS.black
  },
  icon: {
    marginRight: 12,
    width: 20,
    height: 20
  },
  sectionFirst: {
    flex: 0.65,
    paddingRight: 5,
  },
  sectionSecond: {
    flex: 0.35,
    paddingRight: 5,
    alignItems: 'flex-end'
  },
  sectionThird: {
    width: 85,
    alignItems: 'flex-end',
    paddingRight: 5
  },
  networkName: {
    ...FONT.STYLE.normal,
    fontSize: FONT.SIZE.small,
    textAlign: 'left',
    marginLeft: 32,
    color: COLORS.colorGrey1
  },
  containerStyle: {
    minHeight: 20,
    justifyContent: 'center'
  },
  verifyIcon: {
    width: 12,
    height: 12
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
