import * as types from './types';

export const liveStart = payload => ({
  type: types.LIVE_START,
  payload,
});

export const liveUserCount = payload => ({
  type: types.LIVE_USER_COUNT,
  payload,
});

export const liveFollow = payload => ({
  type: types.LIVE_FOLLOW,
  payload,
});

export const callToExpert = payload => ({
  type: types.LIVE_CALL_EXPERT,
  payload,
});

export const endLiveCall = payload => ({
  type: types.END_LIVE_CALL,
  payload,
});

export const liveShare = payload => ({
  type: types.LIVE_SHARE,
  payload,
});

export const checkCallBusy = payload => ({
  type: types.LIVE_CHECK_CALL_BUSY,
  payload,
});

export const giftList = payload => ({
  type: types.GIFT_LIST,
  payload,
});

export const saveLiveData = payload => ({
  type: types.SAVE_LIVE_DATA,
  payload,
});
export const saveLiveCallFirebase = payload => ({
  type: types.LIVE_CALL_FIREBASE,
  payload,
});
