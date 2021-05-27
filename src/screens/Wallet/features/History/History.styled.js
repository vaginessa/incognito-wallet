import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT } from '@src/styles';

const { width, height } = Dimensions.get('window');
export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    position: 'relative',
  },
  icon: {
    fontSize: 100,
    color: COLORS.primary,
    marginVertical: 40,
  },
  labelText: {
    flex: 1,
    fontFamily: FONT.NAME.medium,
    color: COLORS.colorGreyBold,
    fontSize: 15,
    lineHeight: 18,
    minWidth: 70,
  },
  extra: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontFamily: FONT.NAME.bold,
    color: COLORS.black,
    fontSize: 15,
    lineHeight: 18,
    textAlign: 'left',
    flex: 1,
  },
  copyIcon: {
    marginLeft: 5,
  },
  linkingIcon: {
    marginLeft: 5,
  },
  rowFullText: {
    height: 30,
  },
});
