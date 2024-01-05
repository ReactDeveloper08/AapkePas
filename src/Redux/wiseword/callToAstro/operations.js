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

export const getCall = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/callRequestNew',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/callRequestNew');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.getCall(response));
      } else {
        dispatch(actions.getCall(response));
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

export const getEndCall = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/endICallRequest',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/endICallRequest');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.getEndCall(response));
      } else {
        dispatch(actions.getEndCall(response));
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
