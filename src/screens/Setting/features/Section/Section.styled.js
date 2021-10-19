import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

const HEADER_HEIGHT = 35;

export const sectionStyle = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomColor: COLORS.colorGrey4,
    borderBottomWidth: 1
  },
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
  item: {
    paddingVertical: 16,
    borderBottomColor: COLORS.colorGrey4,
    borderBottomWidth: 1
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastItem: {},
  items: {
    backgroundColor: COLORS.white,
  },
  label: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 9,
    color: COLORS.black,
    marginBottom: 4,
  },
  desc: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 9,
    color: COLORS.lightGrey33,
    flex: 1,
  },
  subDesc: {
    marginTop: 10,
  },
});
