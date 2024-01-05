import * as types from './types';
import {combineReducers} from 'redux';

const declineServiceReducer = (state = {}, action) => {
  switch (action.type) {
    case types.DECLINE_SERVICE:
      return action.payload;

    default:
      return state;
  }
};

const reducer = combineReducers({
  declineService: declineServiceReducer,
});

export default reducer;
