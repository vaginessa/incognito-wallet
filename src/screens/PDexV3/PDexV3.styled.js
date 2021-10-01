import {StyleSheet} from 'react-native';
import {COLORS, FONT, UTILS} from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    flex: 1,
    marginTop: 10,
  },
  fullFlex: {
    flex: 1,
  },
  button: {
    marginVertical: 50,
    height: 50,
  },
  scrollView: {
    marginBottom: UTILS.heightScale(70),
  },
  mainInfo: {
    marginVertical: UTILS.heightScale(20),
  },
  bigText: {
    ...FONT.STYLE.bold,
    color: COLORS.colorTradeBlue,
    fontSize: 35,
    lineHeight: 45,
  },
  error: {
    color: COLORS.red,
    lineHeight: 22,
  }
});
