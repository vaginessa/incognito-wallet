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
    marginRight: 5,
    fontSize: FONT.SIZE.medium,
    color: COLORS.black,
    fontFamily: FONT.NAME.medium,
  },
  nameFollowed: {
    color: COLORS.black,
  },
  subText: {
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 2,
    color: COLORS.colorGrey3,
    fontFamily: FONT.NAME.medium,
    marginBottom: 10,
  },
  block1: {
    flex: 0.7,
    marginRight: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  block2: {
    flex: 0.2,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 5,
  },
  block3: {
    flex: 0.1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
