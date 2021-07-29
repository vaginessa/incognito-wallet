import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { poolItemDataSelector } from '@screens/Liquidity3/Liquidity3.selector';
import { useSelector } from 'react-redux';
import { Row } from '@src/components';
import mainStyle from '@screens/Liquidity3/features/FavoritePool/FavoritePool.styled';
import styleSheet from '@components/VerifiedText/style';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from '@screens/Liquidity3/components/PoolCard/PoolCard.styled';
import formatUtil from '@utils/format';
import Swipeout from 'react-native-swipeout';
import {COLORS} from '@src/styles';

const PoolCard = ({ data, onPress, swipable, onRemove }) => {
  const pool = useSelector(poolItemDataSelector)(data);
  if (!pool) return;
  const { token1, token2, verified, AMP, APY, volume, priceChange, dayPercent, poolID } = pool;

  const Component = (
    <TouchableOpacity onPress={onPress}>
      <Row>
        <View style={mainStyle.wrapperFirstSection}>
          <Row style={styled.rowName}>
            <Text style={styled.name}>{`${token1?.symbol} / ${token2?.symbol}`}</Text>
            {!!verified && (
              <Icons style={styleSheet.verifiedFlag} name='check-circle' size={14} />
            )}
          </Row>
          <Text style={styled.subText}>{`Vol: ${formatUtil.amountFull(volume, 0)}$`}</Text>
          <Text style={styled.subText}>{`AMP: ${AMP}`}</Text>
        </View>
        <View style={mainStyle.wrapperSecondSection}>
          <Text style={[styled.subText, mainStyle.centerText]}>{`${APY}%`}</Text>
        </View>
        <View style={mainStyle.wrapperThirdSection}>
          <Text style={[styled.subText, mainStyle.rightText]}>{`$${formatUtil.amountFull(priceChange, 0)}`}</Text>
          <Text style={[
            styled.subText,
            mainStyle.rightText,
            dayPercent === 0 ? styled.grayText : ((dayPercent > 0) ? styled.greenText : styled.redText)]}
          >{`${dayPercent > 0 ? '+' : ''}${dayPercent}%`}
          </Text>
        </View>
      </Row>
    </TouchableOpacity>
  );

  if (swipable === true) {
    return (
      <Swipeout
        autoClose
        style={styled.container}
        right={[
          {
            text: 'Remove',
            backgroundColor: COLORS.red,
            onPress: () => { onRemove(poolID); },
          },
        ]}
      >
        {Component}
      </Swipeout>
    );
  }

  return (
    <View style={styled.container}>
      {Component}
    </View>
  );
};

PoolCard.defaultProps = {
  swipable: false
};

PoolCard.propTypes = {
  data: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  swipable: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
};


export default React.memo(PoolCard);
