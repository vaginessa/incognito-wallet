import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';
import globalStyled from '@src/theme/theme.styled';

export const styled = StyleSheet.create({
  container: {
    ...globalStyled.defaultPaddingHorizontal,
    paddingVertical: 16
  },
  rowName: {
    alignItems: 'center',
  },
  name: {
    marginRight: 5,
    fontSize: FONT.SIZE.medium,
    fontFamily: FONT.NAME.medium,
  },
  nameFollowed: {
    color: COLORS.black,
  },
  subText: {
    fontSize: FONT.SIZE.medium,
    fontFamily: FONT.NAME.medium,
    marginTop: 4
  },
  block1: {
    flex: 1,
    marginRight: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  block2: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  block3: {
    width: 25,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  network: {
    fontSize: 11,
    fontFamily: FONT.NAME.medium,
    lineHeight: 16,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4
  },
  earnBtn: {
    marginLeft: 5,
    textAlign: 'center',
    fontSize: FONT.SIZE.small,
    fontFamily: FONT.NAME.medium,
    backgroundColor: '#1A73E8',
    paddingVertical: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
    paddingHorizontal: 12
  }
});
