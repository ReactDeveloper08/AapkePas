import * as actions from './actions';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {Alert} from 'react-native';
import {clearData} from 'api/UserPreference';
import {nsNavigate} from 'routes/NavigationService';
const handleTokenExpire = async () => {
  await clearData();
  nsNavigate('Login');
};

export const declineService = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/declineService',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/declineService');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.declineService(response));
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
