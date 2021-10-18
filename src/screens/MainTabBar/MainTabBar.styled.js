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
  },
  shadow: {
    shadowColor: COLORS.black,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    backgroundColor: COLORS.white
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
  regularBlack: {
    ...FONT.STYLE.normal,
    fontSize: FONT.SIZE.superSmall,
    color: COLORS.black,
    lineHeight: FONT.SIZE.superSmall + 6,
    marginTop: 2,
  },
  rowImg: {
    marginTop: 16,
    alignItems: 'flex-end'
  },
  paddingTopCategory: {
    marginTop: 25
  },
  wrapCategory: {
    paddingVertical: 16,
    marginTop: 8
  },
  category: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

