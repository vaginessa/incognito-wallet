import { StyleSheet } from 'react-native';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    paddingTop: 32,
  },
  styledTabs: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnOrderHistory: {
    marginRight: 15,
  },
  rightHeader: {
    backgroundColor: 'transparent'
  },
  styledTabList: {
    borderBottomWidth: 0,
  },
});
