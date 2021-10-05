import { StyleSheet } from 'react-native';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    paddingTop: 32,
    flex: 1,
  },
  groupBtns: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tradeBtn: {
    width: 115,
    maxWidth: '48%',
  },
  createNewPoolBtn: {
    width: '100%',
  },
});
