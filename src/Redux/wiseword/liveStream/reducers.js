import * as types from './types';
import {combineReducers} from 'redux';

const liveStartReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LIVE_START:
      return action.payload;
    default:
      return state;
  }
};

const liveUserCountReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LIVE_USER_COUNT:
      return action.payload;
    default:
      return state;
  }
};

const liveFollowReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LIVE_FOLLOW:
      return action.payload;

    default:
      return state;
  }
};

const callToExpertReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LIVE_CALL_EXPERT:
      return action.payload;
    default:
      return state;
  }
};
const endLiveCallReducer = (state = {}, action) => {
  switch (action.type) {
    case types.END_LIVE_CALL:
      return action.payload;
    default:
      return state;
  }
};
const liveShareReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LIVE_SHARE:
      return action.payload;
    default:
      return state;
  }
};
const checkCallBusyReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LIVE_CHECK_CALL_BUSY:
      return action.payload;
    default:
      return state;
  }
};
const giftListReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GIFT_LIST:
      return action.payload;
    default:
      return state;
  }
};
const saveLiveDataReducer = (state = {}, action) => {
  switch (action.type) {
    case types.SAVE_LIVE_DATA:
      return action.payload;
    default:
      return state;
  }
};
const saveLiveCallFirebaseReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LIVE_CALL_FIREBASE:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  liveStart: liveStartReducer,
  liveUserCount: liveUserCountReducer,
  liveFollow: liveFollowReducer,
  callToExpert: callToExpertReducer,
  endLiveCall: endLiveCallReducer,
  liveShare: liveShareReducer,
  checkCallBusy: checkCallBusyReducer,
  giftList: giftListReducer,
  saveLiveData: saveLiveDataReducer,
  saveLiveCallFirebase: saveLiveCallFirebaseReducer,
});
export default reducer;
