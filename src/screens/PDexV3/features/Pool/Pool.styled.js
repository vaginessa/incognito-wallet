import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

export const styled = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  rowName: {
    alignItems: 'center',
  },
  name: {
    ...FONT.STYLE.bold,
    fontSize: FONT.SIZE.superMedium + 1,
    marginRight: 5,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.newGrey,
  },
  nameFollowed: {
    color: COLORS.black,
  },
  subText: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 2,
    color: COLORS.newGrey,
    marginTop: 10,
  },
  wrapperFirstSection: {
    flex: 0.8,
  },
  wrapperSecondSection: {
    flex: 0.2,
  },
  wrapperThirdSection: {
    flex: 0.3,
  },
  apy: {
    textAlign: 'center',
  },
  rightText: {
    textAlign: 'right',
  },
});
