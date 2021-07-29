import React, { memo } from 'react';
import { Text } from 'react-native';
import { MESSAGES } from '@screens/Liquidity3/Liquidity3.constants';
import styled from '@screens/Liquidity3/features/FavoritePool/FavoritePool.styled';
import { Row } from '@src/components';

const HEADER_FACTORIES = [
  {
    text: MESSAGES.name_vol,
    mainStyle: styled.wrapperFirstSection,
    textStyle: null
  },
  {
    text: MESSAGES.apy,
    mainStyle: styled.wrapperSecondSection,
    textStyle: styled.centerText },
  {
    text: MESSAGES.change,
    mainStyle: styled.wrapperThirdSection,
    textStyle: styled.rightText
  }
];

const FixedHeaderPoolCard = () => {
  return (
    <Row style={{ marginVertical: 15 }}>
      {HEADER_FACTORIES.map((item) => (
        <Text key={item?.text} style={[item.mainStyle, styled.headerSectionText, item?.textStyle]}>
          {item?.text}
        </Text>
      ))}
    </Row>
  );
};

export default memo(FixedHeaderPoolCard);
