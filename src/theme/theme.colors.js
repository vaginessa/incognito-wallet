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
    background3: darkMode ? black : '#ECECEC',
    background4: darkMode ? white : black,

    // text
    text1: darkMode ? white : black,
    text2: darkMode ? '#000000' : '#9e9e9e',
    text3: darkMode ? '#9C9C9C' : '#C0C0C0',
    // todo: review
    text4: darkMode ? '#9C9C9C' : '#8A8A8E',
    text5: darkMode ? '#9C9C9C' : '#A6A6A6',
    text6: darkMode ? '#9C9C9C' : '#858383',
    

    // button
    btnBG1: darkMode ? '#1A73E8' : '#1A73E8',
    btnBG2: darkMode ? '#404040' : white,

    contrast: darkMode ? white : black,
  };
}
