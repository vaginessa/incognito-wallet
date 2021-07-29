import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { portfolioItemDataSelector } from '@screens/Liquidity3/Liquidity3.selector';
import { Row } from '@src/components';
import { ButtonBasic } from '@components/Button';
import styled from '@screens/Liquidity3/components/PortfolioCard/PortfolioCard.styled';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';

const CustomExtraInfo = React.memo(({ left, right }) => {
  return (
    <ExtraInfo
      left={left}
      style={{}}
      right={right}
      rightStyle={{}}
    />
  );
});

const PortfolioCard = React.memo(({ data }) => {
  const portfolio = useSelector(portfolioItemDataSelector)(data);
  const { token1, token2, APYStr, AMP, exchangeRateStr, principalStr, shareStr } = portfolio;
  return (
    <View>
      <Row style={styled.wrapperHeader}>
        <Text style={styled.boldBlackText}>{`${token1?.symbol} / ${token2?.symbol}`}</Text>
        <Row>
          <ButtonBasic btnStyle={[styled.button, styled.buttonInvest]} titleStyle={styled.titleInvest} title="Invest more" />
          <ButtonBasic btnStyle={[styled.button, styled.buttonWithdraw]} titleStyle={styled.titleWithdraw} title="Withdraw " />
        </Row>
      </Row>
      <CustomExtraInfo left="APY:" right={APYStr} />
      <CustomExtraInfo left="AMP:" right={AMP} />
      <CustomExtraInfo left="Exchange rate:" right={exchangeRateStr} />
      <CustomExtraInfo left="Principal:" right={principalStr} />
      <CustomExtraInfo left="Share:" right={shareStr} />
    </View>
  );
});

PortfolioCard.propTypes = {
  data: PropTypes.object.isRequired
};

export default PortfolioCard;
