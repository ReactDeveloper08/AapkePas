import * as types from './types';

export const getTerms_Condition = payload => ({
  type: types.GET_TERMS_CONDITION,
  payload,
});

export const getPrivacy_Policies = payload => ({
  type: types.GET_PRIVACY_POLICIES,
  payload,
});

export const getContactUs = payload => ({
  type: types.GET_CONTACT_US,
  payload,
});

export const getFaqQuestion = payload => ({
  type: types.GET_FAQ_QUESTION,
  payload,
});

export const getFaqCategories = payload => ({
  type: types.GET_FAQ_CATEGORIES,
  payload,
});
