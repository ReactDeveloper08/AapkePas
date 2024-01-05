import database from '@react-native-firebase/database';
export const send = async (
  msgValue,
  channelName,
  userId,
  date,
  usId,
  usName,
  heart,
  Img,
  gift,
  giftImg,
) => {
  try {
    return await database()
      .ref('chatRoom/')
      .child(`${channelName}`)
      .push({
        message: {
          msg: msgValue,
          chName: channelName,
          userId: userId,
          date: date,
          usId: usId,
          usName: usName,
          heart: heart,
          img: Img,
          gift: gift,
          giftImg: giftImg,
        },
      });
  } catch (e) {
    return e;
  }
};

export const receiveCall = async (
  channelName,
  astrologerId,
  payloadId,
  call,
) => {
  try {
    return await database()
      .ref('LiveCall/' + `${channelName}`)
      .child(`${astrologerId}`)
      .update({
        userId: payloadId,
        call: call,
      });
  } catch (e) {
    return e;
  }
};

export const remove = async channelName => {
  try {
    return await database()
      .ref(`chatRoom/${channelName}`)
      .remove()
      .then('value', ref => {
        console.log('data delete', ref);
      });
  } catch (e) {
    return e;
  }
};
export const liveCount = async (channelName, live, time) => {
  try {
    return await database()
      .ref('LiveCount/' + `${channelName}`)
      .update({
        live: live,
        time,
      });
  } catch (e) {
    console.log('the gift error message', e);
  }
};
