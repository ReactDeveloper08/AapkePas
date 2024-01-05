import {Alert} from 'react-native';
import {clearData} from 'api/UserPreference';
import {nsNavigate} from 'routes/NavigationService';

const handleTokenExpire = async () => {
  await clearData();
  nsNavigate('Login');
};

import * as actions from './actions';
import {BASE_URL, makeRequest} from 'api/ApiInfo';

export const getTerms_Condition = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/termsAndConditions',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/termsAndConditions');
    if (response && response.success) {
      const {description} = response;
      dispatch(actions.getTerms_Conditions(description));
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
  } catch (e) {
    console.log(e.message);
  }
};

export const getPrivacy_Policies = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/privacyPolicy',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/privacyPolicy');
    if (response && response.success) {
      const {description} = response;
      dispatch(actions.getPrivacy_Policies(description));
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
    }
  } catch (e) {
    console.log(e.message);
  }
};

export const getContactUs = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/contactUs',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/contactUs');
    if (response && response.success) {
      const {description} = response;
      dispatch(actions.getContactUs(description));
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
    }
  } catch (e) {}
};

export const getFaqQuestion = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/faqQuestion',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/faqQuestion');
    if (response && response.success) {
      const {message} = response;
      dispatch(actions.getFaqQuestion(message));
    }
  } catch (e) {}
};

export const getFaqCategories = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/faqCategories',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/faqCategories');
    if (response && response.success) {
      const {categories} = response;
      dispatch(actions.getFaqQuestion(categories));
    }
  } catch (e) {}
};
