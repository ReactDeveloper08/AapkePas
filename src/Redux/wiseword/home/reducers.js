import * as types from './types';
import {combineReducers} from 'redux';

const HomeReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_HOME:
      return action.payload;

    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const CategoriesReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_CATEGORIES:
      return action.payload;

    default:
      return state;
  }
};

const ExpertSelectionReducer = (state = null, action) => {
  switch (action.type) {
    case types.GET_EXPERT:
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
  getHome: HomeReducer,
  getCategories: CategoriesReducer,
  getExpertList: ExpertSelectionReducer,
  getNotification: getNotificationReducer,
});

export default reducer;
