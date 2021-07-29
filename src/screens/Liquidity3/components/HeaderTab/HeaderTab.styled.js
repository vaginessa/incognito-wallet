import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

const styled = StyleSheet.create({
  wrapper: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey30,
    padding: 3,
    borderRadius: 25
  },
  wrapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 44,
    borderRadius: 22,
  },
  itemSelected: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },

    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  textSelected: {
    color: COLORS.colorBlue,
    fontSize: 18,
    ...FONT.STYLE.medium,
  },
  textUnSelected: {
    color: COLORS.lightGrey31,
    fontSize: 18,
    ...FONT.STYLE.medium,
  }
});

export default styled;
