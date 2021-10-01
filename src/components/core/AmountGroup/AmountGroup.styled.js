import { StyleSheet } from 'react-native';
import { FONT, COLORS, UTILS } from '@src/styles';

export default StyleSheet.create({
  wrapper: {
  },
  title: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 3,
    color: COLORS.lightGrey33
  },
  baseAmount: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.superLarge,
    lineHeight: FONT.SIZE.superLarge + 8,
    color: COLORS.black
  },
  compareAmount: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 3,
    color: COLORS.black1
  },
});
