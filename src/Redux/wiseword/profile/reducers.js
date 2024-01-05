import * as types from './types';
import {combineReducers} from 'redux';

const profileReducer = (state = {}, action) => {
  switch (action.type) {
    case types.PROFILE:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const updateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case types.UPDATE_PROFILE:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  profile: profileReducer,
  updateProfile: updateProfileReducer,
});

export default reducer;
