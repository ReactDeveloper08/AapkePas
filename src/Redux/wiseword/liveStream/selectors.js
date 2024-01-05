export const isLiveStart = state => {
  return state.liveStream.liveStart;
};

export const getSaveLiveData = state => {
  return state.liveStream.saveLiveData;
};

export const isLiveUserCount = state => {
  return state.liveStream.liveUserCount;
};
export const isLiveFollow = state => {
  return state.liveStream.liveFollow;
};
export const isLiveCallToExpert = state => {
  return state.liveStream.callToExpert;
};
export const isLiveEndLiveCall = state => {
  return state.liveStream.endLiveCall;
};
export const isLiveShare = state => {
  return state.liveStream.liveShare;
};
export const isLiveCallBusy = state => {
  return state.liveStream.checkCallBusy;
};
export const isLiveGiftList = state => {
  return state.liveStream.giftList;
};

export const isLiveCallFirebase = state => {
  return state.liveStream.saveLiveCallFirebase;
};
