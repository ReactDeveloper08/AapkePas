export const isChatRequest = state => {
  return state.chat.chatRequest;
};
export const isChatDataSave = state => {
  return state.chat.saveChatData;
};
export const isDocChatDataSave = state => {
  return state.chat.docSaveChatData;
};
export const isEndRequest = state => {
  return state.chat.endChatRequest;
};
export const isAstrologerOnline = state => {
  return state.chat.onlineAstrologer;
};
