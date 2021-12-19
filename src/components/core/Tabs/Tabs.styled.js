import { StyleSheet } from 'react-native';

export const styled = StyleSheet.create({
  tabs: {
    backgroundColor: 'transparent',
    minHeight: 64,
  },
  tabList: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // borderRadius: 40,
    flex: 1,
    borderBottomColor: '#484848',
    borderBottomWidth: 1,
  },
  tabList1: {
    borderRadius: 10,
    backgroundColor: 'transparent',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tabContent: {
    flex: 1,
    overflow: 'hidden'
  },
});
