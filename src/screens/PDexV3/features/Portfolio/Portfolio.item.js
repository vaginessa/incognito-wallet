import { Row } from '@src/components';
import { ButtonTrade, ButtonTrade1 } from '@src/components/Button';
import { Text } from '@src/components/core';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { getDataByShareIdSelector } from './Portfolio.selector';
import { portfolioItemStyled as styled } from './Portfolio.styled';

const Hook = React.memo((props) => {
  const { label, value, isClaimReward } = props;
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
        {isClaimReward && (
          <ButtonTrade
            title="Claim"
            btnStyle={[styled.btnSmall, { width: 50 }]}
            titleStyle={styled.titleSmall}
          />
        )}
      </Row>
    </Row>
  );
});

const Extra = React.memo((props) => {
  const { shareId } = props;
  const data = useSelector(getDataByShareIdSelector)(shareId);
  const { token1, token2 } = data || {};
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
        />
        <ButtonTrade1
          title="Withdraw"
          btnStyle={styled.btnSmall}
          titleStyle={styled.titleSmall}
        />
      </Row>
    </Row>
  );
});

const PortfolioItem = (props) => {
  const { shareId } = props;
  const data = useSelector(getDataByShareIdSelector)(shareId);
  if (!data) {
    return null;
  }
  const { hookFactories } = data || {};
  return (
    <View style={styled.container}>
      <Extra shareId={shareId} />
      {hookFactories.map((hook) => (
        <Hook {...hook} />
      ))}
    </View>
  );
};

PortfolioItem.propTypes = {};

export default React.memo(PortfolioItem);
