const white = '#FFFFFF';
const black = '#000000';

export function appTheme(darkMode: boolean) {
  return {
    // base
    white,
    black,
    // background
    background1: darkMode ? '#303030' : white,

    // text
    text1: darkMode ? white : black,
    text2: darkMode ? '#000000' : '#9e9e9e',
    text3: darkMode ? '#616161' : '#616161',
    text4: darkMode ? '#797979' : '#797979',
    text5: darkMode ? '#595959' : '#595959',
  };
}
