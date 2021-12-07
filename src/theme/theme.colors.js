import { THEME_KEYS } from '@src/theme/theme.consts';

const white = '#FFFFFF';
const black = '#000000';

const lightTheme = () => ({
  // base
  white,
  black,
  // background
  background1: white,
  background2: '#F2F4F5',

  // text
  text1: black,
  text2: '#9e9e9e',
  text3: '#C0C0C0',

  // button
  btnBG1: '#1A73E8',
  btnBG2: white,

  contrast: black,
});

const darkTheme = () => ({
  // base
  white,
  black,
  // background
  background1: '#303030',
  background2: black,

  // text
  text1: white,
  text2: '#000000',
  text3: '#9C9C9C',

  // button
  btnBG1: '#1A73E8',
  btnBG2: '#404040',

  contrast: white,
});


export function appTheme(themeMode: string) {
  if (themeMode === THEME_KEYS.DARK_THEME) return darkTheme();
  return lightTheme();
}
