import * as types from './types';

export const sendOTP = payload => ({
  type: types.SEND_OTP,
  payload,
});

export const sendOTPReset = () => ({
  type: types.SEND_OTP_RESET,
});

export const sendOTPError = payload => ({
  type: types.SEND_OTP_ERROR,
  payload,
});

export const resendOtp = payload => ({
  type: types.RESEND_OTP,
  payload,
});

export const resendOtpError = payload => ({
  type: types.RESEND_OTP_ERROR,
  payload,
});

export const login = payload => ({
  type: types.LOGIN,
  payload,
});
export const googleLogin = payload => ({
  type: types.GOOGLE_LOGIN,
  payload,
});

export const loginError = payload => ({
  type: types.LOGIN_ERROR,
  payload,
});

export const logout = payload => ({
  type: types.LOGOUT,
  payload,
});
