import AsyncStorage from '@react-native-community/async-storage';
import { Toast } from '@components/core/index';

const Storage = {
  setItem(key:string, value:string, callback:function) {
    console.debug('SET ITEM', key);
    return new Promise((resolve, reject) => {
      // If data is larger than 2mb we need to throw error
      // Because Android can not store a key larger than 2MB
      if (value && value.length > 2e6) {
        const message = 'Your masterless\'s histories is so large. Please go to the settings to delete the histories.';
        Toast.showError(`${message} (${key}-${(value.length / 1e6).toFixed(2)}MB)`);
        return resolve();
      }

      AsyncStorage.setItem(key, value, (err) => {
        if (typeof callback === 'function') {
          callback(err);
        }
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  },
  getItem(key:string, callback:function) {
    console.debug('GET ITEM', key);
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key, (err, rs)=> {
        if (typeof callback === 'function') {
          callback(err, rs);
        }
        if (err) {
          return reject(err);
        }
        return resolve(rs);
      });
    });
  },
  removeItem(key:string, callback:function) {
    console.debug('REMOVE ITEM', key);
    return new Promise((resolve, reject) => {
      AsyncStorage.removeItem(key, (err)=> {
        if (typeof callback === 'function') {
          callback(err);
        }
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  },
  clear(callback:function) {
    return new Promise((resolve, reject) => {
      AsyncStorage.clear((err)=> {
        if (typeof callback === 'function') {
          callback(err);
        }
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }
};

export default Storage;
