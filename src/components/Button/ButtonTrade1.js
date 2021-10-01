import { COLORS } from '@src/styles';
import React from 'react';
import { StyleSheet } from 'react-native';
import ButtonBasic from './ButtonBasic';

const styled = StyleSheet.create({
  btnStyle: {
    backgroundColor: COLORS.colorGrey,
  },
  titleStyle: {
    color: COLORS.black,
  },
});

const ButtonTrade1 = React.memo(({ btnStyle, titleStyle, ...rest }) => {
  return (
    <ButtonBasic
      btnStyle={[btnStyle, styled.btnStyle]}
      titleStyle={[styled.titleStyle, titleStyle]}
      {...rest}
    />
  );
});

export default ButtonTrade1;
