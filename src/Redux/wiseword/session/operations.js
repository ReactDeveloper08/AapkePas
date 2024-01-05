import * as actions from './actions';
import {Alert} from 'react-native';
// import * as loaderActions from '../loader/actions';
import {BASE_URL, makeRequest} from 'api/ApiInfo';

export const sendOTP = params => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));

    const response = await makeRequest(
      BASE_URL + 'api/Customer/userLogin',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/userLogin');
    if (response) {
      dispatch(actions.sendOTP(response));
      // dispatch(loaderActions.processing(false));
    }
  } catch (error) {
    dispatch(actions.sendOTPError(error));
  }
};

export const sendOTPReset = actions.sendOTPReset;

export const login = params => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));

    const response = await makeRequest(
      BASE_URL + 'api/Customer/register',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/register');
    if (response) {
      dispatch(actions.login(response));
      // dispatch(loaderActions.processing(false));
    }
  } catch (error) {
    dispatch(actions.loginError(error));
  }
};
export const googleLogin = params => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));

    const response = await makeRequest(
      BASE_URL + 'api/Customer/googleSignIn',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/googleSignIn');
    if (response) {
      dispatch(actions.googleLogin(response));
      // dispatch(loaderActions.processing(false));
    }
  } catch (error) {
    dispatch(actions.loginError(error));
  }
};

// export const login = params => async dispatch => {
//   try {
//     // dispatch(loaderActions.processing(true));

//     const response = await makeRequest(
//       BASE_URL + 'api/Customer/userOtpVerify',
//       params,
//     );

//     if (response) {
//       dispatch(actions.login(response));
//       // dispatch(loaderActions.processing(false));
//     }
//   } catch (error) {
//     dispatch(actions.loginError(error));
//   }
// };

export const resendOtp = params => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeRequest(
      BASE_URL + 'api/Customer/userLogin',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/userLogin');
    if (response) {
      dispatch(actions.resendOtp(response));
      // dispatch(loaderActions.processing(false));
    }
  } catch (error) {
    dispatch(actions.resendOtp(error));
  }
};

export const logout = () => {
  return logout;
};
