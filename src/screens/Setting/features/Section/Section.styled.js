import { FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

const HEADER_HEIGHT = 35;

export const sectionStyle = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: HEADER_HEIGHT,
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  infoContainer: {},
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastItem: {},
  label: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 9,
  },
  desc: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 9,
    flex: 1,
    marginLeft: 40
  },
  subDesc: {
    marginTop: 10,
  },
  wrapIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  }
});
