import { Row } from '@src/components';
import { TokenVerifiedIcon } from '@src/components/Icons';
import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionToggleFollowingPool,
  getDataByPoolIdSelector,
} from '@screens/PDexV3/features/Pools';
import PropTypes from 'prop-types';
import { TouchableOpacity } from '@src/components/core';
import { BtnStar } from '@src/components/Button';
import { styled } from './Pool.styled';

export const PoolItem = React.memo((props) => {
  const { poolId, onPressPool, checkFollow, style } = props;
  const data = useSelector(getDataByPoolIdSelector)(poolId);
  if (!data) {
    return null;
  }
  const {
    isVerify,
    apy,
    volumeToAmountStr,
    isFollowed,
    poolTitle,
    ampStr,
    apyStr,
    priceChangeToAmountStr,
  } = data || {};

  const dispatch = useDispatch();
  const handleToggleFollowingPool = () =>
    dispatch(actionToggleFollowingPool(poolId));
  return (
    <TouchableOpacity
      onPress={() => typeof onPressPool === 'function' && onPressPool(poolId)}
      style={[styled.container, style]}
    >
      <Row>
        <View style={styled.block1}>
          <Row style={styled.rowName}>
            <Text style={styled.name}>{poolTitle}</Text>
            {!!isVerify && <TokenVerifiedIcon />}
          </Row>
          <Text style={styled.subText}>{`Vol: ${volumeToAmountStr}`}</Text>
        </View>
        <View style={styled.block2}>
          <Text style={styled.subText}> {apyStr}</Text>
          <Text style={styled.subText}> {priceChangeToAmountStr}</Text>
        </View>
        <View style={styled.block3}>
          <BtnStar onPress={handleToggleFollowingPool} isBlue={isFollowed} />
        </View>
      </Row>
    </TouchableOpacity>
  );
});

const Pool = (props) => {
  const { poolId, swipable, onPressPool, checkFollow } = props;
  const dispatch = useDispatch();
  if (!poolId) {
    return null;
  }
  return <PoolItem poolId={poolId} onPressPool={onPressPool} />;
};

Pool.defaultProps = {
  onPressPool: null,
  checkFollow: true,
};

Pool.propTypes = {
  poolId: PropTypes.string.isRequired,
  swipable: PropTypes.bool.isRequired,
  onPressPool: PropTypes.func,
  checkFollow: PropTypes.bool,
};

PoolItem.defaultProps = {
  onPressPool: null,
  checkFollow: true,
  style: null,
};

PoolItem.propTypes = {
  poolId: PropTypes.string.isRequired,
  onPressPool: PropTypes.func,
  checkFollow: PropTypes.bool,
  style: PropTypes.object,
};

export default React.memo(Pool);
