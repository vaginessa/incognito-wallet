import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export const styled = StyleSheet.create({

});

export const headerStyled = StyleSheet.create({
  input: {
    height: 50
  },
  wrapTab: {
    width: 49,
    height: 40,
    backgroundColor: COLORS.lightGrey30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 8
  },
  tabText: {
    ...FONT.STYLE.normal,
    fontSize: FONT.SIZE.regular,
    color: COLORS.black
  },
  wrapSearch: {
    backgroundColor: COLORS.white,
    height: 50,
    marginBottom: 16
  },
  wrapInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.lightGrey37,
    borderWidth: 1
  },
  rowStyle: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.lightGrey18,
    height: 40
  },
  rowTextStyle: {
    ...FONT.STYLE.normal,
    color: COLORS.black,
    fontSize: FONT.SIZE.small
  },
  dropdownStyle: {
    borderRadius: 8,
    backgroundColor: COLORS.white,
    width: 110,
  },
  buttonTextStyle: {
    ...FONT.STYLE.normal,
    color: COLORS.black,
    fontSize: FONT.SIZE.regular,
  },
  buttonStyle: {
    width: 98,
    borderRadius: 8,
    height: 40,
    backgroundColor: COLORS.lightGrey30,
  }
});

export const itemStyled = StyleSheet.create({
  wrapItem: {
    paddingBottom: 30,
  },
  blackLabel: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.small + 1,
    textAlign: 'left',
    color: COLORS.black
  },
  icon: {
    marginRight: 16,
    width: 20,
    height: 20
  },
  sectionFirst: {
    flex: 0.6,
    paddingRight: 10
  },
  sectionSecond: {
    flex: 0.4,
    paddingRight: 10
  },
  sectionThird: {
    width: 80,
    paddingRight: 10
  }
});
