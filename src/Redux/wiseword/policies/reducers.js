import * as types from './types';
import {combineReducers} from 'redux';

const getTerms_ConditionReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_TERMS_CONDITION:
      return action.payload;
    default:
      return state;
  }
};

const getPrivacy_PoliciesReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_PRIVACY_POLICIES:
      return action.payload;
    default:
      return state;
  }
};

const getContactUsReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_CONTACT_US:
      return action.payload;
    default:
      return state;
  }
};

const getFaqQuestionReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_FAQ_QUESTION:
      return action.payload;
    default:
      return state;
  }
};

const getFaqCategoriesReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_FAQ_CATEGORIES:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  getTerms_Condition: getTerms_ConditionReducer,
  getPrivacy_Policies: getPrivacy_PoliciesReducer,
  getContactUs: getContactUsReducer,
  getFaqQuestion: getFaqQuestionReducer,
  getFaqCategories: getFaqCategoriesReducer,
});
export default reducer;
