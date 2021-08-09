import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

export const styled = StyleSheet.create({
  tabs: {
    backgroundColor: 'transparent',
  },
  tabList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.colorGreyLight1,
    borderRadius: 40,
    padding: 4,
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
});
