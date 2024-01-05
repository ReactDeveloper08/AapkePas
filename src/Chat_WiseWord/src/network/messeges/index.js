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
    return await database()
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
    return await database()
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
    return await database()
      .ref('typing/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .update({
        typing: typing,
      });
  } catch (error) {
    return console.log(error);
  }
};

export const isChatEnd = async (endNow, currentUserId, guestUserId) => {
  try {
    return await database()
      .ref('endChat/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .update({endChat: endNow});
  } catch (error) {
    return console.log('the endChat error', error);
  }
};

export const isAcceptChat = async (accept, currentUserId, guestUserId) => {
  try {
    return await database()
      .ref('acceptChat/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .update({acceptChat: accept});
  } catch (e) {
    return console.log('the Accept chat error', e);
  }
};
export const isExtendChat = async (extend, currentUserId, guestUserId) => {
  try {
    return await database()
      .ref('extendChat/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .update({extendChat: extend});
  } catch (e) {
    return console.log('the Accept chat error', e);
  }
};

export const ChatOperation = async (
  endMessage,
  extend,
  accept,
  endNow,
  currentUserId,
  guestUserId,
) => {
  try {
    return await database()
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
    return await database()
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

//* video call
export const isVideoCallEnd = async (
  endMessage,
  endNow,
  currentUserId,
  guestUserId,
) => {
  try {
    return await database()
      .ref('endVideoCall/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .update({endVideoCall: endNow, endMessage: endMessage});
  } catch (error) {
    return console.log('the endChat error', error);
  }
};

export const isAcceptVideoCall = async (accept, currentUserId, guestUserId) => {
  try {
    return await database()
      .ref('acceptVideoCall/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .update({acceptVideoCall: accept});
  } catch (e) {
    return console.log('the Accept chat error', e);
  }
};
export const isVCEnd = async (endNow, currentUserId, guestUserId) => {
  try {
    return await database()
      .ref('endVC/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .update({endVC: endNow});
  } catch (error) {
    return console.log('the endVideoCall error', error);
  }
};

export const removeVideoCallEnd = async (currentUserId, guestUserId) => {
  try {
    return await database()
      .ref('endVideoCall/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .remove()
      .then('value', ref => {
        console.log('data delete', ref);
      });
  } catch (e) {
    return e;
  }
};

export const removeAcceptVideoCall = async (currentUserId, guestUserId) => {
  try {
    return await database()
      .ref('acceptVideoCall/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .remove()
      .then('value', ref => {
        console.log('data delete', ref);
      });
  } catch (e) {
    return e;
  }
};

export const removeVCEnd = async (currentUserId, guestUserId) => {
  try {
    return await database()
      .ref('endVC/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .remove()
      .then('value', ref => {
        console.log('data delete', ref);
      });
  } catch (e) {
    return e;
  }
};

//*Internet Call*//

export const isVoipCallEnd = async (
  endMessage,
  endNow,
  currentUserId,
  guestUserId,
) => {
  try {
    return await database()
      .ref('endVoipCall/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .update({endVoipCall: endNow, endMessage: endMessage});
  } catch (error) {
    return console.log('the endChat error', error);
  }
};

export const isAcceptVoipCall = async (accept, currentUserId, guestUserId) => {
  try {
    return await database()
      .ref('acceptVoipCall/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .update({acceptVoipCall: accept});
  } catch (e) {
    return console.log('the Accept chat error', e);
  }
};

export const isExtendVoipCall = async (extend, currentUserId, guestUserId) => {
  try {
    return await database()
      .ref('extendVoipCall/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .update({extendVoipCall: extend});
  } catch (e) {
    return console.log('the Accept chat error', e);
  }
};
export const isCallEnd = async (endNow, currentUserId, guestUserId) => {
  try {
    return await database()
      .ref('endCall/' + `${currentUserId}`)
      .child(`${guestUserId}`)
      .update({endCall: endNow});
  } catch (error) {
    return console.log('the endCall error', error);
  }
};

export const removeAcceptVoipCall = async (currentUserId, guestUserId) => {
  try {
    console.log('removeAcceptVoipCall', currentUserId, guestUserId);
    return await database()
      .ref(`acceptVoipCall/` + `${currentUserId}`)
      .child(`${guestUserId}`)
      .remove()
      .then('value', ref => {
        console.log('data delete', ref);
      });
  } catch (e) {
    return e;
  }
};
export const removeEndCall = async (currentUserId, guestUserId) => {
  try {
    console.log('removeEndCall', currentUserId, guestUserId);
    return await database()
      .ref(`endCall/` + `${currentUserId}`)
      .child(`${guestUserId}`)
      .remove()
      .then('value', ref => {
        console.log('data delete', ref);
      });
  } catch (e) {
    return e;
  }
};
export const removeEndVoipCall = async (currentUserId, guestUserId) => {
  try {
    console.log('removeEndVoipCall', currentUserId, guestUserId);
    return await database()
      .ref(`endVoipCall/` + `${currentUserId}`)
      .child(`${guestUserId}`)
      .remove()
      .then('value', ref => {
        console.log('data delete', ref);
      });
  } catch (e) {
    return e;
  }
};
export const removeExtendVoipCall = async (currentUserId, guestUserId) => {
  try {
    console.log('removeExtendVoipCall', currentUserId, guestUserId);
    return await database()
      .ref(`extendVoipCall/` + `${currentUserId}`)
      .child(`${guestUserId}`)
      .remove()
      .then('value', ref => {
        console.log('data delete', ref);
      });
  } catch (e) {
    return e;
  }
};
