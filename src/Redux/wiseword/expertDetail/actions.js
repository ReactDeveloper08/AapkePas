import * as types from './types';

export const getExpertList = payload => ({
  type: types.GET_EXPERT_LIST,
  payload,
});

export const getExpertCategories = payload => ({
  type: types.GET_EXPERT_CATEGORIES,
  payload,
});

export const getExpertDetail = payload => ({
  type: types.GET_EXPERT_DETAIL,
  payload,
});

export const getFollowAstro = payload => ({
  type: types.GET_FOLLOW_ASTRO,
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
