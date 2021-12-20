import { StyleSheet } from 'react-native';
import { FONT } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  accountItemContainer: {
    marginBottom: 30,
    marginHorizontal: 10
  },
  accountItemHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
    flex: 1
  },
  desc: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 4,
    alignSelf: 'flex-start'
  },
  titleGroup: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.large,
    lineHeight: FONT.SIZE.large + 4,
    flex: 1,
    marginTop: 5,
    marginBottom: 25,
  },
  topGroup: {
    flex: 1,
  },
  saveAsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  copyAllButton: {
    flex: 1
  },
  copyNext: {
    paddingVertical: 15,
    height: 90,
  },
  qrCode: {
    marginRight: 15,
  },
  bottomGroup: {
    marginVertical: 50,
    flexDirection: 'row'
  },
  btnQRCode: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    backgroundColor: '#ECECEC',
    marginRight: 5,
    borderRadius: 12,
  }
});
