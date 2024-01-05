import * as types from './types';
import {combineReducers} from 'redux';

const getDocHomeReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_HOME:
      return action.payload;

    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const GoLiveReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GO_LIVE:
      return action.payload;

    default:
      return state;
  }
};

const getOnlineReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_ONLINE:
      return action.payload;

    default:
      return state;
  }
};

const reducer = combineReducers({
  getDocHome: getDocHomeReducer,
  GoLive: GoLiveReducer,
  getOnline: getOnlineReducer,
});

export default reducer;
