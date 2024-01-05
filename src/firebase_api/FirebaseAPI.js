import React from 'react';
import {nsNavigate, nsPush} from 'routes/NavigationService';
import {Alert, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
//async Storage
// import AsyncStorage from '@react-native-community/async-storage';

//* Decline url path
import {declineChat, declineCall, declineVideoCall} from './Decline_Actions';

import {uploadToken} from './UploadTokenAPI';
// Delegates
import {homeScreenFetchNotificationCount} from '../clientScreens/HomeScreen';
// import {isEmpty} from 'lodash';
import CheckChat from '../firebase_api/CheckChatMiss';
import {getUniqueId} from 'react-native-device-info';
import RNVoipCallNativeModule from '../callLib/RNVoipCall';
import {KEYS, getData} from 'api/UserPreference';
import {isCallEnd, isVCEnd} from '../Chat_WiseWord/src/network';
import {isChatEnd} from 'ChatDoctor/src/network';
// import RNVoipCall from 'react-native-voip-call';
var deviceId = getUniqueId();
// References
export let isAppOpenedByRemoteNotificationWhenAppClosed = false;

export const checkPermission = async () => {
  try {
    const authStatus = messaging().hasPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      // fetching fcm token
      await getToken();
    } else {
      await requestPermission();
    }
  } catch (error) {
    console.log(error.message);
  }
};

const requestPermission = async () => {
  try {
    // requesting permission
    await messaging().requestPermission();
    // fetching fcm token
    await getToken();
  } catch (error) {
    // User has rejected permission
    // console.log('User has rejected permission:', error.message);
  }
};

const getToken = async () => {
  try {
    if (
      Platform.OS === 'ios' &&
      !messaging().isDeviceRegisteredForRemoteMessages
    ) {
      console.log('myMethod: ', 'registerDeviceForRemoteMessages');
      await messaging().registerDeviceForRemoteMessages();
    }
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      // calling api to upload token
      const response = await uploadToken(fcmToken);
      // calling api again in case of failure
      if (response && response.success !== 1) {
        await uploadToken(fcmToken);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Token Listeners
const onTokenRefreshCallback = async fcmToken => {
  try {
    if (fcmToken) {
      // calling api to update token
      const response = await uploadToken(fcmToken);
      // calling api again in case of failure
      if (response && response.success !== 1) {
        await uploadToken(fcmToken);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const createOnTokenRefreshListener = thisArg => {
  thisArg.onTokenRefreshListener = messaging().onTokenRefresh(
    onTokenRefreshCallback,
  );
};
export const removeOnTokenRefreshListener = thisArg => {
  thisArg.onTokenRefreshListener();
};

// Notification Listeners
export const createNotificationListeners = async thisArg => {
  // Triggered when a particular notification has been received in foreground
  const onNotificationCallback = async notification => {
    console.log('new type', notification);
    //notify for chat
    const dataBody = notification.data;

    console.log(notification, dataBody.DOB);
    if (dataBody.consultationId) {
      const constId = dataBody.consultationId;
      const response = await CheckChat(constId);
      if (response && response.success == true) {
        if (Platform.OS === 'android') {
          console.log(dataBody);
          const userInfo = await getData(KEYS.USER_INFO);
          const dataRef = await database().ref(
            dataBody.isVideo != undefined
              ? 'endVC'
              : dataBody.isCall != undefined
              ? 'endCall'
              : 'endChat',
          );
          var currentUserId = userInfo.userId;
          var guestUserId = dataBody.userId;
          let key_next = true;
          if (key_next === true) {
            dataRef
              .child(`${currentUserId}`)
              .child(`${guestUserId}`)
              .on('value', async dataSnapShot => {
                // let consultantData = dataSnapShot.exists();
                // if (consultantData && key_next === true) {
                console.log('user in C B 1');
                const enddata =
                  dataBody.isVideo != undefined
                    ? dataSnapShot.val().endVC
                    : dataBody.isCall != undefined
                    ? dataSnapShot.val().endCall
                    : dataSnapShot.val().endChat;

                // const enddata = dataSnapShot.val().endVC;
                console.log('user in C B 2', enddata);
                if (key_next === true && enddata === 1) {
                  console.log('user in C B 3');
                  key_next = false;
                  this.declineChat = true;
                  let endNow = 0;
                  dataBody.isVideo != undefined
                    ? isVCEnd(endNow, currentUserId, guestUserId)
                    : dataBody.isCall != undefined
                    ? isCallEnd(endNow, currentUserId, guestUserId)
                    : isChatEnd(0, currentUserId, guestUserId);
                  RNVoipCallNativeModule.stopRingtune();
                  RNVoipCallNativeModule.endAllCalls();
                  RNVoipCallNativeModule.removeEventListener('endCall');
                  RNVoipCallNativeModule.removeEventListener('answerCall');
                  Alert.alert(
                    'Aapke Pass!',
                    'Client declined the Request',
                    [
                      {
                        text: 'Ok',
                        // onPress: () => ,
                      },
                    ],
                    {
                      cancelable: false,
                    },
                  );
                  dataRef.off();
                }
                // }
              });
          }

          let Options = {
            callerId: dataBody.consultationId, // Important uuid must in this format
            // callerId: data.uuid, // Important uuid must in this format
            ios: {
              phoneNumber: '12344', // Caller Mobile Number
              name: ' is Calling...', // caller Name
              hasVideo: false,
            },
            android: {
              ringtuneSound: true, // defualt true
              ringtune: 'ringtune', // add file inside Project_folder/android/app/res/raw --Formats--> mp3,wav
              duration: 20000, // defualt 30000
              vibration: true, // defualt is true
              channel_name: 'call', //
              notificationId: 1123,
              notificationTitle:
                dataBody.isChat != undefined
                  ? 'Incomming Chat'
                  : dataBody.isVideo != undefined
                  ? 'Incomming Video'
                  : 'Incomming Call',
              notificationBody: `${dataBody.clientName} is Calling...`,
              answerActionTitle: 'Accept',
              declineActionTitle: 'Decline',
            },
          };
          console.log(dataBody.consultationId);
          RNVoipCallNativeModule.onCallAnswer(data => {
            console.log('call answear', data, dataBody.consultationId);
            dataRef.off();
            dataBody.isChat !== undefined
              ? nsNavigate('CallConfirm', {dataBody: notification.data})
              : dataBody.isVideo !== undefined
              ? nsNavigate('vcDoc', {dataBody: notification.data})
              : nsNavigate('callPopUp', {dataBody: notification.data});
          });
          RNVoipCallNativeModule.onEndCall(data => {
            console.log('call End', data, dataBody.consultationId);
            dataRef.off();
            dataBody.isChat != undefined
              ? declineChat(dataBody)
              : dataBody.isVideo != undefined
              ? declineVideoCall(dataBody)
              : declineCall(dataBody);
          });

          RNVoipCallNativeModule.displayIncomingCall(Options)
            .then(dataM => {
              console.log('call did display data', dataM);
              RNVoipCallNativeModule.endCall(constId);
              RNVoipCallNativeModule.endAllCalls();
            })
            .catch(e => console.log(e));

          console.log(dataBody.consultationId);
        }
      } else if (response && response.success == false) {
        Alert.alert(
          `Aapke Pass!`,
          `${response.message}`,
          [
            {
              text: 'Ok',
              // onPress: () => logout(),
            },
          ],
          {cancelable: false},
        );
      }
    }
    // updating notification count on home screen if it is focused
    if (homeScreenFetchNotificationCount) {
      // nsNavigate('CallConfirm');
      await homeScreenFetchNotificationCount();
    }
  };
  // thisArg.onNotificationListener = firebase
  //   .notifications()
  //   .onNotification(onNotificationCallback);
  thisArg.onNotificationListener = await messaging().onMessage(
    onNotificationCallback,
  );
};

export const removeNotificationListeners = thisArg => {
  // Remove listeners allocated in createNotificationListeners()
  thisArg.onNotificationListener();
  RNVoipCallNativeModule.stopRingtune();
  RNVoipCallNativeModule.endAllCalls();
  RNVoipCallNativeModule.removeEventListener('endCall');
  RNVoipCallNativeModule.removeEventListener('answerCall');
  // thisArg.onNotificationOpenedListener();
};

export const resetIsAppOpenedByRemoteNotificationWhenAppClosed = () => {
  isAppOpenedByRemoteNotificationWhenAppClosed = false;
};
