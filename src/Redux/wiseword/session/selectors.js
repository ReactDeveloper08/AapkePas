export const isOTPSent = state => {
  return state.session.sendOTP;
};

export const isLoggedIn = state => {
  return state.session.login;
};
export const isGoogleLoggedIn = state => {
  return state.session.googleLogin;
};

export const isOtpResend = state => {
  return state.session.resendOtp;
};

export const isLogout = state => {
  return state.session.logout;
};
