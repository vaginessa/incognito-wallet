import React, { memo } from 'react';
import { ScrollViewBorder, Text, View } from '@components/core';
import { View2 } from '@components/core/View';
import { styled } from '@screens/Shield/features/ShieldDecentralizeDescription/styled';
import Header from '@components/Header/Header';
import { withLayout_2 } from '@components/Layout';
import { useSelector } from 'react-redux';
import { selectedPrivacySelector } from '@src/redux/selectors';

const CONTENTS = [
  {
    content: 'The shielding process is a cross-chain action, and requires an Ethereum smart contract interaction.\n'
  },
  {
    content: 'The fee is the cost of this interaction. Paid to the Ethereum miners, it is based on current gas prices on the Ethereum network\n'
  },
  {
    content: 'The shielding process will complete when the amount shielded is sufficient to cover the required gas fees.\n'
  },
];

const ShieldDecentralizeDescription = () => {
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  return (
    <View2 style={styled.container}>
      <Header title={`Shield ${selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol}`} />
      <ScrollViewBorder>
        <View style={styled.wrapper}>
          {CONTENTS.map((item, index) => <Text style={styled.content} key={`content-${index}`}>{item.content}</Text>)}
        </View>
      </ScrollViewBorder>
    </View2>
  );
};

export default withLayout_2(memo(ShieldDecentralizeDescription));
