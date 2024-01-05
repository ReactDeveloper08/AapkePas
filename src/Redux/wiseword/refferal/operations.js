import {Alert} from 'react-native';
import {clearData} from 'api/UserPreference';
import {nsNavigate} from 'routes/NavigationService';
const handleTokenExpire = async () => {
  await clearData();
  nsNavigate('Login');
};

import * as actions from './actions';

import {BASE_URL, makeRequest} from 'api/ApiInfo';

export const getReferral = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/referralCode',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/referralCode');
    if (response) {
      dispatch(actions.getReferral(response));
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

      dispatch(actions.getReferral(0));
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};
export const enterReferral = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/enterReferralCode',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/enterReferralCode');
    if (response) {
      dispatch(actions.enterReferral(response));
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

      dispatch(actions.enterReferral(0));
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};
