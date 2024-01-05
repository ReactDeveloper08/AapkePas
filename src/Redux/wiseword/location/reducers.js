import * as types from './types';
import {combineReducers} from 'redux';
const saveLocationReducer = (state = {}, action) => {
  switch (action.type) {
    case types.SAVE_LOCATION:
      return action.payload;

    default:
      return state;
  }
};

const reducer = combineReducers({
  saveLocation: saveLocationReducer,
});
export default reducer;
