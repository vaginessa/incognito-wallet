import { Row } from '@src/components';
import { TokenVerifiedIcon } from '@src/components/Icons';
import { COLORS } from '@src/styles';
import React from 'react';
import { View, Text } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionToggleFollowingPool,
  getDataByPoolIdSelector,
} from '@screens/PDexV3/features/Pools';
import PropTypes from 'prop-types';
import { TouchableOpacity } from '@src/components/core';
import { styled } from './Pool.styled';

export const PoolItem = React.memo((props) => {
  const { poolId, onPressPool } = props;
  const data = useSelector(getDataByPoolIdSelector)(poolId);
  if (!data) {
    return null;
  }
  const {
    token1,
    token2,
    verified,
    amp,
    apy,
    volumeToAmount,
    priceChangeToAmount,
    perChange24hToStr,
    perChange24hColor,
    isFollowed,
    poolTitle,
  } = data || {};
  return (
    <TouchableOpacity
      onPress={() => typeof onPressPool === 'function' && onPressPool(poolId)}
      style={styled.container}
    >
      <Row>
        <View style={styled.wrapperFirstSection}>
          <Row style={styled.rowName}>
            <Text
              style={[styled.name, isFollowed ? styled.nameFollowed : null]}
            >
              {poolTitle}
            </Text>
            {!!verified && <TokenVerifiedIcon />}
          </Row>
          <Text style={styled.subText}>{`Vol: ${volumeToAmount}$`}</Text>
          <Text style={styled.subText}>{`AMP: ${amp}`}</Text>
        </View>
        <View style={styled.wrapperSecondSection}>
          <Text style={[styled.subText, styled.apy]}>{`${apy}%`}</Text>
        </View>
        <View style={styled.wrapperThirdSection}>
          <Text
            style={[
              styled.subText,
              styled.rightText,
              {
                color: perChange24hColor,
              },
            ]}
          >
            {`$${priceChangeToAmount}`}
          </Text>
          <Text
            style={[
              styled.subText,
              styled.rightText,
              {
                color: perChange24hColor,
              },
            ]}
          >
            {perChange24hToStr}
          </Text>
        </View>
      </Row>
    </TouchableOpacity>
  );
});

const Pool = (props) => {
  const { poolId, swipable, onPressPool } = props;
  const dispatch = useDispatch();
  if (!poolId) {
    return null;
  }
  if (swipable) {
    return (
      <Swipeout
        autoClose
        style={{ backgroundColor: 'transparent' }}
        right={[
          {
            text: 'Remove',
            backgroundColor: COLORS.red,
            onPress: () => dispatch(actionToggleFollowingPool(poolId)),
          },
        ]}
      >
        <PoolItem poolId={poolId} onPressPool={onPressPool} />
      </Swipeout>
    );
  }
  return <PoolItem poolId={poolId} onPressPool={onPressPool} />;
};

Pool.propTypes = {
  poolId: PropTypes.string.isRequired,
  swipable: PropTypes.bool.isRequired,
  onPressPool: PropTypes.func,
};

export default React.memo(Pool);
