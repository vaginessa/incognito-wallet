import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

export const styled = StyleSheet.create({
  tabs: {
    backgroundColor: 'transparent',
    minHeight: 50,
    marginBottom: 10
  },
  tabList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.colorGreyLight1,
    borderRadius: 40,
    flex: 1,
    padding: 4
  },
  tabContent: {
    flex: 1,
  },
});
