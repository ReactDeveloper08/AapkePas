import * as types from './types';
import {combineReducers} from 'redux';

export const getReferralReducers = (state = 0, action) => {
  switch (action.type) {
    case types.GET_REFERRAL:
      return action.payload;

    default:
      return state;
  }
};

export const enterReferralReducers = (state = null, action) => {
  switch (action.type) {
    case types.ENTER_REFERRAL:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  getReferral: getReferralReducers,
  enterReferral: enterReferralReducers,
});
export default reducer;
