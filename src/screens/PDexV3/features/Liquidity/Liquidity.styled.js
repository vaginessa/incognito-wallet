import {StyleSheet} from 'react-native';
import {FONT} from '@src/styles';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 25,
  },
  wrapInput: {
    marginTop: 27
  },
  wrapAMP: {
    marginBottom: 27
  },
  amp: {
    ...FONT.STYLE.bold,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 15,
  },
  selectPercentAmountContainer: {
    marginTop: 40
  }
});

export default styled;
