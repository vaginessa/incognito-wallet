import {StyleSheet} from 'react-native';
import {COLORS, FONT} from '@src/styles';

const styled = StyleSheet.create({
  hookContainer: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hookLabel: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 7,
    color: COLORS.lightGrey34,
  },
  wrapValue: {
    flexDirection:'row',
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  },
  hookValue: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 7,
    color: COLORS.black,
    textAlign: 'right',
  },
});

export default styled;
