// import firebase from '../../firebase/config';
import database from '@react-native-firebase/database';

//* message box
export const senderMsg = async (
  msgValue,
  currentUserId,
  guestUserId,
  img,
  time,
) => {
  try {
    return database()
      .ref('messeges/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .push({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          msg: msgValue,
          time: time,
          img: img,
        },
      });
  } catch (error) {
    return error;
  }
};

export const recieverMsg = async (
  msgValue,
  currentUserId,
  guestUserId,
  img,
  time,
) => {
  try {
    return database()
      .ref('messeges/' + `${guestUserId}`)
      .child(`${currentUserId}`)
      .push({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          msg: msgValue,
          time: time,
          img: img,
        },
      });
  } catch (error) {
    return error;
  }
};

export const isTyping = async (typing, currentUserId, guestUserId) => {
  try {
    return database()
      .ref('typing/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .update({
        typing: typing,
      });
  } catch (error) {
    return console.log(error);
  }
};

export const isExtendChat = async (extend, currentUserId, guestUserId) => {
  try {
    return database()
      .ref('extendChat/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .update({extendChat: extend});
  } catch (e) {
    return console.log('the Accept chat error', e);
  }
};

export const isChatEnd = async (endNow, currentUserId, guestUserId) => {
  try {
    return database()
      .ref('endChat/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .update({
        endChat: endNow,
      });
  } catch (error) {
    return console.log('the endChat error', error);
  }
};

export const isAcceptChat = async (accept, currentUserId, guestUserId) => {
  try {
    return database()
      .ref('acceptChat/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .update({acceptChat: accept});
  } catch (e) {
    return console.log('the Accept chat error', e);
  }
};

export const chatOperation = async (
  endMessage,
  extend,
  accept,
  endNow,
  currentUserId,
  guestUserId,
) => {
  try {
    return database()
      .ref('chatOperation/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .push({
        chatOperation: {
          endMessage: endMessage,
          extendChat: extend,
          accept: accept,
          endNow: endNow,
        },
      });
  } catch (e) {
    return console.log('chat operation error', e);
  }
};

export const remove = async (currentUserId, guestUserId) => {
  try {
    return database()
      .ref(`chatOperation/` + `${currentUserId}`)
      .child(`${guestUserId}`)
      .remove()
      .then('value', ref => {
        console.log('data delete', ref);
      });
  } catch (e) {
    return e;
  }
};

export const removeChatOperation = async (currentUserId, guestUserId) => {
  return database()
    .ref(`chatOperation/` + `${currentUserId}`)
    .child(`${guestUserId}`)
    .remove()
    .then('value', ref => {
      console.log('data delete', ref);
    });
};

export const removeEndChat = async (currentUserId, guestUserId) => {
  return database()
    .ref(`endChat/` + `${currentUserId}`)
    .child(`${guestUserId}`)
    .remove()
    .then('value', ref => {
      console.log('data delete', ref);
    });
};

export const endTyping = async (currentUserId, guestUserId) => {
  return database()
    .ref(`typing/` + `${currentUserId}`)
    .child(`${guestUserId}`)
    .remove()
    .then('value', ref => {
      console.log('data delete', ref);
    });
};
