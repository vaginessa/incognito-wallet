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
import format from '@utils/format';

const TokenFollow = ({ item, hideStar, handleToggleFollowToken, onPress }) => {
  const { symbol, priceUsd, change, tokenId, isFollowed, name } = item;
  const balance = React.useMemo(() => {
    const price = priceUsd;
    const isTokenDecrease = change && change[0] === '-';
    const changeToNumber = Number(replace(change, '-', ''));
    const changeStr = changeToNumber === 0 ? '0%' : `${isTokenDecrease ? '-' : '+'}${format.amountVer2(changeToNumber, 0)}%`;
    const changeColor = changeToNumber === 0 ? COLORS.lightGrey34 : (isTokenDecrease ? COLORS.red : COLORS.green);
    return {
      price: formatPrice(price),
      changeStr,
      changeColor
    };
  }, [priceUsd]);
  return (
    <TouchableOpacity key={tokenId} onPress={onPress}>
      <Row style={styled.wrapItem}>
        <View centerVertical style={styled.sectionFirst}>
          <Row centerVertical>
            <ImageCached uri={item.iconUrl} style={styled.icon} defaultImage={incognito} />
            <View>
              <NormalText
                style={styled.blackLabel}
                text={symbol}
              />
              <NormalText
                style={styled.greyText}
                text={name}
              />
            </View>
          </Row>
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
          <NormalText
            style={[styled.greyText, { color: balance.changeColor }]}
            containerStyle={styled.containerStyle}
            text={balance.changeStr}
          />
        </View>
        {!hideStar && (
          <TouchableOpacity style={styled.iconStar} onPress={() => handleToggleFollowToken(item)}>
            <BtnStar onPress={() => handleToggleFollowToken(item)} isBlue={isFollowed} />
          </TouchableOpacity>
        )}
      </Row>
    </TouchableOpacity>
  );
};

export const FollowHeader = React.memo(({ hideStar }) => {
  return (
    <Row style={styled.wrapHeader}>
      <View centerVertical style={styled.sectionFirst}>
        <Text style={styled.headerLabel}>Assets</Text>
      </View>
      <View centerVertical style={styled.sectionSecond}>
        <Text style={styled.headerLabel}>Price</Text>
      </View>
      <View centerVertical style={styled.sectionThird}>
        <Text style={styled.headerLabel}>Change</Text>
      </View>
      {!hideStar && <View style={styled.iconStar} />}
    </Row>
  );
});

export const styled = StyleSheet.create({
  wrapItem: {
    paddingBottom: 32,
  },
  blackLabel: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    textAlign: 'left',
    color: COLORS.black,
    lineHeight: FONT.SIZE.medium + 9,
  },
  icon: {
    marginRight: 12,
    width: 32,
    height: 32
  },
  sectionFirst: {
    flex: 1,
    paddingRight: 5,
    height: '100%',
  },
  sectionSecond: {
    flex: 1,
    paddingRight: 5,
    alignItems: 'flex-end',
  },
  sectionThird: {
    width: 90,
    alignItems: 'flex-end',
  },
  greyText: {
    fontFamily: FONT.NAME.normal,
    fontSize: FONT.SIZE.small,
    color: COLORS.colorGrey1,
    lineHeight: FONT.SIZE.small + 7,
  },
  containerStyle: {
    minHeight: 20,
    justifyContent: 'center'
  },
  headerLabel: {
    ...FONT.STYLE.normal,
    fontSize: FONT.SIZE.small,
    color: COLORS.colorGrey1
  },
  wrapHeader: {
    marginTop: 24,
    marginBottom: 5
  },
  iconStar: {
    width: 24,
    height: FONT.SIZE.medium + 9,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
});

TokenFollow.propTypes = {
  item: PropTypes.shape({
    iconUrl: PropTypes.string,
    symbol: PropTypes.string.isRequired,
    priceUsd: PropTypes.number.isRequired,
    change: PropTypes.string,
    tokenId: PropTypes.string.isRequired,
    isFollowed: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    network: PropTypes.string,
    hasSameSymbol: PropTypes.bool
  }).isRequired,
  hideStar: PropTypes.bool.isRequired,
  handleToggleFollowToken: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
};

FollowHeader.propTypes = {
  hideStar: PropTypes.bool.isRequired,
};

export default memo(TokenFollow);
