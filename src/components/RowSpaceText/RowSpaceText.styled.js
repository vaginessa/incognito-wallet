import {StyleSheet} from 'react-native';
import {COLORS, FONT} from '@src/styles';

const styled = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  hookContainer: {
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  hookLabel: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 3,
    color: COLORS.lightGrey17,
  },
  hookValue: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 3,
    color: COLORS.lightGrey31,
  },
  extraContainer: {
    justifyContent: 'space-between',
    marginBottom: 18,
    alignItems: 'center',
  },
  extraLabel: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium + 1,
    lineHeight: FONT.SIZE.superMedium + 4,
    color: COLORS.black,
  },
  btnSmall: {
    height: 28,
    width: 89,
    marginLeft: 5,
  },
  titleSmall: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small - 1,
    lineHeight: FONT.SIZE.small + 2,
  },
});

export default styled;
