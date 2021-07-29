import { StyleSheet } from 'react-native';
import {COLORS, FONT} from '@src/styles';

const styled = StyleSheet.create({
  container: {
    marginBottom: 25,
    backgroundColor: 'transparent',
  },
  rowName: {
    alignItems: 'center'
  },
  name: {
    ...FONT.STYLE.bold,
    fontSize: FONT.SIZE.medium,
    color: COLORS.black,
    marginRight: 5
  },
  subText: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small,
    color: COLORS.newGrey,
    marginTop: 5
  },
  redText: {
    color: COLORS.red
  },
  greenText: {
    color: COLORS.green
  },
  grayText: {
    color: COLORS.newGrey
  },
});

export default styled;
