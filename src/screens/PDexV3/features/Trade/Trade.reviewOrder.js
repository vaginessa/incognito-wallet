import { Header } from '@src/components';
import { ButtonTrade } from '@src/components/Button';
import { ScrollView } from '@src/components/core';
import { withLayout_2 } from '@src/components/Layout';
import { COLORS, FONT } from '@src/styles';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';

const styled = StyleSheet.create({
  container: { flex: 1 },
  btnStyled: {
    marginTop: 30,
  },
  scrollview: {
    paddingTop: 42,
    flex: 1,
  },
});

const ReviewOrder = () => {
  const data = useNavigationParam('data') || {};
  const { extra, handleConfirm, btnColor = COLORS.colorTradeBlue } = data;
  return (
    <View style={styled.container}>
      <Header title="Order preview" />
      <ScrollView style={styled.scrollview}>
        {extra && extra}
        <ButtonTrade
          btnStyle={{ ...styled.btnStyled, backgroundColor: btnColor }}
          title="Confirm"
          onPress={handleConfirm}
        />
      </ScrollView>
    </View>
  );
};

ReviewOrder.propTypes = {};

export default withLayout_2(React.memo(ReviewOrder));
