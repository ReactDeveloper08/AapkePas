import * as types from './types';

export const getCall = payload => ({
  type: types.GET_CALL,
  payload,
});

export const getEndCall = payload => ({
  type: types.END_CALL,
  payload,
});

export const error = payload => ({
  type: types.ERROR,
  payload,
});
