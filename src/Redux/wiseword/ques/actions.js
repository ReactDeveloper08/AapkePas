import * as types from './types';

export const getQuestion = payload => ({
  type: types.GET_QUESTIONS,
  payload,
});

export const getScore = payload => ({
  type: types.GET_SCORE,
  payload,
});
