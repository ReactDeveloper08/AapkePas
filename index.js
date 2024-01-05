/**
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import configureStore from './src/Redux/store';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {RequestListener} from 'firebase_api/FirebaseBackGround';
import messaging from '@react-native-firebase/messaging';
const {store, persister} = configureStore();
import {nsNavigate, nsPush} from 'routes/NavigationService';
import {Alert, Platform} from 'react-native';
import database from '@react-native-firebase/database';
//* Decline url path
import {
  declineChat,
  declineCall,
  declineVideoCall,
} from 'firebase_api/Decline_Actions';
// import {isEmpty} from 'lodash';
// import CheckChat from 'firebase_api/CheckChatMiss';
// import {getUniqueId} from 'react-native-device-info';
import RNVoipCallNativeModule from 'callLib/RNVoipCall';
import {KEYS, getData} from 'api/UserPreference';
import {isCallEnd, isVCEnd} from './src/Chat_WiseWord/src/network';
import {isChatEnd} from './src/ChatDoctor/src/network';

// API
import {BASE_URL, makeRequest} from 'api/ApiInfo';

// const resetData = () => {
//   try {
//     RNVoipCallNativeModule.stopRingtune();
//     RNVoipCallNativeModule.endAllCalls();
//     // RNVoipCallNativeModule.removeEventListener('endCall');
//     nsNavigate('astro_Home');
//   } catch (error) {
//     console.log('error while reset', error);
//   }
// };
messaging().setBackgroundMessageHandler(async remoteMessage => {
  const {data} = remoteMessage;
  let notification;
  let dataBody;
  var Ground = 1;
  if (data) {
    dataBody = data;
    notification = remoteMessage;
  }
  console.log('remoteMessage Recive to R L 2');
  const params = {
    consultationId: dataBody.consultationId,
  };
  // calling api
  const response = await makeRequest(
    BASE_URL + 'api/Astrologers/checkChatStatus',
    params,
    true,
    false,
  );
  console.log('remoteMessage Recive to R L 3');
  if (response && response.success == true) {
    if (Platform.OS === 'android') {
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
                    onPress: () => this.props.navigation.navigate('astro_home'),
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
      console.log(dataBody.consultationId);
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
          RNVoipCallNativeModule.endCall(dataBody.consultationId);
          RNVoipCallNativeModule.endAllCalls();
        })
        .catch(e => console.log(e));

      console.log(dataBody.consultationId);
    }
  }
});

function Root() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <App />
      </PersistGate>
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(Root));
