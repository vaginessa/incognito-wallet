import { CONSTANT_CONFIGS, CONSTANT_KEYS } from '@src/constants';
import storage from '@src/services/storage';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { byteToHexString } from 'incognito-chain-web-js/build/wallet';
import { misc, codec } from 'incognito-chain-web-js/lib/privacy/sjcl';
import { randomBytes } from 'react-native-randombytes';

const PASSWORD_DURATION_IN_MS = 7 * 24 * 3600 * 1000; // 7 days

export function clearPassword() {
  storage.removeItem(CONSTANT_KEYS.PASSPHRASE_KEY);
}

export async function getPassphrase() {
  // try {
  //   let pass = await storage.getItem(CONSTANT_KEYS.PASSPHRASE_KEY);
  //   // fix for old user < 3.2.6
  //   pass = _.isEmpty(pass)? await storage.getItem(CONSTANT_KEYS.PASSPHRASE_KEY_REVERVE):pass;
  //   if (!pass) return;
  //   pass = CryptoJS.AES.decrypt(
  //     pass,
  //     CONSTANT_CONFIGS.PASSWORD_SECRET_KEY
  //   ).toString(CryptoJS.enc.Utf8);
  //   const [password, expired] = pass.split(':');
  //   if (!password || !expired) return CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT;
  //
  //   // disabled check expired time
  //   // if (Date.now() > parseInt(expired, 10)) {
  //   //   return;
  //   // }
  //   return password || CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT;
  // } catch (e) {
  //   return CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT;
  // }

  // TODO : password expiry
  let password = CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT;
  const ACCESS_KEY = CONSTANT_KEYS.SALT_KEY || 'default-wallet-salt';
  try {
    let salt = await getItemAsync(ACCESS_KEY);
    if (!salt) {
      // generate a new wallet encryption key
      const raw = randomBytes(16);
      salt = byteToHexString(raw);
      await setItemAsync(ACCESS_KEY, salt);
      console.log('PASSWORD-SERVICE : Generated new salt for wallet key in SecureStorage', salt);
    } else { 
      console.log('PASSWORD-SERVICE : Load wallet salt', salt);
    }
    let aesKey = misc.pbkdf2(password, salt, null, 128);
    aesKey = codec.hex.fromBits(aesKey);
    return aesKey;
  } catch (e) {
    console.log('error accessing SecureStorage', e);
    throw e;
  }
}

export async function hasPassword() {
  return !!(await getPassphrase());
}

export function savePassword(pass) {
  try {
    const expired = Date.now() + PASSWORD_DURATION_IN_MS;
    const toBeSaved = `${pass}:${expired}`;
    return setItemAsync(CONSTANT_KEYS.PASSPHRASE_KEY, toBeSaved);
  } catch {
    throw new Error('Can not save your password, please try again');
  }
}
