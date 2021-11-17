import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export const styled = StyleSheet.create({

});

export const headerStyled = StyleSheet.create({
  input: {
  },
  wrapInput: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.colorGrey5,
    marginRight: 8
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
    fontSize: FONT.SIZE.regular
  },
  buttonStyle: {
    width: 110,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGrey37
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
