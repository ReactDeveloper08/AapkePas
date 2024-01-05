import * as types from './types';

export const chatRequest = payload => ({
  type: types.CHAT_REQUEST,
  payload,
});
export const saveChatData = payload => ({
  type: types.SAVE_CHAT_DATA,
  payload,
});
export const docSaveChatData = payload => ({
  type: types.DOC_SAVE_DATA,
  payload,
});

export const endChatRequest = payload => ({
  type: types.END_CHAT_REQUEST,
  payload,
});

export const onlineAstrologer = payload => ({
  type: types.ONLINE_ASTROLOGER,
  payload,
});

export const error = payload => ({
  type: types.ERROR,
  payload,
});
