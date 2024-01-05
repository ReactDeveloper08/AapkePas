import * as types from './types';

export const profile = payload => ({
  type: types.PROFILE,
  payload,
});

export const updateProfile = payload => ({
  type: types.UPDATE_PROFILE,
  payload,
});

export const error = payload => ({
  type: types.ERROR,
  payload,
});
