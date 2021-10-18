import {COLORS, FONT} from '@src/styles';
import {StyleSheet} from 'react-native';

export const DEFAULT_PADDING = 24;

export const styled = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: DEFAULT_PADDING,
    paddingTop: 10
  },
});

export const homeStyled = StyleSheet.create({
  header: {
    height: 56,
  },
  headerIcon: {
    marginRight: 16
  },
  wrapBanner: {
    marginTop: 8
  },
  mainCategory: {
    flex: 1,
    marginTop: 8,
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mediumBlack: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.regular,
    color: COLORS.black,
    lineHeight: FONT.SIZE.regular + 8,
  },
  regularGray: {
    ...FONT.STYLE.normal,
    fontSize: FONT.SIZE.superSmall,
    color: COLORS.lightGrey34,
    lineHeight: FONT.SIZE.superSmall + 3,
  },
  rowImg: {
    marginTop: 16,
    alignItems: 'flex-end'
  },
  imgMedium: {
    width: 40,
    height: 40
  }
});

