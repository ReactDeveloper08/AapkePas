import {Alert} from 'react-native';
import {clearData} from 'api/UserPreference';
import {nsNavigate} from 'routes/NavigationService';
const handleTokenExpire = async () => {
  await clearData();
  nsNavigate('Login');
};

import * as actions from './actions';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
// import * as loaderActions from '../loader/actions';

export const profile = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/userProfile',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/userProfile');
    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.profile(response));
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
  } catch (error) {
    dispatch(actions.error(error));
  }
};

export const updateProfile = params => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeRequest(
      BASE_URL + 'api/Customer/editUserProfile',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/editUserProfile');
    if (response) {
      const {success} = response;

      if (success) {
        // const {message} = response;
        dispatch(actions.updateProfile(response));
        // dispatch(loaderActions.processing(false));
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
        // dispatch(loaderActions.processing(false));
      }
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};
