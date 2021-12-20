import {COLORS, FONT} from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    marginVertical: 50,
  },
  buttonTitle: {
    fontSize: 20,
    ...FONT.STYLE.bold,
  },
  error: {
    color: COLORS.red,
  },
  bold: {
    ...FONT.STYLE.bold,
  },
  content: {
    ...FONT.STYLE.medium,
    fontSize: 18,
    marginTop: 5,
  },
  historyItem: {
    marginVertical: 30,
  },
  right: {
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  extra: {
    ...FONT.STYLE.medium,
    fontSize: 18,
  },
  info: {
    ...FONT.STYLE.bold,
    fontSize: 18,
  },
});
