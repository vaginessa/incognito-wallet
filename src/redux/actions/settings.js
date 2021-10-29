import type from '@src/redux/types/settings';
import {getSettings as getSettingsAPI} from '@services/api/settings';
import {getFunctionConfigs} from '@services/api/misc';

export const setSettings = (data) => ({
  type: type.SET_SETTINGS,
  payload: data
});

export const setBanners = (data) => ({
  type: type.SET_BANNERS,
  payload: data
});

export const getSettings = () => async dispatch => {
  const settings = await getSettingsAPI();
  return dispatch(setSettings(settings));
};

export const getBanners = () => async dispatch => {
  try {
    const configs = await getFunctionConfigs() || {};
    const bannersConfig = configs.find(item => item.name === 'banners');
    if (bannersConfig) {
      const banners = JSON.parse(bannersConfig.message) || [];
      return dispatch(setBanners(banners));
    }
  } catch (e) {
    console.log('getBanners errors: ', e);
  }
};
