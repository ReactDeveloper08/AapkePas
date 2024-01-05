import * as types from './types';
import {combineReducers} from 'redux';

export const getQuestionReducers = (state = {}, action) => {
  switch (action.type) {
    case types.GET_QUESTIONS:
      return action.payload;

    default:
      return state;
  }
};
export const getScoreReducers = (state = {}, action) => {
  switch (action.type) {
    case types.GET_SCORE:
      return action.payload;

    default:
      return state;
  }
};

const reducer = combineReducers({
  getQuestion: getQuestionReducers,
  getScore: getScoreReducers,
});

export default reducer;
