import * as actions from './actions';
import {Alert} from 'react-native';
import {clearData} from 'api/UserPreference';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {nsNavigate} from 'routes/NavigationService';
const handleTokenExpire = async () => {
  await clearData();
  nsNavigate('Login');
};

export const getHome = params => async dispatch => {
  try {
    const response = await makeRequest(BASE_URL + 'api/Customer/home', params);
    //Alert.alert('', BASE_URL + 'api/Customer/home');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.getHome(response));
      } else {
        dispatch(actions.error(response));
      }
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};

export const getCategories = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/categories',
      params,
    );
    // Alert.alert('', BASE_URL + 'api/Customer/categories');
    if (response) {
      const {success} = response;
      if (success) {
        const {categories} = response;
        dispatch(actions.getCategories(categories));
      } else {
        dispatch(actions.error(response));
      }
    }
  } catch (e) {
    dispatch(actions.error(e));
  }
};

export const getExpertList = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/categoryExpertsList',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/categoryExpertsList');
    if (response) {
      const {success} = response;
      if (success) {
        const {output} = response;
        dispatch(actions.getExpertList(output));
      } else {
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
