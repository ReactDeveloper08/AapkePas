// import React from 'react';
import * as actions from './actions';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {Alert} from 'react-native';
import {clearData} from 'api/UserPreference';
import {nsNavigate} from 'routes/NavigationService';
const handleTokenExpire = async () => {
  await clearData();
  nsNavigate('Login');
};
export const getWalletBalance = params => async dispatch => {
  try {
    // dispatch(loaderActions.fetching(true));
    const response = await makeRequest(
      BASE_URL + 'api/Customer/walletBalance',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/walletBalance');
    if (response) {
      const {success} = response;

      if (success) {
        const {walletBalance, minimum_recharge_amount} = response;
        dispatch(actions.getWalletBalance(walletBalance));
        dispatch(actions.getMinBalance(minimum_recharge_amount));
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
    } else {
      dispatch(actions.getWalletBalance(0));
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};

export const addBalance = params => async dispatch => {
  try {
    // dispatch(loaderActions.fetching(true));
    const response = await makeRequest(
      BASE_URL + 'api/Customer/addMoney',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/addMoney');
    if (response) {
      const {success} = response;
      // dispatch(actions.addBalance(response));
      if (success) {
        dispatch(actions.addBalance(response));
        // dispatch(loaderActions.fetching(false));
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
        dispatch(actions.addBalance(response));
        dispatch(actions.error(response));
      }
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};

export const getHistory = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/myConsultations',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/myConsultations');
    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.getHistory(response));
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

export const getEarning = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/onlinePaymentVerification',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/onlinePaymentVerification');
    if (response) {
      const {success} = response;

      if (success) {
        const {message} = response;
        dispatch(actions.getEarning(message));
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

export const getWalletSummary = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/walletIncome',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/walletIncome');
    if (response) {
      const {success} = response;

      if (success) {
        // const {income} = response;
        dispatch(actions.getWalletSummary(response));
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
