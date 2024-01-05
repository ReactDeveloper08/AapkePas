import * as types from './types';

export const getDocHome = payload => ({
  type: types.GET_HOME,
  payload,
});
export const GoLive = payload => ({
  type: types.GO_LIVE,
  payload,
});
export const getOnline = payload => ({
  type: types.GET_ONLINE,
  payload,
});
export const error = payload => ({
  type: types.ERROR,
  payload,
});
