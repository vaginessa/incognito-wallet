import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

export const styled = StyleSheet.create({
  container: {},
  btnTrade: {
    marginTop: 56,
    marginBottom: 30,
  },
});

export const tabsStyled = StyleSheet.create({
  tabBtn: {
    height: 32,
    width: 62,
    backgroundColor: COLORS.black,
    maxWidth: 62,
  },
  tabBtnDisabled: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  tabTitleStyled: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 3,
    color: COLORS.white,
  },
  tabTitleDisabledStyled: {
    color: COLORS.newGrey,
  },
  styledTabList: {
    maxWidth: 144,
  },
});
