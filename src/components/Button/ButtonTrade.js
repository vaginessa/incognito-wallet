import { COLORS } from '@src/styles';
import React from 'react';
import { StyleSheet } from 'react-native';
import ButtonBasic from './ButtonBasic';

const styled = StyleSheet.create({
  btnStyle: {
    backgroundColor: COLORS.colorBlue,
  },
  titleStyle: {
    color: COLORS.white,
  },
});

const ButtonTrade = React.memo(({ btnStyle, titleStyle, ...rest }) => {
  return (
    <ButtonBasic
      btnStyle={[btnStyle, styled.btnStyle]}
      titleStyle={[titleStyle, styled.titleStyle]}
      {...rest}
    />
  );
});

export default ButtonTrade;
