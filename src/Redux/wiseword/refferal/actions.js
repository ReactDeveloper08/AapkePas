import * as types from './types';

export const getReferral = payload => ({
  type: types.GET_REFERRAL,
  payload,
});
export const enterReferral = payload => ({
  type: types.ENTER_REFERRAL,
  payload,
});
