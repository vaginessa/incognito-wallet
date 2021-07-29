import { StyleSheet } from 'react-native';
import {COLORS, FONT} from '@src/styles';

const styled = StyleSheet.create({
  container: {
    marginBottom: 25,
    backgroundColor: 'transparent',
  },
  wrapperHeader: {
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  button: {
    height: 28,
    paddingHorizontal: 10,
  },
  buttonInvest: {
    backgroundColor: COLORS.colorBlue
  },
  buttonWithdraw: {
    backgroundColor: COLORS.colorGrey,
    marginLeft: 5
  },
  titleInvest: {
    ...FONT.STYLE.normal,
    fontSize: FONT.SIZE.agvSmall,
    color: COLORS.white,
  },
  titleWithdraw: {
    ...FONT.STYLE.normal,
    fontSize: FONT.SIZE.agvSmall,
    color: COLORS.black,
  },
  rowName: {
    alignItems: 'center'
  },
  boldBlackText: {
    ...FONT.STYLE.bold,
    fontSize: FONT.SIZE.superMedium,
    color: COLORS.black,
  },
  name: {
    ...FONT.STYLE.bold,
    fontSize: FONT.SIZE.medium,
    color: COLORS.black,
    marginRight: 5
  },
});

export default styled;
