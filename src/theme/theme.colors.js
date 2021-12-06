const white = '#FFFFFF';
const black = '#000000';

export function appTheme(darkMode: boolean) {
  return {
    // base
    white,
    black,
    // background
    background1: darkMode ? '#303030' : white,
    background2: darkMode ? black : '#F2F4F5',

    // text
    text1: darkMode ? white : black,
    text2: darkMode ? '#000000' : '#9e9e9e',
    text3: darkMode ? '#9C9C9C' : '#C0C0C0',

    // button
    btnBG1: darkMode ? '#1A73E8' : '#1A73E8',
    btnBG2: darkMode ? '#404040' : white,
  };
}
