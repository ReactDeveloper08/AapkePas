import {Alert} from 'react-native';
import {clearData} from 'api/UserPreference';
import {nsNavigate} from 'routes/NavigationService';
import * as actions from './actions';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
// import * as loaderActions from '../loader/actions';

// import {KEYS, setAsyncStorage} from 'views/AsyncStorage';

const handleTokenExpire = async () => {
  await clearData();
  nsNavigate('Login');
};

export const vcRequest = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/videoRequestNew',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/videoRequestNew');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.vcRequest(response));
      } else {
        dispatch(actions.vcRequest(response));
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

        // dispatch(actions.error(response));
      }
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};

export const vcEndCall = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/endVideoRequest',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/endVideoRequest');
    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.vcEndCall(response));
      } else {
        dispatch(actions.vcEndCall(response));
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

        // dispatch(actions.error(response));
      }
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};

// export const saveVCData = params => async dispatch => {
//   try {
//
//     await dispatch(actions.saveVCData(params));
//   } catch (e) {
//     console.log('there is an error in save VC DATA');
//   }
// };
