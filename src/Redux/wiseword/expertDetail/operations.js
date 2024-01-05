import {Alert} from 'react-native';
import {clearData} from 'api/UserPreference';
import {nsNavigate} from 'routes/NavigationService';
import * as actions from './actions';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
const handleTokenExpire = async () => {
  await clearData();
  nsNavigate('Login');
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
        dispatch(actions.getExpertList(response));
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

export const getExpertCategories = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/categories',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/categories');
    if (response) {
      const {success} = response;
      if (success) {
        const {categories} = response;
        dispatch(actions.getExpertCategories(categories));
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

export const getExpertDetail = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/astrologerProfile',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/astrologerProfile');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.getExpertDetail(response));
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

export const getFollowAstro = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/followVendor',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/followVendor');
    if (response) {
      const {success} = response;

      if (success) {
        const {message} = response;

        dispatch(actions.getFollowAstro(message));
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
