import { isIOS } from '@src/utils/platform';
import { Platform } from 'react-native';

const FONT_FAMILY = Platform.OS === 'ios' ? 'SFProDisplay' : 'SF-Pro-Display-';
const FONT_FAMILY_SPECIAL =
  Platform.OS === 'ios' ? 'HelveticaNeue' : 'Helvetica-Neue';

const fontNames = {
  default:
    Platform.OS === 'ios' ? `${FONT_FAMILY}-Light` : `${FONT_FAMILY}Light`,
  italic:
    Platform.OS === 'ios'
      ? `${FONT_FAMILY}-LightItalic`
      : `${FONT_FAMILY}LightItalic`,
  medium:
    Platform.OS === 'ios' ? `${FONT_FAMILY}-Medium` : `${FONT_FAMILY}Medium`,
  mediumItalic:
    Platform.OS === 'ios'
      ? `${FONT_FAMILY}-MediumItalic`
      : `${FONT_FAMILY}MediumItalic`,
  bold: Platform.OS === 'ios' ? `${FONT_FAMILY}-Bold` : `${FONT_FAMILY}Bold`,
  boldItalic:
    Platform.OS === 'ios'
      ? `${FONT_FAMILY}-BoldItalic`
      : `${FONT_FAMILY}BoldItalic`,
  regular:
    Platform.OS === 'ios' ? `${FONT_FAMILY}-Regular` : `${FONT_FAMILY}Regular`,
  regularItalic:
    Platform.OS === 'ios'
      ? `${FONT_FAMILY}-RegularItalic`
      : `${FONT_FAMILY}RegularItalic`,
  specialRegular:
    Platform.OS === 'ios' ? `${FONT_FAMILY_SPECIAL}` : `${FONT_FAMILY_SPECIAL}`,
  specialBold: `${FONT_FAMILY_SPECIAL}-Bold`,
  specialMedium: `${FONT_FAMILY_SPECIAL}-Medium`,
};

const fontStyle = {
  normal: {
    fontFamily: fontNames.regular,
  },
  medium: {
    fontFamily: fontNames.medium,
  },
  bold: {
    fontFamily: fontNames.bold,
  },
  light: {
    fontFamily: fontNames.light,
  },
};

// const getFontScale = PixelRatio.getFontScale();

const fontSizes = {
  superSmall: 12,
  agvSmall: 13,
  small: 14,
  regular: 16,
  medium: 18,
  superMedium: 20,
  large: 22,
  large24: 24,
  avgLarge: 28,
  veryLarge: 34,
  superLarge: 40,
};

const textStyle = {
  incognitoH1: {
    fontSize: fontSizes.medium,
    fontFamily: fontNames.medium,
  },
  incognitoH2: {
    fontSize: 34,
    fontFamily: fontNames.medium,
  },
  incognitoH3: {
    fontSize: 28,
    fontFamily: fontNames.medium,
  },
  incognitoH4: {
    fontSize: fontSizes.large24,
    fontFamily: fontNames.medium,
  },
  incognitoH5: {
    fontSize: fontSizes.superMedium,
    fontFamily: fontNames.medium,
  },
  incognitoH6: {
    fontSize: fontSizes.medium,
    fontFamily: fontNames.medium,
  },
  incognitoP1: {
    fontSize: fontSizes.regular,
    fontFamily: fontNames.regular,
    lineHeight: isIOS() ? 20 : 24,
  },
  incognitoP2: {
    fontSize: fontSizes.small,
    fontFamily: fontNames.regular,
  },
  incognitoSMedium: {
    fontSize: fontSizes.superSmall,
    fontFamily: fontNames.regular,
  },
};

export default {
  NAME: fontNames,
  SIZE: fontSizes,
  STYLE: fontStyle,
  TEXT: textStyle,
};
