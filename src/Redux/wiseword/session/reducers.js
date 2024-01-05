import * as types from './types';
import {combineReducers} from 'redux';

const sendOTPReducer = (state = {}, action) => {
  switch (action.type) {
    case types.SEND_OTP:
      return action.payload;
    case types.SEND_OTP_ERROR:
      return action.payload;
    case types.SEND_OTP_RESET:
      return null;
    default:
      return state;
  }
};

const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LOGIN:
      return action.payload;
    case types.LOGIN_ERROR:
      return action.payload;
    default:
      return state;
  }
};
const googleLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GOOGLE_LOGIN:
      return action.payload;
    case types.LOGIN_ERROR:
      return action.payload;
    default:
      return state;
  }
};

const resendOtpReducer = (state = {}, action) => {
  switch (action.type) {
    case types.RESEND_OTP:
      return action.payload;
    case types.RESEND_OTP_ERROR:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  sendOTP: sendOTPReducer,
  login: loginReducer,
  googleLogin: googleLoginReducer,
  resendOtp: resendOtpReducer,
});

export default reducer;
