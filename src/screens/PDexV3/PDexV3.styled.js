import {StyleSheet} from 'react-native';
import {COLORS} from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    flex: 1
  },
  button: {
    marginVertical: 50,
    backgroundColor: COLORS.blue5,
    height: 50,
  },
});
