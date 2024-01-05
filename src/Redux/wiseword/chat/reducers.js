import * as types from './types';
import {combineReducers} from 'redux';

const chatRequestReducer = (state = {}, action) => {
  switch (action.type) {
    case types.CHAT_REQUEST:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const saveChatDataReducer = (state = {}, action) => {
  switch (action.type) {
    case types.SAVE_CHAT_DATA:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const docSaveChatDataReducer = (state = {}, action) => {
  switch (action.type) {
    case types.DOC_SAVE_DATA:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const endChatRequestReducer = (state = {}, action) => {
  switch (action.type) {
    case types.END_CHAT_REQUEST:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const onlineAstrologerReducer = (state = {}, action) => {
  switch (action.type) {
    case types.ONLINE_ASTROLOGER:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  chatRequest: chatRequestReducer,
  endChatRequest: endChatRequestReducer,
  onlineAstrologer: onlineAstrologerReducer,
  saveChatData: saveChatDataReducer,
  docSaveChatData: docSaveChatDataReducer,
});

export default reducer;
