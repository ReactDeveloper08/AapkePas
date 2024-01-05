import * as types from './types';

export const getHome = payload => ({
  type: types.GET_HOME,
  payload,
});

export const getCategories = payload => ({
  type: types.GET_CATEGORIES,
  payload,
});

export const getExpertList = payload => ({
  type: types.GET_EXPERT,
  payload,
});

export const getNotification = payload => ({
  type: types.GET_NOTIFICATION,
  payload,
});

export const error = payload => ({
  type: types.ERROR,
  payload,
});
