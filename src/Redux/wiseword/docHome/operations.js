import * as actions from './actions';
import {Alert} from 'react-native';
import {clearData} from 'api/UserPreference';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {nsNavigate} from 'routes/NavigationService';
const handleTokenExpire = async () => {
  await clearData();
  nsNavigate('Login');
};

export const getDocHome = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/home',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Astrologers/home');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.getDocHome(response));
      } else {
        dispatch(actions.getDocHome(response));
        dispatch(actions.error(response));
      }
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};

export const GoLive = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/goLive',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Astrologers/goLive');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.GoLive(response));
      } else {
        dispatch(actions.GoLive(response));
        dispatch(actions.error(response));
      }
    }
  } catch (e) {
    dispatch(actions.error(e));
  }
};

export const getOnline = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/switchOnline',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Astrologers/switchOnline');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.getOnline(response));
      } else {
        dispatch(actions.getOnline(response));
        dispatch(actions.error(response));
      }
    }
  } catch (e) {
    dispatch(actions.error(e));
  }
};

export const getNotification = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/official',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/official');
    if (response) {
      const {success} = response;
      if (success) {
        const {output} = response;
        dispatch(actions.getNotification(output));
      } else {
        const {isAuthTokenExpired} = response;
        if (isAuthTokenExpired === true) {
          Alert.alert(
            'Aapke Pass',
            'Your Session Has Been Expired \n Login Again to Continue!',
            [
              {
                text: 'OK',
              },
            ],
            {
              cancelable: false,
            },
          );
          handleTokenExpire();
          return;
        }

        dispatch(actions.error(response));
      }
    }
  } catch (e) {
    dispatch(actions.error(e));
  }
};
