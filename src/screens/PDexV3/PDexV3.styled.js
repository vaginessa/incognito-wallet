import {StyleSheet} from 'react-native';
import {COLORS, FONT} from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    flex: 1,
    backgroundColor: COLORS.white
  },
  fullFlex: {
    flex: 1,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
    height: 50,
    borderRadius: 8
  },
  scrollView: {
    marginBottom: 70,
  },
  mainInfo: {
    marginVertical: 20,
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
