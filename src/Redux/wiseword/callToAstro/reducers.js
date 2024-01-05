import * as types from './types';
import {combineReducers} from 'redux';

const getCallReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_CALL:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const getEndCallReducer = (state = {}, action) => {
  switch (action.type) {
    case types.END_CALL:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  getCall: getCallReducer,
  getEndCall: getEndCallReducer,
});

export default reducer;
