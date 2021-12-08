import { StyleSheet } from 'react-native';
import { FONT } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
});

export const styledHeaderTitle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontFamily: FONT.NAME.specialMedium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 4,
  },
  searchStyled: {
    textTransform: 'none',
    maxWidth: '100%',
  },
  containerTitle: {},
});
