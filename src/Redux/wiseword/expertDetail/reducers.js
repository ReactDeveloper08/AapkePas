import * as types from './types';
import {combineReducers} from 'redux';

const getExpertListReducers = (state = {}, action) => {
  switch (action.type) {
    case types.GET_EXPERT_LIST:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const getExpertCategoriesReducers = (state = {}, action) => {
  switch (action.type) {
    case types.GET_EXPERT_CATEGORIES:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const getExpertDetailReducers = (state = {}, action) => {
  switch (action.type) {
    case types.GET_EXPERT_DETAIL:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const getFollowAstroReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_FOLLOW_ASTRO:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const getNotificationReducer = (state = null, action) => {
  switch (action.type) {
    case types.GET_NOTIFICATION:
      return action.payload;

    default:
      return state;
  }
};

const reducer = combineReducers({
  getExpertList: getExpertListReducers,
  getExpertCategories: getExpertCategoriesReducers,
  getExpertDetail: getExpertDetailReducers,
  getFollowAstro: getFollowAstroReducer,
  getNotification: getNotificationReducer,
});

export default reducer;
