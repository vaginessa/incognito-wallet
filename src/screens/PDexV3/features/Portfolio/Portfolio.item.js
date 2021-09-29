import { Row } from '@src/components';
import { ButtonTrade } from '@src/components/Button';
import {Text, Toast} from '@src/components/core';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {batch, useDispatch, useSelector} from 'react-redux';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import {liquidityActions} from '@screens/PDexV3/features/Liquidity';
import PropTypes from 'prop-types';
import {actionSetPoolModal} from '@screens/PDexV3/features/Portfolio/Portfolio.actions';
import {getDataByShareIdSelector} from './Portfolio.selector';
import { portfolioItemStyled as styled } from './Portfolio.styled';

const Hook = React.memo((props) => {
  const { label, value, isClaimReward, withdrawable, withdrawing } = props;
  const onWithdrawLPFee = () => {
    if (withdrawing) return Toast.showSuccess('Please wait previous transaction success.');
  };
  if (!isClaimReward) {
    return (
      <Row style={styled.hookContainer}>
        <Text style={styled.hookLabel}>{`${label}:`}</Text>
        <Text style={styled.hookValue}>{value}</Text>
      </Row>
    );
  }
  return (
    <Row style={styled.hookContainer}>
      <Text style={styled.hookLabel}>{`${label}:`}</Text>
      <Row style={[styled.hookContainer, { marginBottom: 0 }]}>
        <Text style={styled.hookValue}>{value}</Text>
        {(isClaimReward && withdrawable) && (
          <ButtonTrade
            title={`${withdrawing ? 'Withdrawing' : 'Claim'}`}
            btnStyle={withdrawing ? styled.withdrawing : styled.withdrawBtn}
            titleStyle={styled.titleSmall}
            onPress={onWithdrawLPFee}
          />
        )}
      </Row>
    </Row>
  );
});

const Extra = React.memo((props) => {
  const { shareId } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const data = useSelector(getDataByShareIdSelector)(shareId);
  const { token1, token2, poolId } = data || {};
  const onInvestPress = () => {
    batch(() => {
      dispatch(liquidityActions.actionSetContributePoolID({ poolId }));
      navigation.navigate(routeNames.ContributePool);
    });
  };

  return (
    <Row style={styled.extraContainer}>
      <Text style={styled.extraLabel}>
        {`${token1?.symbol} / ${token2?.symbol}`}
      </Text>
      <Row>
        <ButtonTrade
          title="Invest more"
          btnStyle={styled.btnSmall}
          titleStyle={styled.titleSmall}
          onPress={onInvestPress}
        />
      </Row>
    </Row>
  );
});

const PortfolioItem = (props) => {
  const { shareId } = props;
  const dispatch = useDispatch();
  const data = useSelector(getDataByShareIdSelector)(shareId);
  if (!data) {
    return null;
  }
  const onPress = () => dispatch(actionSetPoolModal({ poolId: data.poolId }));
  const { hookFactories } = data || {};
  return (
    <TouchableOpacity
      style={styled.container}
      onPress={onPress}
    >
      <Extra shareId={shareId} />
      {hookFactories.map((hook) => (
        <Hook {...hook} />
      ))}
    </TouchableOpacity>
  );
};

PortfolioItem.propTypes = {
  shareId: PropTypes.string.isRequired
};

Extra.propTypes = {
  shareId: PropTypes.string.isRequired
};

Hook.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isClaimReward: PropTypes.bool.isRequired,
  withdrawable: PropTypes.bool.isRequired,
  withdrawing: PropTypes.bool.isRequired,
};

export default React.memo(PortfolioItem);
