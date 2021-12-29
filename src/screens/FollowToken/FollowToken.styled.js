import { StyleSheet } from 'react-native';
import { FONT } from '@src/styles';
import globalStyled from '@src/theme/theme.styled';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    paddingTop: 27,
  },
  text: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
  },
  boldText: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
  },
  addManually: {
    ...globalStyled.defaultPaddingHorizontal,
    paddingBottom: 40,
    paddingTop: 15,
  },
  listToken: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
  },
});
