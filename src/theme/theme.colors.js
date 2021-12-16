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
    background3: darkMode ? '#404040' : '#ECECEC',
    background4: darkMode ? white : black,
    background5: darkMode ? '#404040' : white,
    background6: darkMode ? '#1A73E8' : '#404040',  // blue - gray

    // text
    text1: darkMode ? white : black,
    text2: darkMode ? '#000000' : '#9e9e9e',
    text3: darkMode ? '#9C9C9C' : '#C0C0C0',
    // todo: review
    text4: darkMode ? '#9C9C9C' : '#8A8A8E',
    text5: darkMode ? '#9C9C9C' : '#A6A6A6',
    text6: darkMode ? '#9C9C9C' : '#858383',
    text7: darkMode ? '#64A121' : black,
    text8: darkMode ? white : '#D6D6D6',
    text9: darkMode ? white : '#8A8A8E',

    // button
    btnBG1: darkMode ? '#1A73E8' : '#1A73E8',
    btnBG2: darkMode ? '#404040' : white,

    // border
    border1: darkMode ? '#484848' : '#F7F7F7',
    border2: darkMode ? white : black,
    border3: darkMode ? '#484848' : '#D6D6D6',

    contrast: darkMode ? white : black,

    // icon
    icon1: darkMode ? '#1A73E8' : '#1A73E8',  // green - blue
  };
}
