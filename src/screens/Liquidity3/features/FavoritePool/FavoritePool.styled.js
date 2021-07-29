import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapperSearch: {
    justifyContent: 'space-between',
    marginTop: 30,
    alignItems: 'center'
  },
  wrapButtonSearch: {
    backgroundColor: COLORS.lightGrey19,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: 32,
    borderRadius: 16,
  },
  titleText: {
    color: COLORS.black,
    fontSize: FONT.SIZE.medium,
    ...FONT.STYLE.bold,
  },
  searchText: {
    color: COLORS.newGrey,
    fontSize: FONT.SIZE.small,
    ...FONT.STYLE.medium,
  },
  wrapperFirstSection: {
    flex: 0.5,
  },
  wrapperSecondSection: {
    flex: 0.2
  },
  wrapperThirdSection: {
    flex: 0.3
  },
  headerSectionText: {
    color: COLORS.newGrey,
    fontSize: FONT.SIZE.small,
    ...FONT.STYLE.medium,
  },
  centerText: {
    textAlign: 'center',
  },
  rightText: {
    textAlign: 'right',
  },
  addFavoriteText: {
    color: COLORS.black,
    fontSize: FONT.SIZE.medium,
    ...FONT.STYLE.medium,
  },
  wrapperReward: {
    marginTop: 20,
  },
  balanceStyle: {
    marginTop: 15
  },
  wrapperGroupButton: {
    justifyContent: 'space-between',
    marginTop: 10
  },
  normalButton: {
    width: '38%',
    backgroundColor: COLORS.colorBlue,
    height: 45
  },
  largeButton: {
    width: '53%',
    backgroundColor: COLORS.colorBlue,
    height: 45
  },
  wrapFooter: {
    marginBottom: 50
  }
});

export default styled;
